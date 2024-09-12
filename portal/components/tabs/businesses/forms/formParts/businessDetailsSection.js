const renderBusinessDetailsSection = () => `
    <div class="form-group">
        <label for="businessName">Business Name:</label>
        <input type="text" id="businessName" name="businessName">
    </div>
    <div class="form-group">
        <label for="streetAddress">Street Address:</label>
        <input type="text" id="streetAddress" name="streetAddress">
    </div>
    <div class="form-group">
        <label for="mailingAddress">Mailing Address:</label>
        <input type="text" id="mailingAddress" name="mailingAddress">
    </div>
    <div class="form-group">
        <label for="city">City:</label>
        <input type="text" id="city" name="city">
    </div>
    <div class="form-group">
        <label for="state">State:</label>
        <input type="text" id="state" name="state">
    </div>
    <div class="form-group">
        <label for="zipCode">Zip Code:</label>
        <input type="text" id="zipCode" name="zipCode">
    </div>
`;

export default renderBusinessDetailsSection