import React, { Component } from "react";
import { isCompositeComponentWithType } from "react-dom/test-utils";
import Map from "./Map";
import { Link } from "react-router-dom";

export default class CheckOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        user_id: 222,
        user_name: "Fake Fake",
        user_phone: "4161234567",
        user_email: "fake@gmail.com",
        user_address: "123 Fake Ave, Toronto, ON",
        user_password: "pw",
      },
      customersCount: 5,
      couponApplied: false,
      items: [],
      confirmed: false,
      show_map: false,

      branch: "Eaton Centre",
      branches: {
        "Eaton Centre": { lat: 43.6544, lng: -79.3807 },
        "Hudson`s Bay": { lat: 43.671, lng: -79.3856 },
        "Bielnino Shopping Mall": { lat: 43.6714, lng: -79.395 },
      },
    };

    this.handleDate = this.handleDate.bind(this);
  }

  async componentDidMount() {
    var session = await fetch("http://localhost:4000/checksession", {
      method: "GET",
      credentials: "same-origin",
    });

    var session_data = await session.json();
    var u = session_data.user;
    var i = session_data.orderitems;
    console.log("STATE");
    console.log(u);
    this.setState({ user: u, items: i });
  }

  applyCoupon = () => {
    this.setState({ couponApplied: true });
  };

  totalOrder = (items, couponApplied) => {
    var total = 0.0;
    items.forEach((item) => (total += parseFloat(item.item_price)));
    if (total >= 100 && !couponApplied) {
      return (
        <div class="triple-block">
          <div class="field-block">
            <h2>Order Total: {total.toFixed(2)} CAD</h2>
          </div>
          <div class="field-block"></div>
          <div class="field-block">
            <button
              class="form-button"
              name="confirm-order"
              onClick={this.applyCoupon}
            >
              Apply Coupon!: 10% off all orders over $100
            </button>
          </div>
        </div>
      );
    }
    if (couponApplied) {
      return (
        <h2>Order Total: {(total * 0.9).toFixed(2)} CAD (Reduced by 10%)</h2>
      );
    }
    if (total < 100) {
      return <h2>Order Total: {total.toFixed(2)} CAD</h2>;
    }
  };

  show_map = (e) => {
    if (this.state.show_map) {
      this.setState({ show_map: false });
      this.setState({ show_map: true });
    } else {
      this.setState({ show_map: true });
    }
  };

  show_route(map) {
    const branch_selection = this.state.selectedValue;

    const branch_loc = this.state.branches.branch_selection;

    const user_address = this.state.user.user_address;

    console.log(map);

    var branch = this.state.branch;
    var branches = this.state.branches;

    var origin = branches[branch];

    console.log(origin);

    if (map) {
      return (
        <div id="map-container">
          <Map
            origin={{ lat: origin.lat, lng: origin.lng }}
            address={this.state.user.user_address}
          />
        </div>
      );
    } else {
      return <div id="map-container"></div>;
    }

    // if (document.querySelector("#map-container")) {
    //   document.querySelector("#map-container").remove();
    // }

    // document.querySelector(".checkout-main").appendChild(map_container);
  }

  getTrucks = async (e) => {
    e.preventDefault();
    var trip_id;
    var order_id;
    var truck_id;
    var total = 0.0;
    var order_items = this.state.items;
    order_items.forEach((item) => (total += parseFloat(item.item_price)));
    const response = await fetch("http://localhost:4000/get_trucks", {
      method: "GET",
      credentials: "same-origin",
    });
    var data = await response.json();
    console.log(data);
    var count = Object.keys(data).length;
    console.log(count);
    this.setState({ trucks: data });

    var available = await fetch("http://localhost:4000/available_trucks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: this.state.date.replace("T", " ").split(" ")[0],
        count: count,
        trucks: data,
      }),
    }).then((available) => available.json());

    console.log(available);

    if (available[0]) {
      truck_id = 2;
    } else {
      truck_id = 1;
    }

    var trip = await fetch("http://localhost:4000/schedule_truck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: this.state.date.replace("T", " ").split(" ")[0],
        truck: truck_id,
      }),
    });

    console.log(trip);

    var id = await fetch("http://localhost:4000/make_trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branch_loc: this.state.branch,
        address: this.state.user.user_address,
        truck: truck_id,
      }),
    }).then((id) => id.json());

    trip_id = id.insertId;

    var order = await fetch("http://localhost:4000/log_order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: this.state.date.replace("T", " ").split(" ")[0],
        total: total,
        user: this.state.user.user_id,
        trip: trip_id,
      }),
    }).then((order) => order.json());

    order_id = order.insertId;

    order_items.forEach(async (item) => {
      console.log(item.item_id);
      await fetch("http://localhost:4000/order_comp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: order_id,
          item: item.item_id,
          trucks: data,
        }),
      });
    });

    this.setState({ confirmed: true });
  };

  getConfirm = (c) => {
    console.log(c);
    if (c) {
      return (
        <p style={{ fontSize: 20 }}>
          Order Confirmed. Go to <Link to="/my_orders">My Orders</Link> to see
          details
        </p>
      );
    }
  };

  handleValueSelected = (event) => {
    console.log(event.target.value);
    this.setState({
      branch: event.target.value,
    });
  };

  handleDate = (d) => {
    console.log(d);
    this.setState({ date: d.target.value });
  };

  render() {
    return (
      <div class="checkout-main">
        <h2>Order Summary</h2>
        <div style={{ margin: "0 auto" }} class="items-container">
          {this.state.items.map((item) => {
            return (
              <div class="item" item_id={item.item_id} key={item.item_id}>
                <img src={`images/${item.item_image}`} draggable="false" />
                <div class="item-description">
                  <p>{item.item_name}</p>
                  <p>{item.item_price} CAD</p>
                </div>
              </div>
            );
          })}
        </div>
        {this.totalOrder(this.state.items, this.state.couponApplied)}

        <hr style={{ marginTop: 20, opacity: 0.2 }} />
        <h2 style={{ margin: "20 0" }}>Delivery Details</h2>
        <form
          style={{ width: "100%" }}
          class="sl-form"
          method="post"
          onSubmit={this.getTrucks}
        >
          <h3>Recipient</h3>
          <div class="triple-block">
            <div class="field-block">
              <label for="name">Name:</label>
              <input
                type="name"
                name="name"
                readOnly
                value={this.state.user.user_name}
              />
            </div>
            <div class="field-block">
              <label for="address">Address:</label>
              <input
                id="user-address"
                type="address"
                name="address"
                readOnly
                value={this.state.user.user_address}
              />
            </div>
            <div class="field-block">
              <label for="phone">Phone:</label>
              <input
                type="phone"
                name="phone"
                readOnly
                value={this.state.user.user_phone}
              />
            </div>
          </div>
          <div class="triple-block">
            <div class="field-block">
              <label for="deliverydatetime">Delivery Date and Time:</label>
              <input
                type="datetime-local"
                name="deliverydatetime"
                value={this.state.date}
                onChange={(e) => this.handleDate(e)}
                required
              />
            </div>
            <div class="field-block"></div>
            <div class="field-block"></div>
          </div>
          <h3>Payment information</h3>
          <div class="triple-block">
            <div class="field-block">
              <label for="ccn">Card Number:</label>
              <input
                name="ccn"
                type="tel"
                inputMode="numeric"
                pattern="[0-9\s]{13,19}"
                maxLength="19"
                placeholder="xxxx xxxx xxxx xxxx"
                onChange={this.handleCC}
                required
              />
            </div>
            <div class="field-block">
              <label for="exp">Expiry Date:</label>
              <input
                type="tel"
                inputMode="numeric"
                name="exp"
                placeholder="mm / yy"
                maxLength="7"
                required
              />
            </div>
            <div class="field-block">
              <label for="cvv">CVV:</label>
              <input
                type="password"
                inputMode="numeric"
                name="cvv"
                maxLength="3"
                placeholder="cvv"
                required
              />
            </div>
          </div>
          <div class="triple-block">
            <div class="field-block">
              <label for="deliver_from">Deliver From:</label>
              <select
                id="branch_selection"
                name="deliver_from"
                defaultValue={this.state.branch}
                onChange={this.handleValueSelected}
              >
                <option value="Eaton Centre" lat="43.6544" lng="-79.3807">
                  Eaton Center
                </option>
                <option value="Hudson`s Bay" lat="43.6710" lng="-79.3856">
                  Hudson's Bay
                </option>
                <option
                  value="Bielnino Shopping Mall"
                  lat="43.6714"
                  lng="-79.3950"
                >
                  Bielnino Shopping Mall
                </option>
              </select>
            </div>
            <div class="field-block">
              <button type="button" onClick={this.show_map} class="form-button">
                See Route
              </button>
            </div>
            <div class="field-block">
              <button class="form-button" name="confirm-order">
                Confirm Order
              </button>
            </div>
          </div>
        </form>
        {this.getConfirm(this.state.confirmed)}
        {this.show_route(this.state.show_map)}
      </div>
    );
  }
}

