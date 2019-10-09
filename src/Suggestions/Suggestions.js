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
                {/*context.queryName !== null && context.queryName.length > 2
                  ? context.popSuggestions.length > 0 ? context.renderPopNames() : context.renderApiNames()
                  : console.log('awaiting 3 characters')*/}
                <div className='empty'></div>
            </div>
      )}
    </LethologicaContext.Consumer>
    );
  }
}
