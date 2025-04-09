
// Categories Module
const Categories = (() => {
  // Categories array to store category objects
  let categories = [];
  
  // DOM Elements
  const addCategoryBtn = document.getElementById('add-category-btn');
  const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));
  const categoryForm = document.getElementById('category-form');
  const categoryNameInput = document.getElementById('category-name');
  const categoryColorInput = document.getElementById('category-color');
  const saveCategoryBtn = document.getElementById('save-category-btn');
  const customCategoriesList = document.getElementById('custom-categories-list');
  
  // API Endpoints (for future implementation)
  const API_URL = 'http://localhost:3000/api';
  const ENDPOINTS = {
    categories: `${API_URL}/categories`
  };
  
  // Initialize Categories module
  const init = () => {
    // Load categories from localStorage
    loadCategories();
    
    // Event listeners
    addCategoryBtn.addEventListener('click', showAddCategoryModal);
    saveCategoryBtn.addEventListener('click', saveCategory);
    
    // Initial render
    renderCategories();
  };
  
  // Load categories from localStorage
  const loadCategories = () => {
    const storedCategories = localStorage.getItem('categories');
    categories = storedCategories ? JSON.parse(storedCategories) : [];
  };
  
  // Save categories to localStorage
  const saveCategories = () => {
    localStorage.setItem('categories', JSON.stringify(categories));
  };
  
  // Show modal to add new category
  const showAddCategoryModal = () => {
    categoryForm.reset();
    categoryModal.show();
  };
  
  // Save new category
  const saveCategory = () => {
    const name = categoryNameInput.value.trim();
    const color = categoryColorInput.value;
    
    if (!name) {
      alert('Please enter a category name');
      return;
    }
    
    // Create new category object
    const newCategory = {
      id: 'category_' + Date.now(),
      name,
      color,
      createdAt: new Date().toISOString()
    };
    
    // Add to categories array
    categories.push(newCategory);
    
    // Save and update UI
    saveCategories();
    renderCategories();
    categoryModal.hide();
    
    // Refresh tasks if Tasks module is available
    if (typeof Tasks !== 'undefined') {
      Tasks.renderTasks();
    }
  };
  
  // Delete category
  const deleteCategory = (categoryId) => {
    if (confirm('Are you sure you want to delete this category?')) {
      // Remove category from array
      categories = categories.filter(c => c.id !== categoryId);
      
      // Save changes
      saveCategories();
      renderCategories();
      
      // Refresh tasks if Tasks module is available
      if (typeof Tasks !== 'undefined') {
        Tasks.renderTasks();
      }
    }
  };
  
  // Render categories in the sidebar
  const renderCategories = () => {
    // Clear the current list
    customCategoriesList.innerHTML = '';
    
    // Add each category to the list
    categories.forEach(category => {
      const li = document.createElement('li');
      li.className = 'nav-item category-item';
      
      const categoryLink = document.createElement('a');
      categoryLink.className = 'nav-link';
      categoryLink.href = '#';
      categoryLink.dataset.category = category.id;
      
      categoryLink.innerHTML = `
        <span className="category-color" style="background-color: ${category.color};"></span>
        ${category.name}
      `;
      
      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm text-danger';
      deleteBtn.innerHTML = '<i className="fas fa-times"></i>';
      deleteBtn.title = 'Delete category';
      
      // Add event listener to delete button
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteCategory(category.id);
      });
      
      // Add event listener for category selection
      categoryLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('[data-category]').forEach(link => {
          link.classList.remove('active');
        });
        
        // Add active class to clicked link
        categoryLink.classList.add('active');
        
        // Update tasks view if Tasks module is available
        if (typeof Tasks !== 'undefined') {
          Tasks.changeView(category.id);
          document.getElementById('current-view-title').textContent = category.name;
        }
      });
      
      li.appendChild(categoryLink);
      li.appendChild(deleteBtn);
      customCategoriesList.appendChild(li);
    });
  };
  
  // Get all categories
  const getCategories = () => {
    return categories;
  };
  
  // Get category by ID
  const getCategoryById = (categoryId) => {
    return categories.find(c => c.id === categoryId);
  };
  
  // Return public methods
  return {
    init,
    getCategories,
    getCategoryById,
    renderCategories
  };
})();
