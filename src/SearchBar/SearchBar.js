import React, { Component } from 'react';
import './SearchBar.css';
import LethologicaContext from '../LethologicaContext';

export default class SearchBar extends Component{
  constructor(props){
    super(props)
    this.searchInput = React.createRef();
    this.list = React.createRef();
  }

  componentDidUpdate(){
    this.searchInput.current.focus()
  }

  render() {
    return (
      <LethologicaContext.Consumer>
      {(context) => (
        <>
          <span id="searchInstructions">Search two actors/directors/producers</span>
          <div className="input-container">
            <div className="search_box_button">
              <input type='text' ref={this.searchInput} autoFocus={true} value={context.inputVal} className="search_input" placeholder="e.g. Denzel Washington, Sanaa Lathan"
              required onChange={(event) => {
                context.updateActors(event.target.value);
                context.onChangeSuggest(event.target.value);
              }}/>

              <button className="search_button"
              onClick={() => {
                context.getIds();
              }}>SEARCH</button>

            </div>
            <span style={{display: context.spanDisplay}} id='secondNameAlert'>Enter a second name to search!</span>

          </div>

        </>
      )}
    </LethologicaContext.Consumer>
    );
  }
}
