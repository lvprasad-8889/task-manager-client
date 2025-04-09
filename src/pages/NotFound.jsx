import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h1 className="display-1">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead">The page you are looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn btn-primary mt-3">Go Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
