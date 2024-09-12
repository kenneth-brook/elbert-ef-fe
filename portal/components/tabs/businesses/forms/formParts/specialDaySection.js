const renderSpecialDaySection = () => `
    <div class="special-day-container">
        <label for="special-day">Special Day:</label>
        <input type="text" id="special-day" class="special-day" name="special-day" />
    </div>
    <div class="altered-hours-container">
        <label for="altered-hours">Altered Hours:</label>
        <input type="text" id="altered-hours" class="altered-hours" name="altered-hours" />
    </div>
    <div class="add-day-container">
        <button type="button" id="add-day-button">Add Day</button>
    </div>
    <div class="day-hours-list" id="day-hours-list"></div>
`;

export default renderSpecialDaySection