// <?php require 'config.php' ?>

// <!DOCTYPE html>
// <html lang="en">

// <head>
//   <?php include './components/headers.php' ?>
//   <title>SOKO | Checkout</title>
//   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRgMvD0tUbsGv6Gn6yedurKxGLc_Hh21I&libraries=places,directions"></script>
// </head>

// <body>
//   <?php include './components/navbar.php' ?>

//   <?php
//   echo "<div class='checkout-main'>";

//   if (isset($_POST["order_items"])) {

//     echo "<h2>Order Summary</h2>";

//     $_SESSION["last_order"] = $_POST["order_items"];

//     $query = "SELECT * FROM item WHERE ";
//     foreach ($_POST["order_items"] as $key => $order_item) {
//       if ($key === array_key_last($_POST["order_items"])) {
//         $query = $query . "item_id = '" . $order_item . "'";
//       } else {
//         $query = $query . "item_id = '" . $order_item . "' OR ";
//       }
//     }

//     $items_in_order = mysqli_query($conn, $query);
//     $order_total = 0;

//     $user_email = $_SESSION["account"];
//     $user_info_query = "SELECT user_name, user_address, user_phone FROM user WHERE user_email = '$user_email'";
//     $user_info =  mysqli_fetch_assoc(mysqli_query($conn, $user_info_query));

