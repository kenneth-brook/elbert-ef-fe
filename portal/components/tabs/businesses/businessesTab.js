import { eatForm, initializeEatFormWrapper } from './forms/eatForm.js';
import { stayForm, initializeStayFormWrapper } from './forms/stayForm.js';
import { playForm, initializePlayFormWrapper } from './forms/playForm.js';
import { shopForm, initializeShopFormWrapper } from './forms/shopForm.js';
import { otherForm, initializeOtherFormWrapper } from './forms/otherForm.js';

import ListBusinesses from './listBusinesses.js';
import store from '../../../services/store.js';


class BusinessesTab {
    constructor(store, router, apiService) {
        this.store = store;
        this.router = router;
        this.apiService = apiService;
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.addRoute('businesses/list', () => this.showListBusinesses());
        this.router.addRoute('businesses/add', () => this.showAddBusiness());
        this.router.addRoute('businesses/edit/:id', id => this.showEditBusiness(id));
    }

    showListBusinesses() {
        const contentArea = document.querySelector('.tab-content');
        console.log('contentArea:', contentArea);
        console.log('Type of contentArea:', typeof contentArea);
        console.log('Is contentArea an instance of Element?', contentArea instanceof Element);
        if (!contentArea) {
            console.error("Content area element not found");
            return;
        }
        contentArea.innerHTML = '';
        console.log('contentArea.innerHTML:', contentArea.innerHTML);
        const listBusinesses = new ListBusinesses(this.router, this.store, this.apiService);
        const renderedListBusinesses = listBusinesses.render();
        contentArea.appendChild(renderedListBusinesses);
        this.setActiveTab('businesses/list');
    }

    showAddBusiness() {
        this.displayBusinessTypeSelection();
        this.setActiveTab('businesses/add');
    }

    displayBusinessTypeSelection() {
        const contentArea = document.querySelector('.tab-content');

        if (!contentArea) {
            console.error('Content area element not found');
            return;
        }

        contentArea.innerHTML = '';

        const selectionHtml = `
            <div>
                <h3>Select The Type Of Business To Add</h3>
                <select id="business-type-select">
                    <option value="eat">Eat</option>
                    <option value="stay">Stay</option>
                    <option value="play">Play</option>
                    <option value="shop">Shop</option>
                    <option value="other">Other</option>
                </select>
                <button id="select-business-type-button">Select</button>
            </div>
        `;

        contentArea.innerHTML = selectionHtml;

        document.getElementById('select-business-type-button').addEventListener('click', () => {
            const selectedType = document.getElementById('business-type-select').value;
            console.log('business-type-select, just before store: ', selectedType)
            store.setSelectedBusinessType(selectedType);
            console.log('Selected Business Type after setting to store:', store.getSelectedBusinessType());
            this.loadBusinessForm();
        });
    }

    getFormAndInitializer(type, businessData = {}) {
        let formHtml, initializeForm;
        switch (type) {
            case 'eat':
                formHtml = eatForm(businessData);
                initializeForm = initializeEatFormWrapper;
                break;
            case 'stay':
                formHtml = stayForm(businessData);
                initializeForm = initializeStayFormWrapper;
                break;
            case 'play':
                formHtml = playForm(businessData);
                initializeForm = initializePlayFormWrapper;
                break;
            case 'shop':
                formHtml = shopForm(businessData);
                initializeForm = initializeShopFormWrapper;
                break;
            case 'other':
                formHtml = otherForm(businessData);
                initializeForm = initializeOtherFormWrapper;
                break;
            default:
                console.error(`Unsupported business type: ${type}`);
                return {};
        }
    
        // Add log before returning
        console.log('Returning from getFormAndInitializer:', { formHtml, initializeForm });
    
        return { formHtml, initializeForm };
    }

    loadBusinessForm(type = null, businessData = null) {
        // Retrieve the selected business type from the store if not provided
        const selectedType = type || this.store.getSelectedBusinessType();
        
        // Ensure selectedType exists before proceeding
        if (!selectedType) {
            console.error("Selected business type is not set");
            return;
        }
    
        const { formHtml, initializeForm } = this.getFormAndInitializer(selectedType, businessData);
    
        const contentArea = document.querySelector('.tab-content');
        contentArea.innerHTML = formHtml;
    
        setTimeout(() => {
            this.initializeForm(contentArea, initializeForm, selectedType, businessData);
        }, 0);
    }

