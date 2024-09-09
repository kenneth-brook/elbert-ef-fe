import ApiService from '../../../../services/apiService.js';
import config from '../../../../utils/config.js';

const apiService = new ApiService();

export const eatForm = () => {
    return `
        <form id="combined-form" enctype="multipart/form-data">
            <!-- Initial Business Form Fields -->
            <div class="form-section">
                <div class="form-toggle">
                    <label id="toggle-label">Company is currently <span id="toggle-status" style="color: red;">Inactive</span></label>
                    <input type="checkbox" id="active-toggle" name="active">
                </div>
            </div>
            <div class="form-section">
                <div class="form-group">
                    <label for="businessName">Business Name:</label>
                    <input type="text" id="businessName" name="businessName">
                </div>
                <div class="form-group">
                    <label for="streetAddress">Street Address:</label>
                    <input type="text" id="streetAddress" name="streetAddress">
                </div>
                <div class="form-group">
                    <label for="mailingAddress">Mailing Address:</label>
                    <input type="text" id="mailingAddress" name="mailingAddress">
                </div>
                <div class="form-group">
                    <label for="city">City:</label>
                    <input type="text" id="city" name="city">
                </div>
                <div class="form-group">
                    <label for="state">State:</label>
                    <input type="text" id="state" name="state">
                </div>
                <div class="form-group">
                    <label for="zipCode">Zip Code:</label>
                    <input type="text" id="zipCode" name="zipCode">
                </div>
            </div>
            <div class="form-section">
                <div class="form-group">
                    <label for="latitude">Latitude:</label>
                    <input type="text" id="latitude" name="latitude" readonly>
                </div>
                <div class="form-group">
                    <label for="longitude">Longitude:</label>
                    <input type="text" id="longitude" name="longitude" readonly>
                </div>
                <button type="button" id="autofill-button">Auto Fill</button>
            </div>
            <div class="form-section">
                <div class="form-group">
                    <label for="phone">Phone:</label>
                    <input type="tel" id="phone" name="phone">
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email">
                </div>
                <div class="form-group">
                    <label for="website">Website:</label>
                    <input type="url" id="website" name="website">
                </div>
            </div>
            <div class="form-section" id="social-media-section">
                <div class="form-group">
                    <label for="socialPlatform">Social Platform:</label>
                    <input type="text" id="socialPlatform" name="socialPlatform">
                </div>
                <div class="form-group">
                    <label for="socialAddress">Social Address:</label>
                    <input type="text" id="socialAddress" name="socialAddress">
                </div>
                <button type="button" id="add-social-media">Add</button>
                <ul id="social-media-list"></ul>
            </div>
            <div class="form-section">
                <div class="form-group">
                    <label for="logoUpload">Business Logo:</label>
                    <input type="file" id="logoUpload" name="logoUrl" accept="image/*">
                </div>
                <div id="logo-preview" class="thumbnail-container"></div>
            </div>
            <div class="form-section" id="image-upload-section">
                <div class="form-group">
                    <label for="imageUpload">Upload Images:</label>
                    <input type="file" id="imageUpload" name="imageUrls" multiple>
                </div>
                <div id="image-thumbnails"></div>
                <ul id="image-file-list"></ul>
            </div>
            <div class="form-section description-section">
                <div class="description-container">
                    <label for="description">Business Description:</label>
                    <textarea id="description" class="description" name="description"></textarea>
                </div>
            </div>
            
            <!-- Menu Selection Section -->
            <div class="form-section" id="menu-selection-section">
                <div style="display: flex; flex-direction: row; gap: 20px; width: 100%;">
                    <div class="form-group">
                        <label for="menuType">Menu Type:</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <select id="menuType" name="menuType"></select>
                            <button type="button" id="add-menu-type">Add Selection</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="newMenuType">New Menu Type:</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="text" id="newMenuType" name="newMenuType">
                            <button type="button" id="add-new-menu-type">Add</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="averageCost">Average Cost:</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <select id="averageCost" name="averageCost"></select>
                        </div>
                    </div>
                </div>
                <ul id="menu-type-list"></ul>
            </div>
            <div class="form-section special-day-section">
                <div class="special-day-container">
                    <label for="special-day">Special Day:</label>
                    <input type="text" id="special-day" class="special-day" name="special-day" />
                </div>
                <div class="altered-hours-container">
                    <label for="altered-hours">Altered Hours:</label>
                    <input type="text" id="altered-hours" class="altered-hours" name="altered-hours" />
                </div>
                <div class="add-day-container">
                    <button type="button" id="add-day-button">Add Day</button>
                </div>
                <div class="day-hours-list" id="day-hours-list"></div>
            </div>
            <input type="hidden" id="businessId" name="businessId" value="">

            <button type="button" id="submitButton">Submit</button>
        </form>
    `;
}

