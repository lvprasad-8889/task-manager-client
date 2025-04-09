import { useState, useEffect } from "react";
import useStore from "../../store/useStore";
import TagInput from "./TagInput";

const TaskDetailsModal = ({ task, onHide }) => {
  const { updateTask, deleteTask, categories } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  // Update local state when task changes
  useEffect(() => {
    setEditedTask({ ...task });
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    updateTask(task._id, editedTask);
    setIsEditing(false);
  };

  const fetchTagsToParent = (tag) => {
    setEditedTask({
      ...editedTask,
      tags: [...editedTask.tags, tag],
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task._id);
      onHide();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // For date input fields, we need YYYY-MM-DD format
    if (isEditing) {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    }

    // For display, use a more readable format
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategory = () => {
    return categories.find((c) => c._id === task.category);
  };

  const category = getCategory();

  return (
    <div
      className="modal fade show"
      style={{ display: "block", zIndex: 9999999 }}
    >
      <div className="modal-dialog" style={{ zIndex: 9999999 }}>
        <div className="modal-content">
          <div className="modal-header">
            {isEditing ? (
              <input
                type="text"
                className="form-control"
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
              />
            ) : (
              <h5 className="modal-title">{task.title}</h5>
            )}
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {isEditing ? (
              <form>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={editedTask.description || ""}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dueDate"
                      value={formatDate(editedTask.dueDate)}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      name="priority"
                      value={editedTask.priority}
                      onChange={handleInputChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={editedTask.category || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <TagInput
                    fetchTagsToParent={fetchTagsToParent}
                    defaultTags={editedTask.tags}
                  ></TagInput>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="completed-checkbox"
                    name="completed"
                    checked={editedTask.completed}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="completed-checkbox"
                  >
                    Mark as completed
                  </label>
                </div>
              </form>
            ) : (
              <>
                <div className="d-flex flex-wrap mb-3">
                  <span
                    className={`badge bg-${
                      task.completed ? "success" : "warning"
                    } me-2`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>

                  <span
                    className={`badge bg-${
                      task.priority === "high"
                        ? "danger"
                        : task.priority === "medium"
                        ? "warning"
                        : "info"
                    } me-2`}
                  >
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}{" "}
                    Priority
                  </span>

                  {category && (
                    <span
                      className="badge me-2"
                      style={{
                        backgroundColor: category.color,
                        color: getContrastColor(category.color),
                      }}
                    >
                      {category.name}
                    </span>
                  )}

                  {task.dueDate && (
                    <span className="badge bg-secondary">
                      <i className="fas fa-calendar-alt me-1"></i>
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>

                {task.description ? (
                  <div className="mb-3 text-break">
                    <h6>Description:</h6>
                    <p className="mb-0">{task.description}</p>
                  </div>
                ) : (
                  <p className="text-muted">No description provided</p>
                )}

                <div className="d-flex justify-content-between text-muted mt-4 pt-2 border-top">
                  <small>
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </small>
                  {task.updatedAt && task.updatedAt !== task.createdAt && (
                    <small>
                      Updated: {new Date(task.updatedAt).toLocaleString()}
                    </small>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleSave();
                    onHide();
                  }}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-danger me-auto"
                  onClick={handleDelete}
                >
                  <i className="fas fa-trash-alt me-1"></i> Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fas fa-edit me-1"></i> Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

// Helper function to determine text color based on background
const getContrastColor = (hexColor) => {
  // If no hex color provided, return white
  if (!hexColor) return "#ffffff";

  // Convert hex to RGB
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

export default TaskDetailsModal;
