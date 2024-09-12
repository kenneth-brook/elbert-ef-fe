const renderSocialMediaSection = () => `
    <div class="form-group">
        <label for="socialPlatform">Social Platform:</label>
        <input type="text" id="socialPlatform" name="socialPlatform">
    </div>
    <div class="form-group">
        <label for="socialAddress">Social Address:</label>
        <input type="text" id="socialAddress" name="socialAddress">
    </div>
    <button type="button" id="add-social-media">Add</button>
    <ul id="social-media-list"></ul>
`;

export default renderSocialMediaSection