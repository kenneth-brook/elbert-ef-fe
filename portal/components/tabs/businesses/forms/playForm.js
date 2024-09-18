import ApiService from '../../../../services/apiService.js';
import config from '../../../../utils/config.js';
import { renderAndInitializeFormStatusToggle } from './formParts/formStatusToggle.js';
import renderBusinessDetailsSection from './formParts/businessDetailsSection.js';
import renderLatLongSection from './formParts/latLongSection.js';
import renderContactDetailsSection from './formParts/contactDetailsSection.js';
import renderImageUploadSection from './formParts/imageUploadSection.js';
import renderDescriptionSection from './formParts/descriptionSection.js';
import renderMenuSelectionSection from './formParts/menuSelectionSection.js';

const apiService = new ApiService();

export const playForm = (businessData = {}) => {
    businessData = businessData || {};
    return `
    <form id="combined-form" enctype="multipart/form-data">
        <!-- Initial Business Form Fields -->

        <div class="form-section">
            <!-- Business Details -->
            ${renderBusinessDetailsSection()}
        </div>
        <div class="form-section">
            <!-- Latitude, Longitude and Auto Fill -->
            ${renderLatLongSection()}
        </div>
        <div class="form-section">
            <!-- Contact Details -->
            ${renderContactDetailsSection()}
        </div>
        <div class="form-section" id="image-upload-section">
            ${renderImageUploadSection()}
        </div>
        <div class="form-section description-section">
            ${renderDescriptionSection()}
        </div>
        <div class="form-section" id="menu-selection-section">
            ${renderMenuSelectionSection()}
        </div>
        <input type="hidden" id="businessId" name="businessId" value="">
        
        <div style="display: flex; gap: 10px;">
            <button type="button" id="submitButton">Submit</button>
            <button style="background-color: red;" type="button" id="cancelButton">Cancel</button>
        </div>
    </form>
`;
};

// Event Listeners and Handlers

export const attachCoordinatesHandler = (formContainer) => {
    const autofillButton = formContainer.querySelector('#autofill-button');
    if (autofillButton) {
        autofillButton.addEventListener('click', handleAutofill);
    }
};

async function handleAutofill() {
    const streetAddress = document.getElementById('streetAddress').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value;

    if (!streetAddress || !city || !state || !zipCode) {
        alert("Please fill in all address fields.");
        return;
    }

    const address = `${streetAddress}, ${city}, ${state}, ${zipCode}`;
    const apiKey = config.google;

    if (!apiKey) {
        console.error("API key is missing");
        return;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            document.getElementById('latitude').value = location.lat;
            document.getElementById('longitude').value = location.lng;
        } else {
            console.error("Geocode was not successful for the following reason:", data.status);
            alert(`Geocode was not successful for the following reason: ${data.status}`);
        }
    } catch (error) {
        console.error("Error fetching geocode data:", error);
        alert("Error fetching geocode data. Please try again later.");
    }
}

// Social Media handling
export const attachSocialMediaHandler = (formContainer) => {
    const addButton = formContainer.querySelector('#add-social-media');
    const socialMediaList = formContainer.querySelector('#social-media-list');
    const platformInput = formContainer.querySelector('#socialPlatform');
    const addressInput = formContainer.querySelector('#socialAddress');

    if (!addButton || !socialMediaList || !platformInput || !addressInput) {
        console.error('One or more elements not found for Social Media handlers');
        return;
    }

    const socialMediaPairs = formContainer.socialMediaPairs || [];

    addButton.addEventListener('click', () => {
        const platform = platformInput.value.trim();
        const address = addressInput.value.trim();

        if (platform && address) {
            socialMediaPairs.push({ platform, address });
            const listItem = document.createElement('li');
            listItem.textContent = `${platform}: ${address}`;
            listItem.dataset.platform = platform;
            listItem.dataset.address = address;
            socialMediaList.appendChild(listItem);

            // Clear inputs
            platformInput.value = '';
            addressInput.value = '';
        }
    });

    formContainer.socialMediaPairs = socialMediaPairs;
};

