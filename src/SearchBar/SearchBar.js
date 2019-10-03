import React, { Component } from 'react';
import './SearchBar.css';
import LethologicaContext from '../LethologicaContext';

export default class SearchBar extends Component {
  render() {
    return (
      <LethologicaContext.Consumer>
      {(context) => (
        console.log('context.queryName.length', context.queryName),
        context.queryName != null
          ? console.log('context query name length', context.queryName.length)
          : console.log('context.queryName', context.queryName),

        <>
          <span id="searchInstructions">Search two actors/directors/producers</span>
          <div className="input-container">
            <div className="search_box_button">
              <input className="search_input" placeholder="Denzel Washington, Sanaa Lathan"
              required onChange={(event) => {
                console.log('this.value', event.target.value)
                context.updateActors(event.target.value);
                context.onChangeSuggest(event.target.value);
              }}/>

              <button className="search_button"
              onClick={() => {
                context.getIds(context.actors.split(','));
              }}>SEARCH</button>
            </div>

            <div className='suggestions' >
              <ul className='suggestions_list' style={{display: context.displayProp}}>
                {context.queryName !== null && context.queryName.length > 2
                  ? context.popNames.length > 0 ? context.renderPopNames() : context.renderApiNames()
                  : console.log('awaiting 3 characters')}
              </ul>
              <div className="empty"></div>
            </div>

          </div>

        </>
      )}
    </LethologicaContext.Consumer>
    );
  }
}
