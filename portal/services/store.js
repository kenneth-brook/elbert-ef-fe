class Store {
    constructor(initialState) {
        this.state = initialState || { data: { combined: [] } }; // Ensure data.combined is initialized
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.listeners.forEach(listener => listener(this.state));
    }

    setUserRole(role) {
        this.updateState({ userRole: role });
    }

    getUserRole() {
        return this.state.userRole;
    }

    setSelectedBusinessType(type) {
        this.updateState({ selectedBusinessType: type });
        console.log('Updated selectedBusinessType in store:', this.getState().selectedBusinessType);
    }

    getSelectedBusinessType() {
        return this.state.selectedBusinessType;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener); // Return an unsubscribe function
        };
    }
}

const store = new Store();
export default store;

