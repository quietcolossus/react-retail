import React, { Component } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 43.6532,
  lng: -79.3832,
};

const google = window.google;

export default class MapContainer extends Component {
  state = {
    directions: null,
  };

  componentDidMount() {
    const directionsService = new google.maps.DirectionsService();

    const origin = { lat: 6.5244, lng: 3.3792 };
    const destination = { lat: 6.4667, lng: 3.45 };

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: [
          {
            location: new google.maps.LatLng(6.4698, 3.5852),
          },
          {
            location: new google.maps.LatLngBounds(6.6018, 3.3515),
          },
        ],
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(result);
          this.setState({
            directions: result,
          });
          console.log(this.state.directions);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  render() {
    return (
      <LoadScript googleMapsApiKey="AIzaSyBRgMvD0tUbsGv6Gn6yedurKxGLc_Hh21I">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
          <DirectionsRenderer directions={this.state.directions} />
        </GoogleMap>
      </LoadScript>
    );
  }
}

/*{ <script>
  const get_address_loc = address => {
    return new Promise((resolve, resject) => {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({
        address: address
      }, (results, status) => {
        if (status === 'OK') {
          resolve(results[0].geometry.location);
        } else {
          reject(status)
        }
      })
    })
  }

  const show_route = async () => {

    const branch_selector = document.querySelector('#branch_selection')
    const branch_selection = branch_selector.selectedIndex

    const branch_loc = {
      lat: parseFloat(branch_selector[branch_selection].getAttribute('lat')),
      lng: parseFloat(branch_selector[branch_selection].getAttribute('lng'))
    }

    const map_container = document.createElement('div')
    map_container.setAttribute('id', 'map-container')

    const user_address = document.querySelector('#user-address').getAttribute('value')

    let user_address_loc = await get_address_loc(user_address)

    map = new google.maps.Map(map_container, {
      center: {
        lat: 43.6532,
        lng: -79.3832
      },
      zoom: 8,
    })

    directionsService = new google.maps.DirectionsService()
    directionsDisplay = new google.maps.DirectionsRenderer()
    directionsDisplay.setMap(map)

    directionsService.route({
      origin: branch_loc,
      destination: user_address_loc,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      }
    })


    if (document.querySelector('#map-container')) {
      document.querySelector('#map-container').remove()
    }

    document.querySelector('.checkout-main').appendChild(map_container)
  }
</script> */
