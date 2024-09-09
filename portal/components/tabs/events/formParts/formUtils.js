export const selectOnlyThis = (checkbox, groupName, callback) => {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false;
    });
    if (callback) {
        callback(checkbox);
    }
};