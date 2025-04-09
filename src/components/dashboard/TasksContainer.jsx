
import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import TaskList from './TaskList';
import TaskStats from './TaskStats';
import TaskHeader from './TaskHeader';
import AddTaskModal from './AddTaskModal';
import TaskCalendarView from './TaskCalendarView';
import TaskKanbanView from './TaskKanbanView';

const TasksContainer = () => {
  const { 
    tasks, 
    taskStats,
    currentView, 
    currentCategory,
    isLoadingTasks,
    displayFormat,
    setDisplayFormat
  } = useStore();
  
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  
  // Filter tasks based on current view and search query
  useEffect(() => {
    const filterTasks = () => {
      let filtered = [...tasks];
      
      // Apply view filter
      switch (currentView) {
        case 'today': {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          filtered = filtered.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate.getTime() === today.getTime();
          });
          break;
        }
        case 'upcoming': {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          filtered = filtered.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate > today;
          });
          break;
        }
        case 'completed':
          filtered = filtered.filter(task => task.completed);
          break;
        case 'category':
          filtered = filtered.filter(task => task.category === currentCategory?._id);
          break;
        default:
          // All tasks, no additional filtering
          break;
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(task => 
          task.title.toLowerCase().includes(query) || 
          (task.description && task.description.toLowerCase().includes(query))
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'dueDate':
            // Sort by due date (null values at the end)
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          case 'priority':
            // Sort by priority (high > medium > low)
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          case 'title':
            // Sort by title alphabetically
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
      
      setFilteredTasks(filtered);
    };
    
    filterTasks();
  }, [tasks, currentView, currentCategory, searchQuery, sortBy]);
  
  // Get view title
  const getViewTitle = () => {
    switch (currentView) {
      case 'today': return 'Today\'s Tasks';
      case 'upcoming': return 'Upcoming Tasks';
      case 'completed': return 'Completed Tasks';
      case 'category': return currentCategory?.name || 'Tasks';
      default: return 'All Tasks';
    }
  };
  
  return (
    <div className="tasks-container">
      <TaskStats stats={taskStats} />
      
      <TaskHeader 
        title={getViewTitle()} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onAddTask={() => setShowAddTaskModal(true)}
        displayFormat={displayFormat}
        onChangeFormat={setDisplayFormat}
      />
      
      {displayFormat === 'list' && (
        <TaskList 
          tasks={filteredTasks} 
          loading={isLoadingTasks}
        />
      )}
      
      {displayFormat === 'calendar' && (
        <TaskCalendarView 
          tasks={filteredTasks} 
          loading={isLoadingTasks}
        />
      )}
      
      {displayFormat === 'kanban' && (
        <TaskKanbanView 
          tasks={filteredTasks} 
          loading={isLoadingTasks}
        />
      )}
      
      <AddTaskModal 
        show={showAddTaskModal} 
        onHide={() => setShowAddTaskModal(false)} 
      />
    </div>
  );
};

export default TasksContainer;
