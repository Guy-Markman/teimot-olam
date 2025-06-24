import { checkUserLoggedIn } from "./util.js";

export async function login() {
  const username = await checkUserLoggedIn();

  // עדכון כותרת
  document.getElementById('welcome').textContent = `ברוך הבא, ${username}!`;

  try {
    const res = await fetch('data/restaurantsByUser.json');
    if (!res.ok) throw new Error('Network error while loading restaurants');

    const restByUser = await res.json();
    const userRestaurants = restByUser[username];

    if (!userRestaurants || userRestaurants.length === 0) {
      document.getElementById('restaurants').textContent = 'לא נמצאו מסעדות.';
      return;
    }

    const container = document.getElementById('restaurants');
    container.innerHTML = '';

    userRestaurants.forEach((r) => {
      const card = document.createElement('div');
      card.className = 'restaurant-card';

      const img = document.createElement('img');
      img.src = r.img;
      img.alt = r.name;

      const desc = document.createElement('div');
      desc.className = 'description';
      desc.textContent = r.desc;

      const toRest = document.createElement('a');
      toRest.textContent = 'לאתר המסעדה';
      toRest.href = `${r.folder}/restaurant.html`;

      const addMeal = document.createElement('a');
      addMeal.textContent = 'להוספת מנה';
      addMeal.href = `${r.folder}/addMeal.html`;

      const menuFilter = document.createElement('a');
      menuFilter.textContent = 'למעבר על התפריט';
      menuFilter.href = `${r.folder}/menu-filter.html`;

      card.append(img, desc, toRest, addMeal,menuFilter );
      container.append(card);
    });

  } catch (err) {
    console.error('שגיאה בטעינת המסעדות:', err);
    document.getElementById('restaurants').textContent = 'אירעה שגיאה בטעינת הנתונים.';
  }
}

export function logout() {
  sessionStorage.removeItem('username');
  window.location.href = 'login.html';
}