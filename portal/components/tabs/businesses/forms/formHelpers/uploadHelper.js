export const getUniqueFilename = (filename) => {
    const date = new Date().toISOString().replace(/[-:.]/g, '');
    return `${date}_${filename}`;
  };
  
  export const uploadFilesToDreamHost = async (formData) => {
    try {
      const response = await fetch('https://douglas.365easyflow.com/easyflow-images/upload.php', {
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
  