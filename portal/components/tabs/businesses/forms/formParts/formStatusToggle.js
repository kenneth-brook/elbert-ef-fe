import Store from '../../../../../services/store.js'; // Adjust path to your store

const store = new Store(); // Create an instance of the store

const renderFormStatusToggle = (isEdit, businessData = {}) => {
    // Fetch the selected business type from the store
    const selectedBusinessType = store.getSelectedBusinessType();

    console.log('Store state:', store.getState()); // Log the entire store state for debugging
    console.log('Selected Business Type:', selectedBusinessType);
    
    if (!selectedBusinessType) {
        console.error('Selected business type is not set in the store.');
        return `<div>Error: Business type not selected</div>`;
    }

    const capitalizedType = selectedBusinessType.charAt(0).toUpperCase() + selectedBusinessType.slice(1);
    const businessName = businessData.name || ''; // Use business name if editing, or empty string for new business

    const announcementText = isEdit
        ? `Editing ${businessName}`
        : `Creating New ${capitalizedType} Business`;

    return `
        <div class="announcement-text" style="text-align: center; font-weight: bold; margin-bottom: 20px;">
            ${announcementText}
        </div>
        <div class="form-section">
            <div class="form-toggle">
                <label id="toggle-active-label">Company is currently <span id="toggle-status" style="color: red;">Inactive</span></label>
                <input type="checkbox" id="active-toggle" name="active">
            </div>
            <div class="form-toggle">
                <label id="toggle-member-label">Is Member: <span id="toggle-member-status" style="color: red;">No</span></label>
                <input type="checkbox" id="member-toggle" name="isMember">
            </div>
        </div>
    `;
};

export default renderFormStatusToggle;
