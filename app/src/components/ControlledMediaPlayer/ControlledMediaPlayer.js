/* eslint react/prefer-stateless-function : 0 */
import React, { Component } from 'react';

import ReactPlayer from 'react-player';
import Measure from 'react-measure';

import { inElectron } from '../../helpers/electronUtils';

import LocalAudioPlayer from './LocalAudioPlayer';
import LocalVideoPlayer from './LocalVideoPlayer';

import './ControlledMediaPlayer.scss';

const PRECISION_THRESHOLD = 0.7;
const PROGRESS_INTERVAL = 100;

class MediaPlayer extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      dimensions: {
        width: 800,
        height: 600
      }
    };
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( 
      (
        Math.abs( this.props.seekedTime - nextProps.seekedTime ) > PRECISION_THRESHOLD 
        || !this.props.seekedTime && nextProps.seekedTime
        || Math.abs( nextProps.seekedTime - nextProps.currentTime ) > PRECISION_THRESHOLD 
      ) && this.player 
    ) {
      this.player.seekTo( nextProps.seekedTime );
    }
  }

  seekTo = ( to ) => {
    if ( this.player ) {
      this.player.seekTo( to );
    }
  }

  render() {
    const {
      state: {
        dimensions: {
          width,
          height,
        }
      },
      props: {
        src = '',
        displayUi,
        shouldPlay,

        setMediaPlaying,
        setMediaCurrentTime,
        setMediaDuration,
      }
    } = this;

    const bindRef = ( player ) => {
      this.player = player;
    };

    const onDuration = ( duration ) => {
      if ( typeof setMediaDuration === 'function' ) {
        setMediaDuration( duration );
      }
    };

    const onProgress = ( {

      /*
       * loaded,
       * loadedSeconds,
       * played,
       */
      playedSeconds,
    } ) => {
      if ( typeof setMediaCurrentTime === 'function' ) {
        setMediaCurrentTime( playedSeconds );
      }
    };

    const onReady = () => {
      // console.log('on ready');
    };

    const onStart = () => {
      // console.log('on start');
    };
    const onPlay = () => {
      // console.log('on play');
      setMediaPlaying( true );
    };
    const onPause = () => {
      // console.log('on pause, should play:', shouldPlay, e);
      setMediaPlaying( false );
    };

    const localSrc = src.indexOf( 'file://' ) === 0;

    if ( localSrc && inElectron ) {
      const ext = src.split( '.' ).pop();
      const audio = [ 'mp3' ].find( ( thatExt ) => ext === thatExt );
      if ( audio ) {
        return (
          <Measure
            bounds
            onResize={ ( contentRect ) => {
              this.setState( { dimensions: contentRect.bounds } );
            } }
          >
            {( { measureRef } ) =>
              (
                <div
                  className={ "dicto-ControlledMediaPlayer" }
                  ref={ measureRef }
                >
                  <LocalAudioPlayer
                    ref={ bindRef }
                    width={ width }
                    height={ height }
                    src={ src }
                    playing={ shouldPlay }
                    listenInterval={ PROGRESS_INTERVAL }
                    // callbacks
                    controls
                    onPlay={ onPlay }
                    onPause={ onPause }
                    onDurationChange={ setMediaDuration }
                    onListen={ ( playedSeconds ) => onProgress( { playedSeconds } ) }
                    onCanPlay={ onReady }
                  />
                </div>
              )
            }
          </Measure>

        );
      }
      else {
        return (
          <Measure
            bounds
            onResize={ ( contentRect ) => {
              this.setState( { dimensions: contentRect.bounds } );
            } }
          >
            {( { measureRef } ) =>
              (
                <div
                  className={ "dicto-ControlledMediaPlayer" }
                  ref={ measureRef }
                >
                  <LocalVideoPlayer
                    ref={ bindRef }
                    width={ width }
                    height={ height }
                    src={ src }
                    playing={ shouldPlay }
                    listenInterval={ PROGRESS_INTERVAL }
                    onDurationChange={ setMediaDuration }
                    // callbacks
                    controls
                    onPlay={ onPlay }
                    onPause={ onPause }
                    onListen={ ( playedSeconds ) => onProgress( { playedSeconds } ) }
                    onCanPlay={ onReady }
                  />
                </div>
              )
            }
          </Measure>

        );
      }
    }
    else {
      return (
        <Measure
          bounds
          onResize={ ( contentRect ) => {
            this.setState( { dimensions: contentRect.bounds } );
          } }
        >
          {( { measureRef } ) =>
            (
              <div
                className={ "dicto-ControlledMediaPlayer" }
                ref={ measureRef }
              >
                <ReactPlayer
                  ref={ bindRef }
                  width={ width }
                  height={ height }
                  url={ src }
                  playing={ shouldPlay }
                  progressInterval={ PROGRESS_INTERVAL }
                  // callbacks
                  onReady={ onReady }
                  onStart={ onStart }
                  controls={ displayUi }
                  onPlay={ onPlay }
                  onProgress={ onProgress }
                  onDuration={ onDuration }
                  onPause={ onPause }
                />
              </div>
            )
          }
        </Measure>
      );
    }
  }
}

export default MediaPlayer;
