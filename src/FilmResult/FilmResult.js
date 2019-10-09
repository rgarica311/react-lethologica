import React from 'react';
import './filmResult.css';

function FilmResult(props) {
  return (
      <div className='flex_filmInfo'>
        <img src={props.posterPath} height='278px' alt="film poster"/>
        <div className='film-info'>
          <span className='block-span title'>{props.title}</span>
          <span className='block-span tag'>{props.tagline}</span>
          <span className='block-span overview'>{props.overview}</span>
          <span className='block-span date'>{props.releaseDate}</span>
        </div>
       </div>
  );
}

export default FilmResult;
