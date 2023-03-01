var express = require("express");
var mysql = require("mysql2");
const sendMail = require("./controllers/sendMail");
var app = express();
app.use(express.json());
const port = 3000;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "haris",
  database: "newdb",
});

con.connect((err) => {
  if (err) {
    console.log("inside connect");
    console.log(err);
  } else {
    console.log("connected!!");
  }
});

// POST

app.post("/", (req, res) => {
  console.log("inside post: ", req.body);
  const name = req.body.name;
  const gender = req.body.gender;
  const email = req.body.email;

  con.query(
    "insert into mytable(name, gender, email) values(?,?,?)",
    [name, gender, email],
    (err, result) => {
      if (err) {
        res.json({
          status: "error",
          message: err.message,
        });
        console.log(err);
      } else {
        sendMail(email);
        res.json({
          status: "success",
          message: "New user created successfully",
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log("on port 3000");
});

app.get("/fetch", (req, res) => {
  console.log("inside fetch");
  con.query("select * from mytable", function (err, result, field) {
    if (err) {
      console.log(err);
    } else {
      //   res.send(result);
      console.log(JSON.parse(JSON.stringify(result)));
    }
  });
});
app.get("/fetchbyid/:id", (req, res) => {
  const fetchid = req.params.id;
  con.query("select * from mytable where id=?", fetchid, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.lenght == 0) {
        console.log("id not present");
      }
      var value = JSON.parse(JSON.stringify(result));
      console.log(value[0].name);
      console.log(value[0].gender);

      console.log("connected!!");
      //   res.send(result);
    }
  });
});
app.put("/update/:id", (req, res) => {
  const email = req.params.email;
  const name = req.body.name;
  const gender = req.body.gender;
  con.query(
    "update mytable SET name=?, gender=? email=? WHERE id=?",
    [name, gender, email, upid],

    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.affectedroe == 0) {
          res.send(" id not present ");
        } else {
          res.send(" updated ");
        }
        app.delete("/deletedata/:id", (req, res) => {
          const delid = req.body.id;
          con.query("delete from mytable where id=?", delid, (err, result) => {
            if (result.affectedroe == 0) {
              res.send(" id not present ");
            } else {
              if (result.affectedRows == 0) {
                res.send("id not present");
              } else {
                res.send("deleted");
              }

              // res.send(" deleted ");
              // console.log(result);
              app.listen(port, () => {
                console.log("on port 3000");
              });
            }
          });
        });
      }
    }
  );
});
