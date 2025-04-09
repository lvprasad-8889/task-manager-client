
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the Auth module first
  if (typeof Auth !== 'undefined') {
    Auth.init();
  }
  
  // Other modules will be initialized by Auth when needed
  // This ensures the proper initialization sequence
});
