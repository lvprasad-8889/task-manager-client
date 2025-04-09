
import { useMemo } from 'react';

const TaskStats = ({ stats }) => {
  return (
    <div className="row mb-4">
      <div className="col-6 col-sm-6 col-md-6  col-lg-3 g-3 mb-3 mb-md-0">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body d-flex align-items-center">
            <div className="rounded-circle bg-primary p-3 me-3" style={{width: "50px", height: "50px"}}>
              <i className="fas fa-tasks text-white d-flex justify-content-center align-items-center"></i>
            </div>
            <div>
              <h5 className="card-title mb-0">{stats.total || 0}</h5>
              <p className="card-text text-black">Total Tasks</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-6 col-sm-6 col-md-6  col-lg-3 g-3 mb-3 mb-md-0">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body d-flex align-items-center">
            <div className="rounded-circle bg-warning p-3 me-3" style={{width: "50px", height: "50px"}}>
              <i className="fas fa-clock text-white  d-flex justify-content-center align-items-center"></i>
            </div>
            <div>
              <h5 className="card-title mb-0">{stats.pending || 0}</h5>
              <p className="card-text text-black">Pending</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-6 col-sm-6 col-md-6  col-lg-3 g-3 mb-3 mb-md-0">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body d-flex align-items-center">
            <div className="rounded-circle bg-success p-3 me-3"  style={{width: "50px", height: "50px"}}>
              <i className="fas fa-check-circle text-white  d-flex justify-content-center align-items-center"></i>
            </div>
            <div>
              <h5 className="card-title mb-0">{stats.completed || 0}</h5>
              <p className="card-text text-black">Completed</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-6 col-sm-6 col-md-6  col-lg-3 g-3  mb-3 mb-md-0">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body d-flex align-items-center">
            <div className="rounded-circle bg-danger p-3 me-3"  style={{width: "50px", height: "50px"}}>
              <i className="fas fa-exclamation-circle text-white  d-flex justify-content-center align-items-center" ></i>
            </div>
            <div>
              <h5 className="card-title mb-0">{stats.overdue || 0}</h5>
              <p className="card-text text-black">Overdue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
