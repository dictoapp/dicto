import React, { Component } from 'react';

export default class LocalVideoPlayer extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      playing: false
    };
  }

  componentWillUpdate = ( nextProps, nextState ) => {
    if ( nextProps.playing && !nextState.playing ) {
      if ( this.player ) {
        this.player.play();
      }
    }
    else if ( !nextProps.playing && nextState.playing ) {
      if ( this.player ) {
        this.player.pause();
      }
    }
  }

  seekTo = ( to ) => {
    if ( this.player ) {
      this.player.play();
      setTimeout( () => {
        this.player.currentTime = to;
      } );
    }
  }

  render = () => {
    const {
      props: {
        
        width = '100%',
        height = '100%',
         
        src = '',
        onPlay,
        onPause,
        onListen,
        onDurationChange,
        onCanPlay,
      }
    } = this;

    const handlePlay = () => {
      onPlay();
      this.setState( { playing: true } );
    };
    const handlePause = () => {
      onPause();
      this.setState( { playing: false } );
    };

    const handleTimeUpdate = () => {
      onListen( this.player.currentTime );
    };

    const handleDurationChange = () => {
      if ( typeof onDurationChange === 'function' ) {
        onDurationChange( this.player.duration );
      }
    };

    const bindRef = ( player ) => {
      this.player = player;
    };

    const ext = src.split( '.' ).pop();

    return (
      <div
        style={ {
          width,
          height,
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
        } }
      >
        <video
          ref={ bindRef }
          onPlay={ handlePlay }
          onPause={ handlePause }
          onTimeUpdate={ handleTimeUpdate }
          onCanPlay={ onCanPlay }
          onDurationChange={ handleDurationChange }
          controls
        >
          <source
            src={ src }
            type={ `video/${ext}` }
          />
        </video>
      </div>
    );
  }
}
