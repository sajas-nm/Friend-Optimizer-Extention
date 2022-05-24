import React, { Component } from 'react';
import './Options.css';
import AppComponent from '../../containers/App/App';

class Options extends Component {
  render() {
    return (
      <div>
        <AppComponent view={'options'} />
      </div>
    );
  }
}

export default Options;
