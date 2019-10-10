import React, { Component } from 'react';
import LethologicaContext from './LethologicaContext';
import FilmResult from './FilmResult/FilmResult';
import SearchBar from './SearchBar/SearchBar';
import Suggestions from './Suggestions/Suggestions';
import './App.css';
import axios from 'axios';
import './FilmData';
import NoResults from './NoResults/NoResults';


class App extends Component {
  constructor(props) {
    super(props);
    this.getCredits = this.getCredits.bind(this);
    this.onChangeSuggest = this.onChangeSuggest.bind(this);
    this.renderPopNames = this.renderPopNames.bind(this);
    this.renderApiNames = this.renderApiNames.bind(this);
    this.getIds = this.getIds.bind(this);
    //this.handleClose = this.handleClose.bind(this);
    //this.updateCreditState = this.updateCreditState.bind(this);
    //this.updateMovieIdState = this.updateMovieIdState.bind(this);

  }

  state = {
    show: 'true',
    searchInput: 'searchInput',
    inputVal: '',
    firstName: '',
    queryName: null,
    filmResults: {},
    unique0: null,
    unique1: null,
    names: null,
    apiNames: null,
    popNames: null,
    apiData: [],
    popData: [],
    popSuggestions: [],
    filmData: {
      apiData: {
        apiNames: [],
        apiKnownFor: [],
        apiProfilePath: [],
      },
      titleIds: [],
      popNames: [],
      apiNames: [],
      apiNameIds: [],
      popNameIds: [],
      apiProfilePath: [],
      popProfilePath: [],
      apiKnownFor: [],
      popKnownFor: [],
      sharedCreditsIds: [],
    },
    displayProp: 'none',
    spanDisplay: 'none',
    modalDisplayVal: 'flex',
  };

  showModal = e => {
    this.setState({
      show: !this.state.show
    });
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
    this.setState({
      displayProp: 'none',
      show: !this.state.show,
      inputVal: '',
    })
    const responses = [];
    const apiKey = 'api_key=3e9d342e0f8308faebfe8db3fffc50e7';
    for (let i = 0; i < actors.length; i++) {
      let response = await axios.get(`https://api.themoviedb.org/3/search/person?${apiKey}&language=en-US&page=1&include_adult=false&query=${actors[i]}`);
      if(response.data.results[0] !== undefined) {
        responses.push(response.data.results[0].id);
      }

    };
    console.log('this', this);
    this.getCredits(responses);
  }



  async componentDidMount() {
    const names = [];
    const nameIds = [];
    const profilePath = [];
    const knownFor = [];
    const popDataObjects = [];
    let baseUrl = 'http://image.tmdb.org/t/p/w185/';
    let popData = {...this.state.popData}
    for(let i = 1; i<50; i++) {
        let response = await axios.get(`https://api.themoviedb.org/3/person/popular?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US&page=${i}`)
        console.log('popular people response', response)
        for(let j = 0; j<response.data.results.length; j++){
          let object = 'object' + i;
          popData[object] = {
            popName: response.data.results[j].name,
            popProfilePath: baseUrl + response.data.results[j].profile_path,
            popKnownFor: response.data.results[j].known_for[0],
            popID: response.data.results[j].id
          }
          popDataObjects.push(popData[object])
          names.push(response.data.results[j].name)
          nameIds.push(response.data.results[j].id)
          profilePath.push(response.data.results[j].profile_path)
          knownFor.push(response.data.results[j].known_for[0])
        }
    }
    let filmData = {...this.state.filmData}

    filmData.popNames = names
    filmData.popNameIds = nameIds
    filmData.popProfilePath = profilePath
    filmData.popKnownFor = knownFor
    this.setState({
      popData: popDataObjects,
      names: names,
      filmData
    }, () => console.log('names loaded into state'))
  };


