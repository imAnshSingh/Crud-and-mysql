const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride("_method"));
app.use(express.urlencoded( {extended : true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: '@Anshsingh88',
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ]
};

//Home route
app.get("/", (req, res) => {
  let q = `select count(*) from user`;

  try {
    connection.query(q, (err, result) => {
      let count = result[0]['count(*)'];
      if (err) throw err;
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Error arise in DB");
  }
});

//show users

app.get("/user", (req, res) => {
  let q = `SELECT *FROM user`;

  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showUser.ejs", { users });
    });
  } catch (err) {
    res.send("Some error occur in database");
  }
});

// edit routes
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT *FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    res.send("Some error occur in database");
  }
})

//update route

app.patch("/user/:id", (req, res)=>{
  let { id } = req.params;
  let { password : formPass, username : newUsername } = req.body;
  let q = `SELECT *FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if(formPass != user.password){
        res.send("Wrong Password");
      }else{
        let q2 = `UPDATE user SET username ='${newUsername}' where id = '${id}'`;
          connection.query(q2, (err, result)=>{
            if(err) throw err;
            res.redirect("/user");
          })
      }
    })
  } catch (err) {
    res.send("Some error occur in database");
  }
});

app.listen("8080", () => {
  console.log("listening app on 8080...");
})



// connection.end();