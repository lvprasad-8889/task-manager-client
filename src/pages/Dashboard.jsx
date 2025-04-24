import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import socket from '../store/socket';

const Dashboard = () => {
  const { user, isAuthenticated } = useStore();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:3000/api/tasks', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setTasks(res.data);
  };

  const createTask = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/api/tasks', newTask, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setNewTask({ title: '', description: '' });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  return (
    <div className="container mt-4">
      <h3>My Tasks</h3>
      <form onSubmit={createTask} className="mb-4">
        <input className="form-control my-2" placeholder="Title" value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
        <textarea className="form-control my-2" placeholder="Description" value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
        <button className="btn btn-primary">Add Task</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{task.title}</strong><br />
                <small>{task.description}</small>
              </div>
              <span className="badge bg-secondary">{task.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
