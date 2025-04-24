import { useEffect, useState } from "react";
import useStore from "../store/useStore";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Dashboard from "../components/dashboard/Dashboard";
import { io } from "socket.io-client";

const Index = () => {
  const { isAuthenticated, user, setUserNotification } = useStore();
``
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      let prod = process.env.NODE_ENV !== "development";
      let socket = io(
        prod
          ? "wss://task-managers-server-12a74ec3356d.herokuapp.com/"
          : "http://localhost:3000"
      ); 
      socket.on(`notification:${user.id}`, (notification) => {
        setUserNotification(notification);
      });
      return () => {
        socket.off(`notification:${user.id}`);
      };
    }
  }, [isAuthenticated]);

  // Render based on authentication state
  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="row w-100 justify-content-center">
          <div className="col-sm-8 col-md-6 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-body p-4">
                {showLogin ? (
                  <div>
                    <Login />

                    <div className="text-center mt-2">
                      Dont have an account ?{" "}
                      <span
                        role="button"
                        onClick={() => {
                          setShowLogin(!showLogin);
                        }}
                        className="text-decoration-underline"
                      >
                        Register
                      </span>{" "}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Register />

                    <div className="text-center mt-2">
                      Already have an account ?{" "}
                      <span
                        role="button"
                        className="cursor-pointer text-decoration-underline"
                        onClick={() => {
                          setShowLogin(!showLogin);
                        }}
                      >
                        Login
                      </span>{" "}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
