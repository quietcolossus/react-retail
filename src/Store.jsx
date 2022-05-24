import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Store extends Component {
  state = {
    user: null,
    customersCount: 5,
    items: [],
  };

  async componentDidMount() {
    const response = await fetch("http://localhost:4000/item", {
      method: "GET",
      credentials: "same-origin",
    });
    const data = await response.json();
    this.setState({ items: data });

    var session = await fetch("http://localhost:4000/checksession", {
      method: "GET",
      credentials: "same-origin",
    });
    console.log(session);
    var session_data = await session.json();
    var u = session_data.user;
    console.log("STATE");
    console.log(u);
    this.setState({ user: u });
  }

  render() {
    return (
      <main class="main">
        <div
          className="items-container"
          style={{
            margin: this.state.pageTitle == "LoggedIn" ? "0" : "0 auto",
          }}
          onDragOver={this.dragover}
        >
          {this.state.items.map((item) => {
            return (
              <div
                className="item draggable"
                draggable="true"
                item_id={item.item_id}
                key={item.item_id}
                onDragStart={this.dragstart}
                onDragEnd={this.dragend}
              >
                <img src={`images/${item.item_image}`} draggable="false" />
                <div className="item-description">
                  <p>{item.item_name}</p>
                  <p>{item.item_price} CAD</p>
                </div>
              </div>
            );
          })}
        </div>

        {this.showCart(this.state.user)}
      </main>
    );
  }

  showCart = (user) => {
    if (!(user == null))
      return (
        <div className="cart">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 40,
              justifyContent: "space-between",
            }}
          >
            <h2>Cart</h2>
            <button
              id="checkout-btn"
              style={{
                background: "none",
                border: "none",
                height: 25,
                marginLeft: 20,
                marginTop: 5,
                cursor: "pointer",
              }}
              className="main-button"
              onClick={this.checkout}
            >
              Checkout
            </button>
          </div>
          <div className="cart-item-container" onDragOver={this.dragover}></div>
        </div>
      );
  };

  goToCheckout() {
    window.location.href = "/checkout";
  }

  checkout = (e) => {
    var cart_items = document.querySelectorAll(".cart-item-container .item");
    var array = [];
    cart_items.forEach((item) => {
      array.push(item.getAttribute("item_id"));
    });

    console.log(array);

    fetch("http://localhost:4000/db_checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        items: array,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result[0]) {
          alert("Moving to checkout.");
          this.goToCheckout();
        } else {
          alert("Your cart is empty");
        }
      });
  };

  handleSubmit = (e) => {
    console.log(this.state.email);
    console.log(this.state.password);
    e.preventDefault();
    fetch("http://localhost:4000/db_checkout", {
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
          alert("Moving to checkout.");
          this.goToMain();
        } else {
          alert("Your cart is empty");
        }
      });
  };

  dragstart(e) {
    const cart = document.querySelector(".cart");
    e.currentTarget.classList.add("dragging");

    cart.classList.add("accepting-draggables");
  }

  dragend(e) {
    const cart = document.querySelector(".cart");
    e.currentTarget.draggable.classList.remove("dragging");

    cart.classList.remove("accepting-draggables");
  }

  dragover(e) {
    e.preventDefault();
    const draggable = document.querySelector(".dragging");
    e.currentTarget.appendChild(draggable);
  }
}

// {
//     <!DOCTYPE html>
//     <html lang="en">

//     <head>
//       <?php include './components/headers.php' ?>
//       <title>SOKO | Home</title>
//     </head>

//     <body>
//       <?php include './components/navbar.php' ?>

//       <?php
//       $query = "SELECT * FROM item";
//       $result = mysqli_query($conn, $query);

//       $logged_in = isset($_SESSION["account"]);

//       echo "<main class='main'>";

//       if ($logged_in) {
//         echo "<div class='items-container'>";
//       } else {
//         echo "<div style='margin: 0 auto;' class='items-container'>";
//       }

//       while ($row = $result->fetch_assoc()) {
//         echo "
//             <div class='item draggable' draggable='true' item_id='" . $row["item_id"] . "'>
//               <img src='images/" . $row["item_image"] . " ' draggable='false'>
//               <div class='item-description'>
//                 <p>" . $row["item_name"] . "</p>
//                 <p>" . $row["item_price"] . " CAD</p>
//               </div>
//             </div>
//           ";
//       }

//       echo "</div>";

//       if ($logged_in) {
//         echo "
//             <div class='cart'>
//               <div style='display: flex; align-items: center; margin-bottom: 40px; justify-content: space-between;'>
//                 <h2>Cart</h2>
//                 <button id='checkout-btn' style='background: none; border: none; height: 25px; margin-left: 20px; margin-top: 5px; cursor: pointer;' class='main-button'>Checkout</button>
//               </div>
//               <div class='cart-item-container'>

//               </div>
//             </div>
//           ";
//       }

//       echo "</main>";
//       ?>

//     </body>

//     <script>
//       const draggables = document.querySelectorAll('.draggable')
//       const catalogue = document.querySelector('.items-container')
//       const cart = document.querySelector('.cart')
//       const cart_item_container = document.querySelector('.cart-item-container')

//       if (cart) {
//         draggables.forEach(draggable => {
//           draggable.addEventListener('dragstart', () => {
//             draggable.classList.add('dragging')

//             cart.classList.add('accepting-draggables')
//           })

//           draggable.addEventListener('dragend', () => {
//             draggable.classList.remove('dragging')

//             cart.classList.remove('accepting-draggables')
//           })
//         })

//         catalogue.addEventListener('dragover', e => {
//             e.preventDefault()
//             const draggable = document.querySelector('.dragging')
//             catalogue.appendChild(draggable)
//         })

//         cart_item_container.addEventListener('dragover', e => {
//             e.preventDefault()
//             const draggable = document.querySelector('.dragging')
//             cart_item_container.appendChild(draggable)
//         })

//       }
//     </script>

//     <script>
//       checkoutbtn = document.getElementById("checkout-btn")

//       checkoutbtn.addEventListener('click', () => {
//         cart_items = document.querySelectorAll('.cart-item-container .item')

//         order_items = []

//         const form = document.createElement('form')
//         form.method = 'post'
//         form.action = 'checkout.php'

//         let idx = 0
//         cart_items.forEach((item) => {
//           const hiddenInput = document.createElement('input')
//           hiddenInput.type = 'hidden'
//           hiddenInput.name = `order_items[${idx}]`
//           hiddenInput.value = item.getAttribute('item_id')

//           form.appendChild(hiddenInput)

//           idx++;
//         })

//         document.body.appendChild(form)
//         form.submit()

//       })
//     </script>

//     </html>
