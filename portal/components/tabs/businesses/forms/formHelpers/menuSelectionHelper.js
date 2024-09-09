import ApiService from '../../../../../services/apiService.js';
const apiService = new ApiService();

export const initializeMenuSelection = async (formContainer) => {
  const menuTypeDropdown = formContainer.querySelector('#menuType');
  const averageCostDropdown = formContainer.querySelector('#averageCost');
  const addMenuTypeButton = formContainer.querySelector('#add-menu-type');
  const addNewMenuTypeButton = formContainer.querySelector('#add-new-menu-type');
  const newMenuTypeInput = formContainer.querySelector('#newMenuType');
  const menuTypeList = formContainer.querySelector('#menu-type-list');

  const menuTypes = [];

  const fetchedMenuTypes = await getMenuTypes();
  if (fetchedMenuTypes && Array.isArray(fetchedMenuTypes)) {
    fetchedMenuTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.name;
      menuTypeDropdown.appendChild(option);
    });
  } else {
    console.error('Error fetching menu types:', fetchedMenuTypes);
  }

  const fetchedAverageCosts = await getAverageCosts();
  if (fetchedAverageCosts && Array.isArray(fetchedAverageCosts)) {
    fetchedAverageCosts.forEach(cost => {
      const option = document.createElement('option');
      option.value = cost.id;
      option.textContent = `${cost.symbol} - ${cost.description}`;
      averageCostDropdown.appendChild(option);
    });
  } else {
    console.error('Error fetching average costs:', fetchedAverageCosts);
  }

  addMenuTypeButton.addEventListener('click', () => {
    const selectedOption = menuTypeDropdown.options[menuTypeDropdown.selectedIndex];
    if (selectedOption) {
      const listItem = createMenuListItem(selectedOption.textContent, selectedOption.value);
      menuTypeList.appendChild(listItem);
      menuTypes.push({ id: selectedOption.value, name: selectedOption.textContent });
    }
  });

  addNewMenuTypeButton.addEventListener('click', async () => {
    const newMenuType = newMenuTypeInput.value.trim();
    if (newMenuType) {
      const response = await addNewMenuType(newMenuType);
      if (response && response.id) {
        const option = document.createElement('option');
        option.value = response.id;
        option.textContent = newMenuType;
        menuTypeDropdown.appendChild(option);

        const listItem = createMenuListItem(newMenuType, response.id);
        menuTypeList.appendChild(listItem);
        menuTypes.push({ id: response.id, name: newMenuType });

        newMenuTypeInput.value = '';
      } else {
        console.error('Error adding new menu type:', response);
      }
    }
  });

  formContainer.menuTypes = menuTypes;

  function createMenuListItem(name, id) {
    const listItem = document.createElement('li');
    listItem.textContent = name;
    listItem.dataset.id = id;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.style.color = 'red';
    removeButton.style.marginLeft = '10px';
    removeButton.addEventListener('click', () => {
      menuTypeList.removeChild(listItem);
      const index = menuTypes.findIndex(type => type.id === id);
      if (index > -1) {
        menuTypes.splice(index, 1);
      }
    });

    listItem.appendChild(removeButton);
    return listItem;
  }
};

const getMenuTypes = async () => {
  const tableName = `eat_type`;
  try {
    const response = await apiService.fetch(`menu-types?table=${tableName}`);
    return response;
  } catch (error) {
    console.error(`Error fetching menu types:`, error);
    return [];
  }
};

const getAverageCosts = async () => {
  const tableName = `eat_cost`;
  try {
    const response = await apiService.fetch(`average-costs?table=${tableName}`);
    return response;
  } catch (error) {
    console.error(`Error fetching average costs:`, error);
    return [];
  }
};

const addNewMenuType = async (newMenuType) => {
  const tableName = `eat_type`;
  try {
    const response = await apiService.fetch('menu-types', {
      method: 'POST',
      body: JSON.stringify({ name: newMenuType, table: tableName }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error(`Error adding new menu type:`, error);
    return { id: Date.now(), name: newMenuType };
  }
};
