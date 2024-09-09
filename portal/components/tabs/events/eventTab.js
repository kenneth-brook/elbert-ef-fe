import ApiService from '../../../services/apiService.js';
import { eventFormTemplate } from './formParts/eventFormTemplate.js';
import { initializeEventForm } from './formParts/eventFormInitializer.js';
import ListEvents from './listEvents.js';

class EventsTab {
  constructor(store, router) {
    this.store = store;
    this.router = router;
    this.apiService = new ApiService();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.addRoute('events/add', () => this.showAddEvent());
    this.router.addRoute('events/edit/:id', (id) => this.showEditEvent(id));
    this.router.addRoute('events/list', this.showListEvents.bind(this));
  }

  showAddEvent() {
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
      console.error("Content area element not found");
      return;
    }
    contentArea.innerHTML = eventFormTemplate();
    initializeEventForm(contentArea, this.apiService);
  }

  showEditEvent(id) {
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
      console.error("Content area element not found");
      return;
    }

    // Load the event data from the store using the event ID
    console.log("Attempting to edit event with ID:", id);
    console.log("Current events in store:", this.store.getState().data.events);

    const event = this.store.getState().data.events.find(e => e.id == id);
    if (!event) {
      console.error(`Event with ID ${id} not found`);
      return;
    }

    // Render the form template
    contentArea.innerHTML = eventFormTemplate();

    // Initialize the form with the existing event data
    initializeEventForm(contentArea, this.apiService, event); // Pass the event data to the initializer
  }

  showListEvents() {
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
        console.error("Content area element not found");
        return;
    }
    contentArea.innerHTML = '';

    const listEvents = new ListEvents(this.router, this.store);
    const renderedEvents = listEvents.render();
    contentArea.appendChild(renderedEvents);
  }
}

export default EventsTab;
