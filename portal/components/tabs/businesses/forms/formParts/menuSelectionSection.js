const renderMenuSelectionSection = () => `
    <div style="display: flex; flex-direction: row; gap: 20px; width: 100%;">
        <div class="form-group">
            <label for="menuType">Menu Type:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <select id="menuType" name="menuType"></select>
                <button type="button" id="add-menu-type">Add Selection</button>
            </div>
        </div>
        <div class="form-group">
            <label for="newMenuType">New Menu Type:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="text" id="newMenuType" name="newMenuType">
                <button type="button" id="add-new-menu-type">Add</button>
            </div>
        </div>
        <div class="form-group">
            <label for="averageCost">Average Cost:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <select id="averageCost" name="averageCost"></select>
            </div>
        </div>
    </div>
    <ul id="menu-type-list"></ul>
`;

export default renderMenuSelectionSection