//     echo "<div style='margin: 0 auto;' class='items-container'>";

//     while ($row = $items_in_order->fetch_assoc()) {
//       echo "
//         <div class='item' item_id='" . $row["item_id"] . "'>
//           <img src='images/" . $row["item_image"] . " ' draggable='false'>
//           <div class='item-description'>
//             <p>" . $row["item_name"] . "</p>
//             <p>" . $row["item_price"] . " CAD</p>
//           </div>
//         </div>
//       ";
//       $order_total = $order_total + $row["item_price"];
//     }

//     $_SESSION["last_order_total"] = $order_total;

//     echo "</div>";

//     echo "<h2>Order Total: " . number_format($order_total, 2, '.', '') . " CAD</h2>";

//     echo "<hr style='margin-top: 20px; opacity: .2'>";

//     echo "<h2 style='margin: 20px 0;'>Delivery Details</h2>";

//     echo "
//       <form style='width: 100%;' class='sl-form' action='' method='post'>
//         <h3>Recepient</h3>
//         <div class='triple-block'>
//           <div class='field-block'>
//             <label for='name'>Name:</label>
//             <input type='name' name='name' readOnly value='" . $user_info["user_name"] . "'>
//           </div>
//           <div class='field-block'>
//             <label for='address'>Address:</label>
//             <input id='user-address' type='address' name='address' readOnly value='" . $user_info["user_address"] . "'>
//           </div>
//           <div class='field-block'>
//             <label for='phone'>Phone:</label>
//             <input type='phone' name='phone' readOnly value='" . $user_info["user_phone"] . "'>
//           </div>
//         </div>
//         <div class='triple-block'>
//           <div class='field-block'>
//             <label for='deliverydatetime'>Delivery Date and Time:</label>
//             <input type='datetime-local' name='deliverydatetime' required>
//           </div>
//           <div class='field-block'>
//           </div>
//           <div class='field-block'>
//           </div>
//         </div>
//         <h3>Payment information</h3>
//         <div class='triple-block'>
//           <div class='field-block'>
//             <label for='ccn'>Card Number:</label>
//             <input name='ccn' type='tel' inputMode='numeric' pattern='[0-9\s]{13,19}' maxLength='19' placeholder='xxxx xxxx xxxx xxxx' required>
//           </div>
//           <div class='field-block'>
//             <label for='exp'>Expiry Date:</label>
//             <input type='tel' inputMode='numeric' name='exp' placeholder='mm / yy' maxLength='7' required>
//           </div>
//           <div class='field-block'>
//             <label for='cvv'>CVV:</label>
//             <input type='password' inputMode='numeric' name='cvv' maxLength='3' placeholder='cvv' required>
//           </div>
//         </div>
//         <div class='triple-block'>
//           <div class='field-block'>
//             <label for='deliver_from'>Deliver From:</label>
//             <select id='branch_selection' name='deliver_from'>
//               <option value='Eaton Center' lat='43.6544' lng='-79.3807'>Eaton Center</option>
//               <option value='Hudson`s Bay' lat='43.6710' lng='-79.3856'>Hudson's Bay</option>
//               <option value='Bielnino Shopping Mall' lat='43.6714' lng='-79.3950'>Bielnino Shopping Mall</option>
//             </select>
//           </div>
//           <div class='field-block'>
//             <button type='button' onClick='show_route()' class='form-button'>See Route</button>
//           </div>
//           <div class='field-block'>
//             <button class='form-button' name='confirm-order'>Confirm Order</button>
//           </div>
//         </div>
//       </form>
//     ";
//   } elseif (isset($_POST["confirm-order"])){
//     $user_acc = $_SESSION["account"];
//     $order_items = $_SESSION["last_order"];
//     $order_total = $_SESSION["last_order_total"];
//     $user_address = $_POST["address"];
//     $branch_loc = $_POST["deliver_from"];
//     $delivery_schedule_time = date("Y-m-d H:i:s",strtotime($_POST["deliverydatetime"]));

