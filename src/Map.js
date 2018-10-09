import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={14}
    zoom={props.zoom}
    defaultCenter={{ lat: 64.1466, lng: -21.9426 }}
  >
    {props.markers && props.markers.filter(marker => marker.markerVisability).map((marker, index) => (
      <Marker
        key={index}
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={() => props.markerClicked(marker)}
      >
        {marker.isInfoWindowOpen && (
          <InfoWindow>
            <p>You clicked on an InfoWindow!</p>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
));

class Map extends Component {
  render() {
    return (
      <MyMapComponent
        {...this.props}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAKvpuYGtcN7erv_7CY1ZGWtOxXpqysZxs&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} className='loadingElement' />}
        containerElement={<section style={{ height: `100%` }} className='containerElement' />}
        mapElement={<div style={{ height: `100%` }} className='mapElement' role='application' />}
      />
    )
  }
}

export default Map;