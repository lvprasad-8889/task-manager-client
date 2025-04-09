import { useState } from "react";
import useStore from "../../store/useStore";
import TagInput from "./TagInput";

const AddTaskModal = ({ show, onHide }) => {
  const { addTask, categories } = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim()) {
      const taskData = {
        title,
        description,
        priority,
        completed: false,
        tags,
      };

      if (dueDate) {
        taskData.dueDate = new Date(dueDate);
      }

      if (category) {
        taskData.category = category;
      }

      addTask(taskData);
      resetForm();
      onHide();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setCategory("");
  };

  const fetchTagsToParent = (tagFromChild) => {
    setTags([...tags, tagFromChild]);
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", zIndex: 9999999 }}
    >
      <div className="modal-dialog" style={{ zIndex: 9999999 }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Task</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <form id="task-form" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="task-title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="task-description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="task-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                ></textarea>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="task-due-date" className="form-label">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="task-due-date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="task-priority" className="form-label">
                    Priority
                  </label>
                  <select
                    className="form-select"
                    id="task-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="task-category" className="form-label">
                  Category
                </label>
                <select
                  className="form-select"
                  id="task-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                <TagInput fetchTagsToParent={fetchTagsToParent}></TagInput>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default AddTaskModal;
