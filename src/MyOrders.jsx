import React, { Component } from "react";

export default class MyOrders extends Component {
  state = {
    user: {},
    customersCount: 5,
    orders: [],
    order_items: [],
    items: [],
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

    console.log(u);

    const items = await fetch("http://localhost:4000/item", {
      method: "GET",
      credentials: "same-origin",
    });
    console.log(items);
    const data = await items.json();

    console.log(data);
    this.setState({ items: data });

    var orders = await fetch("http://localhost:4000/my_orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: u.user_id,
      }),
    }).then((orders) => orders.json());

    this.setState({ orders: orders });

    var oi = [];

    orders.forEach(async (order) => {
      var order_items = await fetch("http://localhost:4000/order_items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: order.order_id,
        }),
      }).then((order_items) => order_items.json());
      order_items.forEach(async (order_item) => {
        var item_detail = await fetch("http://localhost:4000/item_detail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            item_id: order_item.item_id,
          }),
        }).then((item_detail) => item_detail.json());
        oi.push(item_detail);
      });
    });

    this.setState({ order_items: oi });

    console.log(this.state.order_items);

    console.log(orders);
  }
  showorders = (items, orders) => {
    orders.forEach((order) => console.log(order));
  };

  update = () => {
    this.setState({ update: true });
    return <p></p>;
  };

  render() {
    return (
      <div className="orders-container">
        <h2 style={{ marginBottom: 40 }}>My Orders</h2>
        {this.state.orders.map((order) => {
          return (
            <div className="order-container" key={order.order_id}>
              <h3>Order # {order.order_id}</h3>
              <div style={{ margin: 0 }} className="items-container">
                {this.state.order_items.map((item) => {
                  return (
                    <div className="item" key={item.item_id}>
                      <div className="item-description">
                        <p>{item.item_name}</p>
                        <p>{item.item_price} CAD</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div class="order-info">
                <div>
                  <h4>Date Issued:</h4>
                  <p>{order.date_issued}</p>
                </div>
                <div>
                  <h4>Date Scheduled:</h4>
                  <p>{order.date_scheduled}</p>
                </div>
                <div>
                  <h4>Order Price:</h4>
                  <p>{order.order_price}</p>
                </div>
              </div>
            </div>
          );
        })}
        {this.update}
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
