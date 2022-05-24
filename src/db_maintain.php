<?php
require 'config.php'
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <?php include './components/headers.php' ?>
  <title>SOKO | Database Maintain</title>
</head>

<body>
  <?php include './components/navbar.php' ?>
    <div class="dead-center-div">
    <form class="db-form" action="" method="post" autocomplete="off">
        <h2>Database Maintain Mode</h2>

        <div class="input-block">
            <h3>Choose an action:</h3>
            <select name="action" id="action">
                <option value="insert">Insert</option>
                <option value="delete">Delete</option>
                <option value="select">Select</option>
                <option value="update">Update</option>
            </select>
        </div>

        <div class="input-block">
            <h3>Select table:</h3> 
            <input type="radio" id="user" name="select-table" value="user">
            <label for="user">User</label><br>
            <input type="radio" id="item" name="select-table" value="item">
            <label for="item">Item</label><br>
            <input type="radio" id="trip" name="select-table" value="trip">
            <label for="trip">Trip</label><br>
            <input type="radio" id="order" name="select-table" value="order">
            <label for="order">Order</label><br>
            <input type="radio" id="list-of-orders" name="select-table" value="order">
            <label for="list-of-orders">List of orders</label><br>
            <input type="radio" id="truck" name="select-table" value="truck">
            <label for="truck">Truck</label><br>
            <input type="radio" id="truck-unavailable" name="select-table" value="truck-unavailable">
            <label for="truck-unavailable">Truck unavailable</label><br>
        </div>

      <div class="form-action">
        <input class="main-button" type="submit" name="proceed" value="Proceed">
      </div>
    </form>
  </div>

</body>

</html>

<?php


if (isset($_POST["Proceed"])) {
    $table = $_POST["select-table"];
    $sql = "SELECT * FROM User";
    if ($table == "user") {$sql = "SELECT * FROM User";}
    else if ($table == "item") {$sql = "SELECT * FROM Item";}
    else if ($table == "trip") {$sql = "SELECT * FROM Trip";}
    else if ($table == "truck") {$sql = "SELECT * FROM Truck";}
    else if ($table == "order") {$sql = "SELECT * FROM Order";}
    else if ($table == "list-of-orders") {$sql = "SELECT * FROM List_of_orders";}
    else if ($table == "truck-unavailable") {$sql = "SELECT * FROM Truck_unavailable";}


    echo "<table border='1'>
    <tr>
    <th>Firstname</th>
    <th>Lastname</th>
    </tr>";

    while($row = mysqli_fetch_array($sql))
    {
    echo "<tr>";
    echo "<td>" . $row['FirstName'] . "</td>";
    echo "<td>" . $row['LastName'] . "</td>";
    echo "</tr>";
    }
    echo "</table>";
}
?>