// Logo upload handling
export const attachLogoUploadHandler = (formContainer, existingLogoUrl = '') => {
    const logoUploadInput = formContainer.querySelector('#logoUpload');
    const logoPreviewContainer = formContainer.querySelector('#logo-preview');

    // If there is an existing logo, display it
    if (existingLogoUrl) {
        displayLogo(existingLogoUrl, logoPreviewContainer, formContainer);
    }

    if (logoUploadInput) {
        logoUploadInput.addEventListener('change', async () => {
            const file = logoUploadInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    logoPreviewContainer.innerHTML = ''; // Clear previous preview
                    displayLogo(e.target.result, logoPreviewContainer, formContainer, file);
                };
                reader.readAsDataURL(file);
            }
        });
    }
};

// Image upload handling
export const attachImageUploadHandler = (formContainer, existingImages ) => {
    existingImages = Array.isArray(existingImages) ? existingImages : [];

    const imageUploadInput = formContainer.querySelector('#imageUpload');
    const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
    const imageFileListContainer = formContainer.querySelector('#image-file-list');

    // Initialize imageUrls with existing images
    formContainer.imageUrls = [...existingImages];
    console.log('image url after push to formContainer: ', formContainer.imageUrls)

    // Function to display images (both existing and new)
    const displayImage = (url, fileName, file = null, isExisting = false) => {
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'thumbnail-container';

        const img = document.createElement('img');
        img.src = url.startsWith('data:') ? url : `https://elbert.365easyflow.com/easyflow-images/${url}`;
        img.alt = fileName;
        img.className = 'thumbnail';

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-button';
        removeButton.addEventListener('click', () => {
            const index = formContainer.imageUrls.indexOf(isExisting ? url : `uploads/${fileName}`);
            if (index > -1) {
                formContainer.imageUrls.splice(index, 1);
            }
            imageThumbnailsContainer.removeChild(thumbnailContainer);
            imageFileListContainer.removeChild(listItem);
        });

        thumbnailContainer.appendChild(img);
        thumbnailContainer.appendChild(removeButton);
        imageThumbnailsContainer.appendChild(thumbnailContainer);

        const listItem = document.createElement('li');
        listItem.textContent = fileName;
        imageFileListContainer.appendChild(listItem);

        if (file) {
            // Upload new file and update imageUrls
            const uniqueFilename = getUniqueFilename(file.name);
            const imageFormData = new FormData();
            imageFormData.append('imageFiles[]', file, uniqueFilename);

            uploadFilesToDreamHost(imageFormData)
                .then((uploadResult) => {
                    if (uploadResult && uploadResult[0]) {
                        formContainer.imageUrls.push(`uploads/${uniqueFilename}`);
                        console.log('Image URLs:', formContainer.imageUrls);
                    } else {
                        console.error('Failed to upload image:', uploadResult);
                    }
                })
                .catch((error) => {
                    console.error('Error during image upload:', error);
                });
        } else {
            console.log('Loaded existing image:', url);
        }
    };

    // Display existing images
    existingImages.forEach((imageUrl) => {
        const fileName = imageUrl.split('/').pop();
        displayImage(imageUrl, fileName, null, true);
    });

    // Handle new image uploads
    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', () => {
            const files = imageUploadInput.files;

            for (const file of files) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    displayImage(e.target.result, file.name, file);
                };
                reader.readAsDataURL(file);
            }
        });
    }
};

// Display functions for Logo and Image
function displayLogo(url, container, formContainer, file = null) {
    const img = document.createElement('img');
    img.src = url.startsWith('data:') ? url : `https://douglas.365easyflow.com/easyflow-images/${url}`;
    img.className = 'thumbnail';
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-button';
    removeButton.addEventListener('click', () => {
        container.innerHTML = '';
        formContainer.logoUrl = ''; // Clear the stored URL or file
    });

    container.appendChild(img);
    container.appendChild(removeButton);

    if (file) {
        uploadFile(file, formContainer, 'logo');
    } else {
        formContainer.logoUrl = url; // Keep existing URL
    }
}

const initializeTinyMCE = (selector, content = '') => {
    tinymce.init({
        selector: selector,
        license_key: 'gpl',
        plugins: 'link code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
        setup: (editor) => {
            editor.on('init', () => {
                if (content) {
                    editor.setContent(content);
                }
            });
        },
    });
};

