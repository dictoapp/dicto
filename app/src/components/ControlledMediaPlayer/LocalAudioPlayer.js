import React, { Component } from 'react';
import AudioPlayer from 'react-audio-player';

export default class LocalAudioPlayer extends Component {
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

  onReady = ( props ) => {
    const duration = this.player.duration;
    if ( typeof props.onDurationChange === 'function' ) {
      props.onDurationChange( duration );
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
        width,
        height,
        src,
        onPlay,
        onPause,
        onListen,
        listenInterval,
        onCanPlay
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

    const handleCanPlay = () => {
      onCanPlay();
      this.onReady( this.props );
    };
    const bindRef = ( element ) => {
            if ( element ) {
              this.player = element.audioEl;
            }
          };
    return (
      <div 
        style={ {
          width,
          height,
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'center',
        } }
      >
        <AudioPlayer
          src={ src }
          ref={ bindRef }
          controls
          onPlay={ handlePlay }
          onPause={ handlePause }
          onListen={ onListen }
          listenInterval={ listenInterval }
          onCanPlay={ handleCanPlay }
        />
      </div>
    );
  }
}
