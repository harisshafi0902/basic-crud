const express = require("express");
const app = express();
const mysql = require("mysql2");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { UserLogin } = require("./generateAccessToken");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const db = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});
// const db = mysql.createPool({
//   connectionLimit: 100,
//   host: "127.0.0.1", //This is your localhost IP
//   user: "newuser", // "newuser" created in Step 1(e)
//   password: "Haris@12345", // password for the new user
//   database: "newDB", // Database name
//   port: "3306", // port name, "3306" by default
// });

db.getConnection((err, connection) => {
  if (err) throw err;
  console.log("DB connected successful: " + connection.threadId);
});
const port = process.env.PORT;
app.listen(port, () => console.log(`Server Started on port ${port}...`));

app.use(express.json());
app.use("/", (req, _, next) => {
  req.db = db;
  next();
});

//middleware to read req.body.<params>
//CREATE USER
app.post("/createUser", async (req, res) => {
  const user = req.body.name;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM userTable WHERE user = ?";
    const search_query = mysql.format(sqlSearch, [user]);
    const sqlInsert = "INSERT INTO userTable(user, password) VALUES (?,?)";
    const insert_query = mysql.format(sqlInsert, [user, hashedPassword]);
    // ? will be replaced by values
    // ?? will be replaced by string
    connection.query(search_query, async (err, result) => {
      if (err) throw err;
      console.log("------> Search Results");
      console.log(result.length);

      if (result.length != 0) {
        connection.release();
        console.log("------> User already exists");
        res.sendStatus(409);
        console.log("result", result);
      } else {
        connection.query(insert_query, (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("--------> Created new User");
          console.log(result.insertId);
          res.sendStatus(201);
        });
      }
    }); //end of connection.query()
  }); //end of db.getConnection()
}); //end of app.post()

//LOGIN (AUTHENTICATE USER)
app.post("/login", UserLogin);
// app.post("/login", (req, res) => {
//   const user = req.body.name;
//   const password = req.body.password;

//   db.getConnection(async (err, connection) => {
//     if (err) throw err;
//     const sqlSearch = "Select * from userTable where user = ?";
//     const search_query = mysql.format(sqlSearch, [user]);
//     connection.query(search_query, async (err, result) => {
//       connection.release();

//       if (err) throw err;
//       if (result.length == 0) {
//         console.log("--------> User does not exist");
//         res.sendStatus(404);
//       } else {
//         const hashedPassword = result[0].password;
//         //get the hashedPassword from result
//         if (bcrypt.compare(password, hashedPassword)) {
//           console.log("---------> Login Successful");
//           res.send(`${user} is logged in!`);
//         } else {
//           console.log("---------> Password Incorrect");
//           res.send("Password incorrect!");
//         } //end of bcrypt.compare()
//       } //end of User exists i.e. results.length==0
//     }); //end of connection.query()
//   }); //end of db.connection()
// }); //end of app.post()