export const initializePlayForm = async (formContainer, businessData = null) => {
    const formElement = formContainer.querySelector('#combined-form');

    if (!formElement) {
        console.error('Form element not found in formContainer');
        return;
    }

    if (!formContainer.imageUrls) {
        formContainer.imageUrls = [];
    }

    attachCoordinatesHandler(formContainer);
    attachSocialMediaHandler(formContainer, businessData ? businessData.socialMedia : []);
    attachLogoUploadHandler(formContainer, businessData ? businessData.logoUrl : '');
    attachImageUploadHandler(formContainer, businessData ? businessData.images : []);
    initializeTinyMCE('#description', businessData ? businessData.description : '');
    //initializeAverageCostDropdown(formContainer, businessData ? businessData.cost : null);

    renderAndInitializeFormStatusToggle(formElement, businessData);
};

export const initializePlayFormWrapper = (formContainer, businessData) => {
    if (!businessData) {
        businessData = {}; // Set to an empty object if null to avoid accessing properties on null
      }
    initializePlayForm(formContainer, businessData);
    initializeMenuSelection(formContainer, businessData.play_types || []);
};

export const initializeMenuSelection = async (formContainer, selectedMenuTypes = []) => {
    const menuTypeDropdown = formContainer.querySelector('#menuType');
    const menuTypeList = formContainer.querySelector('#menu-type-list');
    const addMenuTypeButton = formContainer.querySelector('#add-menu-type');
    const addNewMenuTypeButton = formContainer.querySelector('#add-new-menu-type');
    const newMenuTypeInput = formContainer.querySelector('#newMenuType'); // Ensure this exists

    // Check if elements are available
    if (!menuTypeDropdown || !menuTypeList || !addMenuTypeButton || !newMenuTypeInput) {
        console.error('One or more elements not found for Menu Selection initialization');
        console.log({ menuTypeDropdown, menuTypeList, addMenuTypeButton, newMenuTypeInput });
        return;
    }

    document.getElementById('cancelButton').addEventListener('click', () => {
        window.history.back();
    });

    const menuTypes = [];

    // Fetch and populate the menu type dropdown
    const fetchedMenuTypes = await getMenuTypes();
    console.log('Fetched Menu Types:', fetchedMenuTypes);

    if (fetchedMenuTypes && Array.isArray(fetchedMenuTypes)) {
        // Clear dropdown before populating
        menuTypeDropdown.innerHTML = '';
        
        fetchedMenuTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.name;
            menuTypeDropdown.appendChild(option);
        });

        // Populate the selected menu types in the list
        selectedMenuTypes.forEach(selectedTypeId => {
            const type = fetchedMenuTypes.find(t => String(t.id) === String(selectedTypeId));
            if (type) {
                const existingItem = menuTypeList.querySelector(`li[data-id="${type.id}"]`);
                if (!existingItem) {
                    const listItem = createMenuListItem(type.name, type.id);
                    menuTypeList.appendChild(listItem);
                    menuTypes.push({ id: type.id, name: type.name });
                }
            }
        });
    } else {
        console.error('Error fetching menu types:', fetchedMenuTypes);
    }

    // Add event listener for "Add Selection" button
    addMenuTypeButton.addEventListener('click', () => {
        const selectedOption = menuTypeDropdown.options[menuTypeDropdown.selectedIndex];
        if (selectedOption) {
            const existingItem = menuTypeList.querySelector(`li[data-id="${selectedOption.value}"]`);
            if (existingItem) {
                console.log('This menu type is already added.');
                return; // Prevent adding duplicates
            }

            const listItem = createMenuListItem(selectedOption.textContent, selectedOption.value);
            menuTypeList.appendChild(listItem);
            menuTypes.push({ id: selectedOption.value, name: selectedOption.textContent });

            console.log('Menu Types after addition:', menuTypes);
        }
    });

    // Add event listener for "Add New Menu Type" button
    addNewMenuTypeButton.addEventListener('click', async () => {
        const newMenuType = newMenuTypeInput.value.trim();
        if (newMenuType) {
            const response = await addNewMenuType(newMenuType); // Ensure addNewMenuType is defined
            if (response && response.id) {
                const option = document.createElement('option');
                option.value = response.id;
                option.textContent = newMenuType;
                menuTypeDropdown.appendChild(option);

                const listItem = createMenuListItem(newMenuType, response.id);
                menuTypeList.appendChild(listItem);
                menuTypes.push({ id: response.id, name: newMenuType });

                newMenuTypeInput.value = ''; // Clear the input field
            } else {
                console.error('Error adding new menu type:', response);
            }
        }
    });

    formContainer.menuTypes = menuTypes;

    // Helper function to create the list item
    function createMenuListItem(name, id) {
        const listItem = document.createElement('li');
        listItem.textContent = name;
        listItem.dataset.id = id; // Ensure to set a data attribute for the id
        const removeButton = document.createElement('button');
        removeButton.textContent = 'x';
        removeButton.style.color = 'red';
        removeButton.style.marginLeft = '10px';
        removeButton.addEventListener('click', () => {
            menuTypeList.removeChild(listItem);
            const index = menuTypes.findIndex(type => type.id === id);
            if (index > -1) {
                menuTypes.splice(index, 1);
            }
        });
        listItem.appendChild(removeButton);
        return listItem;
    }
};

