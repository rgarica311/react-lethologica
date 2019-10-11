import React, { Component } from 'react';
import LethologicaContext from '../LethologicaContext';

import './Suggestions.css';

export default class Suggestions extends Component {

  render() {
    return (
      <LethologicaContext.Consumer>
      {(context) => (
            <div className='suggestions' >
              {this.props.children}
                <div className='empty'></div>
            </div>
      )}
    </LethologicaContext.Consumer>
    );
  }
}
