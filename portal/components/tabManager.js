import BusinessesTab from './tabs/businesses/businessesTab.js';
import EventsTab from './tabs/events/eventTab.js';
import OfficeTab from './tabs/office/officeTab.js';

class TabManager {
  constructor(store, apiService, router) {
    this.store = store;
    this.apiService = apiService;
    this.router = router;
    this.tabs = [];
    this.tabContainer = document.querySelector('.tab-links'); // Get tab container
    this.setupTabs();
  }

  setupTabs() {
    this.tabs.push({ id: 'businesses/list', title: 'Businesses', instance: new BusinessesTab(this.store, this.router, this.apiService) });
    this.tabs.push({ id: 'events/list', title: 'Events', instance: new EventsTab(this.store, this.router, this.apiService) });
    this.tabs.push({ id: 'office/list', title: 'Office', instance: new OfficeTab(this.store, this.router, this.apiService) });

    this.renderTabs();

    if (!window.location.hash) {
      this.router.navigate('businesses/list'); // Default tab if no hash is present
    } else {
      this.router.loadCurrentRoute();
    }
  }

  renderTabs() {
    // Clear any previously rendered tabs
    this.tabContainer.innerHTML = '';

    // Loop through tabs and create tab elements
    this.tabs.forEach(tab => {
      const tabElement = document.createElement('li');
      const linkElement = document.createElement('a');
      linkElement.href = `#${tab.id}`;
      linkElement.textContent = tab.title;

      // Attach event listener for tab clicks
      linkElement.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        this.setActiveTab(tab.id); // Set active tab style
        this.router.navigate(tab.id); // Navigate to the new tab
      });

      tabElement.appendChild(linkElement);
      this.tabContainer.appendChild(tabElement);
    });

    // Set the active tab when the page loads
    this.setActiveTab(window.location.hash.slice(1) || 'businesses/list');
  }

  setActiveTab(tabId) {
    // Ensure the correct tab is highlighted when clicked
    const links = this.tabContainer.querySelectorAll('a');
    links.forEach(link => {
      if (link.href.endsWith(`#${tabId}`)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

export default TabManager;
