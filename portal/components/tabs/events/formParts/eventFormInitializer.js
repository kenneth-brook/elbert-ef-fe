import ApiService from '../../../../services/apiService.js';
import { attachCoordinatesHandler } from './coordinatesHandler.js';
import { attachSocialMediaHandler } from './socialMediaHandler.js';
import { attachLogoUploadHandler } from './logoUploadHandler.js';
import { attachImageUploadHandler } from './imageUploadHandler.js';
import { initializeTinyMCE } from './tinyMCEInitializer.js';
import { handleAutofill } from './addressUtils.js';
import { selectOnlyThis } from './formUtils.js';

const apiService = new ApiService();

export const initializeEventForm = async (formContainer, apiService, event = null) => {
    attachCoordinatesHandler(formContainer);
    attachSocialMediaHandler(formContainer);
    attachLogoUploadHandler(formContainer);
    attachImageUploadHandler(formContainer);
    initializeTinyMCE('#description');

    // If event data is provided, populate the form with it
    if (event) {
        console.log("Populating form with event data:", event);

        formContainer.querySelector('#eventName').value = event.name || '';
        formContainer.querySelector('#streetAddress').value = event.street_address || '';
        formContainer.querySelector('#city').value = event.city || '';
        formContainer.querySelector('#state').value = event.state || '';
        formContainer.querySelector('#zipCode').value = event.zip || '';
        formContainer.querySelector('#latitude').value = event.lat || '';
        formContainer.querySelector('#longitude').value = event.long || '';
        formContainer.querySelector('#startDate').value = event.start_date ? new Date(event.start_date).toISOString().split('T')[0] : '';
        formContainer.querySelector('#endDate').value = event.end_date ? new Date(event.end_date).toISOString().split('T')[0] : '';
        formContainer.querySelector('#startTime').value = event.start_time || '';
        formContainer.querySelector('#endTime').value = event.end_time || '';
        formContainer.querySelector('#phone').value = event.phone || '';
        formContainer.querySelector('#email').value = event.email || '';
        formContainer.querySelector('#website').value = event.web || '';
        formContainer.querySelector('#description').value = event.description || '';
        // Populate other fields as necessary, like logo and social media

        if (event.images && event.images.length > 0) {
            const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
            event.images.forEach(image => {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'thumbnail-wrapper';

                const imgElement = document.createElement('img');
                imgElement.src = `https://douglas.365easyflow.com/easyflow-images/${image}`;
                imgElement.className = 'thumbnail';

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.className = 'remove-button';
                removeButton.addEventListener('click', () => {
                    imgWrapper.remove(); // Remove the image from the DOM
                    const index = event.images.indexOf(image);
                    if (index > -1) {
                        event.images.splice(index, 1); // Remove from the array
                    }
                });

                imgWrapper.appendChild(imgElement);
                imgWrapper.appendChild(removeButton);
                imageThumbnailsContainer.appendChild(imgWrapper);
            });
        }
    } else {
        console.log("No event data provided to populate the form.");
    }

    // Additional handlers that need to be directly connected
    formContainer.querySelector('#autofill-button').addEventListener('click', handleAutofill);

    formContainer.querySelectorAll('input[name="groupName"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => selectOnlyThis(checkbox, 'groupName', someCallbackFunction));
    });

    const submitButton = formContainer.querySelector('#submitEventButton');
    const eventForm = formContainer.querySelector('#event-form');

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Submit button clicked and default prevented');
    
        tinymce.triggerSave(); // Ensure TinyMCE content is saved to the textarea
    
        const formData = new FormData(eventForm);

        formData.delete('logoFile');  // Remove any unintended file fields
        formData.delete('imageFiles');
    
        const logoUrl = formContainer.logoUrl || '';
        const imageUrls = formContainer.imageUrls || [];
        const socialMediaPairs = formContainer.socialMediaPairs || [];
    
        formData.append('logoUrl', logoUrl);
        formData.append('imageUrls', JSON.stringify(imageUrls));
        formData.append('socialMedia', JSON.stringify(socialMediaPairs));
    
        if (event && event.id) {
            formData.append('id', event.id);  // Append ID for the update case
        }
    
        // Log formData contents for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            const response = event 
                ? await apiService.updateEvent(event.id, formData)
                : await apiService.submitEventForm(formData);
    
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
        } catch (error) {
            console.error('Error submitting event form:', error);
        }
    });
    
};