    async initializeForm(formContainer, initializeForm, type, businessData ) {
        const businessType = businessData ? businessData.type : type;
        console.log('Determined businessType:', businessType);
    
        if (typeof initializeForm !== 'function') {
            console.error('initializeForm is not a function');
            return;
        }

        if (!businessType) {
            console.error('businessType is not defined');
            return;
        }
    
        if (businessData && businessData.imageUrls) {
            formContainer.imageUrls = [...new Set(businessData.imageUrls)];
        } else {
            formContainer.imageUrls = [];
        }

        initializeForm(formContainer, businessData);
    
        const combinedForm = formContainer.querySelector('#combined-form');
        const submitButton = formContainer.querySelector('#submitButton');
    
        let isSubmitting = false;
    
        submitButton.addEventListener('click', async (event) => {
            event.preventDefault();
    
            if (isSubmitting) return;
            isSubmitting = true;
    
            tinymce.triggerSave();
    
            formContainer.imageUrls = [...new Set(formContainer.imageUrls)];
            const formData = new FormData(combinedForm);
    
            const logoUrl = formContainer.logoUrl || '';
            const socialMediaArray = formContainer.socialMediaPairs || [];
            const menuTypes = formContainer.menuTypes || [];
            const specialDays = formContainer.specialDays || [];
    
            formData.append('logoUrl', logoUrl);
            formData.append('imageUrls', JSON.stringify(formContainer.imageUrls));
            formData.append('socialMedia', JSON.stringify(socialMediaArray));
            formData.append('menuTypes', JSON.stringify(menuTypes.map(mt => mt.id)));
            formData.append('specialDays', JSON.stringify(specialDays));
    
            const data = {
                active: formData.get('active') ? 'true' : 'false',
                chamberMember: formData.get('isMember') ? 'true' : 'false',
                businessName: formData.get('businessName'),
                streetAddress: formData.get('streetAddress'),
                mailingAddress: formData.get('mailingAddress'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                latitude: formData.get('latitude') || '',
                longitude: formData.get('longitude') || '',
                phone: formData.get('phone'),
                email: formData.get('email'),
                website: formData.get('website'),
                socialMedia: JSON.stringify(socialMediaArray),
                logoUrl: logoUrl,
                imageUrls: formContainer.imageUrls,
                description: formData.get('description'),
                menuTypes: menuTypes.map(mt => mt.id),
                specialDays: specialDays
            };
    
            try {
                const businessResponse = businessData && businessData.id
                    ? await this.apiService.updateBusiness(businessData.id, data)
                    : await this.apiService.createBusiness(data);
    
                if (businessResponse && businessResponse.id) {
                    const businessId = businessResponse.id;
    
                    if (['eat', 'play', 'shop', 'stay', 'other'].includes(businessType)) {
                        const detailsFormData = new URLSearchParams();
                        detailsFormData.append('businessId', businessId);
                        detailsFormData.append('menuTypes', JSON.stringify(menuTypes.map(mt => mt.id)));
                        detailsFormData.append('specialDays', JSON.stringify(specialDays));
    
                        if (['eat', 'stay'].includes(businessType)) {
                            detailsFormData.append('averageCost', formData.get('averageCost'));
                        }
    
                        if (['play', 'shop'].includes(businessType)) {
                            const operationalHours = this.collectOperationalHours(formContainer);
                            detailsFormData.append('hours', JSON.stringify(operationalHours));
                        }
    
                        try {
                            console.log('Going into second form with businessType: ', businessType)
                            if (businessType === 'eat') {
                                if (businessData && businessData.id) {
                                    await this.apiService.updateEatForm(businessId, detailsFormData);
                                } else {
                                    await this.apiService.submitEatForm(detailsFormData);
                                }
                            } else if (businessType === 'play') {
                                if (businessData && businessData.id) {
                                    await this.apiService.updatePlayForm(businessId, detailsFormData);
                                } else {
                                    await this.apiService.submitPlayForm(detailsFormData);
                                }
                            } else if (businessType === 'shop') {
                                if (businessData && businessData.id) {
                                    await this.apiService.updateShopForm(businessId, detailsFormData);
                                } else {
                                    await this.apiService.submitShopForm(detailsFormData);
                                }
                            } else if (businessType === 'stay') {
                                if (businessData && businessData.id) {
                                    await this.apiService.updateStayForm(businessId, detailsFormData);
                                } else {
                                    await this.apiService.submitStayForm(detailsFormData);
                                }
                            } else if (businessType === 'other') {
                                if (businessData && businessData.id) {
                                    await this.apiService.updateOtherForm(businessId, detailsFormData);
                                } else {
                                    await this.apiService.submitOtherForm(detailsFormData);
                                }
                            }
                        } catch (error) {
                            console.error('Error submitting additional form data:', error);
                        }
                    }
    
                    setTimeout(() => {
                        //window.location.reload();
                    }, 1500);
                } else {
                    console.error('Business creation/update failed');
                }
            } catch (error) {
                console.error('Error processing business:', error);
            } finally {
                isSubmitting = false;
            }
        });
    
        if (businessData) {
            this.populateFormFields(formContainer, businessData);
        }
    }    
    
    populateFormFields(formContainer, businessData) {
        const businessNameInput = formContainer.querySelector('#businessName');
        const streetAddressInput = formContainer.querySelector('#streetAddress');
        const mailingAddressInput = formContainer.querySelector('#mailingAddress');
        const cityInput = formContainer.querySelector('#city');
        const stateInput = formContainer.querySelector('#state');
        const zipCodeInput = formContainer.querySelector('#zipCode');
        const latitudeInput = formContainer.querySelector('#latitude');
        const longitudeInput = formContainer.querySelector('#longitude');
        const phoneInput = formContainer.querySelector('#phone');
        const emailInput = formContainer.querySelector('#email');
        const websiteInput = formContainer.querySelector('#website');

        const activeToggle = formContainer.querySelector('#active-toggle');
        const memberToggle = formContainer.querySelector('#member-toggle');
        const memberStatusLabel = formContainer.querySelector('#toggle-member-status');
    
        if (businessNameInput) businessNameInput.value = businessData.name || '';
        if (streetAddressInput) streetAddressInput.value = businessData.street_address || '';
        if (mailingAddressInput) mailingAddressInput.value = businessData.mailing_address || '';
        if (cityInput) cityInput.value = businessData.city || '';
        if (stateInput) stateInput.value = businessData.state || '';
        if (zipCodeInput) zipCodeInput.value = businessData.zip || '';
        if (latitudeInput) latitudeInput.value = businessData.lat || '';
        if (longitudeInput) longitudeInput.value = businessData.long || '';
        if (phoneInput) phoneInput.value = businessData.phone || '';
        if (emailInput) emailInput.value = businessData.email || '';
        if (websiteInput) websiteInput.value = businessData.web || '';

        console.log('Is Member Value:', businessData.chamber_member);

        if (activeToggle) {
            activeToggle.checked = businessData.active || false;
        }
    
        // Handle Is Member Toggle
        if (memberToggle) {
            memberToggle.checked = businessData.chamber_member === true;
            memberStatusLabel.textContent = memberToggle.checked ? 'Yes' : 'No';
            memberStatusLabel.style.color = memberToggle.checked ? 'green' : 'red';
        }
        
        // Handle TinyMCE content
        const checkTinyMCE = setInterval(() => {
            const editor = tinymce.get('#description');
            if (editor) {
                editor.setContent(businessData.description || '');
                clearInterval(checkTinyMCE);
            }
        }, 100);
    
        console.log('Menu Types from businessData:', businessData.menu_types);
    
        // Initialize form fields with existing data
        if (typeof this.initializeMenuSelection === 'function') {
            let menuTypes = [];
            console.log('Biz type reported from the new switch', businessData.type)
            switch (businessData.type) {
                case 'eat':
                    menuTypes = businessData.menu_types || [];
                    break;
                case 'stay':
                    menuTypes = businessData.stay_types || [];
                    break;
                case 'play':
                    menuTypes = businessData.play_types || [];
                    break;
                case 'shop':
                    menuTypes = businessData.shop_types || [];
                    break;
                case 'other':
                    menuTypes = businessData.other_types || [];
                    break;
                default:
                    console.error(`Unsupported business type: ${businessData.type}`);
                    return;
            }
        
            this.initializeMenuSelection(formContainer, menuTypes);
        } else {
            console.error('initializeMenuSelection is not defined or not a function');
        }
    
        if (Array.isArray(businessData.socialMedia)) {
            businessData.socialMedia.forEach(pair => {
                const listItem = document.createElement('li');
                listItem.textContent = `${pair.platform}: ${pair.address}`;
                listItem.dataset.platform = pair.platform;
                listItem.dataset.address = pair.address;
                formContainer.querySelector('#social-media-list').appendChild(listItem);
            });
        }
    
        // Handle Logo
        formContainer.logoUrl = businessData.logoUrl || '';
        const logoPreviewContainer = formContainer.querySelector('#logo-preview');
        if (businessData.logoUrl) {
            const img = document.createElement('img');
            img.src = businessData.logoUrl;
            img.className = 'thumbnail';
            logoPreviewContainer.appendChild(img);
        }
    
        // Handle Images
        formContainer.imageUrls = businessData.imageUrls || [];
        const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
        if (Array.isArray(businessData.imageUrls)) {
            businessData.imageUrls.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.className = 'thumbnail';
                imageThumbnailsContainer.appendChild(img);
            });
        }
    
