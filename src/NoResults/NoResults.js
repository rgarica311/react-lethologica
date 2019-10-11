import React, { Component } from 'react';
import './NoResults.css';
import LethologicaContext from '../LethologicaContext';

export default class NoResults extends Component {


  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {

    return (
      <LethologicaContext.Consumer>
      {
        (context) => (
        console.log('render no results running context.filmResults', context.filmResults),

        context.show === true && context.actors === undefined
          ?<div className='no-results-modal'>
            <span>Sorry, it looks like the search field may have been empty.</span>
            <span>Try a different search!</span>
            <button onClick={e => {
              this.onClose(e);
            }}>Close</button>
          </div>
          : context.show === true && context.specialCharCheck === true
              ?<div className='no-results-modal'>
                <span>Sorry, no special characters allowed.</span>
                <span>Try a different search!</span>
                <button onClick={e => {
                  this.onClose(e);
                }}>Close</button>
              </div>
              : context.show === true && context.actors === ""
                  ? <div className='no-results-modal'>
                    <span>Sorry, it looks like the search field may have been empty.</span>
                    <span>Try a different search!</span>
                    <button onClick={e => {
                      this.onClose(e);
                    }}>Close</button>
                  </div>
                  : context.show === true && context.filmResults === null
                      ? <div className='no-results-modal'>
                        <span>Sorry, those names don't seem to share any credits.</span>
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
