import ApiService from '../../../../services/apiService.js';
import config from '../../../../utils/config.js';
import { renderAndInitializeFormStatusToggle } from './formParts/formStatusToggle.js';
import renderBusinessDetailsSection from './formParts/businessDetailsSection.js';
import renderLatLongSection from './formParts/latLongSection.js';
import renderContactDetailsSection from './formParts/contactDetailsSection.js';
import renderSocialMediaSection from './formParts/socialMediaSection.js';
import renderLogoUploadSection from './formParts/logoUploadSection.js';
import renderImageUploadSection from './formParts/imageUploadSection.js';
import renderDescriptionSection from './formParts/descriptionSection.js';
import renderMenuSelectionSection from './formParts/menuSelectionSection.js';
import renderSpecialDaySection from './formParts/specialDaySection.js';

const apiService = new ApiService();

// Main form template
export const otherForm = (businessData = {}) => {
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
            <div class="form-section" id="social-media-section">
                ${renderSocialMediaSection()}
            </div>
            <div class="form-section">
                ${renderLogoUploadSection()}
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
            <div class="form-section special-day-section" style="display: none;">
                ${renderSpecialDaySection()}
            </div>
            <input type="hidden" id="businessId" name="businessId" value="">
            <button type="button" id="submitButton">Submit</button>
        </form>
    `;
};

// Coordinate handling
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
export const attachImageUploadHandler = (formContainer, existingImages = []) => {
    // Ensure existingImages is always an array
    existingImages = Array.isArray(existingImages) ? existingImages : [];

    const imageUploadInput = formContainer.querySelector('#imageUpload');
    const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
    const imageFileListContainer = formContainer.querySelector('#image-file-list');

    // Initialize imageUrls with existing images
    formContainer.imageUrls = [...existingImages];

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
    img.src = url.startsWith('data:') ? url : `https://elbert.365easyflow.com/easyflow-images/${url}`;
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

function displayImage(url, container, formContainer, file = null) {
    const img = document.createElement('img');
    img.src = url.startsWith('data:') ? url : `https://elbert.365easyflow.com/easyflow-images/${url}`;
    img.className = 'thumbnail';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-button';
    removeButton.addEventListener('click', () => {
        container.removeChild(img);
        container.removeChild(removeButton);
        formContainer.imageUrls = formContainer.imageUrls.filter(imageUrl => imageUrl !== url); // Remove from the list
    });

    container.appendChild(img);
    container.appendChild(removeButton);

    if (file) {
        uploadFile(file, formContainer, 'image');
    } else {
        formContainer.imageUrls.push(url); // Keep existing URL
    }
}

const initializeAverageCostDropdown = async (formContainer, selectedCost = null) => {
    const averageCostDropdown = formContainer.querySelector('#averageCost');
    
    if (!averageCostDropdown) {
        console.error('Average Cost dropdown element not found');
        return;
    }

    const averageCosts = await getAverageCosts();

    if (averageCosts && Array.isArray(averageCosts)) {
        averageCosts.forEach(cost => {
            const option = document.createElement('option');
            option.value = cost.id;
            option.textContent = `${cost.symbol}: ${cost.description}`;
            if (selectedCost && String(cost.id) === String(selectedCost)) {
                option.selected = true;
            }
            averageCostDropdown.appendChild(option);
        });
    } else {
        console.error('Error fetching or populating average costs:', averageCosts);
    }
};


// Initialize form components
export const initializeOtherForm = (formContainer, businessData) => {
    const existingImages = businessData.images || [];  // Ensure images are passed
    console.log('Images passed to attachImageUploadHandler:', existingImages);


    const formElement = formContainer.querySelector('#combined-form');

    if (!formElement) {
        console.error('Form element not found in formContainer');
        return;
    }

    // Initialize imageUrls with existing data (from businessData)
    formContainer.imageUrls = businessData.images || [];

    // Populate other form fields
    attachCoordinatesHandler(formContainer);
    attachSocialMediaHandler(formContainer, businessData ? businessData.socialMedia : []);
    attachLogoUploadHandler(formContainer, businessData ? businessData.logoUrl : '');
    attachImageUploadHandler(formContainer, existingImages, businessData ? businessData.images : []);
    initializeTinyMCE('#description', businessData ? businessData.description : '');

    renderAndInitializeFormStatusToggle(formElement, businessData);

    console.log('Form initialized with image URLs:', formContainer.imageUrls);
};

// TinyMCE initialization
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

export const initializeOtherFormWrapper = (formContainer, businessData) => {
    if (!businessData) {
        businessData = {}; // Set to an empty object if null to avoid accessing properties on null
    }

    console.log('Received businessData in eatForm:', businessData);
    initializeOtherForm(formContainer, businessData);

    const selectedMenuTypes = businessData.menu_types || []; // Safely access menu_types
    console.log('Initializing menu selection with:', { formContainer, selectedMenuTypes });

    initializeMenuSelection(formContainer, businessData ? businessData.menu_types : []);
};

// Menu Selection logic
export const initializeMenuSelection = async (formContainer) => {
    const menuTypeDropdown = formContainer.querySelector('#menuType');
    const averageCostDropdown = formContainer.querySelector('#averageCost');
    const addMenuTypeButton = formContainer.querySelector('#add-menu-type');
    const addNewMenuTypeButton = formContainer.querySelector('#add-new-menu-type');
    const newMenuTypeInput = formContainer.querySelector('#newMenuType');
    const menuTypeList = formContainer.querySelector('#menu-type-list');
  
    const menuTypes = [];
  
    const fetchedMenuTypes = await getMenuTypes();
    if (fetchedMenuTypes && Array.isArray(fetchedMenuTypes)) {
      fetchedMenuTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        menuTypeDropdown.appendChild(option);
      });
    } else {
      console.error('Error fetching menu types:', fetchedMenuTypes);
    }
  
    const fetchedAverageCosts = await getAverageCosts();
    if (fetchedAverageCosts && Array.isArray(fetchedAverageCosts)) {
      fetchedAverageCosts.forEach(cost => {
        const option = document.createElement('option');
        option.value = cost.id;
        option.textContent = `${cost.symbol} - ${cost.description}`;
        averageCostDropdown.appendChild(option);
      });
    } else {
      console.error('Error fetching average costs:', fetchedAverageCosts);
    }
  
    addMenuTypeButton.addEventListener('click', () => {
      const selectedOption = menuTypeDropdown.options[menuTypeDropdown.selectedIndex];
      if (selectedOption) {
        const listItem = createMenuListItem(selectedOption.textContent, selectedOption.value);
        menuTypeList.appendChild(listItem);
        menuTypes.push({ id: selectedOption.value, name: selectedOption.textContent });
      }
    });
  
    addNewMenuTypeButton.addEventListener('click', async () => {
      const newMenuType = newMenuTypeInput.value.trim();
      if (newMenuType) {
        const response = await addNewMenuType(newMenuType);
        if (response && response.id) {
          const option = document.createElement('option');
          option.value = response.id;
          option.textContent = newMenuType;
          menuTypeDropdown.appendChild(option);
  
          const listItem = createMenuListItem(newMenuType, response.id);
          menuTypeList.appendChild(listItem);
          menuTypes.push({ id: response.id, name: newMenuType });
  
          newMenuTypeInput.value = '';
        } else {
          console.error('Error adding new menu type:', response);
        }
      }
    });
  
    formContainer.menuTypes = menuTypes;
  
    function createMenuListItem(name, id) {
      const listItem = document.createElement('li');
      listItem.textContent = name;
      listItem.dataset.id = id;
  
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
    const tableName = `eat_type`;
    try {
        const response = await apiService.fetch(`menu-types?table=${tableName}`);
        return response;
    } catch (error) {
        console.error(`Error fetching menu types:`, error);
        return [];
    }
};

// Fetch average costs from the backend
export const getAverageCosts = async () => {
    const tableName = `eat_cost`;
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
        const response = await fetch('https://elbert.365easyflow.com/easyflow-images/upload.php', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result && result[0]) {
            const uploadedUrl = `https://elbert.365easyflow.com/easyflow-images/uploads/${uniqueFilename}`;
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

// Handle special days selection
export const attachSpecialDayHandlers = (formContainer) => {
    const specialDays = [];
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

const getUniqueFilename = (filename) => {
    const date = new Date().toISOString().replace(/[-:.]/g, '');
    return `${date}_${filename}`;
};

const uploadFilesToDreamHost = async (formData) => {
    try {
        const response = await fetch('https://elbert.365easyflow.com/easyflow-images/upload.php', {
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

document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('.tab-content');
    initializeOtherForm(formContainer);
});