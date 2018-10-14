import React, { Component } from 'react';

class SideNav extends Component {

  render() {
    return (
      <div className='nav'>
        <input
          className='search-places'
          type='text'
          value={this.props.query}
          onChange={event => this.props.queryChanged(event.target.value)}
          placeholder='Filter places...'
        />
        <ul className='nav-list'>
          {this.props.markers.map((marker, index) => {
            if(marker.error) {
              return <li className='error-list-item' key={index}><p className='error-place-name'>{marker.name}</p></li>
             } else {
              return <li className='list-item' key={index} onClick={() => this.props.changeActiveMarker(marker)}><h4 className='place-name'>{marker.name}</h4></li>
             }
            })}
        </ul>
      </div>
    )
  }
}

export default SideNav