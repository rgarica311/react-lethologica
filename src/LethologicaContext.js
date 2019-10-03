import React from 'react';

const LethologicaContext = React.createContext({
  actors: [],
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
});

export default LethologicaContext;
