import { useState } from "react";
import useStore from "../../store/useStore";
import AddCategoryModal from "./AddCategoryModal";

const Sidebar = ({ inOffcanvas = false }) => {
  const { currentView, categories, changeView, deleteCategory } = useStore();

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentCategoryId, setCurrentCategoryId] = useState("");

  const handleDeleteCategory = async (e, categoryId) => {
    e.stopPropagation();
    e.preventDefault();

    if (window.confirm("Are you sure you want to delete this category?")) {
      setLoading(false);
      setCurrentCategoryId(categoryId);
      await deleteCategory(categoryId);
      setLoading(true);
    }
  };

  return (
    <>
      <nav
        id="sidebarMenu"
        className={`${
          inOffcanvas
            ? "col-12 d-md-none"
            : "col-md-4 col-lg-3 d-md-block py-4 collapse"
        } bg-light sidebar `}
      >
        <div className="position-sticky pt-3">
          <div className="d-flex justify-content-between align-items-center px-3 mb-3">
            <h6 className="sidebar-heading text-black fw-bold mt-2">
              Categories
            </h6>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus"></i> Add
            </button>
          </div>

          <ul className="nav flex-column">
            <li className="nav-item">
              <a
                className={`nav-link text-black ${
                  currentView === "all" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  changeView("all");
                }}
                {...(inOffcanvas && { "data-bs-dismiss": "offcanvas" })}
              >
                <i className="fas fa-list me-2"></i>
                All Tasks
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link text-black ${
                  currentView === "today" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  changeView("today");
                }}
                {...(inOffcanvas && { "data-bs-dismiss": "offcanvas" })}
              >
                <i className="fas fa-calendar-day me-2"></i>
                Today
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link text-black ${
                  currentView === "upcoming" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  changeView("upcoming");
                }}
                {...(inOffcanvas && { "data-bs-dismiss": "offcanvas" })}
              >
                <i className="fas fa-calendar-week me-2"></i>
                Upcoming
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link text-black ${
                  currentView === "completed" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  changeView("completed");
                }}
                {...(inOffcanvas && { "data-bs-dismiss": "offcanvas" })}
              >
                <i className="fas fa-check-circle me-2"></i>
                Completed
              </a>
            </li>
          </ul>

          {categories.length > 0 && (
            <>
              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span>Custom Categories</span>
              </h6>
              <ul className="nav flex-column">
                {categories.map((category) => (
                  <li className="nav-item" key={category._id}>
                    <a
                      className={`nav-link text-black d-flex align-items-center justify-content-between ${
                        currentView === "category" &&
                        category._id === currentView.categoryId
                          ? "active"
                          : ""
                      }`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        changeView("category", category);
                      }}
                      {...(inOffcanvas && { "data-bs-target": "offcanvas" })}
                    >
                      <div>
                        <span
                          className="category-color me-2"
                          style={{
                            display: "inline-block",
                            width: "12px",
                            height: "12px",
                            backgroundColor: category.color,
                            borderRadius: "50%",
                          }}
                        ></span>
                        {category.name}
                      </div>
                      {(loading && currentCategoryId === category._id) ? (
                        <div className="spinner-border spinner-border-sm text-primary"></div>
                      ) : (
                        <button
                          className="btn btn-sm text-black"
                          onClick={(e) => handleDeleteCategory(e, category._id)}
                          title="Delete category"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </nav>

      <AddCategoryModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
};

export default Sidebar;
