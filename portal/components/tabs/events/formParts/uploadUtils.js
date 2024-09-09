export const getUniqueFilename = (filename) => {
    const date = new Date().toISOString().replace(/[-:.]/g, '');
    console.log(`${date}_${filename}`);
    return `${date}_${filename}`;
  };

export const uploadFilesToDreamHost = async (formData) => {
    try {
      console.log('Uploading files to DreamHost');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value.name}`);
      }
  
      const response = await fetch('https://douglas.365easyflow.com/easyflow-images/upload.php', {
        method: 'POST',
        body: formData,
      });
  
      const responseBody = await response.text();
      console.log('Raw response body:', responseBody);
  
      const result = JSON.parse(responseBody);
      console.log('Upload result:', result);
  
      if (result.length === 0) {
        console.error('Upload result is empty:', result);
        throw new Error('Upload to DreamHost failed: empty result');
      }
  
      return result;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  };