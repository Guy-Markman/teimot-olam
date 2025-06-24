const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const sql = require('mssql');
const port = 3000;
let app;

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
  database: 'restaurants',
  user: 'sa',
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function getStatus(req, res) {
  try {
    const mealName = req.params.mealName;

    const request = new sql.Request();
    request.input('name', sql.NVarChar, mealName);

    const ans = await request.query(`
        SELECT is_discounted, price
        FROM meals
        WHERE name = @name
      `);

    if (!ans.recordset || ans.recordset.length === 0) {
      return res.status(404).json({ lengtherror: 'מנה לא נמצאה' });
    }
    let meal = ans.recordset[0];
    res.json({
      discounted: meal.is_discounted,
      price: meal.price,
    });
  } catch (err) {
    console.log('Error while mealName: ', err);
  }
}

async function updateJSON(mealName, queryResult) {
  const jsonPath = path.join(
    __dirname,
    '/public/restuarants/trattoriaRoma/data/trattoria-roma-menu.json'
  );

  try {
    const raw = await fs.readFile(jsonPath, 'utf-8');
    const menu = JSON.parse(raw);

    let updated = false;

    let finalPrice = queryResult.price;

    if (!queryResult.is_discounted) {
      switch (queryResult.discount_type) {
        case 'fixed': // הורדה בסכום קבוע
          finalPrice = queryResult.price - queryResult.discount_value;
          break;
        case 'percent': // אחוזי הנחה
          finalPrice = queryResult.price * (1 - queryResult.discount_value / 100);
          break;
        default:
          console.warn(`Unknown discount type for ${mealName}`);
      }
    }

    for (const category of Object.values(menu.categories)) {
      for (const dish of category) {
        if (dish.name === mealName) {
          dish.price = `₪${finalPrice}`;
          updated = true;
        }
      }
    }

    if (updated) {
      await fs.writeFile(jsonPath, JSON.stringify(menu, null, 2));
      console.log(`Updated price of "${mealName}" to ${finalPrice}`);
      return finalPrice;
    } else {
      console.warn(`Meal "${mealName}" not found in JSON`);
      return 0;
    }

  } catch (err) {
    console.error('Error updating JSON price:', err);
    return -1;
  }
}

async function toggleSale(req, res) {
  try {
    const mealName = req.params.mealName;

    const request = new sql.Request();
    request.input('name', sql.NVarChar, mealName);
    const result = await request.query(`
      SELECT *
      FROM meals
      WHERE name = @name
    `);

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ error: 'meal not foudn' });
    }

    const current = result.recordset[0].is_discounted;
    const newValue = current ? 0 : 1;

    const update = new sql.Request();
    update.input('name', sql.NVarChar, mealName);
    update.input('discounted', sql.Bit, newValue);
    await update.query(`
      UPDATE meals
      SET is_discounted = @discounted
      WHERE name = @name
    `);
    let newPrice = await updateJSON(mealName, result.recordset[0]);
    res.json({ success: true, status: newValue, newPrice: newPrice });
  } catch (err) {
    console.error('שגיאה ב-toggleSaleHandler:', err);
    res.status(500).json({ error: 'server error' });
  }
}

async function main() {
  app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(__dirname + '/public'));
  // הפניה מעמוד ראשי
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

  app.get('/api/status/:mealName', getStatus);

  app.get('/api/toggleSale/:mealName', toggleSale);

  try {
    await sql.connect(config);
    console.log('Connected to SQL server');

    app.listen(port, () => {
      console.log(`The server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to the SQL server:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
