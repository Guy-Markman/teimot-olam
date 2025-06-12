// הגדרת המשתמשים המורשים
const users = {
    Yossi: 'Yossi2025',
    Dana:  'Dana2025',
    Rami:  'Rami2025'
  };
  
  const form      = document.getElementById('loginForm');
  const errorMsg  = document.getElementById('errorMsg');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (username === "" || password === "")
      errorMsg.textContent = "יש למלא שם משתמש וסיסמה";
    else if (users[username] && users[username] === password) {
      // שמירת שם המשתמש בסשן וניווט ל־index.html
      sessionStorage.setItem('username', username);
      window.location.href = 'index.html';
    } else {
      errorMsg.textContent = 'שם משתמש או סיסמה שגויים.';
    }
  });
  