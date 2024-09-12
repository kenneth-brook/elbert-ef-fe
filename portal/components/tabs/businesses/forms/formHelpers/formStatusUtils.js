export const initializeStatusToggles = (formContainer, businessData) => {
    // Active toggle logic
    const activeToggle = formContainer.querySelector('#active-toggle');
    const toggleStatus = formContainer.querySelector('#toggle-status');

    if (businessData && businessData.active) {
        activeToggle.checked = true;
        toggleStatus.textContent = 'Active';
        toggleStatus.style.color = 'green';
    } else {
        activeToggle.checked = false;
        toggleStatus.textContent = 'Inactive';
        toggleStatus.style.color = 'red';
    }

    activeToggle.addEventListener('change', () => {
        if (activeToggle.checked) {
            toggleStatus.textContent = 'Active';
            toggleStatus.style.color = 'green';
        } else {
            toggleStatus.textContent = 'Inactive';
            toggleStatus.style.color = 'red';
        }
    });

    // Is Member toggle logic
    const memberToggle = formContainer.querySelector('#member-toggle');
    const memberStatus = formContainer.querySelector('#toggle-member-status');

    if (businessData && businessData.isMember) {
        memberToggle.checked = true;
        memberStatus.textContent = 'Yes';
        memberStatus.style.color = 'green';
    } else {
        memberToggle.checked = false;
        memberStatus.textContent = 'No';
        memberStatus.style.color = 'red';
    }

    memberToggle.addEventListener('change', () => {
        if (memberToggle.checked) {
            memberStatus.textContent = 'Yes';
            memberStatus.style.color = 'green';
        } else {
            memberStatus.textContent = 'No';
            memberStatus.style.color = 'red';
        }
    });
};
