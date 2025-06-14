let cartItems = [];

function getRestaurantId() {
  return window.appConfig?.name || 'default';
}

function saveCart() {
  const restaurantId = getRestaurantId();
  localStorage.setItem(`cart-${getRestaurantId()}`, JSON.stringify(cartItems));
}

function loadCart() {
  const restaurantId = getRestaurantId();
  cartItems = JSON.parse(localStorage.getItem(`cart-${getRestaurantId()}`) || '[]');

  cartItems.forEach(({ name, price }) => {
    const template = document.getElementById('cart-item-template');
    const item = template.content.cloneNode(true);

    item.querySelector('.itemTitle').textContent = name;
    item.querySelector('.itemPrice').textContent = price;

    const li = item.querySelector('li');
    item.querySelector('.removeButton').onclick = function () {
      li.remove();
      removeItem(name, price);
      updateTotal(-parseInt(price.substring(1)));
      saveCart();
    };

    document.querySelector('.cart').append(item);
    updateTotal(+parseInt(price.substring(1)));
  });
}

function clearCart() {
  const cart = document.querySelector('.cart');
  cart.innerHTML = ''; // remove all items

  cartItems = []; // clear in-memory array

  const id = getRestaurantId();
  localStorage.removeItem(`cart-${id}`); // clear localStorage

  updateTotal(-parseInt(document.querySelector('#total').textContent)); // reset total
}

function updateTotal(amount) {
  const totalSpan = document.querySelector('#total');
  totalSpan.textContent = parseInt(totalSpan.textContent) + amount;
}

function addItem(name, price) {
  const template = document.getElementById('cart-item-template');
  const item = template.content.cloneNode(true);
  item.querySelector('.itemTitle').textContent = name;
  item.querySelector('.itemPrice').textContent = price;

  const li = item.querySelector('li');
  item.querySelector('.removeButton').onclick = function () {
    updateTotal(-1 * parseInt(price.substring(1, 3)));
    li.remove();
  };

  document.querySelector('.cart').append(item);

  updateTotal(parseInt(price.substring(1, 3)));
  cartItems.push({ name, price });
  localStorage.setItem(`cart-${getRestaurantId()}`, JSON.stringify(cartItems));
}

function removeItem(name, price) {
  const restaurantId = window.appConfig?.name || 'default';

  const index = cartItems.findIndex((item) => item.name === name && item.price === price);

  if (index !== -1) {
    cartItems.splice(index, 1);
    localStorage.setItem(`cart-${getRestaurantId()}`, JSON.stringify(cartItems));

    const amount = parseInt(price.replace(/\D/g, ''));
    updateTotal(-amount);
  }
}
