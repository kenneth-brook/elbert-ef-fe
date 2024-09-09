export const eventFormTemplate = () => {
    return `
      <form id="event-form" enctype="multipart/form-data">
      <div class="form-section">
        <div class="form-group">
          <label for="eventName">Event Name:</label>
          <input type="text" id="eventName" name="eventName" required>
        </div>
      </div>
      <div class="form-section">
        <div class="form-group">
          <label for="streetAddress">Street Address:</label>
          <input type="text" id="streetAddress" name="streetAddress" required>
        </div>
        <div class="form-group">
          <label for="city">City:</label>
          <input type="text" id="city" name="city" required>
        </div>
        <div class="form-group">
          <label for="state">State:</label>
          <input type="text" id="state" name="state" required>
        </div>
        <div class="form-group">
          <label for="zipCode">Zip Code:</label>
          <input type="text" id="zipCode" name="zipCode" required>
        </div>
      </div>
      <div class="form-section">
        <div class="form-group">
          <label for="latitude">Latitude:</label>
          <input type="text" id="latitude" name="latitude" readonly>
        </div>
        <div class="form-group">
          <label for="longitude">Longitude:</label>
          <input type="text" id="longitude" name="longitude" readonly>
        </div>
        <button type="button" id="autofill-button">Auto Fill</button>
      </div>
      <div class="form-section">
        <div class="form-group">
          <label for="startDate">Start Date:</label>
          <input type="date" id="startDate" name="startDate" required>
        </div>
        <div class="form-group">
          <label for="endDate">End Date:</label>
          <input type="date" id="endDate" name="endDate" required>
        </div>
        <div class="form-group">
          <label for="startTime">Start Time:</label>
          <input type="time" id="startTime" name="startTime" required>
        </div>
        <div class="form-group">
          <label for="endTime">End Time:</label>
          <input type="time" id="endTime" name="endTime" required>
        </div>
      </div>
      <div class="form-section">
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
      </div>
      <div class="form-section" id="social-media-section">
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
      </div>
      <div class="form-section">
        <div class="form-group">
          <label for="logoUpload">Event Logo:</label>
          <input type="file" id="logoUpload" name="logoFile" accept="image/*">
        </div>
        <div id="logo-preview" class="thumbnail-container"></div>
      </div>
      <div class="form-section" id="image-upload-section">
        <div class="form-group">
          <label for="imageUpload">Upload Images:</label>
          <input type="file" id="imageUpload" name="imageFiles" multiple>
        </div>
        <div id="image-thumbnails"></div>
        <ul id="image-file-list"></ul>
      </div>
      <div class="form-section description-section">
        <div class="description-container">
          <label for="description">Event Description:</label>
          <textarea id="description" class="description" name="description"></textarea>
        </div>
      </div>
      <button type="button" id="submitEventButton">Submit</button>
    </form>
    `;
  };