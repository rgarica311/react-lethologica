import React from 'react';

import './Suggestions.css';

function Suggestions( props ) {
    return (
      <LethologicaContext.Consumer>
      {(context) => (
            <div className='suggestions' >
              {this.props.children}
                <div className='empty'></div>
            </div>
      )}
    </LethologicaContext.Consumer>
    );
}

export default Suggestions;
