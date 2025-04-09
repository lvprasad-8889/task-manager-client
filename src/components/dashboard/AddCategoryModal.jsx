import { useState } from "react";
import useStore from "../../store/useStore";

const AddCategoryModal = ({ show, onHide }) => {
  const { addCategory } = useStore();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4a6fa5");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim()) {
      addCategory({ name, color });
      setName("");
      setColor("#4a6fa5");
      onHide();
    }
  };

  if (!show) return;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", zIndex: 9999999 }}
    >
      <div className="modal-dialog" style={{ zIndex: 9999999 }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Category</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <form id="category-form" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="category-name" className="form-label">
                  Category Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="category-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="category-color" className="form-label">
                  Color
                </label>
                <input
                  type="color"
                  className="form-control form-control-color"
                  id="category-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
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
                  Save Category
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

export default AddCategoryModal;
