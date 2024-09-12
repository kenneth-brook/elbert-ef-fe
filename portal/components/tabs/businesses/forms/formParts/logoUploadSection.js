const renderLogoUploadSection = () => `
    <div class="form-group">
        <label for="logoUpload">Business Logo:</label>
        <input type="file" id="logoUpload" name="logoUrl" accept="image/*">
    </div>
    <div id="logo-preview" class="thumbnail-container"></div>
`;

export default renderLogoUploadSection