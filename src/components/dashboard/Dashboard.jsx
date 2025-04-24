
import { useEffect } from 'react';
import useStore from '../../store/useStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import TasksContainer from './TasksContainer';

import socket from '../../store/socket';

const Dashboard = () => {
  const { 
    fetchTasks, 
    fetchCategories,
    user ,
    isAuthenticated
  } = useStore();
  
  // Fetch data on component mount
  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);


  
  return (
    <div className="dashboard-layout">
      <Navbar userName={user.name || 'User'} />
      
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          
          <main className="col-md-8 ms-sm-auto col-lg-9 px-md-4 py-4">
            <TasksContainer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
