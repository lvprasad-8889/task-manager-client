// Auth Module
const Auth = (() => {
  // DOM Elements
  const authView = document.getElementById('auth-view');
  const appView = document.getElementById('app-view');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');
  const btnLogout = document.getElementById('btn-logout');
  const usernameDisplay = document.getElementById('username-display');

  // API Endpoints
  // In production, this will be relative to the current domain
  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';
  const ENDPOINTS = {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
  };

  // Initialize Auth
  const init = () => {
    // Check if user is already logged in
    checkAuthStatus();
    
    // Event Listeners
    formLogin.addEventListener('submit', handleLogin);
    formRegister.addEventListener('submit', handleRegister);
    showRegisterLink.addEventListener('click', toggleForms);
    showLoginLink.addEventListener('click', toggleForms);
    btnLogout.addEventListener('click', logout);
  };

  // Check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token) {
      // Update UI with user info
      usernameDisplay.textContent = user.name || 'User';
      showAppView();
    } else {
      showAuthView();
    }
  };

  // Toggle between login and register forms
  const toggleForms = (e) => {
    e.preventDefault();
    loginForm.classList.toggle('d-none');
    registerForm.classList.toggle('d-none');
    loginError.classList.add('d-none');
    registerError.classList.add('d-none');
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    loginError.classList.add('d-none');
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
      // Make the actual API call
      const response = await fetch(ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      checkAuthStatus();
    } catch (error) {
      loginError.textContent = error.message;
      loginError.classList.remove('d-none');
      console.error('Login error:', error);
    }
  };

  // Handle register form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    registerError.classList.add('d-none');
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Basic validation
    if (password !== confirmPassword) {
      registerError.textContent = 'Passwords do not match';
      registerError.classList.remove('d-none');
      return;
    }
    
    try {
      // Make the actual API call
      const response = await fetch(ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      checkAuthStatus();
    } catch (error) {
      registerError.textContent = error.message;
      registerError.classList.remove('d-none');
      console.error('Registration error:', error);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuthStatus();
    // Reset forms
    formLogin.reset();
    formRegister.reset();
    loginForm.classList.remove('d-none');
    registerForm.classList.add('d-none');
  };

  // Show authentication view
  const showAuthView = () => {
    authView.classList.remove('d-none');
    appView.classList.add('d-none');
  };

  // Show application view
  const showAppView = () => {
    authView.classList.add('d-none');
    appView.classList.remove('d-none');
    // Initialize other modules
    if (typeof Tasks !== 'undefined') Tasks.init();
    if (typeof Categories !== 'undefined') Categories.init();
  };

  // Return public methods
  return {
    init,
    checkAuthStatus,
    logout
  };
})();
