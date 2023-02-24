var express = require("express");
var mysql = require("mysql2");
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

app.post("/post", (req, res) => {
  console.log("inside post: ", req.body);
  const name = req.body.name;
  const id = req.body.id;
  const mark = req.body.mark;

  con.query(
    "insert into mytable values(?,?,?)",
    [id, name, mark],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("POSTED");
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
      console.log(value[0].mark);

      console.log("connected!!");
      //   res.send(result);
    }
  });
});
app.put("/update/:id", (req, res) => {
  const upid = req.params.id;
  const name = req.body.name;
  const mark = req.body.mark;
  con.query(
    "update mytable SET name=?, mark=? WHERE id=?",
    [name, mark, upid],

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
