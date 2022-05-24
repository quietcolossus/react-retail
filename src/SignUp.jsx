import React, { Component } from "react";
var md5 = require("md5");

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", email: "" };

    this.handlePW = this.handlePW.bind(this);
    this.handleEM = this.handleEM.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    console.log(this.state.email);
    console.log(this.state.hashed_password);
    e.preventDefault();
    fetch("http://localhost:4000/db_signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email,
        salt: this.state.salt,
        password: this.state.hashed_password,
        address: this.state.address,
        name: this.state.name,
        phone: this.state.phone,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result[0]) {
          alert("Email or Phone Number were already used.");
        } else {
          alert("You are signed up!");
          this.goToLogin();
        }
      });
  };
  goToMain() {
    window.location.href = "/";
  }

  goToLogin() {
    window.location.href = "/login";
  }

  generateSalt(length = 6) {
    return Math.random().toString(20).substr(2, length);
  }

  handlePW(event) {
    const pw = event.target.value;

    var salt = this.generateSalt(16);
    const hash = md5(pw + salt);

    console.log(salt);

    console.log(hash);

    this.setState({ salt: salt, hashed_password: hash });
  }

  handleEM(event) {
    this.setState({ email: event.target.value });
  }

  handleName(event) {
    this.setState({ name: event.target.value });
  }

  handleAddress(event) {
    this.setState({ address: event.target.value });
  }

  handlePhone(event) {
    this.setState({ phone: event.target.value });
  }

  render() {
    return (
      <div class="dead-center-div">
        <form
          class="sl-form"
          action=""
          method="post"
          autocomplete="off"
          onSubmit={this.handleSubmit}
        >
          <h2>Sign Up</h2>

          <div class="double-block">
            <div class="field-block">
              <label for="name">Name:</label>
              <input
                type="name"
                name="name"
                onChange={this.handleName}
                required
              />
            </div>
            <div class="field-block">
              <label for="phone">Phone:</label>
              <input
                type="text"
                name="phone"
                onChange={this.handlePhone}
                required
              />
            </div>
          </div>

          <div class="field-block">
            <label for="address">Address:</label>
            <input
              id="address-input"
              type="text"
              name="address"
              placeholder=""
              onChange={this.handleAddress}
              required
            />
          </div>

          <div class="double-block">
            <div class="field-block">
              <label for="email">Email:</label>
              <input
                type="email"
                name="email"
                onChange={this.handleEM}
                required
              />
            </div>
            <div class="field-block">
              <label for="password">Password:</label>
              <input
                type="password"
                name="password"
                onChange={this.handlePW}
                required
              />
            </div>
          </div>

          <div class="form-action">
            <input
              class="main-button"
              type="submit"
              name="signup"
              value="Sign Up"
            />
            <p>
              Already have an account? <a href="login.php">Log In</a>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

// <?php
//     require 'config.php';
//     if (isset($_POST["signup"])) {
//         $name = $_POST["name"];
//         $phone = $_POST["phone"];
//         $address = $_POST["address"];
//         $email = $_POST["email"];
//         $password = $_POST["password"];
//         $duplicate = mysqli_query($conn, "SELECT * FROM user WHERE user_email = '$email' OR user_phone = '$phone'");
//         if (mysqli_num_rows($duplicate) > 0) {
//             echo
//             "<script>alert('Email or Phone Number were already used')</script>";
//         } else {
//             $query = "INSERT INTO user VALUES('','$name','$phone','$email','$address','$password')";
//             mysqli_query($conn, $query);
//             $_SESSION["account"] = $email;
//             header('Location: index.php');
//         }
//     }
// ?>

// <head>
//     <?php include './components/headers.php' ?>
//     <title>SOKO | Sign Up</title>
//     <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRgMvD0tUbsGv6Gn6yedurKxGLc_Hh21I&libraries=places"></script>
// </head>

// <!-- AIzaSyCgDflAFKvmr5Ib8O544TdpE9Q6yJLWCaY -->

// <body>
//     <?php include './components/navbar.php' ?>

//     <div class="dead-center-div">
//         <form class="sl-form" action="" method="post" autocomplete="off">
//             <h2>Sign Up</h2>

//             <div class="double-block">
//                 <div class="field-block">
//                     <label for="name">Name:</label>
//                     <input type="name" name="name" required>
//                 </div>
//                 <div class="field-block">
//                     <label for="phone">Phone:</label>
//                     <input type="text" name="phone" required>
//                 </div>
//             </div>

//             <div class="field-block">
//                 <label for="address">Address:</label>
//                 <input id="address-input" type="text" name="address" placeholder="" required>
//             </div>

//             <div class="double-block">
//                 <div class="field-block">
//                     <label for="email">Email:</label>
//                     <input type="email" name="email" required>
//                 </div>
//                 <div class="field-block">
//                     <label for="password">Password:</label>
//                     <input type="password" name="password" required>
//                 </div>
//             </div>

//             <div class="form-action">
//                 <input class="main-button" type="submit" name="signup" value="Sign Up">
//                 <p>Already have an account? <a href="login.php">Log In</a></p>
//             </div>
//         </form>
//     </div>
// </body>
// <script>
//     const autocomplete = new google.maps.places.Autocomplete((document.getElementById('address-input')), {
//         types: ['geocode']
//     });
// </script>

// </html>
