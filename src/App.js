import React, { Component } from 'react';
import axios from 'axios';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import Map from './Map';
import SideNav from './SideNav';
import './App.css';

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
          name: 'Solfar',
          description: 'An amazing steel sculpture of a viking ship with a beautiful mountain backdrop.'
        },
        {
          name: 'Arbaejarsafn',
          description: 'An open air museum that consists of 20 old buildings to form a town square.'
        },
        {
          name: 'Tjornin',
          description: '"The Pond" in front of City Hall is a great place to take a beautiful strole.'
        },
        {
          name: 'Grotta',
          description: 'A lighthouse located on the island of Grótta.'
        }
      ],
      markers: [],
      center: [],
      zoom: 12,
      query: '',
      showPlaces: []
    }
  }

  componentDidMount() {
    // to-do: loop over the state.placesOfInterest and call the function
    // below for each iteration and set markers and center.
    for(let i = 0; i < this.state.placesOfInterest.length; i++) {
      let test = this.buildAPIQuery(this.state.placesOfInterest[i].name);
      axios.get(test)
        .then(response => {
          const data = response.data;
          const center = data.response.geocode.feature.geometry;
          const markers = {
            name: this.state.placesOfInterest[i].name,
            description: this.state.placesOfInterest[i].description,
            lat: data.response.venues[0].location.lat,
            lng: data.response.venues[0].location.lng,
            id: data.response.venues[0].id,
            markerVisability: true,
            listVisability: true
          };
          this.setState((prevState) => ({
            markers: prevState.markers.concat([markers]).sort(sortBy('name')),
            center: prevState.center.concat([center]),
            showPlaces: prevState.showPlaces.concat([markers]).sort(sortBy('name'))
          }))
        })
        .catch(error => {
          const marker = {
            name: 'Sorry! There was an error loading this place.',
            error: true,
            errorDes: error
          };
          this.setState((prevState) => ({
            markers: prevState.markers.concat([marker]).sort(sortBy('name')),
            showPlaces: prevState.markers.concat([marker]).sort(sortBy('name'))
          }))
        });
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
    this.setState((prevState) => ({
      markers: prevState.markers.map(marker => {
        marker.isInfoWindowOpen = false
        return marker
      }).sort(sortBy('name')),
      showPlaces: prevState.showPlaces.map(marker => {
        marker.isInfoWindowOpen = false
        return marker
      }).sort(sortBy('name'))
    }), () => {this.openInfoWindow(marker)})
  }

  openInfoWindow = (marker) => {
    if(!marker.prefix && !marker.suffix) {
      axios.get(`https://api.foursquare.com/v2/venues/${marker.id}/photos?client_id=YPAJHYCJSXBAHLEHXCY15QRWRWIAEULQCHSEWKQXPUJEH4B3&client_secret=DZMNN15ZJZBRRSC3WBHARPYRPAHKSJHU4MEJTJOLLB142S44&v=20181007`)
      .then(response => {
        marker.isInfoWindowOpen = true;
        marker.prefix = response.data.response.photos.items[0].prefix;
        marker.suffix = response.data.response.photos.items[0].suffix;
        this.setState((prevState) => ({
          showPlaces: prevState.showPlaces.filter((c) => c.id !== marker.id).concat([marker]).sort(sortBy('name')),
          markers: prevState.markers.filter((c) => c.id !== marker.id).concat([marker]).sort(sortBy('name'))
        }), () => console.log('setState prefix/suffix'));
      })
      .catch(error => {
        marker.error = true
        marker.errorDescription = error
        marker.isInfoWindowOpen = true
        this.setState((prevState) => ({
          showPlaces: prevState.showPlaces.filter((c) => c.id !== marker.id).concat([marker]).sort(sortBy('name')),
          markers: prevState.markers.filter((c) => c.id !== marker.id).concat([marker]).sort(sortBy('name'))
        }))
      });
    } else {
      marker.isInfoWindowOpen = true;
      this.setState((prevState) => ({
        showPlaces: prevState.showPlaces.filter((c) => c.id !== marker.id).concat([marker]).sort(sortBy('name')),
        markers: prevState.markers.filter((c) => c.id !== marker.id).concat([marker]).sort(sortBy('name'))
      }), () => console.log('using state data'));
    }
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() }, this.updateShowPlaces);
  }

  updateShowPlaces = () => {
    if(this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      this.setState({showPlaces: this.state.markers
        .filter((marker) => match.test(marker.name))
        .sort(sortBy('name'))})
    } else {
      this.setState((prevState) => ({
        showPlaces: prevState.markers.sort(sortBy('name'))
      }))
    }
  }

  render() {
    return (
      <section className="App">
        <header className="App-header">
          <h1>My Neighborhood Map</h1>
        </header>
        <nav className='list-nav'>
          <SideNav
            markers={this.state.showPlaces}
            changeActiveMarker={this.markerClicked}
            query={this.state.query}
            queryChanged={this.updateQuery}
          />
        </nav>
        <Map 
          {...this.state}
          markerClicked={this.markerClicked}
        />
      </section>
    );
  }
}

export default App;