export const attachSpecialDayHandlers = (formContainer) => {
    const specialDays = [];
    const addDayButton = formContainer.querySelector('#add-day-button');
  
    if (addDayButton) {
      addDayButton.addEventListener('click', () => {
        const specialDayInput = formContainer.querySelector('#special-day');
        const alteredHoursInput = formContainer.querySelector('#altered-hours');
        const specialDay = specialDayInput.value.trim();
        const alteredHours = alteredHoursInput.value.trim();
  
        if (specialDay && alteredHours) {
          specialDays.push({ day: specialDay, hours: alteredHours });
  
          const dayHoursList = formContainer.querySelector('#day-hours-list');
          const listItem = document.createElement('div');
          listItem.className = 'day-hours-item';
          listItem.textContent = `${specialDay}: ${alteredHours}`;
          dayHoursList.appendChild(listItem);
  
          specialDayInput.value = '';
          alteredHoursInput.value = '';
        } else {
          alert('Please fill both fields.');
        }
      });
  
      formContainer.specialDays = specialDays;
    }
  };
  