const getUniqueFilename = (filename) => {
    const date = new Date().toISOString().replace(/[-:.]/g, '');
    return `${date}_${filename}`;
};

const uploadFilesToDreamHost = async (formData) => {
    try {
        const response = await fetch('https://dev.365easyflow.com/easyflow-images/upload.php', {
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

export const attachSocialMediaHandler = (formContainer) => {
    const addButton = formContainer.querySelector('#add-social-media');
    const socialMediaList = formContainer.querySelector('#social-media-list');
    const socialMediaPairs = [];

    if (!addButton || !socialMediaList) {
        console.error('One or more elements not found for Social Media handlers');
        return;
    }

    addButton.addEventListener('click', () => {
        const platformInput = formContainer.querySelector('#socialPlatform');
        const addressInput = formContainer.querySelector('#socialAddress');

        if (!platformInput || !addressInput) {
            console.error('Social media inputs not found');
            return;
        }

        const platform = platformInput.value.trim();
        const address = addressInput.value.trim();

        if (platform && address) {
            socialMediaPairs.push({ platform, address });
            const listItem = document.createElement('li');
            listItem.textContent = `${platform}: ${address}`;
            socialMediaList.appendChild(listItem);

            // Clear inputs
            platformInput.value = '';
            addressInput.value = '';
        }
    });

    // Store the social media pairs in the form container for later retrieval
    formContainer.socialMediaPairs = socialMediaPairs;
};

export const attachLogoUploadHandler = (formContainer) => {
    const logoUploadInput = formContainer.querySelector('#logoUpload');
    const logoPreviewContainer = formContainer.querySelector('#logo-preview');

    if (logoUploadInput) {
        logoUploadInput.addEventListener('change', async () => {
            const file = logoUploadInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    logoPreviewContainer.innerHTML = '';

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    img.className = 'thumbnail';

                    img.addEventListener('mouseover', () => {
                        const enlargeImg = document.createElement('img');
                        enlargeImg.src = img.src;
                        enlargeImg.className = 'enlarge-thumbnail';
                        document.body.appendChild(enlargeImg);

                        img.addEventListener('mousemove', (event) => {
                            enlargeImg.style.top = `${event.clientY + 15}px`;
                            enlargeImg.style.left = `${event.clientX + 15}px`;
                        });

                        img.addEventListener('mouseout', () => {
                            document.body.removeChild(enlargeImg);
                        });
                    });

                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.className = 'remove-button';
                    removeButton.addEventListener('click', () => {
                        logoPreviewContainer.innerHTML = '';
                        formContainer.logoUrl = '';
                    });

                    logoPreviewContainer.appendChild(img);
                    logoPreviewContainer.appendChild(removeButton);
                };
                reader.readAsDataURL(file);

                // Upload file to DreamHost
                const uniqueFilename = getUniqueFilename(file.name);
                const logoFormData = new FormData();
                logoFormData.append('imageFiles[]', file, uniqueFilename);

                try {
                    const uploadResult = await uploadFilesToDreamHost(logoFormData);
                    if (uploadResult && uploadResult[0]) {
                        formContainer.logoUrl = `uploads/${uniqueFilename}`;
                        console.log('Logo URL:', formContainer.logoUrl);
                    } else {
                        console.error('Failed to upload logo:', uploadResult);
                    }
                } catch (error) {
                    console.error('Error during logo upload:', error);
                }
            }
        });
    }
};

export const attachImageUploadHandler = (formContainer) => {
    const imageUploadInput = formContainer.querySelector('#imageUpload');
    const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
    const imageFileListContainer = formContainer.querySelector('#image-file-list');

    formContainer.imageUrls = [];

    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', async () => {
            const files = imageUploadInput.files;

            for (const file of files) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const thumbnailContainer = document.createElement('div');
                    thumbnailContainer.className = 'thumbnail-container';

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    img.className = 'thumbnail';

                    img.addEventListener('mouseover', () => {
                        const enlargeImg = document.createElement('img');
                        enlargeImg.src = img.src;
                        enlargeImg.className = 'enlarge-thumbnail';
                        document.body.appendChild(enlargeImg);

                        img.addEventListener('mousemove', (event) => {
                            enlargeImg.style.top = `${event.clientY + 15}px`;
                            enlargeImg.style.left = `${event.clientX + 15}px`;
                        });

                        img.addEventListener('mouseout', () => {
                            document.body.removeChild(enlargeImg);
                        });
                    });

                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.className = 'remove-button';
                    removeButton.addEventListener('click', () => {
                        const index = formContainer.imageUrls.indexOf(file.name);
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
                    listItem.textContent = file.name;
                    imageFileListContainer.appendChild(listItem);
                };
                reader.readAsDataURL(file);

                const uniqueFilename = getUniqueFilename(file.name);
                const imageFormData = new FormData();
                imageFormData.append('imageFiles[]', file, uniqueFilename);

                try {
                    const uploadResult = await uploadFilesToDreamHost(imageFormData);
                    if (uploadResult && uploadResult[0]) {
                        formContainer.imageUrls.push(`uploads/${uniqueFilename}`);
                        console.log('Image URLs:', formContainer.imageUrls);
                    } else {
                        console.error('Failed to upload image:', uploadResult);
                    }
                } catch (error) {
                    console.error('Error during image upload:', error);
                }
            }
        });
    }
};

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

