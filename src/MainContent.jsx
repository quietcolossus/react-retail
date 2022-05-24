import React, { Component } from "react";

export default class MainContent extends Component {
  state = {
    pageTitle: "Customers",
    customersCount: 5,
    customers: [
      { id: 1, name: "Scott", phone: "123-456", address: { city: "Toronto" } },
      { id: 2, name: "Zhanna", phone: null, address: { city: "Toronto" } },
      { id: 3, name: "Colin", phone: "123-456", address: { city: "Toronto" } },
    ],
  };

  render() {
    return (
      <div>
        <h4>
          {this.state.pageTitle}
          <span>{this.state.customersCount}</span>
          <button onClick={this.onRefreshClick}>Refresh</button>
        </h4>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {this.state.customers.map((cust) => {
              return (
                <tr key={cust.id}>
                  <td>{cust.id}</td>
                  <td>{cust.name}</td>
                  <td>{cust.phone == null ? "No Phone" : cust.phone}</td>
                  <td>{cust.address.city}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  //Executes when the user clicks on Refresh button
  onRefreshClick = () => {
    this.setState({
      customersCount: 7,
    });
    console.log("Refresh clicked");
  };

  componentDidMount() {
    // Simple GET request using fetch
    fetch("http://localhost:3000/item")
      .then((response) => response.json())
      .then((data) => this.setState({ totalReactPackages: data.total }));
  }
}
