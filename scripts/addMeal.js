import { getLocalMenuName, getMenu, checkUserLoggedIn, getLocalMenu} from './util.js';

function itemInMenu(item, menu, category) {
  return (menu.categories?.[category] ?? []).some((d) => d.name === item.name);
}




async function addMealToTable(mealObject, category) {
  const tbody = document.getElementsByTagName('tbody')[0];
  const row = tbody.insertRow(-1);
  for (let field of ['name', 'category', 'price', 'description', 'image', 'update']) {
    if (field === 'category') row.insertCell(-1).innerText = category;
    else if (field === 'image') {
      let imageCell = row.insertCell(-1);
      let figure = document.createElement('figure');
      let image = document.createElement('img');
      image.src = mealObject[field];
      image.alt = mealObject['name'];
      figure.appendChild(image);
      imageCell.appendChild(figure);
    } else if (field === 'update') {
      let updateCell = row.insertCell(-1);
      let button = document.createElement('button');
      button.innerText = '🗑️';
      button.onclick = async function () {
        let data = await getLocalMenu();
        if (!data) return;

        if (data.categories?.[category]) {
          data.categories[category] = data.categories[category].filter(
            (item) => item.name !== mealObject['name']
          );

          if (data.categories[category].length === 0) {
            delete data.categories[category];
          }

          localStorage.setItem(await getLocalMenuName(), JSON.stringify(data));
        }
        row.remove();
      };
      updateCell.appendChild(button);
    } else {
      row.insertCell(-1).innerText = mealObject[field];
    }
  }
}

async function addMeal(event) {
  event.preventDefault();

  const form = event.target;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const meal = {
    name: form.name.value.trim(),
    description: form.description.value.trim(),
    price: '₪' + form.price.value.trim(),
    image: form.image.value.trim(),
  };

  const category = form.elements['category'].value.trim();
  const baseMenu = await getMenu();
  const localMenu = await getLocalMenu();

  if (itemInMenu(meal, baseMenu, category) || itemInMenu(meal, localMenu, category)) {
    alert('המנה נמצאת כבר בתפריט');
    return;
  }

  if (!localMenu.categories[category]) {
    localMenu.categories[category] = [];
  }

  localMenu.categories[category].push(meal);
  const key = await getLocalMenuName();
  localStorage.setItem(key, JSON.stringify(localMenu));
  addMealToTable(meal, category);

  form.reset();
}

async function loadTable() {
  const tbody = document.getElementsByTagName('tbody')[0];
  for (const [category, dishes] of Object.entries((await getLocalMenu()).categories)) {
    for (const dish of dishes) {
      const meal = {
        name: dish.name.trim(),
        description: dish.description.trim(),
        price: dish.price.trim(),
        image: dish.image.trim(),
      };
      addMealToTable(meal, category);
    }
  }
}

async function loadCategories() {
  let menu = await getMenu();
  let select = document.getElementsByTagName('select')[0];

  for (const [category, ] of Object.entries(menu.categories)) {
    let option = document.createElement('option');
    option.value = category;
    option.innerText = category;
    select.appendChild(option);
  }
}


window.init = function () {
  checkUserLoggedIn();
  document.forms['newDish'].addEventListener('submit', addMeal);
  loadTable();
  loadCategories();
};