export const initializeTinyMCE = (selector) => {
  console.log(`Attempting to initialize TinyMCE on selector: ${selector}`);
  
  const element = document.querySelector(selector);
  if (!element) {
    console.error(`Element not found for selector: ${selector}`);
    return;
  }

  console.log(`Element found for selector ${selector}:`, element);
  console.log(`Element visibility:`, getComputedStyle(element).visibility);
  console.log(`Element display:`, getComputedStyle(element).display);

  tinymce.init({
    selector: selector,
    init_instance_callback: (editor) => {
      console.log(`TinyMCE instance callback triggered on: ${selector}`);
    },
    setup: (editor) => {
      editor.on('init', () => {
        console.log(`TinyMCE editor initialized on: ${selector}`);
      });
      editor.on('change', () => {
        editor.save();
      });
    }
  }).then((editors) => {
    console.log(`TinyMCE promise resolved with editors:`, editors);
    if (editors.length === 0) {
      console.error('No TinyMCE editor instances were created.');
    }
  }).catch((err) => {
    console.error(`TinyMCE promise rejected with error:`, err);
    console.log(`Retrying TinyMCE initialization...`);
    setTimeout(() => {
      tinymce.init({
        selector: selector,
        init_instance_callback: (editor) => {
          console.log(`TinyMCE instance callback re-triggered on: ${selector}`);
        },
        setup: (editor) => {
          editor.on('init', () => {
            console.log(`TinyMCE editor re-initialized on: ${selector}`);
          });
          editor.on('change', () => {
            editor.save();
          });
        }
      }).then((editors) => {
        console.log(`TinyMCE retry promise resolved with editors:`, editors);
        if (editors.length === 0) {
          console.error('No TinyMCE editor instances were created on retry.');
        }
      }).catch((err) => {
        console.error(`TinyMCE retry promise rejected with error:`, err);
      });
    }, 1000); // Retry after 1 second
  });
};


export const initializeEatForm = async (formContainer) => {
    attachCoordinatesHandler(formContainer);
    attachSocialMediaHandler(formContainer);
    attachLogoUploadHandler(formContainer);
    attachImageUploadHandler(formContainer);
    setTimeout(() => {
      const textarea = formContainer.querySelector('#description');
      if (textarea) {
        console.log('Textarea found:', textarea);
        initializeTinyMCE('#description');
      } else {
        console.error('Textarea not found for TinyMCE initialization');
      }
    }, 500);
    attachSpecialDayHandlers(formContainer);

    await initializeMenuSelection(formContainer);
};

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

export const addNewMenuType = async (newMenuType) => {
    const tableName = `eat_type`;
    try {
        const response = await apiService.fetch('menu-types', {
            method: 'POST',
            body: JSON.stringify({ name: newMenuType, table: tableName }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error(`Error adding new menu type:`, error);
        return { id: Date.now(), name: newMenuType };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('.tab-content');
    if (formContainer) {
        formContainer.innerHTML = eatForm();
        initializeEatForm(formContainer);
    }
});
