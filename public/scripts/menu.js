import { getConfig, getRestaurantId, getCombinedMenu } from './util.js';
import { loadCart, clearCart, addItem, removeItem } from './cart.js';

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
  });
}

async function load() {
  const config = await getConfig();
  window.appConfig = config;
  const menu = await getCombinedMenu();
  const menuContainer = document.getElementById('menuContainer');
  const template = document.getElementById('category-template');
  Object.entries(menu.categories).forEach(([category, items]) => {
    const clone = template.content.cloneNode(true);
    clone.querySelector("h2").textContent = category;
    let dishList = clone.querySelector(".dishList");
    loadCategoryBoxes(items, clone.querySelector(".dishList"));
    menuContainer.append(clone);

  });
}

async function init() {
  await load();
  const id = await getRestaurantId();
  loadCart(id);
}

async function toggleSale(mealName) {
  try {
    const response = await fetch(`/api/toggleSale/${mealName}`);
    const data = await response.json();
    const isDiscounted = data.status;

    // מצא את השורה המתאימה בטבלה
    const rows = document.querySelectorAll('.salesTable tbody tr');
    rows.forEach(row => {
      const nameCell = row.querySelector('td');
      if (nameCell && nameCell.textContent.trim() === mealName) {
        const button = row.querySelector('.circle-button');
        if (button) {

          button.dataset.state = isDiscounted ? 'active' : 'inactive';
          button.title = isDiscounted ? 'הנחה פעילה' : 'הנחה לא פעילה';
        }
      }
    });

    const restaurantId = await getRestaurantId();
    const cartKey = `cart-${restaurantId}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    storedCart.forEach(item => {
      if (item.name === mealName) {
        item.price = `₪${data.newPrice}`;;
      }
    });
    localStorage.setItem(cartKey, JSON.stringify(storedCart));



  } catch (err) {
    console.error('error while buttonStatus: ', err);
  }
}

async function statusButton(mealName) {
  try{
    const response = await fetch(`/api/status/${mealName}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const isDiscounted = data.discounted;

    // מצא את השורה המתאימה בטבלה
    const rows = document.querySelectorAll('.salesTable tbody tr');
    rows.forEach(row => {
      const nameCell = row.querySelector('td');
      if (nameCell && nameCell.textContent.trim() === mealName) {
        const button = row.querySelector('.circle-button');
        if (button) {
          button.dataset.state = isDiscounted ? 'active' : 'inactive';
          button.title = isDiscounted ? 'הנחה פעילה' : 'הנחה לא פעילה';
        }
      }
    });

  } catch (err) {
    console.error('error while buttonStatus: ', err);
  }
}


async function updateButtons() {
  const meals = ["ברוסקטה עגבניות", "פסטה טליאטלה ברוטב פטריות כמהין", "טירמיסו ביתי"];
  for (const meal of meals) {
    statusButton(meal);
  }
}

init();
window.clearCart = clearCart;
window.addItem = addItem;
window.removeItem = removeItem;
window.statusButton = statusButton;
window.toggleSale = toggleSale;
updateButtons();