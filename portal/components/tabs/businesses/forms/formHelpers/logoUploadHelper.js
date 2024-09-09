import { getUniqueFilename, uploadFilesToDreamHost } from './uploadHelper.js';

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