//     $get_trucks_query = "SELECT * FROM truck";
//     $truck_list = mysqli_query($conn, $get_trucks_query);

//     foreach ($truck_list as $truck_info) {
//       $truck_id = $truck_info["truck_id"];
//       $truck_availability = mysqli_query($conn, "SELECT * FROM truck_unavailable WHERE truck_id = '$truck_id' AND date_unavailable = '$delivery_schedule_time' ");
//       if (mysqli_num_rows($truck_availability) == 0) {
//         $book_truck_query = "INSERT INTO truck_unavailable (date_unavailable, truck_id) VALUES ('$delivery_schedule_time', '$truck_id')";
//         mysqli_query($conn, $book_truck_query);
//         break;
//       }
//     }

//     $create_trip_query = "INSERT INTO trip (trip_origin, trip_destination, truck_id) VALUES ('$branch_loc', '$user_address', '$truck_id')";
//     mysqli_query($conn, $create_trip_query);

//     $trip_id = mysqli_insert_id($conn);

//     $get_user_id_query = "SELECT * FROM user WHERE user_email = '$user_acc'";
//     $curr_user_id = mysqli_fetch_assoc(mysqli_query($conn, $get_user_id_query))["user_id"];

//     $curr_time = date('Y-m-d H:i:s');

//     $order_status = 1;

//     $create_order_query = "INSERT INTO `order` (date_issued, date_scheduled, order_price, user_id, trip_id, order_status) VALUES ('$curr_time', '$delivery_schedule_time', '$order_total', '$curr_user_id', '$trip_id', '$order_status');";
//     mysqli_query($conn, $create_order_query);
//     $order_id = mysqli_insert_id($conn);

//     foreach ($order_items as $order_item_id) {
//       mysqli_query($conn, "INSERT INTO order_components (order_id, item_id) VALUES ('$order_id', '$order_item_id')");
//     }

//     echo "<p style='font-size: 20px;'>Order Confirmed. Go to <a href='my_orders.php'>My Orders</a> to see details</p>";
//   } else {
//     echo "<p style='font-size: 20px;'>Your cart is empty</p>";
//   }

//   echo "</div>";
//   ?>
// </body>
// <script>
//   const get_address_loc = address => {
//     return new Promise((resolve, resject) => {
//       const geocoder = new google.maps.Geocoder()
//       geocoder.geocode({
//         address: address
//       }, (results, status) => {
//         if (status === 'OK') {
//           resolve(results[0].geometry.location);
//         } else {
//           reject(status)
//         }
//       })
//     })
//   }

//   const show_route = async () => {

//     const branch_selector = document.querySelector('#branch_selection')
//     const branch_selection = branch_selector.selectedIndex

//     const branch_loc = {
//       lat: parseFloat(branch_selector[branch_selection].getAttribute('lat')),
//       lng: parseFloat(branch_selector[branch_selection].getAttribute('lng'))
//     }

//     const map_container = document.createElement('div')
//     map_container.setAttribute('id', 'map-container')

//     const user_address = document.querySelector('#user-address').getAttribute('value')

//     let user_address_loc = await get_address_loc(user_address)

//     map = new google.maps.Map(map_container, {
//       center: {
//         lat: 43.6532,
//         lng: -79.3832
//       },
//       zoom: 8,
//     })

//     directionsService = new google.maps.DirectionsService()
//     directionsDisplay = new google.maps.DirectionsRenderer()
//     directionsDisplay.setMap(map)

//     directionsService.route({
//       origin: branch_loc,
//       destination: user_address_loc,
//       travelMode: google.maps.TravelMode.DRIVING
//     }, (response, status) => {
//       if (status === 'OK') {
//         directionsDisplay.setDirections(response);
//       }
//     })

//     if (document.querySelector('#map-container')) {
//       document.querySelector('#map-container').remove()
//     }

//     document.querySelector('.checkout-main').appendChild(map_container)
//   }
// </script>

// </html>
