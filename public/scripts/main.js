// אם כבר מחובר – ישר לדף המסעדות (index.html שפיתחנו, שם מוצגות המסעדות)
const user = sessionStorage.getItem('username');
if (user) {
  window.location.href = 'index.html'; // או restaurants.html, לפי איך תקראו לו
}

// לחיצה על כפתור – מעבר לעמוד התחברות
document.getElementById('login-btn').addEventListener('click', () => {
  window.location.href = 'login.html';
});
