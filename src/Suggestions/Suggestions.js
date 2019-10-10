import React from 'react';

import './Suggestions.css';

function Suggestions( props ) {
    return (
      <div className='suggestions' >
        {props.children}
        <div className='empty'></div>
      </div>
    );
}

export default Suggestions;
