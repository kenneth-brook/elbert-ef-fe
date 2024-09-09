import { handleAutofill } from './addressUtils.js';

export const attachCoordinatesHandler = (formContainer) => {
    const autofillButton = formContainer.querySelector('#autofill-button');
    autofillButton.addEventListener('click', handleAutofill);
};