// Fetch menu types from the backend
export const getMenuTypes = async () => {
    const tableName = `play_type`;
    try {
        const response = await apiService.fetch(`menu-types?table=${tableName}`);
        console.log('Menu Types API response:', response);
        return response;
    } catch (error) {
        console.error(`Error fetching menu types:`, error);
        return [];
    }
};

// Add new menu type to the backend
export const addNewMenuType = async (newMenuType) => {
    const tableName = `play_type`;
    try {
        const response = await apiService.fetch('menu-types', {
            method: 'POST',
            body: JSON.stringify({ name: newMenuType, table: tableName }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('New Menu Type API response:', response);
        return response;
    } catch (error) {
        console.error(`Error adding new menu type:`, error);
        return { id: Date.now(), name: newMenuType }; // Fallback in case of error
    }
};

export const attachSpecialDayHandlers = (formContainer, existingSpecialDays = []) => {
    const specialDays = existingSpecialDays || [];
    const addDayButton = formContainer.querySelector('#add-day-button');

    if (addDayButton) {
        addDayButton.addEventListener('click', () => {
            const specialDayInput = formContainer.querySelector('#special-day');
            const alteredHoursInput = formContainer.querySelector('#altered-hours');
            const specialDay = specialDayInput.value.trim();
            const alteredHours = alteredHoursInput.value.trim();

            if (specialDay && alteredHours) {
                specialDays.push({ day: specialDay, hours: alteredHours });

                const dayHoursList = formContainer.querySelector('#day-hours-list');
                const listItem = document.createElement('div');
                listItem.className = 'day-hours-item';
                listItem.textContent = `${specialDay}: ${alteredHours}`;
                dayHoursList.appendChild(listItem);

                specialDayInput.value = '';
                alteredHoursInput.value = '';
            } else {
                alert('Please fill both fields.');
            }
        });

        formContainer.specialDays = specialDays;
    }
};

// Fetch average costs from the backend
export const getAverageCosts = async () => {
    const tableName = `play_cost`;
    try {
        const response = await apiService.fetch(`average-costs?table=${tableName}`);
        return response;
    } catch (error) {
        console.error(`Error fetching average costs:`, error);
        return [];
    }
};

// Handle file uploads
async function uploadFile(file, formContainer, type) {
    const formData = new FormData();
    const uniqueFilename = getUniqueFilename(file.name);
    formData.append('file', file, uniqueFilename);

    try {
        const response = await fetch('https://douglas.365easyflow.com/easyflow-images/upload.php', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result && result[0]) {
            const uploadedUrl = `https://douglas.365easyflow.com/easyflow-images/uploads/${uniqueFilename}`;
            if (type === 'logo') {
                formContainer.logoUrl = uploadedUrl;
            } else if (type === 'image') {
                formContainer.imageUrls.push(uploadedUrl);
            }
        } else {
            console.error('Failed to upload file:', result);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

const getUniqueFilename = (filename) => {
    const date = new Date().toISOString().replace(/[-:.]/g, '');
    return `${date}_${filename}`;
};

const uploadFilesToDreamHost = async (formData) => {
    try {
        const response = await fetch('https://douglas.365easyflow.com/easyflow-images/upload.php', {
            method: 'POST',
            body: formData,
        });

        const responseBody = await response.text();
        const result = JSON.parse(responseBody);

        if (result.length === 0) {
            throw new Error('Upload to DreamHost failed: empty result');
        }

        return result;
    } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
    }
};

// Function to initialize the play form
document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('.tab-content');
    initializePlayForm(formContainer);
});

