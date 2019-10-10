import React, { Component } from 'react';
import LethologicaContext from './LethologicaContext';
import FilmResult from './FilmResult/FilmResult';
import SearchBar from './SearchBar/SearchBar';
import Suggestions from './Suggestions/Suggestions';
import './App.css';
import axios from 'axios';
import NoResults from './NoResults/NoResults';

class App extends Component {
  constructor(props) {
    super(props);
    this.getCredits = this.getCredits.bind(this);
    this.onChangeSuggest = this.onChangeSuggest.bind(this);
    this.renderPopNames = this.renderPopNames.bind(this);
    this.renderApiNames = this.renderApiNames.bind(this);
    this.getIds = this.getIds.bind(this);
  }

  state = {
    filmsWithActors: null,
    actors: undefined,
    show: 'false',
    inputVal: undefined,
    firstName: '',
    secondName: '',
    queryName: null,
    filmResults: null,
    unique0: null,
    unique1: null,
    apiData: [],
    popData: [],
    popSuggestions: [],
    displayProp: 'none',
    spanDisplay: 'none',
    masterList: null,
    headerDisplay: 'none',
    specialCharCheck: null,
  };

  showModal = e => {
    this.setState({
      show: !this.state.show,
    });
  };

  updateActors = actors => {
    console.log('actors in update actors', actors)
    let regex = /[~\`!"#$%\^&*+=\-\[\]\\;/{}|\:<>\?]/g;
    this.setState({
      actors: actors,
      filmsWithActors: actors,
      specialCharCheck: regex.test(actors)
    });

  };

  async onChangeSuggest(query) {
    let regex = /[~\`!"#$%\^&*+=\-\[\]\\;/{}|\:<>\?]/g;
    if(query){
      if(regex.test(query) === false){
        let name = query.charAt(0).toUpperCase() + query.slice(1);
        console.log('name in onchange', name)
        if(this.state.headerDisplay === 'block'){
          this.setState({
            headerDisplay: 'none'
          })
        }    if(name.includes(', ') && name.length === name.indexOf(',') + 2){
          this.setState({
            firstName: name
          })
        }

        if(name.includes(', ', /[a-zA-Z]/)){
          let sliceIndex = name.indexOf(',') + 2
          name = name.slice(sliceIndex)
          this.setState({
            secondName: name
          })
        }

        this.setState({
          queryName: name,
          inputVal: this.capitalizeName(query),
        })

        if(name.length > 2) {

          const apiDataObjects = [];
          const popResults = [];
          const apiKey = 'api_key=3e9d342e0f8308faebfe8db3fffc50e7';
          let apiData = {...this.state.apiData};
          let baseUrl = 'http://image.tmdb.org/t/p/w185/';

          for(let i=0; i<this.state.popData.length; i++) {
            for(let key in this.state.popData[i]) {
              if(key !== 'popKnownFor' && key !== 'popProfilePath' && key !== 'popID') {
                if(this.state.popData[i][key].indexOf(name) !== -1) {
                  popResults.push(this.state.popData[i]);
                }
              }
            }
          }

          this.setState({
            displayProp: 'block',
            popSuggestions: popResults,
            spanDisplay: 'none'
          })

          let response = await axios.get(`https://api.themoviedb.org/3/search/person?${apiKey}&language=en-US&page=1&include_adult=false&query=${name}`);

          for (let i = 0; i<response.data.results.length; i++) {
            let object = 'object' + i

            apiData[object] = {
              apiName: response.data.results[i].name,
              apiProfilePath: baseUrl + response.data.results[i].profile_path,
              apiKnownFor: response.data.results[i].known_for[0],
              apiID: response.data.results[i].id
             }

            apiDataObjects.push(apiData[object])

          }

          this.setState({
            apiData: apiDataObjects,
          })

        } else {
            this.setState({
              displayProp: 'none',
            })
          }
      }
    }

    /*if(this.state.specialCharCheck === false){
      this.setState({
        specialCharCheck: regex.test(query)
      })
    } else {
      this.setState({
        filmResults: [],
        headerDisplay: 'none'
      })
    }*/

  }

  async getIds() {
    console.log('this.state.actors @ top', this.state.actors, 'special char check @ top', this.state.specialCharCheck)

    if(this.state.actors !== null){
      if(this.state.actors === undefined){
        this.setState({show: true})
      } else {
          if(this.state.specialCharCheck !== true) {
            const responses = [];
            const apiKey = 'api_key=3e9d342e0f8308faebfe8db3fffc50e7';
            let actors = this.state.actors.split(',')
            for (let i = 0; i < actors.length; i++) {
              let response = await axios.get(`https://api.themoviedb.org/3/search/person?${apiKey}&language=en-US&page=1&include_adult=false&query=${actors[i]}`);
              if(response.data.results[0] !== undefined) {
                responses.push(response.data.results[0].id);
              }
            };
            this.getCredits(responses);
          } else {
              console.log('this.state.actors in else', this.state.actors, 'special char check in else', this.state.specialCharCheck)
              this.setState({
                show: true
              })
          }
        }

  } else {
    console.log('this.state.actors is undefined', this.state.actors)
    this.setState({
      show: true
    })
  }

    /*let regex = /[~\`!"#$%\^&*+=\-\[\]\\;/{}|\:<>\?]/g;
    console.log('actors', actors)
    this.setState({
      displayProp: 'none',
      spanDisplay: 'none',
      inputVal: '',
      specialCharCheck: regex.test(actors)
    }, () => {
      if(this.state.specialCharCheck === false && actors !== 'empty'){
        if(actors[0] !== ""){
          this.setState({
            headerDisplay: 'block'
          })
        }

      }
    })

    if(this.state.specialCharCheck === true){
      this.setState({
        filmResults: {}
      })
    }

    if(this.state.actors === 'empty' || actors === null){
      this.setState({
        actors: actors,
        headerDisplay: 'none',
        show: 'true'
      })
    }*/


  }

  async componentDidMount() {
    const popDataObjects = [];
    let baseUrl = 'http://image.tmdb.org/t/p/w185/';
    let popData = {...this.state.popData}

    for(let i = 1; i<50; i++) {
        let response = await axios.get(`https://api.themoviedb.org/3/person/popular?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US&page=${i}`)

        for(let j = 0; j<response.data.results.length; j++){
          let object = 'object' + i;

          popData[object] = {
            popName: response.data.results[j].name,
            popProfilePath: baseUrl + response.data.results[j].profile_path,
            popKnownFor: response.data.results[j].known_for[0],
            popID: response.data.results[j].id
          }

          popDataObjects.push(popData[object])
        }
    }

    this.setState({
      popData: popDataObjects,
    })
  };

  renderApiNames(){
      return (
        <>
            { this.state.apiData.length !== 0
                ? <ul className='suggestion_list' style={{display: this.state.displayProp}}>
                    {this.state.apiData.map(object =>
                    <li onClick={() => {
                        this.state.inputVal === this.state.queryName
                          ? this.setState({
                              inputVal: object.apiName + ', ',
                              firstName: object.apiName + ', ',
                              displayProp: 'none',
                              spanDisplay: 'block',
                            })
                          : this.setState({
                              inputVal: this.state.firstName +  object.apiName,
                              displayProp: 'none',
                              spanDisplay: 'none',
                          }, () => {
                            this.setState({
                              actors: this.state.inputVal,
                              filmsWithActors:  this.state.inputVal

                            })
                          })

                      }} className='suggestion_element' key={object.apiID}>

                      {
                        !object.apiProfilePath.includes('null')
                          ? <img className='suggestion_image' alt='profile' src={object.apiProfilePath}></img>
                          : <img className='suggestion_image' alt='profile' src={require('./Images/profile.svg')}></img>
                      }
                      <div className='text_info'>
                        <span className='suggest_text'>{object.apiName}</span>
                        {
                          object.apiKnownFor !== undefined
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
    return (
      <>
        {
          this.state.popSuggestions.length !== 0
            ? <ul className='suggestion_list' style={{display: this.state.displayProp}}>
              {
                this.state.popSuggestions.map(object =>
                  <li onClick={() => {
                    this.state.inputVal === this.state.queryName
                      ? this.setState({
                          inputVal: object.popName + ', ',
                          firstName: object.popName + ', ',
                          displayProp: 'none',
                          spanDisplay: 'block',
                        }, () => {
                        })
                      : this.setState({
                          inputVal: this.state.firstName + object.popName,
                          displayProp: 'none',
                          spanDisplay: 'none',
                      }, () => {
                        this.setState({
                          actors: this.state.inputVal,
                          filmsWithActors: this.state.inputVal
                        })
                      })
                    }
              } className='suggestion_element' key={object.popName}>

                  {
                    !object.popProfilePath.includes('null')
                      ? <img className='suggestion_image' alt='profile' src={object.popProfilePath}></img>
                      : <img className='suggestion_image' alt='profile' src={require('./Images/profile.svg')}></img>
                  }

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



  async getCredits (ids)  {
    const url = 'https://api.themoviedb.org/3/person/';

    try {
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
          }
        }

        let unique = 'unique' + i.toString()

        this.setState({
          [unique]: [...new Set(titleIds)]
        }, () => {
          this.setState({
            masterList: this.state.unique0.concat(this.state.unique1),

          })
        })
      };

      this.getFilmInfo(this.find_duplicate_in_array(this.state.masterList));

    }
    catch (error) {
      console.error(error);
    }

  };

  find_duplicate_in_array(array1) {
        const object = {};
        const result = [];

        if(array1 !== null){
          array1.forEach(item => {
            if(!object[item])
                object[item] = 0;
              object[item] += 1;
          })

          for (const prop in object) {
             if(object[prop] >= 2) {
                 result.push(prop);
             }
          }
        }

        return result;

  }

  async getFilmInfo(ids) {
    const url = 'https://api.themoviedb.org/3/movie/';
    let responses = [];
    try {
      for (let i = 0; i < ids.length; i++) {
        const response = await axios.get(url.concat(ids[i],
          '?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US'));

        responses.push({overview: response.data.overview,
                  posterPath: 'http://image.tmdb.org/t/p/w185/' + response.data.poster_path,
                  releaseDate: response.data.release_date,
                  tagline: response.data.tagline,
                  title: response.data.title,
                  id: response.data.id});
      }

      this.setState({
        filmResults: responses,
      });

    } catch (error) {
      console.error(error);
    };

  }

  renderResults() {
    let filmResults = this.state.filmResults;
    console.log('render results running filmResults', filmResults )
    return (
      <>
      {
        filmResults == null
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
    console.log('render running')
    const contextValue = {
      onChangeSuggest: this.onChangeSuggest,
      updateActors: this.updateActors,
      getIds: this.getIds,
      spanDisplay: this.state.spanDisplay,
      inputVal: this.state.inputVal,
      actors: this.state.actors,
      show: this.state.show,
      handleClose: this.handleClose,
      specialCharCheck: this.state.specialCharCheck,
      showEmptyModal: this.showEmptyModal,
      filmsWithActors: this.state.filmsWithActors
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
            ? this.state.popSuggestions.length > 0 ? <Suggestions>{this.renderPopNames()}</Suggestions> : <Suggestions>{this.renderApiNames()}</Suggestions>
            : null
          }
          <h2 style={{display: this.state.headerDisplay}} className='resultsHeader'>Films with: {this.state.filmsWithActors}</h2>
          <div className='flex_results'>
            {this.renderResults()}
          </div>
        </main>
      </LethologicaContext.Provider>
    );
  }

}

export default App;
