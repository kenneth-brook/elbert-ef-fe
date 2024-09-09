// listBusinesses.js
import { createBusinessToolbar } from '../../common/toolbars.js';

class ListBusinesses {
    constructor(router, store, apiService) {
        this.router = router;
        this.store = store;
        this.apiService = apiService;
        this.container = document.createElement('div');

        this.unsubscribe = this.store.subscribe(() => {
            this.render();
        });

        // Automatically fetch data and render when the component is initialized
        this.fetchDataAndRender();

        // Create the modal elements
        this.createModal();
    }

    async fetchDataAndRender() {
        try {
            const data = await this.apiService.fetchData(); // Fetch data from the API
            this.store.updateState({ data }); // Update the store with the fetched data
            this.render(); // Render the component with the new data
        } catch (error) {
            console.error('Error fetching data:', error);
            this.container.innerHTML = '<p>Failed to load businesses. Please try again later.</p>';
        }
    }

    render() {
        console.log('ListBusinesses render called with router:', this.router);

        // Clear any previous content
        this.container.innerHTML = '';

        // Create a parent container for the toolbar and the cards
        const parentContainer = document.createElement('div');
        parentContainer.className = 'business-section';

        // Create and add the toolbar
        const toolbar = createBusinessToolbar(this.router);
        toolbar.classList.add('toolbar');
        parentContainer.appendChild(toolbar);

        // Create and add the cards container
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'business-cards-container';
        parentContainer.appendChild(cardsContainer);

        // Retrieve the businesses data from the store
        const businesses = (this.store.getState().data && this.store.getState().data.combined) || [];

        if (businesses.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No businesses available to display.';
            cardsContainer.appendChild(message);
        } else {
            // Create a card for each business
            businesses.forEach(business => {
                const card = this.createBusinessCard(business);
                cardsContainer.appendChild(card);
            });
        }

        this.container.appendChild(parentContainer);

        return this.container;
    }

    destroy() {
        // Unsubscribe from store updates when the component is destroyed
        this.unsubscribe();
    }

    createBusinessCard(business) {
        const card = document.createElement('div');
        card.className = 'business-card';

        const name = document.createElement('h3');
        name.textContent = `${business.name} (${business.type})`;
        card.appendChild(name);

        const address = document.createElement('p');
        address.textContent = `${business.street_address}, ${business.city}, ${business.state} ${business.zip}`;
        card.appendChild(address);

        const phone = document.createElement('p');
        phone.textContent = business.phone;
        card.appendChild(phone);

        // Add edit and delete buttons
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            this.router.navigate(`businesses/edit/${business.business_id}`);
        });
        card.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            this.businessToDelete = business.business_id; // Store the business ID
            this.openModal();
        });
        card.appendChild(deleteButton);

        return card;
    }

    createModal() {
        // Create the modal structure
        this.modal = document.createElement('div');
        this.modal.className = 'modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const modalTitle = document.createElement('h4');
        modalTitle.textContent = 'Delete Business';
        modalContent.appendChild(modalTitle);

        const modalMessage = document.createElement('p');
        modalMessage.textContent = 'Are you sure you want to delete this business? This action cannot be undone.';
        modalContent.appendChild(modalMessage);

        const modalActions = document.createElement('div');
        modalActions.className = 'modal-actions';

        this.confirmDeleteButton = document.createElement('button');
        this.confirmDeleteButton.textContent = 'Delete';
        this.confirmDeleteButton.className = 'modal-confirm';
        this.confirmDeleteButton.addEventListener('click', () => this.confirmDelete());
        modalActions.appendChild(this.confirmDeleteButton);

        this.cancelDeleteButton = document.createElement('button');
        this.cancelDeleteButton.textContent = 'Cancel';
        this.cancelDeleteButton.className = 'modal-cancel';
        this.cancelDeleteButton.addEventListener('click', () => this.closeModal());
        modalActions.appendChild(this.cancelDeleteButton);

        modalContent.appendChild(modalActions);
        this.modal.appendChild(modalContent);

        // Initially hide the modal
        this.modal.style.display = 'none';

        // Append the modal to the document body
        document.body.appendChild(this.modal);
    }

    openModal() {
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.businessToDelete = null; // Reset the business ID
    }

    async confirmDelete() {
        if (this.businessToDelete) {
            try {
                await this.apiService.deleteBusiness(this.businessToDelete);
                this.closeModal();
                this.fetchDataAndRender(); // Re-fetch and re-render the list after deletion
            } catch (error) {
                console.error('Error deleting business:', error);
                alert('Failed to delete the business. Please try again later.');
            }
        }
    }
}

export default ListBusinesses;
