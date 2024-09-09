import { eventFormTemplate } from './formParts/eventFormTemplate.js';
import { initializeEventForm } from './formParts/eventFormInitializer.js';

export const eventForm = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('.tab-content');
    if (formContainer) {
      formContainer.innerHTML = eventFormTemplate();
      initializeEventForm(formContainer);
    }
  });
}