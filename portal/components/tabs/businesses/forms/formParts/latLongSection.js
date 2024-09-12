const renderLatLongSection = () => `
    <div class="form-group">
        <label for="latitude">Latitude:</label>
        <input type="text" id="latitude" name="latitude" readonly>
    </div>
    <div class="form-group">
        <label for="longitude">Longitude:</label>
        <input type="text" id="longitude" name="longitude" readonly>
    </div>
    <button type="button" id="autofill-button">Auto Fill</button>
`;

export default renderLatLongSection