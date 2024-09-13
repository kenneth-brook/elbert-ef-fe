import store from '../../../../../services/store.js'; 

export const renderAndInitializeFormStatusToggle = (formElement, businessData) => {
    businessData = businessData || {};
    const isEdit = !!businessData.id;

    // Fetch the selected business type from the store
    let selectedBusinessType = store.getSelectedBusinessType() || 'Business';

    // If selectedBusinessType is not set, and businessData.type is available, use it
    if (!selectedBusinessType && businessData.type) {
        selectedBusinessType = businessData.type;
    }

    console.log('Selected Business Type in renderAndInitializeFormStatusToggle:', selectedBusinessType);

    const capitalizedType = selectedBusinessType.charAt(0).toUpperCase() + selectedBusinessType.slice(1);
    const businessName = businessData.name || '';

    const announcementText = isEdit
        ? `Editing ${businessName}`
        : `Creating New ${capitalizedType} Business`;

    // Render the HTML
    const formStatusToggleHtml = `
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

    // Insert the HTML into the formContainer
    const statusToggleContainer = document.createElement('div');
    statusToggleContainer.innerHTML = formStatusToggleHtml;

    console.log('formElement before calling renderAndInitializeFormStatusToggle:', formElement);
    console.log('Type of formElement:', typeof formElement);
    console.log('Is formElement an instance of Element?', formElement instanceof Element);
    console.log('Does formElement have insertBefore?', typeof formElement.insertBefore);

    formElement.prepend(statusToggleContainer);

    // Initialize the toggles
    initializeStatusToggles(formElement, businessData);
};

const initializeStatusToggles = (formElement, businessData = {}) => {
    businessData = businessData || {};
    const activeToggle = formElement.querySelector('#active-toggle');
    const toggleStatus = formElement.querySelector('#toggle-status');
    const memberToggle = formElement.querySelector('#member-toggle');
    const memberStatusLabel = formElement.querySelector('#toggle-member-status');

    // Check if elements exist
    if (activeToggle && toggleStatus) {
        console.log('activeToggle and toggleStatus elements exist.');

        activeToggle.checked = businessData.active || false;
        toggleStatus.textContent = activeToggle.checked ? 'Active' : 'Inactive';
        toggleStatus.style.color = activeToggle.checked ? 'green' : 'red';

        activeToggle.addEventListener('change', () => {
            toggleStatus.textContent = activeToggle.checked ? 'Active' : 'Inactive';
            toggleStatus.style.color = activeToggle.checked ? 'green' : 'red';
        });
    } else {
        if (!activeToggle) {
            console.error('activeToggle element does NOT exist.');
        }
        if (!toggleStatus) {
            console.error('toggleStatus element does NOT exist.');
        }
    }

    if (memberToggle && memberStatusLabel) {
        console.log('memberToggle and memberStatusLabel elements exist.');

        memberToggle.checked = businessData.chamber_member === true;
        memberStatusLabel.textContent = memberToggle.checked ? 'Yes' : 'No';
        memberStatusLabel.style.color = memberToggle.checked ? 'green' : 'red';

        memberToggle.addEventListener('change', () => {
            memberStatusLabel.textContent = memberToggle.checked ? 'Yes' : 'No';
            memberStatusLabel.style.color = memberToggle.checked ? 'green' : 'red';
        });
    } else {
        if (!memberToggle) {
            console.error('memberToggle element does NOT exist.');
        }
        if (!memberStatusLabel) {
            console.error('memberStatusLabel element does NOT exist.');
        }
    }
};

