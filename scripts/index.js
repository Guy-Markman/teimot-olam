function login() {
  // אם לא מחובר – חוזר ל-login
  const username = sessionStorage.getItem('username');
  if (!username) {
    window.location.href = 'login.html';
  }

  // כותרת ברוך הבא
  document.getElementById('welcome').textContent = `ברוך הבא, ${username}!`;

  const restaurantsByUser = {
    Yossi: [
      {
        name: 'UMA סושי בר',
        img: 'imgs/sushi.jpg',
        desc: 'משנת 2016 אומה היא הנקודה הכי ייחודית ועדכנית במבנה מרהיב לשימור בזכרון יעקב. המסעדה מחברת בין אופייה המרהיב של המושבה, תרבויות של טעמים מהמזרח ואווירה ישראלית שמחה.',
        link: 'restuarants/uma/restaurant.html',
      },
      {
        name: 'Trattoria Roma',
        img: 'imgs/pasta.jpg',
        desc: 'מסעדה איטלקית אותנטית בלב רומא הקולינרית. מתמחים בפסטות טריות, פיצות בתנור עצים, ויינות איטלקיים משובחים. בואו לטעום את איטליה האמיתית עם אווירה משפחתית וחמה.',
        link: 'restuarants/trattoriaRoma/restaurant.html',
      },
    ],
    Dana: [
      {
        name: 'מאפיית דולצ׳ה',
        img: 'imgs/pastries.jpg',
        desc: 'מאפייה בוטיק איטלקית-צרפתית. מתמחים בקרואסונים חמאתיים, עוגות אישיות ולחמי מחמצת טריים. כל בוקר אנחנו אופים באהבה, מחומרים איכותיים וללא פשרות.',
        link: 'restuarants/dolceBakery/restaurant.html',
      },
      {
        name: 'JunkyBurger',
        img: 'imgs/hamburger.jpg',
        desc: 'מזללת דיינר אמריקאית בלב שוק לוינסקי. המבורגר הדגל הוא ה"דאבל צ׳יז" – שתי קציצות במשקל 200 גרם עם גבינה אמריקאית, איולי ג׳אנקי, חסה, בצל וחמוצים.',
        link: 'restuarants/elBurger/restaurant.html',
      },
    ],
    Rami: [
      {
        name: 'Yamaji ראמן בר',
        img: 'imgs/ramen.jpg',
        desc: 'בר ראמן יפני שנולד מתוך אהבה לטעמים העמוקים והמדויקים של המטבח האסייתי. טעמים עמוקים, תוספות ביתיות, ואווירה שמביאה את יפן אליכם לשולחן.',
        link: 'restuarants/yamaji/restaurant.html',
      },
    ],
  };

  // בניית הכרטיסים
  const container = document.getElementById('restaurants');
  restaurantsByUser[username].forEach((r) => {
    const card = document.createElement('div');
    card.className = 'restaurant-card';

    const img = document.createElement('img');
    img.src = r.img;
    img.alt = r.name;

    const desc = document.createElement('div');
    desc.className = 'description';
    desc.textContent = r.desc;

    const btn = document.createElement('a');
    btn.textContent = 'לפרטי המסעדה';
    btn.onclick = () => (window.location.href = r.link);

    card.append(img, desc, btn);
    container.append(card);
  });
}

function logout() {
  sessionStorage.removeItem('username');
  window.location.href = 'login.html';
}
