import React, { Fragment } from "react";
import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  DirectionsRenderer,
} from "react-google-maps";
import { withProps, compose, lifecycle } from "recompose";
import Geocode from "react-geocode";

const google = window.google;

Geocode.setApiKey("AIzaSyBRgMvD0tUbsGv6Gn6yedurKxGLc_Hh21I");
Geocode.setLanguage("en");

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBRgMvD0tUbsGv6Gn6yedurKxGLc_Hh21I&libraries=places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService();

      console.log(this.props.origin);

      var destination = Geocode.fromAddress(this.props.address).then(
        async (destination) => {
          destination = await destination.results[0].geometry.location;
          DirectionsService.route(
            {
              origin: this.props.origin,
              destination: new google.maps.LatLng(destination),
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                  directions: result,
                });
              } else {
                console.error(`error fetching directions ${result}`);
              }
            }
          );
        },
        (error) => {
          console.error(error);
        }
      );

      console.log(destination);
    },
  })
)((props) => (
  <Fragment>
    <p>{props.origin.lat}</p>
    <GoogleMap
      defaultZoom={10}
      defaultCenter={new google.maps.LatLng(43.6532, -79.3832)}
    >
      {props.directions && <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
  </Fragment>
));

export default class Map extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MapWithADirectionsRenderer
          origin={this.props.origin}
          address={this.props.address}
        />
      </React.Fragment>
    );
  }
}
