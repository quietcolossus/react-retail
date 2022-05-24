const get_address_loc = (address) => {
  return new Promise((resolve, resject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        address: address,
      },
      (results, status) => {
        if (status === "OK") {
          resolve(results[0].geometry.location);
        } else {
          reject(status);
        }
      }
    );
  });
};

const show_route = async () => {
  const branch_selector = document.querySelector("#branch_selection");
  const branch_selection = branch_selector.selectedIndex;

  const branch_loc = {
    lat: parseFloat(branch_selector[branch_selection].getAttribute("lat")),
    lng: parseFloat(branch_selector[branch_selection].getAttribute("lng")),
  };

  const map_container = document.createElement("div");
  map_container.setAttribute("id", "map-container");

  const user_address = document
    .querySelector("#user-address")
    .getAttribute("value");

  let user_address_loc = await get_address_loc(user_address);

  map = new google.maps.Map(map_container, {
    center: {
      lat: 43.6532,
      lng: -79.3832,
    },
    zoom: 8,
  });

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  directionsService.route(
    {
      origin: branch_loc,
      destination: user_address_loc,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsDisplay.setDirections(response);
      }
    }
  );

  if (document.querySelector("#map-container")) {
    document.querySelector("#map-container").remove();
  }

  document.querySelector(".checkout-main").appendChild(map_container);
};
