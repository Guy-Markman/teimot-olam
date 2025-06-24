import { getRestaurantId } from "./util.js";

let cartItems = [];

async function  saveCart() {
  localStorage.setItem(`cart-${await getRestaurantId()}`, JSON.stringify(cartItems));
}

export async function loadCart() {
  cartItems = JSON.parse(localStorage.getItem(`cart-${await getRestaurantId()}`) || '[]');

  cartItems.forEach(({ name, price }) => {
    const template = document.getElementById('cart-item-template');
    const item = template.content.cloneNode(true);

    item.querySelector('.itemTitle').textContent = name;
    item.querySelector('.itemPrice').textContent = price;

    const li = item.querySelector('li');
    item.querySelector('.removeButton').onclick = async function () {
      li.remove();
      await removeItem(name, price);
      updateTotal(-Number(price.replace(/\D/g, '')));
      saveCart();
    };

    document.querySelector('.cart').append(item);
    updateTotal(Number(price.replace(/\D/g, '')));
  });
}

export async function clearCart() {
  const cart = document.querySelector('.cart');
  cart.innerHTML = ''; // remove all items

  cartItems = []; // clear in-memory array

  const id = await getRestaurantId();
  localStorage.removeItem(`cart-${id}`); // clear localStorage

  updateTotal(-parseInt(document.querySelector('#total').textContent)); // reset total
}

function updateTotal(amount) {
  const totalSpan = document.querySelector('#total');
  totalSpan.textContent = parseInt(totalSpan.textContent) + amount;
}

export async function addItem(name, price) {
  const template = document.getElementById('cart-item-template');
  const item = template.content.cloneNode(true);
  item.querySelector('.itemTitle').textContent = name;
  item.querySelector('.itemPrice').textContent = price;

  const li = item.querySelector('li');
  item.querySelector('.removeButton').onclick = function () {
    updateTotal(-1 * parseInt(Number(price.replace(/\D/g, ''))));
    li.remove();
  };

  document.querySelector('.cart').append(item);

  updateTotal(parseInt(Number(price.replace(/\D/g, ''))));
  cartItems.push({ name, price });
  localStorage.setItem(`cart-${await getRestaurantId()}`, JSON.stringify(cartItems));
}

export async function removeItem(name) {
  const index = cartItems.findIndex((item) => item.name === name);
  if (index !== -1) {
    cartItems.splice(index, 1);
    localStorage.setItem(`cart-${await getRestaurantId()}`, JSON.stringify(cartItems));
  }
}
