import { getConfig, getMenu, getRestaurantId } from './util.js';
import { loadCart, clearCart, addItem, removeItem } from './cart.js';
import {getLocalMenu} from './addMeal.js'

window.appConfig = null;



async function loadCategoryBoxes(dishes, container) {
  const template = document.getElementById('dish-template');
  Object.values(dishes).forEach((dish) => {
    const clone = template.content.cloneNode(true);
    clone.querySelector('h3').textContent = dish.name;
    clone.querySelector('.dishDescription').textContent = dish.description;
    clone.querySelector('.dishPrice').textContent = dish.price;

    const img = clone.querySelector('.dishImage');
    img.src = dish.image;
    img.alt = dish.name;

    clone.querySelector('.addButton').onclick = function () {
      addItem(dish.name, dish.price);
    };

    container.append(clone);
    return null;
  });
}

async function load() {
  const config = await getConfig();
  window.appConfig = config;
  const menu = await getCombinedMenu();
  const main = document.getElementsByTagName('main')[0];

  Object.entries(menu.categories).forEach(([category, items]) => {
    const catElement = document.createElement('section');
    main.append(catElement);

    catElement.classList.add('category');
    const title = document.createElement('h2');
    catElement.append(title);
    title.textContent = category;
    title.classList.add('titleBox', 'titleBoxBakery');

    const dishList = document.createElement('div');
    catElement.append(dishList);
    dishList.classList.add('dishList');

    loadCategoryBoxes(items, dishList);
  });
}

async function init() {
  await load();
  const id = getRestaurantId();
  loadCart(id);
}

async function getCombinedMenu() {
  const baseMenu = await getMenu();
  const storedMenu = await getLocalMenu();

  for (const [category, dishes] of Object.entries(storedMenu.categories)) {
    if (!baseMenu.categories[category]) {
      baseMenu.categories[category] = [];
    }
    baseMenu.categories[category].push(...dishes);
  }

  return baseMenu;
}

init();
window.clearCart = clearCart;
window.addItem = addItem;
window.removeItem = removeItem;