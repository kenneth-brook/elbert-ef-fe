import Router from './services/router.js';
import store from './services/store.js';
import ApiService from './services/apiService.js';
import TabManager from './components/tabManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const router = new Router();
    const apiService = new ApiService();

    try {
        console.log("Fetching user role...");
        const userData = await apiService.fetch('user-role');

        if (!userData.role) {
            throw new Error('User role data is missing');
        }

        // Set the user role in the store
        store.setUserRole(userData.role);
        console.log("User role set:", userData.role);

        // Fetch main data and store it
        const mainData = await apiService.fetch('main-data-endpoint');
        store.updateState({ data: mainData });

        // Initialize the router
        const router = new Router();  // <---- This was the missing line
        console.log("Router initialized:", router);

        // Initialize TabManager with the store, apiService, and router
        const tabManager = new TabManager(store, apiService, router);
        console.log("TabManager initialized");

        // Render tabs and load the current route
        tabManager.renderTabs();
        router.loadCurrentRoute();

    } catch (error) {
        console.error("Failed to initialize the application:", error);
        document.getElementById('content').innerHTML = '<p>Error loading the application. Please try again later.</p>';
    }
});
