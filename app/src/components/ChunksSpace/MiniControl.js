import React from 'react';
import PropTypes from 'prop-types';

const MiniControl = ( {
  style,
  mediaPlaying,
  setMediaPlaying,
  seekForward,
  seekBackward,
  allowCut = false,
  onCut
}, { t } ) => {
  const togglePlaying = ( e ) => {
    e.stopPropagation();
    e.preventDefault();
    if ( mediaPlaying ) {
      setMediaPlaying( false );
    }
    else {
      setMediaPlaying( true );
    }
  };

  const onSeekForward = ( e ) => {
    e.stopPropagation();
    e.preventDefault();
    seekForward();
  };
  const onSeekBackward = ( e ) => {
    e.stopPropagation();
    e.preventDefault();
    seekBackward();
  };
  const handleCut = ( e ) => {
    e.stopPropagation();
    e.preventDefault();
    onCut();
  };
  const silent = ( e ) => {
    e.stopPropagation();
  };
  return (
    <ul
      style={ style }
      className={ 'dicto-MiniControl columns' }
      onClick={ silent }
      onMouseMove={ silent }
      onMouseDown={ silent }
      onMouseUp={ silent }
    >
      {
        allowCut &&
        <li 
          className={ 'column' }
          data-for={ "tooltip" }
          data-tip={ t( 'cut active excerpt(s) at player position' ) }
        >
          <button
            onClick={ handleCut }
            className={ 'button is-rounded' }
          >
            <i className={ 'fas fa-cut' } />
          </button>
        </li>
      }
      <li 
        className={ 'column' }
        data-for={ "tooltip" }
        data-tip={ t( 'go back (5s)' ) }
      >
        <button
          onClick={ onSeekBackward }
          className={ 'button is-rounded' }
        >
          <i
            style={ { transform: 'rotate(90deg)' } }
            className={ 'fas fa-backward' }
          />
        </button>
      </li>
      <li 
        className={ 'column' }
        data-for={ "tooltip" }
        data-tip={ mediaPlaying ? t( 'pause' ) : t( 'play' ) }
      >
        <button
          style={ { display: mediaPlaying === true ? 'block' : 'none' } }
          onClick={ togglePlaying }
          className={ 'button is-rounded' }
        >
          <i className={ 'fas fa-pause' } />
        </button>
        <button
          style={ { display: mediaPlaying === false ? 'block' : 'none' } }
          onClick={ togglePlaying }
          className={ 'button is-rounded' }
        >
          <i className={ 'fas fa-play' } />
        </button>
      </li>
      <li 
        className={ 'column' }
        data-for={ "tooltip" }
        data-tip={ t( 'go forth (5s)' ) }
      >
        <button
          onClick={ onSeekForward }
          className={ 'button is-rounded' }
        >
          <i
            style={ { transform: 'rotate(90deg)' } }
            className={ 'fas fa-forward' }
          />
        </button>
      </li>
    </ul>
  );
};

MiniControl.contextTypes = {
  t: PropTypes.func,
}

export default MiniControl;
