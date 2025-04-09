import { useStore } from '../store/useStore';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const user = useStore(state => state.user);
  return user ? children : <Navigate to="" />;
}
