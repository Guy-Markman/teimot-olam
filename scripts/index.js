// אם לא מחובר – חוזר ל-login
const username = sessionStorage.getItem('username');
if (!username) {
  window.location.href = 'login.html';
}

// כותרת ברוך הבא
document.getElementById('welcome').textContent = `ברוך הבא, ${username}!`;

const restaurantsByUser = {
  Yossi: [
    { name: 'סושי', img: 'imgs/sushi.jpg',    desc: ' סושי טוב זה סושי טרי! בכל בוקר מגיע הצוות שלנו למטבח ומתחיל להכין את האוכל שתאכלו באותו היום.תוכלו ליהנות מהסושי שלנו במסעדה אומה בר אנד סושי או בישיבה מהירה או משלוח דרך אומה יאנג- האחות החדשה של אומה ',      link: 'restaurant.html?name=sushi' },
    { name: 'פסטה איטלקית', img: 'imgs/pasta.jpg',  desc: ' התפריט העשיר עליו חתום שף הרשת כפיר סבן, מבוסס על חומרי גלם טריים ואיכותיים המיובאים מאיטליה, בשילוב תוצרת מקומית מובחרת. באמצעותם, הוא יוצר שפע של פסטות טריות, ריזוטו עשיר, פיצות בשלל סגנונות.  ' , link: 'restaurant.html?name=pasta' }
  ],
  Dana: [
    { name: 'מאפים מפנקים', img: 'imgs/pastries.jpg', desc: ' מאפיית הנביאים מציעים ללקוחות מגוון רחב של לחמים, פיתות, לחמניות, מאפים, בורקסים, קוראסונים, פיצות ועוד… מחירים נוחים לכל כיס, שירות אישי ואדיב לכל לקוח. ' ,       link: 'restaurant.html?name=pastries' },
    { name: 'המבורגר ג׳אנקי', img: 'imgs/hamburger.jpg',desc: ' רשת מזון מהיר ישראלית המציעה ארוחות הכוללות לרוב המבורגר עם תוספות שונות. מוצרים נוספים אותם ניתן לקנות בסניפי הרשת: שניצלים, חזה עוף, טבעות בצל, ציפס, המבורגר טבעוני חדש!, סלטים ושתייה ' , link: 'restaurant.html?name=hamburger' }
  ],
  Rami: [
    { name: 'ראמן חם', img: 'imgs/ramen.jpg', desc: ' מסעדת הראמן באורוות האמנים בפרדס חנה המסעדה שייכת לשף היפני סאסאן שהגיע לארץ בעקבות האהבה למאיה הישראלית שמנהלת איתו את המסעדה יש פה כמה מנות ' , link: 'restaurant.html?name=ramen' }
  ]
};

// בניית הכרטיסים
const container = document.getElementById('restaurants');
restaurantsByUser[username].forEach(r => {
  const card = document.createElement('div');
  card.className = 'restaurant-card';

  const img = document.createElement('img');
  img.src = r.img;
  img.alt = r.name;

  const desc = document.createElement('div');
  desc.className = 'description';
  desc.textContent = r.desc;  

  const btn = document.createElement('button');
  btn.textContent = 'לפרטי המסעדה';
  btn.onclick = () => window.location.href = r.link;

  card.append(img, desc, btn);
  container.append(card);
});
