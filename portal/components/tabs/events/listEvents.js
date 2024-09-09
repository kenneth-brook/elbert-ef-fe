// listEvents.js
import { createEventsToolbar } from '../../common/toolbars.js';
import ApiService from '../../../services/apiService.js';

class ListEvents {
  constructor(router, store) {
      this.router = router;
      this.store = store;
      this.apiService = new ApiService();

      console.log("Store in ListEvents:", this.store);
      console.log("Store getState method:", typeof this.store.getState);

      this.container = document.createElement('div');
      this.parentContainer = document.createElement('div');
      this.parentContainer.className = 'events-section';
      this.parentContainer.appendChild(this.container);
  }

  render() {
    console.log('ListEvents render called with router:', this.router);

    this.container.innerHTML = ''; // Clear any previous content
    this.container.className = 'events-cards-container';

    if (!this.toolbar) {
    const toolbar = createEventsToolbar(this.router);
    toolbar.classList.add('toolbar'); // Add toolbar class for styling
    this.parentContainer.insertBefore(toolbar, this.container); // Insert the toolbar before the cards container
    this.toolbar = toolbar;
    }
    // Retrieve the events data from the store
    const events = this.store.getState().data.events;

    // Sort events by start_date
    events.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    // Create a card for each event
    events.forEach(event => {
      const card = this.createEventCard(event);
      this.container.appendChild(card);
    });

    return this.parentContainer;
  }

  createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const name = document.createElement('h3');
    name.textContent = event.name;
    card.appendChild(name);

    const date = document.createElement('p');
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : null;
    date.textContent = endDate
        ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
        : `${startDate.toLocaleDateString()}`;
    card.appendChild(date);

    if (event.start_time) {
        const startTime = document.createElement('p');
        startTime.textContent = `Start Time: ${event.start_time}`;
        card.appendChild(startTime);
    }

    if (event.end_time) {
        const endTime = document.createElement('p');
        endTime.textContent = `End Time: ${event.end_time}`;
        card.appendChild(endTime);
    }

    const address = document.createElement('p');
    address.textContent = `${event.street_address}, ${event.city}, ${event.state} ${event.zip}`;
    card.appendChild(address);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        this.router.navigate(`events/edit/${event.id}`);
    });
    card.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        this.eventToDelete = event.id; // Store the event ID
        this.openEventModal(); // Open modal for event deletion
    });
    card.appendChild(deleteButton);

    return card;
}

// Create modal for event deletion (similar to business deletion modal)
createEventModal() {
    // Create the modal structure
    this.eventModal = document.createElement('div');
    this.eventModal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    this.eventModal.appendChild(modalContent);

    // Hide modal initially
    this.eventModal.style.display = 'none';

    // Append the modal to the document body
    document.body.appendChild(this.eventModal);

    const modalTitle = document.createElement('h4');
    modalTitle.textContent = 'Delete Event';
    modalContent.appendChild(modalTitle);

    const modalMessage = document.createElement('p');
    modalMessage.textContent = 'Are you sure you want to delete this event? This action cannot be undone.';
    modalContent.appendChild(modalMessage);

    const modalActions = document.createElement('div');
    modalActions.className = 'modal-actions';

    this.confirmDeleteEventButton = document.createElement('button');
    this.confirmDeleteEventButton.textContent = 'Delete';
    this.confirmDeleteEventButton.className = 'modal-confirm';
    this.confirmDeleteEventButton.addEventListener('click', () => this.confirmDeleteEvent());
    modalActions.appendChild(this.confirmDeleteEventButton);

    this.cancelDeleteEventButton = document.createElement('button');
    this.cancelDeleteEventButton.textContent = 'Cancel';
    this.cancelDeleteEventButton.className = 'modal-cancel';
    this.cancelDeleteEventButton.addEventListener('click', () => this.closeEventModal());
    modalActions.appendChild(this.cancelDeleteEventButton);

    modalContent.appendChild(modalActions);
    this.eventModal.appendChild(modalContent);

    // Initially hide the modal
    this.eventModal.style.display = 'none';

    // Append the modal to the document body
    document.body.appendChild(this.eventModal);
}

openEventModal() {
  if (!this.eventModal) {
    this.createEventModal();
}

    this.eventModal.style.display = 'block';
}

closeEventModal() {
    this.eventModal.style.display = 'none';
    this.eventToDelete = null; // Reset the event ID
}

async confirmDeleteEvent() {
    if (this.eventToDelete) {
        try {
            await this.apiService.deleteEvent(this.eventToDelete); // Call your event delete API
            this.closeEventModal();
            this.fetchEventsAndRender(); // Re-fetch and re-render the events list after deletion
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete the event. Please try again later.');
        }
    }
}

async fetchEventsAndRender() {
  try {
    // Assuming apiService.fetchData fetches your event data
    const eventsData = await this.apiService.fetchData();

    // Update the store's state using updateState
    this.store.updateState({ data: { ...this.store.getState().data, events: eventsData.events } });

    // Re-render the updated event list
    this.render();
  } catch (error) {
    console.error('Error fetching and rendering events:', error);
  }
}

  
}

export default ListEvents;
