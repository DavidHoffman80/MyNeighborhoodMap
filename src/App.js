import React, { Component } from 'react';
import axios from 'axios';
import Map from './Map';
import './App.css';

export class App extends Component {

  state = {
    placesOfInterest: [
      {
        name: 'CCP',
        description: 'The main office of CCP games in Reykjavik, Iceland.'
      },
      {
        name: 'Hallgrimskirkja',
        description: 'A beautiful modern cathedral in Reykjavik, Iceland.'
      },
      {
        name: 'Harpa',
        description: 'The Epal Harpa music hall and conference center is home to the national opera and symphony.'
      },
      {
        name: 'Sólfarið',
        description: 'An amazing steel sculpture of a viking ship with a beautiful mountain backdrop.'
      },
      {
        name: 'Árbæjarsafn',
        description: 'An open air museum that consists of 20 old buildings to form a town square.'
      },
      {
        name: 'Tjörnin',
        description: '"The Pond" in front of City Hall is a great place to take a beautiful strole.'
      },
      {
        name: 'Grótta',
        description: 'A lighthouse located on the island of Grótta.'
      }
    ],
    markers: [],
    center: [],
    zoom: 12
  }

  componentDidMount() {
    // to-do: loop over the state.placesOfInterest and call the function
    // below for each iteration and set markers and center.
    for(let i = 0; i < this.state.placesOfInterest.length ; i++) {
      let test = this.buildAPIQuery(this.state.placesOfInterest[i].name);
      axios.get(test)
        .then(response => {
          const data = response.data;
          const center = data.response.geocode.feature.geometry;
          const markers = {
            lat: data.response.venues[0].location.lat,
            lng: data.response.venues[0].location.lng,
            isInfoWindowOpen: false,
            markerVisability: true
          };
          this.setState((prevState) => {
            prevState.center.push(center);
            prevState.markers.push(markers);
          });
        })
        .catch(error => console.log(error));
    }
  }

  buildAPIQuery(queryString) {
    let APIElements = {
      base: 'https://api.foursquare.com/v2/venues/search?',
      keys: {
        client_id: 'YPAJHYCJSXBAHLEHXCY15QRWRWIAEULQCHSEWKQXPUJEH4B3',
        client_secret: 'DZMNN15ZJZBRRSC3WBHARPYRPAHKSJHU4MEJTJOLLB142S44',
        v: '20181007',
        near: 'Reykjavik,IS',
        query: queryString
      }
    };
    let idSection = Object.keys(APIElements.keys).map(key => `${key}=${APIElements.keys[key]}`).join('&');
    let totalAPI = `${APIElements.base}${idSection}`;
    return totalAPI;
  }

  markerClicked = (marker) => {
    // lets close all of the markers first
    this.closeAllInfoWindows();
    marker.isInfoWindowOpen = true;
    this.setState((prevState) => {
      markers: this.filterMarkers(prevState, marker).push(marker)
    }, console.log(this.state));
    
    // marker.isInfoWindowOpen = true;
    // this.setState({ markers: Object.assign(this.state.markers, marker) });
  }

  closeAllInfoWindows = () => {
    this.setState((prevState) => {
      markers: prevState.markers.map(marker => marker.isInfoWindowOpen = false);
    });
  }

  filterMarkers = (prevState, marker) => {
    let filteredResults = prevState.markers.filter(mark => mark.lat !== marker.lat);
    return filteredResults;
  }

  render() {
    return (
      <section className="App">
        <header className="App-header">
          <h1>My Neighborhood Map</h1>
        </header>
        <nav className='list-nav'></nav>
        <Map 
          {...this.state}
          markerClicked={this.markerClicked}
        />
      </section>
    );
  }
}

export default App;