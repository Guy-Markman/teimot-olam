const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));

/*// פרטי ההתחברות לשרת SQL
const config = {
  server: 'localhost', // כתובת השרת
  database: 'course', // שם בסיס הנתונים
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};*/
// גרסה שלי כדי להתחבר לשרת שלי
const config = {
  server: 'localhost',
  database: 'course',
  user: 'sa',
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// הפניה מעמוד ראשי
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
