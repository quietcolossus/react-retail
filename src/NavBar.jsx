import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class NavBar extends Component {
  state = {
    user: null,
  };

  async componentDidMount() {
    var session = await fetch("http://localhost:4000/checksession", {
      method: "GET",
      credentials: "same-origin",
    });
    console.log(session);
    var session_data = await session.json();
    var u = session_data.user;

    this.setState({ user: u });
  }

  render() {
    return (
      <nav>
        <a href="/">
          <h1 className="nav-logo">SOKO</h1>
        </a>
        <ul className="nav-pagelinks">
          <li>
            <Link to="/about_us">About Us</Link>
          </li>
          <li>
            <Link to="/contact_us">Contact Us</Link>
          </li>
        </ul>
        {this.getPageState(this.state.user)}
      </nav>
    );
  }

  logout = async (e) => {
    await fetch("http://localhost:4000/logout", {
      method: "GET",
      credentials: "same-origin",
    });
    this.setState({ user: null });
    window.location.href = "/";
  };

  getPageState = (user) => {
    console.log(this.state.user);
    if (user == null) {
      return (
        <ul className="nav-account">
          <li>
            <Link to="/login">Log In</Link>
          </li>
          <li className="main-button">
            <Link to="/sign_up">Sign Up</Link>
          </li>
        </ul>
      );
    } else {
      if (user.user_email.includes("admin")) {
        return (
          <div className="account-menu">
            <div
              id="dropdown-btn"
              className="account-menu-btn"
              button-box="true"
              onClick={() => {
                document
                  .getElementById("my-account-dropdown")
                  .classList.toggle("show");
              }}
            >
              {user.user_name}
              <i className="arrow down"></i>
            </div>
            <div id="my-account-dropdown" className="account-menu-content">
              <a href="http://localhost/phpmyadmin/">Database Maintain</a>
              <Link to="/logout" onClick={this.logout} id="logout-btn">
                Log Out
              </Link>
            </div>
          </div>
        );
      } else {
        return (
          <div className="account-menu">
            <div
              id="dropdown-btn"
              className="account-menu-btn"
              button-box="true"
              onClick={() => {
                document
                  .getElementById("my-account-dropdown")
                  .classList.toggle("show");
              }}
            >
              {user.user_name}
              <i className="arrow down"></i>
            </div>
            <div id="my-account-dropdown" className="account-menu-content">
              <Link to="/my_orders">My Orders</Link>
              <Link to="/" onClick={this.logout} id="logout-btn">
                Log Out
              </Link>
            </div>
          </div>
        );
      }
    }
  };
}
