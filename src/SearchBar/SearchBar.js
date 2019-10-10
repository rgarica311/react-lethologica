import React, { Component } from 'react';
import './SearchBar.css';
import LethologicaContext from '../LethologicaContext';
import NoResults from '../NoResults/NoResults';


export default class SearchBar extends Component{
  constructor(props){
    super(props)
    this.state = {
      value: ''
    }
    this.handleChange = this.handleChange.bind(this)
    //this.searchInput = React.createRef();
  }

  componentDidUpdate(){
    //this.searchInput.current.focus()
  }

  handleChange(event, callback){
    console.log('backspace detected')
    if(event.target.value === ""){
      this.setState({
        value: undefined
      }, () => {
        callback(this.state.value)
      })
    } else {
      this.setState({
        value: event.target.value
      }, () => {
        callback(this.state.value)
      })
    }

  }

  render() {
    return (
      <LethologicaContext.Consumer>
      {(context) => (
        <>
          <span id="searchInstructions">Search two actors/directors/producers</span>
          <div className="input-container">
            <div className="search_box_button">
              <input type='text' autoFocus={true} value={context.inputVal} className="search_input" placeholder="e.g. Sinbad, Phil Hartman"
              required onChange={(event) => {
                this.handleChange(event, context.updateActors)
                //context.updateActors(this.state.value);
                context.onChangeSuggest(this.state.value);
              }}/>

              <button className="search_button"
              onClick={() => {
                  context.getIds()
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