  renderApiNames(){
    console.log('rendering api names apidata:', this.state.apiData)

      return (

        <>
            { this.state.renderRan > 1
              ? null
              : this.state.apiData.length !== 0
                ? <ul className='suggestion_list' style={{display: this.state.displayProp}}>
                    {this.state.apiData.map(object =>
                    <li onClick={() => {
                        console.log('this in render apinames', this)
                        this.state.inputVal === this.state.queryName
                          ? this.setState({
                              inputVal: object.apiName + ', ',
                              firstName: object.apiName + ', ',
                              displayProp: 'none',
                              spanDisplay: 'block',

                            }, () => {
                              //this.refs.searchInput.focus()
                            })
                          : this.setState({
                              inputVal: this.state.firstName +  object.apiName,
                              displayProp: 'none',
                              spanDisplay: 'none',
                          }, () => {
                            //this.refs.searchInput.focus()
                            this.setState({
                              actors: this.state.inputVal
                            })
                          })

                      }} className='suggestion_element' key={object.apiID}>
                      {!object.apiProfilePath.includes(null)
                        ? <img className='suggestion_image' alt='profile' src={object.apiProfilePath}></img>
                        : <img className='suggestion_image' alt='profile' src={require('./Images/profile.svg')}></img>}
                      <div className='text_info'>
                        <span className='suggest_text'>{object.apiName}</span>
                        {object.apiKnownFor !== undefined
                          ? <span className='suggest_text'>Known for: {object.apiKnownFor.title}</span>
                          : null
                        }
                      </div>
                    </li>
                )}
                </ul>
                : null

            }
        </>

      )
  }

  renderPopNames() {
    console.log('rendering popular names')
    return (
      <>
        {
          this.state.popSuggestions.length !== 0
            ? <ul className='suggestion_list' style={{display: this.state.displayProp}}>
              {this.state.popSuggestions.map(object =>
              <li onClick={() => {
                  //this.searchInput.focus()
                  console.log('this in render pop', this)
                  this.state.inputVal === this.state.queryName
                    ? this.setState({
                        inputVal: object.popName + ', ',
                        firstName: object.popName + ', ',
                        displayProp: 'none',
                        spanDisplay: 'block',
                      }, () => {
                        //this.refs.searchInput.focus()
                      })
                    : this.setState({
                        inputVal: this.state.firstName + object.popName,
                        displayProp: 'none',
                        spanDisplay: 'none',
                    }, () => {
                      //this.refs.searchInput.focus()
                      this.setState({
                        actors: this.state.inputVal
                      })
                    })
                }
              } className='suggestion_element' key={object.popName}>

                  {!object.popProfilePath.includes(null)
                    ? <img className='suggestion_image' alt='profile' src={object.popProfilePath}></img>
                    : <img className='suggestion_image' alt='profile' src={require('./Images/profile.svg')}></img> }

                <div className='text_info'>
                  <span className='suggest_text'>{object.popName}</span>
                  {
                    object.popKnownFor !== undefined
                    ? <span className='suggest_text'>Known for: {object.popKnownFor.title}</span>
                    : null
                  }

                </div>
              </li>
            )}
              </ul>
            : null
          }
      </>
    )

  }

