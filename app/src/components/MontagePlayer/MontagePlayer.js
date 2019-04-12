import React, { Component } from 'react';
import { debounce } from 'lodash';
import Fullscreen from 'react-full-screen';

import Railway from '../Railway';
import MediaPlayer from '../ControlledMediaPlayer';
import Markdown from '../MarkdownPlayer';

import ImageGallery from 'react-image-gallery';

import './MontagePlayer.scss';

import 'react-image-gallery/styles/scss/image-gallery.scss';

import {
  computePlaylist,
  secsToSrt
} from '../../helpers/utils';

const TOLERANCE_SECONDS = 1.1;

let seekTimeout;

export default class MontagePlayer extends Component {

  constructor ( props ) {
    super( props );

    const playlist = computePlaylist( props );
    const { medias } = props;
    const activeBlock = playlist.list.length ? playlist.list[0] : undefined;
    const mediaSrc = activeBlock && medias && activeBlock.blockType === 'chunk' ?
      medias[activeBlock.chunk.metadata.mediaId] &&
        medias[activeBlock.chunk.metadata.mediaId].metadata &&
        medias[activeBlock.chunk.metadata.mediaId].metadata.mediaUrl : undefined;

    this.state = {
      playlist,
      currentPosition: 0,
      isPlaying: false,
      activeBlock,
      mediaSrc,
      metadataVisible: false,
      isFullscreen: false,
    };

    this.debouncedDidUpdate = debounce( this.didUpdate, 10 );
  }

  componentWillReceiveProps = ( nextProps ) => {
    if (
      this.props.summary !== nextProps.summary ||
      this.props.chunks !== nextProps.chunks
    ) {
      const playlist = computePlaylist( nextProps );
      this.setState( {
        playlist,
        currentPosition: 0,
        activeBlock: playlist.list.length ? playlist.list[0] : undefined
      } );
    }
  }

  componentWillUpdate = ( nextProps, nextState ) => {
    if ( this.state.currentPosition !== nextState.currentPosition || ( !nextState.activeBlock && nextProps.summary && nextProps.summary.length ) ) {
      const activeBlock = this.findActiveBlock( this.state.playlist, nextState.currentPosition );

      this.setState( {
        activeBlock
      } );
    }

    let previousActiveMedia;
    let nextActiveMedia;
    const {
      activeBlock
    } = this.state;
    const {
      activeBlock: nextActiveBlock
    } = nextState;
    const {
      medias
    } = this.props;
    const {
      medias: nextMedias
    } = nextProps;
    if ( activeBlock && activeBlock.blockType === 'chunk' ) {
      previousActiveMedia = medias[activeBlock.chunk.metadata.mediaId] &&
        medias[activeBlock.chunk.metadata.mediaId].metadata &&
        medias[activeBlock.chunk.metadata.mediaId].metadata.mediaUrl;
    }

    if ( nextActiveBlock && nextActiveBlock.blockType === 'chunk' ) {
      nextActiveMedia = nextMedias[nextActiveBlock.chunk.metadata.mediaId] &&
        nextMedias[nextActiveBlock.chunk.metadata.mediaId].metadata &&
        nextMedias[nextActiveBlock.chunk.metadata.mediaId].metadata.mediaUrl;
    }

    if ( previousActiveMedia !== nextActiveMedia ) {

      this.setState( {
        mediaSrc: undefined,
      } );
      setTimeout( () => {
        this.setState( {
          mediaSrc: nextActiveMedia
        } );
      } );
    }
  }

  componentDidUpdate = () => {
    this.debouncedDidUpdate();
  }

  componentWillUnmout = () => {
    this.debouncedDidUpdate.cancel();
  }

  didUpdate = () => {
    const {
      activeBlock,
      currentPosition,
      isPlaying
    } = this.state;
    if ( activeBlock && activeBlock.blockType === 'comment' && isPlaying === true ) {
      seekTimeout = setTimeout( () => {
        this.setState( {
          currentPosition: currentPosition + 0.1
        } );
      }, 100 );
    }
  }

  findActiveBlock = ( { list = [] }, position = 0 ) => {
    // normal active block : contains the position
    let activeBlock = list.find( ( element ) => element.start <= position && element.end >= position );
    // fallback 1 : next block
    if ( !activeBlock ) {
      activeBlock = list.find( ( element ) => {
        if ( element.start > position ) {
          return true;
        }
      } );
    }

    /*
     * fallback 2 : first block
     * if ( !activeBlock ) {
     *   activeBlock = list[0];
     * }
     */
    return activeBlock;
  }

  togglePlayPause = () => {
    this.setState( {
      isPlaying: !this.state.isPlaying,
      activeBlock: !this.state.isPlaying === true ?
        this.findActiveBlock( this.state.playlist, this.state.currentPosition )
        : this.state.activeBlock
    } );
  }

  setMediaPlaying = ( isPlaying ) => {
    this.setState( { isPlaying } );
  }

