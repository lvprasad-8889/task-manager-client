import { create } from "zustand";

const useStore = create((set, get) => ({
  // User state
  user: JSON.parse(localStorage.getItem("user") || "{}"),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),

  // Tasks state
  tasks: [],
  taskStats: { total: 0, completed: 0, pending: 0, overdue: 0 },
  isLoadingTasks: false,
  taskError: null,

  // Categories state
  categories: [],
  isLoadingCategories: false,
  categoryError: null,

  // Current view state
  currentView: "all",
  currentCategory: null,

  // Task display format (list, calendar, kanban)
  displayFormat: "list",

  notifications: [],

  apiUrl: process.env.NODE_ENV === 'development' ? "http://localhost:3000/api" : "https://task-managers-server-12a74ec3356d.herokuapp.com/api",

  // Set display format
  setDisplayFormat: (format) => set({ displayFormat: format }),

  // Login action
  login: async (email, password) => {
    try {
      console.log();
      set({ loginError: null });
      const API_URL = get().apiUrl;
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      set({ loginError: error.message });
      return false;
    }
  },

  // Register action
  register: async (name, email, password) => {
    try {
      set({ registerError: null });
      const API_URL = get().apiUrl;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      set({ registerError: error.message });
      return false;
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: {},
      token: null,
      isAuthenticated: false,
      tasks: [],
      categories: [],
      currentView: "all",
      currentCategory: null,
      displayFormat: "list",
    });
  },

  // Fetch tasks
  fetchTasks: async () => {
    try {
      const { user, token } = get();
      if (!user.id || !token) return;

      set({ isLoadingTasks: true, taskError: null });
      const API_URL = get().apiUrl;
      const response = await fetch(`${API_URL}/tasks?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      set({
        tasks: data.tasks,
        taskStats: data.stats || {
          total: data.tasks.length,
          completed: data.tasks.filter((task) => task.completed).length,
          pending: data.tasks.filter((task) => !task.completed).length,
          overdue: 0, // Will calculate this on the frontend if not provided
        },
        isLoadingTasks: false,
      });
    } catch (error) {
      set({ taskError: error.message, isLoadingTasks: false });
    }
  },

  // Add task
  addTask: async (taskData) => {
    try {
      const { user, token } = get();
      if (!user.id || !token) return;

      const API_URL = get().apiUrl;
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...taskData, userId: user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        taskStats: {
          ...state.taskStats,
          total: state.taskStats.total + 1,
          pending: state.taskStats.pending + 1,
        },
      }));
    } catch (error) {
      set({ taskError: error.message });
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      const { token, tasks } = get();
      if (!token) return;

      const oldTask = tasks.find((t) => t._id === taskId);
      if (!oldTask) return;

      const API_URL = get().apiUrl;
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();
      set((state) => {
        const newTasks = state.tasks.map((task) =>
          task._id === taskId ? updatedTask : task
        );

        // Update stats if completion status changed
        const taskStats = { ...state.taskStats };
        if (oldTask.completed !== updatedTask.completed) {
          if (updatedTask.completed) {
            taskStats.completed++;
            taskStats.pending--;
          } else {
            taskStats.completed--;
            taskStats.pending++;
          }
        }

        return {
          tasks: newTasks,
          taskStats,
        };
      });
    } catch (error) {
      set({ taskError: error.message });
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      const { token, tasks } = get();
      if (!token) return;

      const taskToDelete = tasks.find((t) => t._id === taskId);
      if (!taskToDelete) return;

      const API_URL = get().apiUrl;
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
        taskStats: {
          ...state.taskStats,
          total: state.taskStats.total - 1,
          completed: taskToDelete.completed
            ? state.taskStats.completed - 1
            : state.taskStats.completed,
          pending: !taskToDelete.completed
            ? state.taskStats.pending - 1
            : state.taskStats.pending,
        },
      }));
    } catch (error) {
      set({ taskError: error.message });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const { user, token } = get();
      if (!user.id || !token) return;

      set({ isLoadingCategories: true, categoryError: null });
      const API_URL = get().apiUrl;
      const response = await fetch(`${API_URL}/categories?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const categories = await response.json();
      set({ categories, isLoadingCategories: false });
    } catch (error) {
      set({ categoryError: error.message, isLoadingCategories: false });
    }
  },

  // Add category
  addCategory: async (categoryData) => {
    try {
      const { user, token } = get();
      if (!user.id || !token) return;

      const API_URL = get().apiUrl;
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...categoryData, userId: user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      const newCategory = await response.json();
      set((state) => ({ categories: [newCategory, ...state.categories] }));
    } catch (error) {
      set({ categoryError: error.message });
    }
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    try {
      const { token } = get();
      if (!token) return;

      const API_URL = get().apiUrl;
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      set((state) => ({
        categories: state.categories.filter(
          (category) => category._id !== categoryId
        ),
      }));
    } catch (error) {
      set({ categoryError: error.message });
    }
  },

  // Change current view
  changeView: (view, category = null) => {
    set({ currentView: view, currentCategory: category });
  },

  getUserNotifications: async () => {
    try {
      const { user, token } = get();
      if (!user.id || !token) return;

      const API_URL = get().apiUrl;
      const response = await fetch(
        `${API_URL}/notifications?userId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      set((state) => ({
        notifications: [...data],
      }));
    } catch (error) {
      // set({ taskError: error.message, isLoadingTasks: false });
    }
  },

  readAllUserNotifications: async () => {
    try {
      const { user, token } = get();
      if (!user.id || !token) return;

      const API_URL = get().apiUrl;
      const response = await fetch(
        `${API_URL}/notifications/all?userId=${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      console.log("from store", get().notifications);
      let data = get().notifications.map((item) => {
        return {
          ...item,
          unread: false,
        };
      });

      set((state) => ({
        notifications: [...data],
      }));
    } catch (error) {
      console.log(error);
    }
  },

  readUserNotification: async (notificationId) => {
    try {
      const { user, token } = get();
      if (!user.id || !token) return;

      const API_URL = get().apiUrl;
      const response = await fetch(
        `${API_URL}/notifications/one?userId=${user.id}&notificationId=${notificationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      let data = get().notifications.map((item) => {
        if (notificationId === item._id) {
          return {
            ...item,
            unread: false
          };
        }
        return item;
      });

      set((state) => ({
        notifications: [...data],
      }));
    } catch (error) {
    }
  },

  removeUserNotification: async (notificationId) => {
    try {
      const { user, token } = get();
      if (!user.id || !token) return;

      const API_URL = get().apiUrl;
      const response = await fetch(
        `${API_URL}/notifications/dismiss?userId=${user.id}&notificationId=${notificationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      let data = get().notifications.filter((item) => item._id !== notificationId);

      set((state) => ({
        notifications: [...data],
      }));
    } catch (error) {
    }
  },

  setUserNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },
}));

export default useStore;