        // Handle Menu Types
        if (Array.isArray(businessData.menuTypes)) {
            businessData.menuTypes.forEach(type => {
                const listItem = document.createElement('li');
                listItem.textContent = type.name;
                formContainer.querySelector('#menu-type-list').appendChild(listItem);
                formContainer.menuTypes.push({ id: type.id, name: type.name });
            });
        }
    
        // Handle Special Days
        if (Array.isArray(businessData.specialDays)) {
            businessData.specialDays.forEach(day => {
                const listItem = document.createElement('div');
                listItem.className = 'day-hours-item';
                listItem.textContent = `${day.day}: ${day.hours}`;
                formContainer.querySelector('#day-hours-list').appendChild(listItem);
                formContainer.specialDays.push(day);
            });
        }
    }    

    async handleFileUploads(formData) {
        const logoFile = formData.get('logoFile');
        const imageFiles = formData.getAll('imageFiles');

        let logoUrl = '';
        let imageUrls = [];

        if (logoFile) {
            const logoFormData = new FormData();
            const uniqueLogoFilename = getUniqueFilename(logoFile.name);
            logoFormData.append('file', logoFile, uniqueLogoFilename);
            const logoUploadResult = await uploadFilesToDreamHost(logoFormData);
            if (logoUploadResult && logoUploadResult[0]) {
                logoUrl = logoUploadResult[0].url;
            }
        }

        if (imageFiles.length > 0) {
            const imagesFormData = new FormData();
            imageFiles.forEach((file) => {
                const uniqueImageFilename = getUniqueFilename(file.name);
                imagesFormData.append('files[]', file, uniqueImageFilename);
            });
            const imagesUploadResult = await uploadFilesToDreamHost(imagesFormData);
            if (imagesUploadResult && imagesUploadResult.length > 0) {
                imageUrls = imagesUploadResult.map(img => img.url);
            }
        }

        return { logoUrl, imageUrls };
    }

    collectOperationalHours(formContainer) {
      const hoursTableRows = formContainer.querySelectorAll('.hours-table tbody tr');
      const operationalHours = {};
  
      hoursTableRows.forEach(row => {
          const day = row.cells[0].textContent.trim();
          const hours = row.cells[1].querySelector('input').value.trim();
          operationalHours[day] = hours;
      });
  
      return operationalHours;
    }

    setActiveTab(tabId) {
        const links = document.querySelectorAll('.tab-links a');
        links.forEach(link => {
            if (link.href.endsWith(`#${tabId}`) || link.href.includes('#businesses/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    showEditBusiness(id) {
        const contentArea = document.querySelector('.tab-content');
        if (!contentArea) {
            console.error("Content area element not found");
            return;
        }
    
        console.log('Combined data:', this.store.getState().data.combined);
        console.log(`Looking for business with ID: ${id}`);
    
        const businessId = String(id);
        const businessData = this.store.getState().data.combined.find(business => String(business.business_id) === businessId);
    
        if (!businessData) {
            console.error(`Business with ID ${id} not found in store`);
            return;
        }
    
        console.log('Found businessData:', businessData); // Add this line to confirm the data is retrieved
    
        const { formHtml, initializeForm } = this.getFormAndInitializer(businessData.type);
    
        contentArea.innerHTML = formHtml;

        //this.initializeForm(contentArea, initializeForm, businessData);

        this.loadBusinessForm(businessData.type, businessData);
    
        this.setActiveTab(`businesses/edit/${id}`);
    }
    
}

export default BusinessesTab;
