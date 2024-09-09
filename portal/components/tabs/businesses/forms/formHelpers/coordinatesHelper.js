import config from '../../../../../utils/config.js';

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
