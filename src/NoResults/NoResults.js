import React, { Component } from 'react';
import './NoResults.css';
import LethologicaContext from '../LethologicaContext';

export default class NoResults extends Component{

  onClose = e => {
    this.props.onClose && this.props.onClose( e );
  };

  render() {
    return (
      <LethologicaContext.Consumer>
        {
          ( context ) => (
            console.log(`context.filmsWithActors: ${context.filmsWithActors}`),
            context.actors === null || context.actors === undefined
              ? context.show === true
                  ? <div className='no-results-modal'>
                      <span>Input field is empty.</span>
                      <span>Try again. Search for Martin Short and Kurt Russel</span>
                      <button onClick={e => {
                        this.onClose( e );
                      }}
                      > Close </button>
                    </div>
                    : null
                : context.specialCharCheck === true
                    ? context.show === true
                      ? <div className='no-results-modal'>
                          <span>Names should not contain any special characters!</span>
                          <span>Try again. This time search a pair of names.</span>
                          <button onClick={e => {
                            this.onClose( e );
                          }}
                          > Close </button>
                        </div>
                       : null
                    : context.show === true
                        ? <div className='no-results-modal'>
                          <span>Sorry, it looks like those actors haven't been in anything together.</span>
                          <span>Try a different search!</span>
                          <button onClick={e => {
                            this.onClose( e );
                          }}
                          > Close </button>
                        </div>
                        : null
            )
        }
      </LethologicaContext.Consumer>
    );
  }
}
