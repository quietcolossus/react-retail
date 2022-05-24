const express = require("express");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
var md5 = require("md5");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "scs_database",
});

const app = express();
const cors = require("cors");

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { maxAge: oneDay, secure: false, httpOnly: false },
    resave: false,
  })
);

app.use(cookieParser());

var session;

app.get("/checksession", function (req, res) {
  console.log(session);
  res.send(session);
});

app.get("/item", function (req, res) {
  // Connecting to the database.
  connection.getConnection(function (err, connection) {
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query("SELECT * FROM item", function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.send(results);
    });
  });
});

app.get("/get_trucks", function (req, res) {
  connection.getConnection(function (err, connection) {
    connection.query("SELECT * FROM truck", function (error, results) {
      if (error) throw error;
      res.send(results);
    });
  });
});

app.post("/available_trucks", function (req, res) {
  var truck_list = req.body.trucks;
  var date = req.body.date;
  var query = "SELECT * FROM truck_unavailable WHERE ";
  for (var i = 0; i < truck_list.length; i++) {
    truck_id = truck_list[i].truck_id;
    console.log(truck_id);
    console.log(date);
    if ((i = truck_list.length - 1)) {
      query =
        query +
        "(truck_id = '" +
        truck_id +
        "' AND date_unavailable = '" +
        date +
        "') ";
    } else {
      query =
        query +
        "(truck_id = '" +
        truck_id +
        "' AND date_unavailable = '" +
        date +
        "') OR ";
    }
  }
  connection.getConnection(function (err, connection) {
    connection.query(query, function (error, results) {
      if (error) throw error;
      console.log(results);
      res.send(results);
    });
  });
});

app.post("/schedule_truck", function (req, res) {
  var delivery_schedule_time = req.body.date;
  var truck_id = req.body.truck;

  connection.getConnection(function (err, connection) {
    connection.query(
      "INSERT INTO truck_unavailable (date_unavailable, truck_id) VALUES ('" +
        delivery_schedule_time +
        "', '" +
        truck_id +
        "')",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
});

app.post("/make_trip", function (req, res) {
  var branch_loc = req.body.branch_loc;
  var user_address = req.body.address;
  var truck_id = req.body.truck;
  connection.getConnection(function (err, connection) {
    connection.query(
      "INSERT INTO trip (trip_origin, trip_destination, truck_id) VALUES ('" +
        branch_loc +
        "', '" +
        user_address +
        "', '" +
        truck_id +
        "')",
      function (error, results) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
});

app.post("/log_order", function (req, res) {
  var today = new Date();
  var date =
    today.getYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  var delivery_schedule_time = req.body.date;
  var order_total = req.body.total;
  var curr_user_id = req.body.user;
  var trip_id = req.body.trip;
  var order_status = 0;

  connection.getConnection(function (err, connection) {
    connection.query(
      "INSERT INTO orders VALUES('', '" +
        date +
        "', '" +
        delivery_schedule_time +
        "', '" +
        order_total +
        "', '" +
        curr_user_id +
        "', '" +
        trip_id +
        "', '" +
        order_status +
        "')",
      function (error, results) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
});

app.post("/order_comp", function (req, res) {
  var order_id = req.body.order;
  var order_item_id = req.body.item;
  console.log(order_id);
  console.log(order_item_id);
  connection.getConnection(function (err, connection) {
    connection.query(
      "INSERT INTO order_components (order_id, item_id) VALUES('" +
        order_id +
        "', '" +
        order_item_id +
        "')",
      function (error, results) {
        if (error) throw error;
      }
    );
  });
});

app.post("/my_orders", function (req, res) {
  var user = req.body.user;
  connection.getConnection(function (err, connection) {
    connection.query(
      "SELECT * FROM orders WHERE user_id = '" + user + "'",
      function (error, results) {
        if (error) throw error;
        console.log(results);
        res.send(results);
      }
    );
  });
});

app.post("/order_items", function (req, res) {
  var order_id = req.body.order;
  connection.getConnection(function (err, connection) {
    connection.query(
      "SELECT item_id FROM order_components WHERE order_id = '" +
        order_id +
        "'",
      function (error, results) {
        if (error) throw error;
        console.log(results);
        res.send(results);
      }
    );
  });
});

app.post("/item_detail", function (req, res) {
  var item_id = req.body.item_id;
  connection.getConnection(function (err, connection) {
    connection.query(
      "SELECT * FROM item WHERE item_id = '" + item_id + "'",
      function (error, results) {
        if (error) throw error;
        console.log(results);
        res.send(results);
      }
    );
  });
});

app.post("/db_checkout", function (req, res) {
  console.log(JSON.stringify(req.body));
  var password = req.body.password;
  var email = req.body.email;
  var items = req.body.items;
  console.log(items);
  console.log(email);

  var query = "SELECT * FROM item WHERE ";
  items.forEach(function (i, idx, array) {
    if (idx === array.length - 1) {
      query = query + "item_id = '" + i + "'";
    } else {
      query = query + "item_id = '" + i + "' OR ";
    }
  });
  console.log(query);
  // Connecting to the database.
  connection.getConnection(function (err, connection) {
    connection.query(query, function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      if (results) {
        session.orderitems = results;
        session.save();
        console.log("lalalala");
        console.log(session);
        console.log(results);
        res.send(results);
      } else {
        console.log(results);
        res.send(results);
      }
    });
  });
});

app.post("/db_signup", function (req, res) {
  console.log(JSON.stringify(req.body));
  var password = req.body.password;
  var email = req.body.email;
  var salt = req.body.salt;
  var phone = req.body.phone;
  var address = req.body.address;
  var name = req.body.name;
  console.log(password);
  console.log(email);
  var query =
    "SELECT * FROM user WHERE user_email = '" +
    email +
    "' OR user_phone = '" +
    phone +
    "'";
  console.log(query);
  // Connecting to the database.
  connection.getConnection(function (err, connection) {
    connection.query(query, function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      if (results[0]) {
        console.log(results);
        res.send(results);
      } else {
        connection.query(
          "INSERT INTO user VALUES('','" +
            name +
            "','" +
            phone +
            "','" +
            email +
            "','" +
            address +
            "','" +
            salt +
            "','" +
            password +
            "')",
          function (error, results2, fields) {
            if (error) throw error;
          }
        );
        console.log(results);
        res.send(results);
      }
    });
  });
});

app.post("/checklogin", function (req, res) {
  console.log(JSON.stringify(req.body));
  var password = req.body.password;
  var email = req.body.email;
  console.log(password);
  console.log(email);
  var query = "SELECT * FROM user WHERE user_email = '" + email + "'";
  console.log(query);
  // Connecting to the database.
  connection.getConnection(function (err, connection) {
    connection.query(query, function (error, results, fields) {
      // If some error occurs, we throw an error.
      console.log(results);
      if (error) throw error;
      if (results[0]) {
        console.log(results);
        var user = JSON.parse(JSON.stringify(results))[0];
        console.log(user);
        var salt = user.salt;
        var hash = md5(password + salt);
        if (hash == user.password_hash) {
          session = req.session;
          session.user = user;
          session.save();
          res.send(results);
        } else {
          console.log(results);
          res.send([]);
        }
      } else {
        console.log(results);
        res.send(results);
      }
    });
  });
});

app.get("/logout", (req, res) => {
  session = {};
  res.send();
});

// Starting our server.
app.listen(4000, () => {
  console.log("Go to http://localhost:3000/users so you can see the data.");
});
