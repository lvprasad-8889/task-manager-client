
// Tasks Module
const Tasks = (() => {
  // Tasks array to store task objects
  let tasks = [];
  let currentView = 'all';
  let currentSort = 'dueDate';
  
  // DOM Elements
  const tasksContainer = document.getElementById('tasks-container');
  const noTasksMessage = document.getElementById('no-tasks-message');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
  const taskForm = document.getElementById('task-form');
  const taskIdInput = document.getElementById('task-id');
  const taskTitleInput = document.getElementById('task-title');
  const taskDescriptionInput = document.getElementById('task-description');
  const taskDueDateInput = document.getElementById('task-due-date');
  const taskPriorityInput = document.getElementById('task-priority');
  const taskCategoryInput = document.getElementById('task-category');
  const saveTaskBtn = document.getElementById('save-task-btn');
  const currentViewTitle = document.getElementById('current-view-title');
  const sortOptions = document.querySelectorAll('.sort-option');
  
  // API Endpoints (for future implementation)
  const API_URL = 'http://localhost:3000/api';
  const ENDPOINTS = {
    tasks: `${API_URL}/tasks`
  };
  
  // Initialize Tasks module
  const init = () => {
    // Load tasks from localStorage
    loadTasks();
    
    // Event listeners
    addTaskBtn.addEventListener('click', showAddTaskModal);
    saveTaskBtn.addEventListener('click', saveTask);
    document.addEventListener('click', handleTaskActions);
    
    // Setup category filter listeners
    setupCategoryFilter();
    
    // Setup sort options
    sortOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        currentSort = e.target.dataset.sort;
        renderTasks();
      });
    });
    
    // Set min date for due date input to today
    const today = new Date().toISOString().split('T')[0];
    taskDueDateInput.setAttribute('min', today);
    
    // Initial render
    renderTasks();
  };
  
  // Load tasks from localStorage
  const loadTasks = () => {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
  };
  
  // Save tasks to localStorage
  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };
  
  // Show modal to add new task
  const showAddTaskModal = () => {
    taskForm.reset();
    taskIdInput.value = '';
    document.getElementById('taskModalTitle').textContent = 'Add New Task';
    
    // Set default due date to today
    const today = new Date().toISOString().split('T')[0];
    taskDueDateInput.value = today;
    
    // Populate categories dropdown
    populateCategoryDropdown();
    
    taskModal.show();
  };
  
  // Show modal to edit task
  const showEditTaskModal = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    taskIdInput.value = task.id;
    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description || '';
    taskDueDateInput.value = task.dueDate || '';
    taskPriorityInput.value = task.priority;
    
    // Populate categories dropdown
    populateCategoryDropdown(task.category);
    
    taskModal.show();
  };
  
  // Populate category dropdown in task modal
  const populateCategoryDropdown = (selectedCategory = '') => {
    // Clear current options
    taskCategoryInput.innerHTML = '';
    
    // Default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'No Category';
    taskCategoryInput.appendChild(defaultOption);
    
    // Get categories from Categories module if available
    let categories = [];
    if (typeof Categories !== 'undefined') {
      categories = Categories.getCategories();
    }
    
    // Add categories to dropdown
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      if (category.id === selectedCategory) {
        option.selected = true;
      }
      taskCategoryInput.appendChild(option);
    });
  };
  
  // Save task (add new or update existing)
  const saveTask = () => {
    // Get values from form
    const taskId = taskIdInput.value;
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const dueDate = taskDueDateInput.value;
    const priority = taskPriorityInput.value;
    const category = taskCategoryInput.value;
    
    if (!title) {
      alert('Please enter a task title');
      return;
    }
    
    if (taskId) {
      // Update existing task
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          title,
          description,
          dueDate,
          priority,
          category,
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      // Add new task
      const newTask = {
        id: 'task_' + Date.now(),
        title,
        description,
        dueDate,
        priority,
        category,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      tasks.unshift(newTask);
    }
    
    // Save and update UI
    saveTasks();
    renderTasks();
    taskModal.hide();
  };
  
  // Handle task actions (complete, edit, delete)
  const handleTaskActions = (e) => {
    // Check if task toggle clicked
    if (e.target.matches('.task-toggle') || e.target.closest('.task-toggle')) {
      const taskCard = e.target.closest('.task-card');
      const taskId = taskCard.dataset.taskId;
      toggleTaskComplete(taskId);
    }
    
    // Check if edit button clicked
    if (e.target.matches('.task-edit') || e.target.closest('.task-edit')) {
      const taskCard = e.target.closest('.task-card');
      const taskId = taskCard.dataset.taskId;
      showEditTaskModal(taskId);
    }
    
    // Check if delete button clicked
    if (e.target.matches('.task-delete') || e.target.closest('.task-delete')) {
      const taskCard = e.target.closest('.task-card');
      const taskId = taskCard.dataset.taskId;
      deleteTask(taskId);
    }
  };
  
  // Toggle task complete status
  const toggleTaskComplete = (taskId) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      tasks[taskIndex].updatedAt = new Date().toISOString();
      
      saveTasks();
      renderTasks();
    }
  };
  
  // Delete task
  const deleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasks();
      renderTasks();
    }
  };
  
  // Setup category filter links
  const setupCategoryFilter = () => {
    // Built-in filters
    document.querySelectorAll('[data-category]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('[data-category]').forEach(l => {
          l.classList.remove('active');
        });
        
        // Add active class to clicked link
        e.target.classList.add('active');
        
        // Update current view and render tasks
        currentView = e.target.dataset.category;
        currentViewTitle.textContent = e.target.textContent.trim();
        renderTasks();
      });
    });
  };
  
  // Filter tasks based on current view
  const filterTasks = () => {
    let filteredTasks = [...tasks];
    
    switch (currentView) {
      case 'today':
        const today = new Date().toISOString().split('T')[0];
        filteredTasks = filteredTasks.filter(task => task.dueDate === today);
        break;
      case 'upcoming':
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        
        filteredTasks = filteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate > todayDate;
        });
        break;
      case 'all':
        // No filtering needed
        break;
      default:
        // Filter by category
        if (currentView.startsWith('category_')) {
          const categoryId = currentView.replace('category_', '');
          filteredTasks = filteredTasks.filter(task => task.category === categoryId);
        }
        break;
    }
    
    return filteredTasks;
  };
  
  // Sort tasks based on current sort
  const sortTasks = (filteredTasks) => {
    switch (currentSort) {
      case 'dueDate':
        return filteredTasks.sort((a, b) => {
          // Tasks without due dates go to the bottom
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        });
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return filteredTasks.sort((a, b) => {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
      case 'title':
        return filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filteredTasks;
    }
  };
  
  // Render tasks in the UI
  const renderTasks = () => {
    // Filter and sort tasks
    let filteredTasks = filterTasks();
    filteredTasks = sortTasks(filteredTasks);
    
    // Clear tasks container
    tasksContainer.innerHTML = '';
    
    // Show/hide no tasks message
    if (filteredTasks.length === 0) {
      noTasksMessage.classList.remove('d-none');
    } else {
      noTasksMessage.classList.add('d-none');
      
      // Render each task
      filteredTasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksContainer.appendChild(taskCard);
      });
    }
  };
  
  // Create a task card element
  const createTaskCard = (task) => {
    // Create the card element
    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${task.completed ? 'task-complete' : ''} priority-${task.priority} fade-in`;
    taskCard.dataset.taskId = task.id;
    
    // Get category details if Categories module is available
    let categoryInfo = { name: '', color: '#6c757d' };
    if (typeof Categories !== 'undefined' && task.category) {
      const category = Categories.getCategoryById(task.category);
      if (category) {
        categoryInfo = {
          name: category.name,
          color: category.color
        };
      }
    }
    
    // Format due date
    let formattedDate = '';
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      formattedDate = dueDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    // Create task HTML
    taskCard.innerHTML = `
      <div className="task-title">
        <h5 className="mb-0 d-flex align-items-center">
          <button className="task-toggle me-2 btn ${task.completed ? 'text-success' : 'text-secondary'}">
            <i className="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
          </button>
          ${task.title}
        </h5>
        <div className="task-actions">
          <button className="task-edit" title="Edit task">
            <i className="fas fa-edit"></i>
          </button>
          <button className="task-delete" title="Delete task">
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      ${task.description ? `<div className="task-details mt-2">${task.description}</div>` : ''}
      <div className="task-meta mt-2">
        <div className="task-info">
          ${task.dueDate ? `
            <span className="task-due me-2" title="Due Date">
              <i className="far fa-calendar-alt me-1"></i>${formattedDate}
            </span>
          ` : ''}
          ${categoryInfo.name ? `
            <span className="task-category-badge me-2" style="background-color: ${categoryInfo.color}30; color: ${categoryInfo.color}; border: 1px solid ${categoryInfo.color}50;">
              ${categoryInfo.name}
            </span>
          ` : ''}
        </div>
        <div className="task-priority">
          ${getPriorityBadge(task.priority)}
        </div>
      </div>
    `;
    
    return taskCard;
  };
  
  // Get HTML for priority badge
  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-success',
      medium: 'bg-warning',
      high: 'bg-danger'
    };
    
    return `<span className="badge ${colors[priority]} rounded-pill">${priority[0].toUpperCase() + priority.slice(1)}</span>`;
  };
  
  // Get all tasks
  const getAllTasks = () => {
    return tasks;
  };
  
  // Change current view
  const changeView = (view) => {
    currentView = view;
    renderTasks();
  };
  
  // Return public methods
  return {
    init,
    getAllTasks,
    changeView,
    renderTasks
  };
})();
