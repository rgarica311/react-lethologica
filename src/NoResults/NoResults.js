import React, { Component } from 'react';
import './NoResults.css';
import LethologicaContext from '../LethologicaContext';

export default class NoResults extends Component {


  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    console.log('render no results running')

    return (
      <LethologicaContext.Consumer>
      {
        (context) => (
        context.show === true
          ?<div className='no-results-modal'>
            <span>Sorry, it looks like those actors haven't been in anything together.</span>
            <span>Try a different search!</span>
            <button onClick={e => {
              this.onClose(e);
            }}>Close</button>
          </div>
          : null
      )}
      </LethologicaContext.Consumer>
    );
  }
}
