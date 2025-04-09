import useStore from "../../store/useStore";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({ userName }) => {
  const { logout, user } = useStore();

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="">
          <i className="fas fa-tasks me-2"></i>
          <span className="d-inline d-sm-none">
            {userName.split(" ")[0] + "'s "}
          </span>{" "}
          TaskFlow
        </Link>
        <div className="d-flex gap-3 align-items-center">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="d-md-none">
            <NotificationDropdown></NotificationDropdown>{" "}
          </div>
        </div>
        <div
          className="offcanvas offcanvas-start d-md-none"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              {user.name}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body vh-100 d-flex flex-column justify-content-between">
            <Sidebar inOffcanvas={true}></Sidebar>

            <button className="btn btn-danger ms-2 mt-auto" onClick={logout}>
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </button>
          </div>
        </div>

        {/* <div className="d-none d-md-block">
        </div> */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-4">
            <li className="nav-item mt-1">
              <NotificationDropdown></NotificationDropdown>
            </li>
            <li className="nav-item text-white">
              <span></span>
              <span className="d-none d-sm-inline">
                <i className="fas fa-user-circle me-1"></i>
                {userName}
              </span>
              <button className="btn btn-danger ms-2" onClick={logout}>
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
