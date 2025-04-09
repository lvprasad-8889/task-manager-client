
import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import TaskDetailsModal from './TaskDetailsModal';

const TaskKanbanView = ({ tasks, loading }) => {
  const { updateTask } = useStore();
  const [selectedTask, setSelectedTask] = useState(null);
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    completed: []
  });
  
  // Distribute tasks to columns based on completion status and priority
  useEffect(() => {
    const todo = tasks.filter(task => !task.completed && task.priority === 'low');
    const inProgress = tasks.filter(task => !task.completed && task.priority !== 'low');
    const completed = tasks.filter(task => task.completed);
    
    setColumns({
      todo,
      inProgress,
      completed
    });
  }, [tasks]);
  
  // Handle drag start
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };
  
  // Handle drop
  const handleDrop = async (e, columnName) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t._id === taskId);
    
    if (!task) return;
    
    let updatedTask = { ...task };
    
    // Update task based on column
    switch (columnName) {
      case 'todo':
        updatedTask.completed = false;
        updatedTask.priority = 'low';
        break;
      case 'inProgress':
        updatedTask.completed = false;
        updatedTask.priority = 'medium';
        break;
      case 'completed':
        updatedTask.completed = true;
        break;
      default:
        break;
    }
    
    // Only update if something changed
    if (
      updatedTask.completed !== task.completed ||
      updatedTask.priority !== task.priority
    ) {
      await updateTask(task._id, updatedTask);
    }
  };
  
  // Allow drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="kanban-board d-flex gap-4 mb-4 overflow-auto pb-2">
        <div 
          className="kanban-column bg-light rounded"
          onDrop={(e) => handleDrop(e, 'todo')}
          onDragOver={handleDragOver}
        >
          <div className="kanban-column-header bg-secondary text-white p-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Todo</h5>
            <span className="badge bg-white text-dark">{columns.todo.length}</span>
          </div>
          <div className="kanban-column-body p-2">
            {columns.todo.map(task => (
              <div
                key={task._id}
                className="card mb-2 task-card"
                draggable
                onDragStart={(e) => handleDragStart(e, task._id)}
                onClick={() => setSelectedTask(task)}
              >
                <div className="card-body p-3">
                  <h6 className="card-title mb-2">{task.title}</h6>
                  {task.dueDate && (
                    <div className="small text-muted">
                      <i className="far fa-calendar me-1"></i>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {columns.todo.length === 0 && (
              <div className="text-center p-3 text-muted">
                No tasks
              </div>
            )}
          </div>
        </div>
        
        <div 
          className="kanban-column bg-light rounded"
          onDrop={(e) => handleDrop(e, 'inProgress')}
          onDragOver={handleDragOver}
        >
          <div className="kanban-column-header bg-warning text-white p-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">In Progress</h5>
            <span className="badge bg-white text-dark">{columns.inProgress.length}</span>
          </div>
          <div className="kanban-column-body p-2">
            {columns.inProgress.map(task => (
              <div
                key={task._id}
                className={`card mb-2 task-card priority-${task.priority}`}
                draggable
                onDragStart={(e) => handleDragStart(e, task._id)}
                onClick={() => setSelectedTask(task)}
              >
                <div className="card-body p-3">
                  <h6 className="card-title mb-2">{task.title}</h6>
                  {task.dueDate && (
                    <div className="small text-muted">
                      <i className="far fa-calendar me-1"></i>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {columns.inProgress.length === 0 && (
              <div className="text-center p-3 text-muted">
                No tasks
              </div>
            )}
          </div>
        </div>
        
        <div 
          className="kanban-column bg-light rounded"
          onDrop={(e) => handleDrop(e, 'completed')}
          onDragOver={handleDragOver}
        >
          <div className="kanban-column-header bg-success text-white p-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Completed</h5>
            <span className="badge bg-white text-dark">{columns.completed.length}</span>
          </div>
          <div className="kanban-column-body p-2">
            {columns.completed.map(task => (
              <div
                key={task._id}
                className="card mb-2 task-card completed"
                draggable
                onDragStart={(e) => handleDragStart(e, task._id)}
                onClick={() => setSelectedTask(task)}
              >
                <div className="card-body p-3">
                  <h6 className="card-title mb-2 text-decoration-line-through">{task.title}</h6>
                  {task.dueDate && (
                    <div className="small text-muted">
                      <i className="far fa-calendar me-1"></i>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {columns.completed.length === 0 && (
              <div className="text-center p-3 text-muted">
                No tasks
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onHide={() => setSelectedTask(null)}
        />
      )}
      
      <style jsx="true">{`
        .kanban-board {
          min-height: 600px;
        }
        .kanban-column {
          min-width: 300px;
          width: 33%;
          display: flex;
          flex-direction: column;
        }
        .kanban-column-body {
          flex: 1;
          overflow-y: auto;
        }
        .task-card {
          cursor: pointer;
          transition: all 0.2s;
        }
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .completed {
          opacity: 0.7;
        }
        .priority-high {
          border-left: 4px solid #dc3545;
        }
        .priority-medium {
          border-left: 4px solid #ffc107;
        }
        .priority-low {
          border-left: 4px solid #28a745;
        }
      `}</style>
    </>
  );
};

export default TaskKanbanView;
