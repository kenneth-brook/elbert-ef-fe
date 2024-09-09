//import AddOffice from './AddOffice.js';
//import EditOffice from './EditOffice.js';
import ListOffice from './listOffice.js';

class OfficeTab {
  constructor(store, router, apiService) {
    this.store = store;
    this.router = router;
    this.apiService = apiService;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.addRoute('office/list', () => this.showListOfficeContent());
    //this.router.addRoute('office/add', () => this.showAddOfficeContent());
    //this.router.addRoute('office/edit', () => this.showEditOfficeContent());
    // Default sub-route for 'office'
    this.router.addRoute('office', () => this.showListOfficeContent());
  }

  showAddOfficeContent() {
    const view = new AddOffice();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }

  showEditOfficeContent() {
    const view = new EditOffice();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }

  async showListOfficeContent() {
    try {
      // Fetch users from the API using the ApiService
      const users = await this.apiService.fetchUsers();

      if (!users || users.length === 0) {
        throw new Error('No users found');
      }

      console.log('Fetched users:', users); 

      const userRole = this.store.getUserRole(); // Get the user role from the store
      const userId = 'current-user-id'; // Replace with the actual logged-in user ID

      // Pass the users to ListOffice
      const listOffice = new ListOffice(userRole, userId, users);
      document.querySelector('.tab-content').innerHTML = '';
      document.querySelector('.tab-content').appendChild(listOffice.render());
    } catch (error) {
      console.error('Error loading office users:', error);
      document.querySelector('.tab-content').innerHTML = '<p>Error loading users. Please try again later.</p>';
    }
  }
}

export default OfficeTab;
