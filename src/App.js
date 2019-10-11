import React, { Component } from 'react';
import LethologicaContext from './LethologicaContext';
import FilmResult from './FilmResult/FilmResult';
import SearchBar from './SearchBar/SearchBar';
import Suggestions from './Suggestions/Suggestions';
import './App.css';
import axios from 'axios';
import NoResults from './NoResults/NoResults';
import config from './config';

class App extends Component {
  constructor(props) {
    super(props);
    this.getCredits = this.getCredits.bind(this);
    this.onChangeSuggest = this.onChangeSuggest.bind(this);
    this.renderPopNames = this.renderPopNames.bind(this);
    this.renderNames = this.renderNames.bind(this);
    this.getIds = this.getIds.bind(this);
  }

  state = {
    headerDisplay: 'none',
    actors: undefined,
    specialCharCheck: null,
    show: 'true',
    searchInput: 'searchInput',
    inputVal: '',
    firstName: '',
    queryName: null,
    filmResults: null,
    unique0: null,
    unique1: null,
    names: null,
    Names: null,
    popNames: null,
    Data: [],
    popData: [],
    popSuggestions: [],
    filmData: {
      Data: {
        Names: [],
        KnownFor: [],
        ProfilePath: [],
      },
      titleIds: [],
      popNames: [],
      Names: [],
      NameIds: [],
      popNameIds: [],
      ProfilePath: [],
      popProfilePath: [],
      KnownFor: [],
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
    let regex = /[~\`!"#$%\^&*+=\-\[\]\\;/{}|\:<>\?]/g;

    this.setState({
      actors: actors,
      specialCharCheck: regex.test(actors)
    });

  };

  async getIds() {
    this.setState({
      displayProp: 'none',
      show: !this.state.show,
      filmResults: null,
      filmsWithActors: this.state.actors
    })
    if(this.state.name === null){
      this.setState({
        headerDisplay: 'none'
      })
    }
    if(this.state.specialCharCheck === true){
      this.setState({
        headerDisplay: 'none'
      })
    }
    let regex = /[~\`!"#$%\^&*+=\-\[\]\\;/{}|\:<>\?]/g;

    if(this.state.inputVal !== null){
      if(regex.test(this.state.inputVal) === false){
        this.setState({
          inputVal: ""
        })
      }
    }

    if(this.state.actors !== undefined){
      if(this.state.actors !== ""){
        if(this.state.specialCharCheck === false){
          let actors = this.state.actors.split(',')
          const responses = [];
          for (let i = 0; i < actors.length; i++) {
            let response = await axios.get(`https://.themoviedb.org/3/search/person?api_key=${config.API_KEY}&language=en-US&page=1&include_adult=false&query=${actors[i]}`);
            if(response.data.results[0] !== undefined) {
              responses.push(response.data.results[0].id);
            }

          };
          this.getCredits(responses);
        } else {
          this.setState({
            show: true
          })
        }

      }

    } else {
      this.setState({
        show: true
      })
    }

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
        let response = await axios.get(`https://.themoviedb.org/3/person/popular?api_key=${config.API_KEY}&language=en-US&page=${i}`)
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


  };


  renderNames(){
      return (

        <>
            { this.state.renderRan > 1
              ? null
              : this.state.Data.length !== 0
                ? <ul className='suggestion_list' style={{display: this.state.displayProp}}>
                    {this.state.Data.map(object =>
                    <li onClick={() => {
                        this.state.inputVal === this.state.queryName
                          ? this.setState({
                              inputVal: object.Name + ', ',
                              firstName: object.Name + ', ',
                              displayProp: 'none',
                              spanDisplay: 'block',
                            })
                          : this.setState({
                              inputVal: this.state.firstName +  object.Name,
                              displayProp: 'none',
                              spanDisplay: 'none',
                          }, () => {
                            this.setState({
                              actors: this.state.inputVal,
                              filmsWithActors: this.state.inputVal
                            })
                          })

                      }} className='suggestion_element' key={object.ID}>
                      {!object.ProfilePath.includes(null)
                        ? <img className='suggestion_image' alt='profile' src={object.ProfilePath}></img>
                        : <img className='suggestion_image' alt='profile' src={require('./Images/profile.svg')}></img>}
                      <div className='text_info'>
                        <span className='suggest_text'>{object.Name}</span>
                        {object.KnownFor !== undefined
                          ? <span className='suggest_text'>Known for: {object.KnownFor.title}</span>
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
              {this.state.popSuggestions.map(object =>
              <li onClick={() => {
                  this.state.inputVal === this.state.queryName
                    ? this.setState({
                        inputVal: object.popName + ', ',
                        firstName: object.popName + ', ',
                        displayProp: 'none',
                        spanDisplay: 'block',
                      })
                    : this.setState({
                        inputVal: this.state.firstName + object.popName,
                        displayProp: 'none',
                        spanDisplay: 'none',
                    }, () => {
                      //this.refs.searchInput.focus()
                      this.setState({
                        actors: this.state.inputVal,
                        filmsWithActors: this.state.inputVal
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

  ctalizeName(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})
  }

  async onChangeSuggest(query) {
    let regex = /[~\`!"#$%\^&*+=\-\[\]\\;/{}|\:<>\?]/g;
    this.setState({
      inputVal: this.ctalizeName(query),
      spanDisplay: 'none'
    })
    if(regex.test(this.state.inputVal) === false){
      const suggestedNames = [];
      let name = query.charAt(0).toUpperCase() + query.slice(1);
      if(name.includes(', ' , /[a-zA-Z]/)){
        let sliceIndex = name.indexOf(',') + 2
        name = name.slice(sliceIndex)
      }

      this.setState({
        queryName: name
      })

      if(name.length > 2) {
        const responses = [];
        const nameIds = [];
        const profilePath = [];
        const knownFor = [];
        const DataObjects = [];
        const popResults = [];
        let Data = {...this.state.Data};
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

        let filmData = {...this.state.filmData}
        filmData.popNames = suggestedNames
        this.setState({
          popNames: suggestedNames,
          displayProp: 'block',
          filmData,
          popSuggestions: popResults
        })

        if(suggestedNames.length >= 1){
          let response = await axios.get(`https://.themoviedb.org/3/search/person?api_key=${config.API_KEY}&language=en-US&page=1&include_adult=false&query=${name}`);
          for (let i = 0; i<response.data.results.length; i++) {
            let object = 'object' + i

            Data[object] = {
              Name: response.data.results[i].name,
              ProfilePath: baseUrl + response.data.results[i].profile_path,
              KnownFor: response.data.results[i].known_for[0],
              ID: response.data.results[i].id
             }
            DataObjects.push(Data[object])
            responses.push(response.data.results[i].name)
            nameIds.push(response.data.results[i].id)
          }

          let filmData = {...this.state.filmData};
          filmData.Data.Names = responses;
          filmData.NameIds = nameIds;
          filmData.Data.ProfilePath = profilePath
          filmData.Data.KnownFor = knownFor
          this.setState({
            Data: DataObjects,
            Names: responses,
            filmData,
          })

        } else {

        }

      } else {
          this.setState({
            displayProp: 'none',
          })
      }
    }

  }

  async getCredits (ids)  {
    const url = 'https://.themoviedb.org/3/person/';

    try {
      for (let i = 0; i < ids.length; i++) {
        let titles = [];
        let titleIds = [];
        let response = await axios.get(url.concat(ids[i],
          `/movie_credits?api_key=${config.API_KEY}&language=en-US`))
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
            masterList: this.state.unique0.concat(this.state.unique1)
          })
        })
      };

      this.getFilmInfo(this.find_duplicate_in_array(this.state.masterList));

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

  async getFilmInfo(ids) {
    const url = 'https://.themoviedb.org/3/movie/';
    let responses = [];
    try {
      for (let i = 0; i < ids.length; i++) {
        const response = await axios.get(url.concat(ids[i],
          `?api_key=${config.API_KEY}&language=en-US`));
        responses.push({overview: response.data.overview,
                  posterPath: 'http://image.tmdb.org/t/p/w185/' + response.data.poster_path,
                  releaseDate: response.data.release_date,
                  tagline: response.data.tagline,
                  title: response.data.title,
                id: response.data.id});
      }
      if(responses.length > 0){
        this.setState({
          filmResults: responses,
          headerDisplay: 'block'
        });
      } else {
        this.setState({
          show: true
        })
      }


    } catch (error) {
      console.error(error);
    };

  }

  renderResults() {
    let filmResults = this.state.filmResults;

    return (
      <>
      {
        filmResults === null
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
      Names: this.state.filmData.Names,
      popSuggestions: this.state.popSuggestions,
      onChangeSuggest: this.onChangeSuggest,
      filmResults: this.state.filmResults,
      actors: this.state.actors,
      getIds: this.getIds,
      updateActors: this.updateActors,
      getCredits: this.getCredits,
      renderPopNames: this.renderPopNames,
      displayProp: this.state.displayProp,
      renderNames: this.renderNames,
      spanDisplay: this.state.spanDisplay,
      modalDisplayVal: this.state.modalDisplayVal,
      handleClose: this.handleClose,
      show: this.state.show,
      specialCharCheck: this.state.specialCharCheck

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
            ? this.state.popSuggestions.length > 0 ? <Suggestions className='overflow-scrolling'>{this.renderPopNames()}</Suggestions> : <Suggestions className='overflow-scrolling'>{this.renderNames()}</Suggestions>
            : null
          }
          <span className='titleDisplay' style={{display: this.state.headerDisplay}}>Films with: {this.state.filmsWithActors}</span>
          <div className='flex_results'>
            {this.renderResults()}
          </div>
        </main>
      </LethologicaContext.Provider>
    );
  }

}

export default App;
