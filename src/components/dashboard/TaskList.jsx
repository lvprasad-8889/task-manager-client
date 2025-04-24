
import { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import TaskItem from './TaskItem';
import TaskDetailsModal from './TaskDetailsModal';

const TaskList = ({ tasks, loading }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="text-center my-5">
        <i className="fas fa-clipboard fa-3x mb-3 text-muted"></i>
        <p className="text-muted">No tasks found. Create a new task to get started!</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="list-group mt-3">
        {tasks.map(task => (
          <TaskItem 
            key={task._id} 
            task={task} 
            onSelect={() => setSelectedTask(task)} 
          />
        ))}
      </div>
      
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onHide={() => setSelectedTask(null)}
        />
      )}
    </>
  );
};

export default TaskList;
