import React, { Component } from "react";
import MainContent from "./MainContent";
import NavBar from "./NavBar";
import AboutUs from "./AboutUs";
import Store from "./Store";
import LogIn from "./LogIn";
import CheckOut from "./CheckOut";
import MyOrders from "./MyOrders";
import ContactUs from "./ContactUs";
import DBMaintain from "./DBMaintain";
import SignUp from "./SignUp";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";

export default class App extends Component {
  state = {
    pageTitle: "Store",
  };
  render() {
    return (
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" exact element={<Store />} />
          <Route path="/about_us" exact element={<AboutUs />} />
          <Route path="/contact_us" exact element={<ContactUs />} />
          <Route path="/checkout" exact element={<CheckOut />} />
          <Route path="/sign_up" exact element={<SignUp />} />
          <Route path="/login" exact element={<LogIn />} />
          <Route path="/my_orders" exact element={<MyOrders />} />
          <Route path="/logout" exact element={<Store key={Date.now()} />} />
        </Routes>
      </BrowserRouter>
    );
  }
  getPageState = (pageName) => {
    if (pageName == "About") {
      return <AboutUs />;
    } else {
      if (pageName == "Store") {
        return <Store />;
      } else {
        return <MainContent />;
      }
    }
  };
}
