import { useState } from "react";

const TaskHeader = ({
  title,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onAddTask,
  displayFormat,
  onChangeFormat,
}) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
      <div>
        <h2 className="h4 mb-0">{title}</h2>
      </div>

      <div className="d-flex gap-2 mt-3 mt-sm-0 flex-wrap">
        {showSearch ? (
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => {
                onSearchChange("");
                setShowSearch(false);
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ) : (
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowSearch(true)}
          >
            <i className="fas fa-search me-2"></i>
            Search
          </button>
        )}


        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="fas fa-sort me-2"></i>
            Sort
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className={`dropdown-item ${
                  sortBy === "dueDate" ? "active" : ""
                }`}
                onClick={() => onSortChange("dueDate")}
              >
                Due Date
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  sortBy === "priority" ? "active" : ""
                }`}
                onClick={() => onSortChange("priority")}
              >
                Priority
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  sortBy === "title" ? "active" : ""
                }`}
                onClick={() => onSortChange("title")}
              >
                Title
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  sortBy === "category" ? "active" : ""
                }`}
                onClick={() => onSortChange("category")}
              >
                Category
              </button>
            </li>
          </ul>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="fas fa-table-cells me-2"></i>
            View
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className={`dropdown-item ${
                  displayFormat === "list" ? "active" : ""
                }`}
                onClick={() => onChangeFormat("list")}
              >
                <i className="fas fa-list me-2"></i> List
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  displayFormat === "calendar" ? "active" : ""
                }`}
                onClick={() => onChangeFormat("calendar")}
              >
                <i className="fas fa-calendar me-2"></i> Calendar
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  displayFormat === "kanban" ? "active" : ""
                }`}
                onClick={() => onChangeFormat("kanban")}
              >
                <i className="fas fa-columns me-2"></i> Kanban
              </button>
            </li>
          </ul>
        </div>

        <button className="btn btn-primary" onClick={onAddTask}>
          <i className="fas fa-plus me-2"></i>
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskHeader;
