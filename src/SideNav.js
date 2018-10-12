import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

class SideNav extends Component {

  state = {
    query: ''
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  render() {

    let showingPlaces;
    if(this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      showingPlaces = this.props.markers.filter((marker) => match.test(marker.name));
    } else {
      showingPlaces = this.props.markers;
    }

    showingPlaces.sort(sortBy('name'))

    return (
      <div className='nav'>
        <input
          className='search-places'
          type='text'
          value={this.state.query}
          onChange={event => this.updateQuery(event.target.value)}
          placeholder='Filter places...'
        />
        <ul className='nav-list'>
          {showingPlaces.map((marker, index) => (
            <li className='list-item' key={index} onClick={() => this.props.changeActiveMarker(marker)}>
              <h4 className='place-name'>{marker.name}</h4>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default SideNav