import React from 'react';

const LethologicaContext = React.createContext({
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
  spanDisplay: null,
  inputVal: '',
  searchInput: 'searchInput',
  handleClose: () => {},
  show: null,
  actors: undefined,
  specialCharCheck: null
});

export default LethologicaContext;