  capitalizeName(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})
  }

  async onChangeSuggest(query) {
    console.log('query capitalize', this.capitalizeName(query))
    const suggestedNames = [];
    let name = query.charAt(0).toUpperCase() + query.slice(1);
    if(name.includes(', ' , /[a-zA-Z]/)){
      let sliceIndex = name.indexOf(',') + 2
      name = name.slice(sliceIndex)
      //name = name.charAt(0).toUpperCase() + name.slice(1);
    }


    this.setState({
      queryName: name,
      inputVal: this.capitalizeName(query),
    })
    if(name.length > 2) {
      const responses = [];
      const nameIds = [];
      const profilePath = [];
      const knownFor = [];
      const apiDataObjects = [];
      const popResults = [];
      const apiKey = 'api_key=3e9d342e0f8308faebfe8db3fffc50e7';
      let apiData = {...this.state.apiData};
      let baseUrl = 'http://image.tmdb.org/t/p/w185/';
      //console.log('this.state.popData[0]', this.state.popData[0])
      for(let i=0; i<this.state.popData.length; i++) {
        for(let key in this.state.popData[i]) {
          //console.log('this.state.popData.length', this.state.popData.length)
          if(key !== 'popKnownFor' && key !== 'popProfilePath' && key !== 'popID') {
            console.log(`this.state.popData[${i}][${key}]`, this.state.popData[i][key])

            if(this.state.popData[i][key].indexOf(name) !== -1) {
              popResults.push(this.state.popData[i]);
            }
          }
        }
      }

      let filmData = {...this.state.filmData}
      filmData.popNames = suggestedNames
      this.setState({
        popNames: suggestedNames,
        displayProp: 'block',
        filmData,
        popSuggestions: popResults
      })

      if(suggestedNames.length > 0){
        console.log('suggested names from state', suggestedNames)

      } else {
          let response = await axios.get(`https://api.themoviedb.org/3/search/person?${apiKey}&language=en-US&page=1&include_adult=false&query=${name}`);
          console.log('person response data', response)
          for (let i = 0; i<response.data.results.length; i++) {
            let object = 'object' + i

            apiData[object] = {apiName: response.data.results[i].name,
              apiProfilePath: baseUrl + response.data.results[i].profile_path,
              apiKnownFor: response.data.results[i].known_for[0],
              apiID: response.data.results[i].id
             }
            apiDataObjects.push(apiData[object])
            responses.push(response.data.results[i].name)
            nameIds.push(response.data.results[i].id)


          }

          let filmData = {...this.state.filmData};


          filmData.apiData.apiNames = responses;
          filmData.apiNameIds = nameIds;
          filmData.apiData.apiProfilePath = profilePath
          filmData.apiData.apiKnownFor = knownFor
          this.setState({
            apiData: apiDataObjects,
            apiNames: responses,
            filmData,
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

  /*updateSharedCreditsIds(ids) {
    this.setState(prevState => ({
      filmData: {
        ...prevState.filmData,
        sharedCreditsIds: ids,
      },
    }));
  };*/

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
    console.log('render results running')
    console.log('filmResults length in renderResults', filmResults.length);

    return (
      <>
      {
        filmResults.length === 0
          ? <NoResults onClose={this.showModal}/>
          :Object.keys(filmResults).map(film => (
          <FilmResult
            key={filmResults[film].id}
            posterPath={filmResults[film].posterPath}
            title={filmResults[film].title}
            tagline={filmResults[film].tagline}
            overview={filmResults[film].overview}
            releaseDate={filmResults[film].releaseDate}/>
        ))
    }
      </>
    );
  }

  render() {

    const contextValue = {
      searchInput: this.state.searchInput,
      inputVal: this.state.inputVal,
      queryName: this.state.queryName,
      names: this.state.names,
      apiNames: this.state.filmData.apiNames,
      popSuggestions: this.state.popSuggestions,
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
      spanDisplay: this.state.spanDisplay,
      modalDisplayVal: this.state.modalDisplayVal,
      handleClose: this.handleClose,
      show: this.state.show,
    };
    return (
      <LethologicaContext.Provider value={contextValue}>

        <main className='App'>
          <div className='app-title'>
            <span className='letho'>LETHOLOGICA CINEMATICA</span>
            <span className='desc'>When you can't remember the name of that movie with Sinbad and Phil Hartman...</span>
          </div>
          <SearchBar/>
          {this.state.queryName !== null && this.state.queryName.length > 2
            ? this.state.popSuggestions.length > 0 ? <Suggestions className='overflow-scrolling'>{this.renderPopNames()}</Suggestions> : <Suggestions className='overflow-scrolling'>{this.renderApiNames()}</Suggestions>
            : null
          }

          <div className='flex_results'>
            {this.renderResults()}
          </div>
        </main>
      </LethologicaContext.Provider>
    );
  }

}

export default App;
