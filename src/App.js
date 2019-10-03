import React, { Component } from 'react';
import LethologicaContext from './LethologicaContext';
import FilmResult from './FilmResult/FilmResult';
import Nav from './Nav/Nav';
import SearchBar from './SearchBar/SearchBar';
import './App.css';
import axios from 'axios';
import './FilmData';

class App extends Component {
  constructor(props) {
    super(props);
    this.getCredits = this.getCredits.bind(this);
    this.onChangeSuggest = this.onChangeSuggest.bind(this);
    this.renderPopNames = this.renderPopNames.bind(this);
    this.renderApiNames = this.renderApiNames.bind(this);
    //this.updateCreditState = this.updateCreditState.bind(this);
    //this.updateMovieIdState = this.updateMovieIdState.bind(this);

  }

  state = {
    queryName: null,
    filmResults: {},
    titles: null,
    unique0: null,
    unique1: null,
    names: null,
    apiNames: null,
    popNames: null,
    filmData: {
      titleIds: [],
      credits1: [],
      credits2: [],

      sharedCreditsIds: [],
    },
    displayProp: 'none',
  };


  updateActors = actors => {
    console.log('this in update actors', this)
    this.setState({
      actors: actors,
    }, () => {
      console.log('this.state.actors in update actors', this.state.actors);
    });

  };

  async getIds(actors) {
    const responses = [];
    const apiKey = 'api_key=3e9d342e0f8308faebfe8db3fffc50e7';
    for (let i = 0; i < actors.length; i++) {
      let response = await axios.get(`https://api.themoviedb.org/3/search/person?${apiKey}&language=en-US&page=1&include_adult=false&query=${actors[i]}`);
      responses.push(response.data.results[0].id);
    };
    console.log('this', this);
    this.getCredits(responses);
  }

  async componentDidMount() {
    const names = [];
    for(let i = 1; i<50; i++) {
        let response = await axios.get(`https://api.themoviedb.org/3/person/popular?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US&page=${i}`)
        for(let j = 0; j<response.data.results.length; j++){
          names.push(response.data.results[j].name)
        }
    }
    this.setState({
      names: names,
    }, () => console.log('names loaded into state'))
  };


  renderApiNames(){
    console.log('rendering api names')
      return (

        <>
            { this.state.apiNames !== null
              ? this.state.apiNames.map(name => <li key={name}>{name}</li>)
              : console.log('empty')
            }
        </>

      )
  }

  renderPopNames() {
    console.log('special render suggestions running')
    console.log('special this.state.displayProp', this.state.displayProp)

    console.log('renderSuggestions rendering')
    //console.log('this in rendersuggestions', this)
    console.log('this.state.popNames in rendersuggestions', this.state.popNames.length)
    /*if (this.state.popNames.length == 0){
      console.log('this.state.popNames.length is 0', this.state.popNames.length)
    } else {
        console.log('this.state.apiNames', this.state.apiNames)
    }*/

    return (
      <>
      {
        this.state.popNames.map(name => <li key={name}>{name}</li>)
      }
      </>
    )
  }

  async onChangeSuggest(query) {
    const suggestedNames = [];
    let name = query.charAt(0).toUpperCase() + query.slice(1);
    this.setState({
      queryName: name
    })
    if(name.length > 2) {
      const responses = [];
      const apiKey = 'api_key=3e9d342e0f8308faebfe8db3fffc50e7';
      for(let i=0; i<this.state.names.length; i++){
        if(this.state.names[i].includes(name)){
          //console.log(`suggested name ${i} is ${this.state.names[i]}`)
          suggestedNames.push(this.state.names[i])
        }
      }
      this.setState({
        popNames: suggestedNames,
        displayProp: 'flex',
      })

      if(suggestedNames.length > 0){
        console.log('suggested names from state', suggestedNames)

      } else {
          let response = await axios.get(`https://api.themoviedb.org/3/search/person?${apiKey}&language=en-US&page=1&include_adult=false&query=${name}`);
          for (let i = 0; i<response.data.results.length; i++) {
            responses.push(response.data.results[i].name)
          }
          this.setState({
            apiNames: responses
          })
          console.log('names sugggestions from api', responses)
      }

    } else {
        this.setState({
          displayProp: 'none',
        })
    }
  }

