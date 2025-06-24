import { getCombinedMenu, checkUserLoggedIn } from './util.js';

function getCheckBoxes() {
  return document.querySelectorAll('#categoryFilter input[type="checkbox"]');
}

function filterTable() {
  const rows = document.querySelectorAll('#menuTable tr');

  const selectedCategories = Array.from(getCheckBoxes())
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  const selectedPrice = document.getElementById('priceFilter').value;
  const minPrice = selectedPrice === 'all' ? 0 : parseInt(selectedPrice, 10);

  rows.forEach((row) => {
    const rowCategory = row.children[1]?.innerText.trim();
    const rowPriceText = row.children[2]?.innerText.trim().replace(/[^\d.]/g, '');
    const rowPrice = parseFloat(rowPriceText) || 0;

    const matchCategory = selectedCategories.includes(rowCategory);
    const matchPrice = rowPrice >= minPrice;

    row.style.display = matchCategory && matchPrice ? '' : 'none';
  });
}

async function loadCategories() {
  const menu = await getCombinedMenu();
  const template = document.getElementById('template-category');
  const fieldSet = document.getElementById('categoryFilter');

  for (const [category] of Object.entries(menu.categories)) {
    const item = template.content.cloneNode(true);
    const input = item.querySelector('input');
    input.value = category;
    input.checked = true;
    item.querySelector('span').innerText = category;
    fieldSet.appendChild(item);
  }

  document.querySelectorAll('#categoryFilter input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener('change', filterTable);
  });
}

async function addMealToTable(mealObject, category) {
  const tbody = document.getElementById('menuTable');
  const row = tbody.insertRow(-1);
  for (let field of ['name', 'category', 'price', 'description', 'image']) {
    if (field === 'category') row.insertCell(-1).innerText = category;
    else if (field === 'image') {
      let imageCell = row.insertCell(-1);
      let figure = document.createElement('figure');
      let image = document.createElement('img');
      image.src = mealObject[field];
      image.alt = mealObject['name'];
      figure.appendChild(image);
      imageCell.appendChild(figure);
    } else {
      row.insertCell(-1).innerText = mealObject[field];
    }
  }
}

async function loadTable() {
  const menu = await getCombinedMenu();
  for (const [category, dishes] of Object.entries(menu.categories)) {
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
  filterTable();
}

window.init = async function () {
  await checkUserLoggedIn();
  await loadCategories();
  await loadTable();

  document.getElementById('priceFilter').addEventListener('change', (e) => {
    filterTable()
  });
};
