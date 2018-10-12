import React, { Component } from 'react';

class SideNav extends Component {
  render() {
    return (
      <div className='nav'>
        <ul className='nav-list'>
          {this.props.markers.map((marker, index) => {
            return <li className='list-item' key={index}><h4 className='place-name'>{marker.name}</h4></li>
          })}
        </ul>
      </div>
    )
  }
}

export default SideNav