  async getCredits (ids)  {
    const url = 'https://api.themoviedb.org/3/person/';

    let masterList;


    console.log('type of titlesids @ initiant', typeof titleIds)

    try {
      console.log('try block of getcredits');
      console.log('ids.length', ids.length);
      for (let i = 0; i < ids.length; i++) {
        let titles = [];
        let titleIds = [];
        let response = await axios.get(url.concat(ids[i],
          '/movie_credits?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US'))
        let castItem = response.data.cast;
        let crewItem = response.data.crew;


        if (castItem.length > 0) {
          for (let j = 0; j < castItem.length; j++) {
            titles.push(castItem[j].title);
            titleIds.push(castItem[j].id);
          }
        }

        if (crewItem.length > 0) {
          for (let x = 0; x < crewItem.length; x++) {
            titles.push(crewItem[x].title);
            titleIds.push(crewItem[x].id);
            //console.log('debug titles in crewitem loop', titles.length)
          }
        }

        let unique = 'unique' + i.toString()

        this.setState({
          [unique]: [...new Set(titleIds)]
        }, () => {
          console.log('this.state', this.state.unique0)
          masterList = this.state.unique0.concat(this.state.unique1)
        })
      };

      console.log('masterList outside loop', masterList)
      console.log('dupes', this.find_duplicate_in_array(masterList))

      this.getFilmInfo(this.find_duplicate_in_array(masterList));

    }
    catch (error) {
      console.error(error);
    }

  };

  find_duplicate_in_array(arra1) {
        const object = {};
        const result = [];

        arra1.forEach(item => {
          if(!object[item])
              object[item] = 0;
            object[item] += 1;
        })

        for (const prop in object) {
           if(object[prop] >= 2) {
               result.push(prop);
           }
        }

        return result;

  }



  updateCreditState (credit, titles) {

    this.setState(prevState => ({
      filmData: {
        ...prevState.filmData,
        [credit]: titles,
      },
    }));

  };

  updateMovieIdState (movieid, titleIds) {
    this.setState(prevState => ({
      filmData: {
        ...prevState.filmData,
        [movieid]: titleIds,
      },

    }));
  };

  updateSharedCreditsIds(ids) {
    this.setState(prevState => ({
      filmData: {
        ...prevState.filmData,
        sharedCreditsIds: ids,
      },
    }));
  };

  async getFilmInfo(ids) {
    console.log('debug getfilminfo running');
    const url = 'https://api.themoviedb.org/3/movie/';
    let responses = [];
    try {
      console.log('debug ids getinfo', ids);
      for (let i = 0; i < ids.length; i++) {
        const response = await axios.get(url.concat(ids[i],
          '?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US'));
        console.log('entire resposne', response);
        responses.push({overview: response.data.overview,
                  posterPath: 'http://image.tmdb.org/t/p/w185/' + response.data.poster_path,
                  releaseDate: response.data.release_date,
                  tagline: response.data.tagline,
                  title: response.data.title,
                id: response.data.id});
      }
      console.log('responses', responses);
      this.setState({
        filmResults: responses,
      });

    } catch (error) {
      console.error(error);
    };

  }

  renderResults() {

    let filmResults = this.state.filmResults;
    console.log('filmResults length in renderResults', filmResults);

    return (
      <>
      {Object.keys(filmResults).map(film => (
        <FilmResult
          key={filmResults[film].id}
          posterPath={filmResults[film].posterPath}
          title={filmResults[film].title}
          tagline={filmResults[film].tagline}
          overview={filmResults[film].overview}
          releaseDate={filmResults[film].releaseDate}/>
      ))}
      </>
    );
  }

  render() {
    const contextValue = {
      queryName: this.state.queryName,
      names: this.state.names,
      apiNames: this.state.apiNames,
      popNames: this.state.popNames,
      onChangeSuggest: this.onChangeSuggest,
      filmResults: this.state.filmResults,
      actors: this.state.actors,
      getIds: this.getIds,
      updateActors: this.updateActors,
      getCredits: this.getCredits,
      updateCreditState: this.updateCreditState,
      updateMovieIdState: this.updateMovieIdState,
      renderPopNames: this.renderPopNames,
      displayProp: this.state.displayProp,
      renderApiNames: this.renderApiNames,
    };
    return (
      <LethologicaContext.Provider value={contextValue}>
        <main className='App'>
          <Nav/>
          <div className='app-title'>
            <span className='letho'>LETHOLOGICA</span>
            <span className='desc'>When it's on the tip of your tongue...</span>
          </div>
          <SearchBar/>
          <div className='flex_results'>
            {this.renderResults()}
          </div>
        </main>
      </LethologicaContext.Provider>
    );
  }

}

export default App;
