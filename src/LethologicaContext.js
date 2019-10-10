import React from 'react';

const LethologicaContext = React.createContext({
  onChangeSuggest: () => {},
  updateActors: () => {},
  getIds: () => {},
  spanDisplay: null,
  inputVal: null,
  actors: null,
  filmsWithActors: null,
  show: null,
  specialCharCheck: null,
  handleClose: () => {},
  popSuggestions: [],
  apiData: [],
});

export default LethologicaContext;