  setFullscreen = ( isFullscreen ) => {
    this.setState( { isFullscreen } );
  }
  toggleFullscreen = () => {
    this.setState( { isFullscreen: !this.state.isFullscreen } );
  }

  onCurrentTimeChange = ( time ) => {
    const {
      activeBlock,
      currentPosition
    } = this.state;
    // where we are regarding active block position in montage
    const currentPositionInChunk = currentPosition - activeBlock.start;
    // where we are regarding  active block position in current media
    const currentPositionInMedia = currentPositionInChunk + activeBlock.chunk.start;
    // the future position in the chunk
    const newPositionInChunk = time - activeBlock.chunk.start;
    // the future position in the montage
    const newPositionInTimeline = activeBlock.start + newPositionInChunk;
    // if current position (in montage) differs from new one, update state data
    if ( Math.abs( currentPosition - newPositionInTimeline ) < TOLERANCE_SECONDS ) {
      const newActiveBlock = this.findActiveBlock( this.state.playlist, newPositionInTimeline );
      if ( newActiveBlock ) {
        this.setState( {
          currentPosition: newPositionInTimeline,
          activeBlock: newActiveBlock
        } );
      }
      else {
        this.setMediaPlaying( false )
      }
        
    }
    // else jump to proper position
    else {
      const to = currentPositionInMedia < TOLERANCE_SECONDS ? TOLERANCE_SECONDS : currentPositionInMedia
      this.player.seekTo( to );
    }
  }

  onSeek = ( time ) => {
    clearTimeout( seekTimeout );

    const activeBlock = this.findActiveBlock( this.state.playlist, time );
    this.setState( {
      currentPosition: time,
      activeBlock,
    } );
  }

  toggleMetadataVisible = () => {
    this.setState( {
      metadataVisible: !this.state.metadataVisible,
    } );
  }

