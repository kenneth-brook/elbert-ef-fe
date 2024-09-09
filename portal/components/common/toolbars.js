import ApiService from "../../services/apiService.js";

const apiService = new ApiService();

export const createBusinessToolbar = (router) => {
    console.log('createBusinessToolbar called with router:', router);

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
        <input type="text" placeholder="Search businesses..." class="search-box">
        <select class="sort-dropdown">
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
        </select>
        <button class="sort-button">Sort</button>
        <button class="add-new">Add New Business</button>
    `;

    toolbar.querySelector('.add-new').addEventListener('click', () => {
        console.log('Navigating to businesses/add');
        router.navigate('businesses/add');
    });
    
    return toolbar;
};

export const createEventsToolbar = (router) => {
    const eventToolbar = document.createElement('div');
    eventToolbar.className = 'eventToolbar';
    eventToolbar.innerHTML = `
        <input type="text" placeholder="Search events..." class="search-box">
        <select class="sort-dropdown">
            <option value="name">Sort by Name</option>
            <option value="rating">Date</option>
        </select>
        <button class="sort-button">Sort</button>
        <button class="add-new-event">Add New Events</button>
    `;

    eventToolbar.querySelector('.add-new-event').addEventListener('click', () => {
        console.log('Navigating to events/add');
        router.navigate('events/add');
    });

    return eventToolbar;
};

export const createOfficeContentToolbar = (userRole) => {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';

    // Add button only if the user is not an editor
    if (userRole !== 'editor') {
        const addButton = document.createElement('button');
        addButton.textContent = 'Add New User';
        addButton.classList.add('add-new');
        addButton.style.float = 'right';
        addButton.addEventListener('click', () => openAddUserForm(userRole)); // Open popup on click
        toolbar.appendChild(addButton);
    }

    return toolbar;
};

// Function to create and open the popup form
const openAddUserForm = (userRole) => {
    let modal = document.querySelector('#addUserModal');

    // Create modal if it doesn't already exist
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'addUserModal';
        modal.classList.add('modal');
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Add New User</h2>
                <form id="addUserForm">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                    
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>

                    <label for="password">Temporary Password:</label>
                    <input type="text" id="password" name="password" required>
                    <button type="button" id="generatePassword">Generate Random Password</button>
                    
                    <label for="role">Role:</label>
                    <select id="role" name="role" required>
                        <option value="editor">Editor</option>
                        <option value="administrator">Administrator</option>
                        ${userRole === '365admin' ? '<option value="365admin">365 Admin</option>' : ''}
                    </select>

                    <input type="hidden" id="temppass" name="temppass" value="true">
                    <button type="submit">Submit</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close button functionality
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.style.display = 'none';  // Hide modal on close
        });

        // Random password generation
        modal.querySelector('#generatePassword').addEventListener('click', () => {
            const randomPassword = generateRandomPassword();
            modal.querySelector('#password').value = randomPassword;
        });

        // Form submit handler
        modal.querySelector('#addUserForm').addEventListener('submit', async (e) => {
            e.preventDefault();
        
            const userData = {
                email: modal.querySelector('#email').value,
                name: modal.querySelector('#name').value,
                password: modal.querySelector('#password').value,
                role: modal.querySelector('#role').value,
                temppass: modal.querySelector('#temppass').value
            };
        
            try {
                await apiService.addUser(userData);  // Use the apiService instance
                alert('User added successfully');
                modal.style.display = 'none';  // Hide modal after submission
            } catch (error) {
                console.error('Error adding user:', error);
                alert('Failed to add user');
            }
        });
    }

    modal.style.display = 'block';  // Show modal when the "Add New User" button is clicked
};

// Function to generate a random password
const generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
};
