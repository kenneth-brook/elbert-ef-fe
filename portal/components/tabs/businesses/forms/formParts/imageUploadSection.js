const renderImageUploadSection = () => `
    <div class="form-group">
        <label for="imageUpload">Upload Images:</label>
        <input type="file" id="imageUpload" name="imageUrls" multiple>
    </div>
    <div id="image-thumbnails"></div>
    <ul id="image-file-list"></ul>
`;

export default renderImageUploadSection