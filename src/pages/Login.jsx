import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const setUser = useStore(state => state.setUser);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', formData);
      setUser(res.data);
      navigate('/');
    } catch (err) {
      alert(err.response.data.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="form-control my-2" name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <button className="btn btn-success">Login</button>
      </form>
    </div>
  );
};

export default Login;
