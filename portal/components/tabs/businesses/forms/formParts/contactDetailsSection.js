const renderContactDetailsSection = () => `
    <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" name="phone">
    </div>
    <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email">
    </div>
    <div class="form-group">
        <label for="website">Website:</label>
        <input type="url" id="website" name="website">
    </div>
`;

export default renderContactDetailsSection