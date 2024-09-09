export const attachSocialMediaHandler = (formContainer) => {
    const addButton = formContainer.querySelector('#add-social-media');
    const socialMediaList = formContainer.querySelector('#social-media-list');
    const platformInput = formContainer.querySelector('#socialPlatform');
    const addressInput = formContainer.querySelector('#socialAddress');
  
    if (!addButton || !socialMediaList || !platformInput || !addressInput) {
      console.error('One or more elements not found for Social Media handlers');
      return;
    }
  
    const socialMediaPairs = [];
  
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
  
    // Store the social media pairs in the form container for later retrieval
    formContainer.socialMediaPairs = socialMediaPairs;
  };