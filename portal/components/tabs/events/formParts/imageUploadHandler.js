import { getUniqueFilename, uploadFilesToDreamHost } from './uploadUtils.js'

export const attachImageUploadHandler = (formContainer) => {
    const imageUploadInput = formContainer.querySelector('#imageUpload');
    const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
    const imageFileListContainer = formContainer.querySelector('#image-file-list');
  
    formContainer.imageUrls = []; // Initialize image URLs array
  
    imageUploadInput.addEventListener('change', async () => {
      const files = imageUploadInput.files;
  
      for (const file of files) {
        // Create and display thumbnail
        const reader = new FileReader();
        reader.onload = (e) => {
          const thumbnailContainer = document.createElement('div');
          thumbnailContainer.className = 'thumbnail-container';
  
          const img = document.createElement('img');
          img.src = e.target.result;
          img.alt = file.name;
          img.className = 'thumbnail';
  
          // Hover effect for enlargement
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
  
          // Display file name
          const listItem = document.createElement('li');
          listItem.textContent = file.name;
          imageFileListContainer.appendChild(listItem);
        };
        reader.readAsDataURL(file);
  
        // Upload file to DreamHost
        const uniqueFilename = getUniqueFilename(file.name);
        const imageFormData = new FormData();
        imageFormData.append('imageFiles[]', file, uniqueFilename); // Use 'imageFiles[]' key to match server-side script
  
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
  };