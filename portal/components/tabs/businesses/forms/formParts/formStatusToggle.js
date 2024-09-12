const renderFormStatusToggle = () => `
    <div class="form-section">
        <div class="form-toggle">
            <label id="toggle-active-label">Company is currently <span id="toggle-status" style="color: red;">Inactive</span></label>
            <input type="checkbox" id="active-toggle" name="active">
        </div>
        <div class="form-toggle">
            <label id="toggle-member-label">Is Member: <span id="toggle-member-status" style="color: red;">No</span></label>
            <input type="checkbox" id="member-toggle" name="isMember">
        </div>
    </div>
`;

export default renderFormStatusToggle;