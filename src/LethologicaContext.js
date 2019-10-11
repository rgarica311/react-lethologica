import React from 'react';

const LethologicaContext = React.createContext({
  actors: [],
  popSuggestions: null,
  queryName: null,
  apiNames: [],
  popNames: null,
  filmInfo: null,
  getIds: () => {},
  updateActors: () => {},
  getCredits: () => {},
  updateCreditState: () => {},
  updateMovieIdState: () => {},
  onChangeSuggest: () => {},
  renderPopNames: () => {},
  renderApiNames: () => {},
  filmResults: null,
  names: [],
  displayProp: null,
  spanDisplay: null,
  inputVal: '',
  searchInput: 'searchInput',
  handleClose: () => {},
  show: null,
  actors: undefined,
  specialCharCheck: null
});

export default LethologicaContext;
