// User Data Fetcher with Enhanced Features
const UserDataFetcher = {
  // Configuration
  config: {
    apiUrl: 'https://jsonplaceholder.typicode.com/users',
    maxRetries: 2,
    timeout: 5000 // 5 seconds
  },

  // DOM Elements
  elements: {
    dataContainer: document.getElementById('api-data'),
    refreshBtn: document.getElementById('refresh-btn'),
    loadingTemplate: document.getElementById('loading-template')
  },

  // Initialize the component
  init() {
    this.setupEventListeners();
    this.fetchData();
  },

  // Set up event listeners
  setupEventListeners() {
    this.elements.refreshBtn.addEventListener('click', () => this.fetchData());
    document.addEventListener('userDataRefresh', () => this.fetchData());
  },

  // Main data fetching method
  async fetchData(retryCount = 0) {
    this.showLoadingState();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      const response = await fetch(this.config.apiUrl, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const users = await response.json();
      this.displayUsers(users);
      
    } catch (error) {
      console.error('Fetch error:', error);
      
      if (retryCount < this.config.maxRetries) {
        console.log(`Retrying... (${retryCount + 1}/${this.config.maxRetries})`);
        return this.fetchData(retryCount + 1);
      }
      
      this.showErrorState(error);
    }
  },

  // Display users in the UI
  displayUsers(users) {
    this.elements.dataContainer.innerHTML = '';
    
    if (!users || users.length === 0) {
      this.elements.dataContainer.textContent = 'No users found.';
      return;
    }

    const fragment = document.createDocumentFragment();
    const userList = document.createElement('ul');
    userList.className = 'user-list';

    users.forEach(user => {
      const listItem = this.createUserListItem(user);
      userList.appendChild(listItem);
    });

    fragment.appendChild(userList);
    this.elements.dataContainer.appendChild(fragment);
  },

  // Create individual user list item
  createUserListItem(user) {
    const li = document.createElement('li');
    li.className = 'user-item';
    li.innerHTML = `
      <div class="user-main">
        <span class="user-name">${user.name}</span>
        <button class="toggle-details">Show Details</button>
      </div>
      <div class="user-details hidden">
        <p>Email: ${user.email}</p>
        <p>Phone: ${user.phone}</p>
        <p>Company: ${user.company.name}</p>
      </div>
    `;
    
    li.querySelector('.toggle-details').addEventListener('click', (e) => {
      const details = li.querySelector('.user-details');
      details.classList.toggle('hidden');
      e.target.textContent = details.classList.contains('hidden') 
        ? 'Show Details' 
        : 'Hide Details';
    });
    
    return li;
  },

  // UI State Handlers
  showLoadingState() {
    this.elements.dataContainer.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Loading user data...</p>
    `;
    this.elements.dataContainer.className = 'loading';
  },

  showErrorState(error) {
    this.elements.dataContainer.innerHTML = `
      <div class="error-icon">⚠️</div>
      <p>Failed to load data: ${error.message}</p>
      <button class="retry-btn">Try Again</button>
    `;
    this.elements.dataContainer.className = 'error';
    
    this.elements.dataContainer.querySelector('.retry-btn')
      .addEventListener('click', () => this.fetchData());
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => UserDataFetcher.init());