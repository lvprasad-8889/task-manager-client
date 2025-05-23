import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Register from "./components/auth/Register";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import useStore from "./store/useStore";
import socket from "./store/socket";

const App = () => {
  let { validateUserCredentials, user, isAuthenticated } = useStore();
  useEffect(() => {
    validateUserCredentials();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Navigate to="" />} />
        <Route path="" element={<Index />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
