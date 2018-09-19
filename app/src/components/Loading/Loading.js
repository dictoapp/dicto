import React from 'react';

export default () => (
  <div 
    style={ {
          display: 'flex',
          flexFlow: 'row nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute'
        } }
  >
    <div 
      style={ {
              display: 'flex',
              flexFlow: 'column nowrap',
              alignItems: 'center',
              justifyContent: 'center'
            } }
    >
      <img src={ require( './loading.gif' ) } />
      <h1 className={ 'title is-1' }>DICTO</h1>
    </div>
  </div>
);