  render = () => {
    const {
      state: {
        playlist: {
          list,
          duration
        },
        activeBlock,
        isPlaying,
        currentPosition,
        metadataVisible,
        isFullscreen,
        mediaSrc,
      },
      togglePlayPause,
      setMediaPlaying,
      onCurrentTimeChange,
      onSeek,
      props: {
        metadata = {},
      },
      toggleMetadataVisible,
      setFullscreen,
      toggleFullscreen,
    } = this;

    let mediaSeekTo;
    if ( activeBlock && activeBlock.blockType === 'chunk' ) {
      mediaSeekTo = currentPosition - activeBlock.start + activeBlock.chunk.start;
      mediaSeekTo = mediaSeekTo < 0 ? 0 : mediaSeekTo;
    }

    const onInfoClick = () => {
      if ( isPlaying ) {
        togglePlayPause();
      }
      toggleMetadataVisible();
    };

    const bindMediaPlayer = ( player ) => {
      this.player = player;
    };

    const renderAside = ( aside ) => {
      switch ( aside.type ) {
      case 'link':
        return (
          <div className={ 'aside-block link content' }>
            <p>
              <a
                href={ aside.url }
                target={ 'blank' }
                rel={ 'noopener' }
              >
                <i
                  className={ 'fas fa-link' }
                  style={ { marginRight: '1em' } }
                />
                {aside.text}
              </a>
            </p>
            {
              aside.displayWebpage &&
              <iframe src={ aside.url } />
            }
          </div>
        );
      case 'markdown':
        return (
          <div className={ 'aside-block markdown content' }>
            <Markdown src={ aside.content } />
          </div>
        );
      case 'images':
        if ( aside.images && aside.images.length > 1 ) {
          const images = aside.images.map( ( { url, content } ) => ( {
            original: url,
            thumbnail: url,
            description: (
              <div className={ 'content' }>
                <Markdown src={ content } />
              </div>
            )
          } ) );
          return (
            <div className={ 'aside-block images' }>
              {
                aside.title && aside.title.length &&
                <div className={ 'content' }>
                  <h2 className={ "aside-title" }>{aside.title}</h2>
                </div>
              }
              <ImageGallery items={ images } />
            </div>
          );
        }
        else if ( aside.images && aside.images.length > 0 ) {
          return (
            <div className={ 'aside-block image' }>
              {
                aside.title && aside.title.length &&
                <div className={ 'title' }>
                  <h2 className={ "aside-title" }>{aside.title}</h2>
                </div>
              }
              <img src={ aside.images[0].url } />
              <div className={ 'content' }>
                <Markdown src={ aside.images[0].content } />
              </div>
            </div>
          );
        }
        else return null;

      default:
        return null;
      }
    };

    return (
      <Fullscreen
        enabled={ isFullscreen }
        onChange={ setFullscreen }
      >
        <div className={ 'dicto-MontagePlayer' }>
          <div className={ 'main-row' }>
            <div
              className={ `media-wrapper ${activeBlock && activeBlock.blockType === 'comment' ? 'with-comment' : ''}` }
            >
              {
                          activeBlock && activeBlock.blockType === 'comment' ?
                            <div className={ 'comment-card content' }>
                              <div
                                style={ {
                                position: 'relative',
                                top: `${( 0.5 - ( currentPosition - activeBlock.start ) / ( activeBlock.end - activeBlock.start ) ) * 2 * 100 }%`
                              } }
                              >
                                <Markdown src={ activeBlock.content } />
                              </div>
                            </div>
                          :
                            <div className={ 'media-contents-container' }>
                              {
                                  mediaSrc &&
                                  <MediaPlayer
                                    ref={ bindMediaPlayer }
                                    src={ mediaSrc }
                                    displayUi={ false }

                                    shouldPlay={ isPlaying }

                                    setMediaPlaying={ setMediaPlaying }

                                    seekedTime={ mediaSeekTo }

                                    setMediaCurrentTime={ onCurrentTimeChange }
                                  />
                                }
                              <aside className={ `asides-wrapper ${activeBlock && activeBlock.asides && activeBlock.asides.length ? 'active' : ''}` }>
                                {
                                      activeBlock &&
                                          activeBlock.asides &&
                                          activeBlock.asides
                                            .map( ( aside, index ) => {
                                              return (
                                                <div
                                                  className={ 'aside-row' }
                                                  key={ index }
                                                >
                                                  {renderAside( aside )}
                                                </div>
                                              );
                                            } )
                                    }
                              </aside>
                            </div>
                      }
            </div>
            {
                      activeBlock ? /* eslint no-nested-ternary: 0 */
                        ( activeBlock.blockType === 'chunk'
                        && activeBlock.chunk.fields[activeBlock.activeFieldId]
                        && activeBlock.chunk.fields[activeBlock.activeFieldId].length ?
                          <div className={ 'chunk-comment-card' }>
                            <Markdown src={ activeBlock.chunk.fields[activeBlock.activeFieldId] } />
                          </div>
                          : null
                        ) : null
                    }
            <div className={ `metadata-wrapper ${metadataVisible ? 'visible' : ''}` }>
              <div style={ { width: '100%' } }>
                <h1 className={ 'title is-1 stretched-columns' }>
                  <span className={ "is-flex-1" }>
                    {metadata.title}
                  </span>
                  {
                                  metadataVisible &&
                                  <span
                                    onClick={ toggleMetadataVisible }
                                    style={ { cursor: 'pointer', paddingLeft: '1em', borderRadius: '50%' } }
                                    className={ 'icon' }
                                  >
                                    <i className={ 'fas fa-times-circle' } />
                                  </span>
                                }
                </h1>
                {
                              metadata.creators &&
                              <h2 className={ 'title is-3' }>
                                  {
                                    metadata.creators.reduce( ( res, creator, index ) => [
                                      ...res,
                                      index !== 0 ? <span key={ index }>, </span> : null,
                                      <span key={ creator.given + creator.family + index }>
                                        {creator.given}{' '}{creator.family}
                                      </span>
                                    ], [] )
                                  }
                              </h2>
                            }
                {
                              metadata.description &&
                              <div className={ 'content' }>
                                <Markdown src={ metadata.description } />
                              </div>
                            }
              </div>
            </div>
          </div>
          <div className={ 'gui-row' }>
            <div className={ 'gui-btn-container' }>
              <button
                style={ { display: isPlaying ? 'inline-block' : 'none' } }
                className={ 'button is-dark' }
                onClick={ togglePlayPause }
              >
                <span className={ 'icon' }>
                  <i className={ 'fas fa-pause' } />
                  
                </span>
              </button>
              <button
                style={ { display: !isPlaying ? 'inline-block' : 'none' } }
                className={ 'button is-dark' }
                onClick={ togglePlayPause }
              >
                <i className={ 'fas fa-play' } />
              </button>
            </div>
            <div className={ "time-display" }>
              <span className="time-display-anchor">🕐</span>
              <span className="time-display-value">
              <span>{currentPosition && currentPosition > 0 ? secsToSrt( parseInt( currentPosition ), false ) : secsToSrt( 0, false )}</span>
                <span>/</span>
                <span>{duration && duration > 0 ? secsToSrt( parseInt( duration ), false ) : secsToSrt( 0, false )}</span>
              </span>
              
            </div>
            <div className={ 'railway-container' }>
              <Railway
                orientation={ 'horizontal' }
                mediaCurrentTime={ currentPosition }
                mediaDuration={ duration }
                seekToMediaTime={ onSeek }
                chunks={ list }
                enableTooltip={true}
              />
            </div>
            <div className={ 'gui-btn-container' }>
              <button
                className={ 'button is-info' }
                onClick={ onInfoClick }
              >
                <span className={ 'icon' }>
                  <i className={ 'fas fa-info-circle' } />
                </span>
              </button>
              <button
                className={ 'button is-primary' }
                onClick={ toggleFullscreen }
              >
                <span className={ 'icon' }>
                  <i className={ 'fas fa-expand-arrows-alt' } />
                </span>
              </button>
            </div>
          </div>
        </div>
      </Fullscreen>
    );
  }
}
