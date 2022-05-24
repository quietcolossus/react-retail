import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", email: "" };

    this.handlePW = this.handlePW.bind(this);
    this.handleEM = this.handleEM.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  render() {
    return (
      <div class="dead-center-div">
        <form
          className="sl-form"
          method="post"
          autocomplete="off"
          onSubmit={this.handleSubmit}
        >
          <h2>Log In</h2>

          <div class="field-block">
            <label for="email">Email:</label>
            <input
              value={this.state.email}
              onChange={this.handleEM}
              type="email"
              name="email"
              required
            />
          </div>

          <div class="field-block">
            <label for="password">Password:</label>
            <input
              value={this.state.password}
              onChange={this.handlePW}
              type="password"
              name="password"
              required
            />
          </div>

          <div class="form-action">
            <input
              class="main-button"
              type="submit"
              name="checklogin"
              value="Log In"
            />
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    );
  }

  handleSubmit = (e) => {
    console.log(this.state.email);
    console.log(this.state.password);
    e.preventDefault();
    fetch("http://localhost:4000/checklogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result[0]) {
          alert("You are logged in.");
          this.goToMain();
        } else {
          alert("Please check your login information.");
        }
      });
  };

  goToMain() {
    window.location.href = "/";
  }

  handlePW(event) {
    this.setState({ password: event.target.value });
  }

  handleEM(event) {
    this.setState({ email: event.target.value });
  }
}

// <?php
//   require 'config.php';
//   if (isset($_POST["login"])) {
//     $email = $_POST["email"];
//     $password = $_POST["password"];
//     $result = mysqli_query($conn, "SELECT * FROM user WHERE user_email = '$email' AND user_password = '$password'");
//     if (mysqli_num_rows($result) > 0) {
//       $_SESSION["account"] = $email;
//       header('Location: index.php');
//     } else {
//       echo
//       "<script>alert('Wrong Email or Password')</script>";
//     }
//   }

// ?>
