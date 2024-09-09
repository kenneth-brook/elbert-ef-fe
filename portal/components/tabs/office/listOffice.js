import { createOfficeContentToolbar } from '../../common/toolbars.js';

class ListOffice {
    constructor(userRole, userId, users) {
        this.userRole = userRole;
        this.userId = userId;
        this.users = users || [];  // Default to an empty array if users are undefined
        this.container = document.createElement('div');
      }

    render(users) {
        this.container.innerHTML = ''; // Clear existing content
        if (!Array.isArray(this.users)) {
            console.error('Users data is invalid:', this.users);  // Log the issue for debugging
            return this.container;
        }

        // Add toolbar if not already created
        if (!this.toolbar) {
            const toolbar = createOfficeContentToolbar(this.userRole);  // Pass userRole to the toolbar
            toolbar.classList.add('toolbar'); // Add toolbar class for styling
            this.container.prepend(toolbar);  // Insert toolbar at the top of the container
            this.toolbar = toolbar;
        }

        // Separate users by roles
        const editors = this.users.filter(user => user.role === 'editor');
        const admins = this.users.filter(user => user.role === 'administrator');
        const admins365 = this.users.filter(user => user.role === '365admin');

        if (editors.length > 0) {
            this.renderEditors(editors);
          }
          if (admins.length > 0) {
            this.renderAdmins(admins);
          }
          if (admins365.length > 0) {
            this.renderAdmins365(admins365);
          }

        return this.container;
    }

    renderEditors(editors) {
        const editorsSection = document.createElement('div');
        editorsSection.innerHTML = `<h3>Editors</h3>`;
        editors.forEach(editor => {
          const editorElement = document.createElement('div');
          editorElement.textContent = `${editor.email}`;
    
          // Show "Edit Profile" and "Change Password" for the logged-in editor
          if (this.userRole === 'editor' && editor.id === this.userId) {
            const editProfileButton = this.createButton('Edit Profile');
            const changePasswordButton = this.createButton('Change Password');
            editorElement.appendChild(editProfileButton);
            editorElement.appendChild(changePasswordButton);
          }
          editorsSection.appendChild(editorElement);
        });
        this.container.appendChild(editorsSection);
      }
    
      renderAdmins(admins) {
        const adminsSection = document.createElement('div');
        adminsSection.innerHTML = `<h3>Administrators</h3>`;
        admins.forEach(admin => {
          const adminElement = document.createElement('div');
          adminElement.textContent = `${admin.email}`;
    
          // Show "Edit," "Reset Password," and "Remove" for logged-in administrators
          if (this.userRole === 'administrator' || this.userRole === '365admin') {
            const editButton = this.createButton('Edit');
            const resetPasswordButton = this.createButton('Reset Password');
            const removeButton = this.createButton('Remove');
            adminElement.appendChild(editButton);
            adminElement.appendChild(resetPasswordButton);
            adminElement.appendChild(removeButton);
          }
          adminsSection.appendChild(adminElement);
        });
        this.container.appendChild(adminsSection);
      }
    
      renderAdmins365(admins365) {
        const admins365Section = document.createElement('div');
        admins365Section.innerHTML = `<h3>365 Admins</h3>`;
        admins365.forEach(admin365 => {
          const adminElement = document.createElement('div');
          adminElement.textContent = `${admin365.email}`;
    
          // Show "Change Password" and "Remove" for all 365admins
          if (this.userRole === '365admin') {
            const changePasswordButton = this.createButton('Change Password');
            const removeButton = this.createButton('Remove');
            adminElement.appendChild(changePasswordButton);
            adminElement.appendChild(removeButton);
          }
          admins365Section.appendChild(adminElement);
        });
        this.container.appendChild(admins365Section);
      }
    
      // Helper method to create a button element
      createButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('action-button');  // Add a CSS class for styling
        return button;
      }
}

export default ListOffice;

