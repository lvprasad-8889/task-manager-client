import useStore from "../../store/useStore";
import Wraptags from './WrapTags';


const TaskItem = ({ task, onSelect }) => {
  const { updateTask, categories } = useStore();

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    updateTask(task._id, { completed: !task.completed });
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "secondary";
    }
  };

  const getCategory = () => {
    return categories.find((c) => c._id === task.category);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const category = getCategory();

  return (
    <div
      className={`list-group-item list-group-item-action ${
        task.completed ? "bg-light" : ""
      }`}
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex w-100 justify-content-between align-items-center ">
        <div className="d-flex align-items-center me-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="ms-2">
            <h5
              className={`mb-1 text-break ${
                task.completed ? "text-decoration-line-through text-muted" : ""
              }`}
            >
              {task.title}
            </h5>

            <div className="d-flex align-items-center mt-1 gap-1 flex-wrap">
              {task.dueDate && (
                <small className="text-muted me-2">
                  <i className="fas fa-calendar-alt me-1"></i>
                  {formatDate(task.dueDate)}
                </small>
              )}

              {category && (
                <span
                  className="badge rounded-pill me-2"
                  style={{
                    backgroundColor: category.color,
                    color: getContrastColor(category.color),
                  }}
                >
                  {category.name}
                </span>
              )}

              <span
                className={`badge bg-${getPriorityBadgeClass(task.priority)}`}
              >
                {task.priority}
              </span>

              {task.tags.length > 0 && <Wraptags tags={task.tags}></Wraptags>}
            </div>
          </div>
        </div>

        <div>
          <button
            className="btn btn-sm btn-outline-primary me-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <i className="fas fa-eye"></i>
          </button>
        </div>
      </div>

      {task.description && (
        <p className={`mb-0 mt-2 text-break ${task.completed ? "text-muted" : ""}`}>
          {task.description.length > 100
            ? `${task.description.substring(0, 100)}...`
            : task.description}
        </p>
      )}
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

export default TaskItem;
