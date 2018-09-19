/* eslint react/no-set-state : 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import MiniControl from './MiniControl';

import { Scrollbars } from 'react-custom-scrollbars';
import { SpringSystem, MathUtil } from 'rebound';
import Measure from 'react-measure';

import {
  getEventRelativePosition,
  secsToSrt
} from '../../helpers/utils';

const AUTOSCROLL_SPEED = 0.03;
const AUTOSCROLL_THRESHOLD_FRACTION = 0.9;

import './ChunksSpace.scss';

const computeSpan = ( ratio ) => {
  if ( ratio > 100 ) {
    return 0.5;
  }
  else if ( ratio >= 30 ) {
    return 1;
  }
  else if ( ratio >= 13 ) {
    return 5;
  }
  else if ( ratio >= 8 ) {
    return 10;
  }
  else if ( ratio >= 4 ) {
    return 30;
  }
  else if ( ratio >= 1 ) {
    return 60;
  }
  else if ( ratio >= 0.2 ) {
    return 60 * 5;
  }
  else if ( ratio >= 0.1 ) {
    return 60 * 10;
  }
  else {
    return 60 * 30;
  }
};

const renderTicks = ( duration, ratio, { viewFrom = 0, viewTo = Infinity } ) => {
  const margin = ( viewTo - viewFrom ) / 2;
  const span = computeSpan( ratio );
  const marks = [];
  let pos = 0;
  while ( pos <= duration ) {
    marks.push( pos );
    pos += span;
  }

  return (
    <ul className={ 'marks-container' }>
      {
        marks
          .filter( ( s ) => s >= viewFrom - margin && s <= viewTo + margin )
          .map( ( mark ) => (
            <li
              className={ 'mark' }
              key={ mark }
              style={ {
                top: mark * ratio,
              } }
            >
              <span
                className={ "mark-content left" }
              >
                {secsToSrt( mark )}
              </span>
              <span
                className={ "mark-content right" }
              >
                {secsToSrt( mark )}
              </span>
            </li>
          ) )
      }
    </ul>
  );
};

class FocusedInput extends Component {
  componentWillReceiveProps = ( nextProps ) => {
    if ( !this.props.isActive && nextProps.isActive ) {
      this.input.focus();
    }
  }
  render = () => {
    const bindRef = ( input ) => {
      this.input = input;
    };
    const {
      isActive, /* eslint no-unused-vars : 0 */
      ...props
    } = this.props;
    return ( 
      <input
        ref={ bindRef }
        { ...props }
      /> 
    );
  }
}

export default class ChunksSpace extends Component {

  static childContextTypes = {
    spaceDimensions: PropTypes.object,
    onDragStart: PropTypes.func,
    draggedItemId: PropTypes.string,
  }

  constructor( props ) {
    super( props );
    this.state = {
      scrollValues: {},
      draggedItemId: undefined,
      searchActive: false,
      searchTerm: ''
    };
    this.handleSpringUpdate = this.handleSpringUpdate.bind( this );

    this.zoomIn = debounce( this.zoomIn, 50 );
    this.zoomOut = debounce( this.zoomOut, 50 );
  }

  getChildContext = () => ( {
    spaceDimensions: this.state.dimensions,
    onDragStart: this.onChildDragStart,
    draggedItemId: this.state.draggedItemId
  } )

  componentDidMount = () => {
    const scrollValues = this.computeScrollbarValues();
    this.setState( {
      scrollValues
    } );
    setTimeout( () => this.onScroll( scrollValues ) );
    this.springSystem = new SpringSystem();
    this.spring = this.springSystem.createSpring();
    this.spring.addListener( { onSpringUpdate: this.handleSpringUpdate } );
  }

  componentWillReceiveProps( nextProps ) {
    if (
      ( nextProps.scrollTargetInSeconds !== this.props.scrollTargetInSeconds ||
      nextProps.scrollTargetInSeconds !== this.props.scrollTargetInSeconds ) &&
      nextProps.scrollTargetInSeconds !== undefined
    ) {
      const {
        // top,
        scrollHeight,
        clientHeight
      } = this.state.scrollValues;
      const targetFraction = nextProps.scrollTargetInSeconds / nextProps.mediaDuration;
      const target = ( scrollHeight * targetFraction ) - clientHeight / 2;
      this.scrollTop( target );
      nextProps.setScrollTargetInSeconds( undefined );
    }

    if (
      this.props.chunkSpaceTimeScroll.viewFrom !== nextProps.chunkSpaceTimeScroll.viewFrom ||
        this.props.chunkSpaceTimeScroll.viewTo !== nextProps.chunkSpaceTimeScroll.viewTo
    ) {
      this.updateRatio( nextProps );
    }

    if ( this.props.mediaDuration !== nextProps.mediaDuration ) {
      setTimeout( () => {
        const scrollValues = this.computeScrollbarValues();
        this.setState( {
          scrollValues
        } );
        this.onScroll( scrollValues );
        this.updateRatio( this.props );
      } );
    }
  }

  componentDidUpdate = ( previousProps, previousState ) => {
    if ( this.state.zoomingIn ) {
      this.zoomIn();
    }
    else if ( this.state.zoomingOut ) {
      this.zoomOut();
    }

    if ( previousState.searchTerm !== this.state.searchTerm && this.state.searchTerm.length > 1 ) {
      const { items, ratio } = this.props;
      const searchTerm = this.state.searchTerm.toLowerCase();
      const matching = items.find( ( item ) => JSON.stringify( item ).toLowerCase().includes( searchTerm ) );
      if ( matching ) {
        this.scrollTop( matching.start * ratio );
      }
    }
  }

  componentWillUnmount() {
    this.springSystem.deregisterSpring( this.spring );
    this.springSystem.removeAllListeners();
    this.springSystem = undefined;
    this.spring.destroy();
    this.spring = undefined;
    this.zoomIn.flush();
    this.zoomOut.flush();
  }

  toggleSearch = () => {
    this.setState( {
      searchActive: !this.state.searchActive,
      searchTerm: ''
    } );
  }
  setSearchTerm = ( searchTerm ) => {
    this.setState( {
      searchTerm
    } );
  }

  updateRatio = ( nextProps ) => {
    const {
      chunkSpaceTimeScroll,
      setRatio,
      ratio,
    } = nextProps;
    const timeSpan = chunkSpaceTimeScroll.viewTo - chunkSpaceTimeScroll.viewFrom;
    const height = this.state.dimensions && this.state.dimensions.height;
    if ( height ) {
      const nextRatio = height / timeSpan;
      const margin = nextRatio / 10;

      if ( !isNaN( nextRatio ) && Math.abs( nextRatio - ratio ) > margin ) {
        setRatio( nextRatio );
        const target = nextRatio * chunkSpaceTimeScroll.viewFrom;
        this.scrollbar.scrollTop( target );
      }
    }
  }

  forceScrollView = ( { viewFrom, viewTo } ) => {
    const timeSpan = viewTo - viewFrom;
    const height = this.state.dimensions && this.state.dimensions.height;

    if ( height ) {
      const nextRatio = height / timeSpan;
      if ( !isNaN( nextRatio ) ) {
        const target = nextRatio * viewFrom;
        this.scrollbar.scrollTop( target );
      }
    }
  }

  onChildDragStart = ( e, itemId, draggedItemType ) => {
    this.setState( {
      draggedItemId: itemId,
      draggedItemType
    } );

    e.stopPropagation();
    e.preventDefault();
  }

  computeScrollbarValues = () => {
    const clientHeight = this.scrollbar.getClientHeight();
    const top = this.scrollbar.getScrollTop();
    const scrollHeight = this.scrollbar.getScrollHeight();

    return {
      clientHeight,
      scrollHeight,
      top
    };
  }

  scrollTop( top ) {
    const { scrollbar } = this;
    const scrollTop = scrollbar.getScrollTop();
    const scrollHeight = scrollbar.getScrollHeight();
    const val = MathUtil.mapValueInRange( top, 0, scrollHeight, 0, scrollHeight );
    this.spring.setCurrentValue( scrollTop ).setAtRest();
    this.spring.setEndValue( val );
  }

  handleSpringUpdate( spring ) {
    const { scrollbar } = this;
    const val = spring.getCurrentValue();
    scrollbar.scrollTop( val );
  }

  setChunkSpaceTimeScroll = ( scrollBounds ) => {
    this.props.setChunkSpaceTimeScroll( scrollBounds );
  }

  onScroll = ( values ) => {
    if ( !this.props.scrollLocked ) {
      const { mediaDuration } = this.props;
      const ratioY = ( values.scrollTop || 0 ) / values.scrollHeight;
      const ratioH = values.clientHeight / values.scrollHeight;
      const timeY = mediaDuration * ratioY;
      const timeH = mediaDuration * ratioH;
      const viewFrom = timeY;
      const viewTo = timeY + timeH;
      if ( !isNaN( viewFrom ) && !isNaN( viewTo ) ) {
        this.setChunkSpaceTimeScroll( {
          viewFrom,
          viewTo
        } );
      }
      this.setState( {
        scrollValues: values
      } );
    }
  }

  zoomIn = () => {
    const {
      chunkSpaceTimeScroll,
      zoomFactor = 1.1,
      setScrollLocked,
      scrollLocked,
    } = this.props;

    const diff = chunkSpaceTimeScroll.viewTo - chunkSpaceTimeScroll.viewFrom;
    const newDiff = diff / zoomFactor;
    const center = chunkSpaceTimeScroll.viewFrom + diff / 2;
    const props = {
      viewFrom: center - newDiff / 2,
      viewTo: center + newDiff / 2,
    };
    this.setChunkSpaceTimeScroll( props );
    this.updateRatio( {
      ...this.props,
      chunkSpaceTimeScroll: props
    } );
    if ( scrollLocked ) {
      setScrollLocked( true );
      setTimeout( () => setScrollLocked( false ), 1000 );
    }
  };

  zoomOut = () => {
    const {
      chunkSpaceTimeScroll,
      zoomFactor = 1.1,
      mediaDuration,
      scrollLocked,
      setScrollLocked,
    } = this.props;
    const duration = chunkSpaceTimeScroll.viewTo - chunkSpaceTimeScroll.viewFrom;
    const newDuration = duration * zoomFactor;
    const center = chunkSpaceTimeScroll.viewFrom + duration / 2;

    let newFrom = center - newDuration / 2;
    newFrom = newFrom < 0 ? 0 : newFrom;
    let newTo = center + newDuration / 2;
    newTo = newTo > mediaDuration ? mediaDuration : newTo;
    const props = {
      viewFrom: newFrom,
      viewTo: newTo,
    };
    this.setChunkSpaceTimeScroll( props );
    this.updateRatio( {
      ...this.props,
      chunkSpaceTimeScroll: props
    } );
    if ( scrollLocked ) {
      setScrollLocked( true );
      setTimeout( () => setScrollLocked( false ), 100 );
    }
  }

  render = () => {
    const {
      ratio = 1,
      mediaDuration = 1,
      mediaCurrentTime = 0,
      seekToMediaTime,
      chunkSpaceTimeScroll,
      items = [],
      isEmpty,

      mediaPlaying,
      setMediaPlaying,

      seekBackward,
      seekForward,
      onCut,
      activeChunk,
      contentsIfEmpty,

      addChunk,
      isDragging,
      setIsDragging,
      children,
    } = this.props;

    const {
      dragStart,
      dragPosition,
      dimensions,
      searchActive,
      searchTerm
    } = this.state;
    const {
      toggleSearch,
      setSearchTerm
    } = this;

    const syncDragging = ( to ) => {
      if ( to !== isDragging ) {
        setIsDragging( to );
      }
    };

    const onSpaceMouseDown = ( e ) => {
      e.stopPropagation();
      e.preventDefault();
      let isRightMB;
      if ( 'which' in e ) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which === 3;
      }
      else if ( 'button' in e ) { // IE, Opera
        isRightMB = e.button === 2;
      }
      if ( isRightMB ) {
        return;
      }

      const { x, y, rect } = getEventRelativePosition( e, 'ticks-space' );
      const h = rect.height;
      const thatRatio = y / h;
      const seekTo = mediaDuration * thatRatio;
      this.setState( {
        dragStart: {
          y: seekTo,
          x: x / rect.width
        },
      } );
    };
    const onSpaceMouseMove = ( e ) => {
      e.stopPropagation();
      e.preventDefault();

      if ( this.state.draggedItemId || dragStart ) {
        const { x, y, rect } = getEventRelativePosition( e, 'ticks-space' );
        const h = rect.height;
        const thatRatio = y / h;
        const seconds = mediaDuration * thatRatio;
        if ( this.state.draggedItemId ) {
          syncDragging( true );
          this.props.onElementDrag(
            this.state.draggedItemId, {
              y: this.state.lastDragYPositionSeconds,
              prevY: seconds,
              x: x / rect.width,
              prevX: this.state.lastDragXPositionFraction,
              type: this.state.draggedItemType
            } );
          this.setState( {
            lastDragYPositionSeconds: seconds,
            lastDragXPositionFraction: x / rect.width,
          } );
        }
        else if ( dragStart ) {
          const newY = seconds;
          const newX = x / rect.width;
          syncDragging( true );
          this.setState( {
            dragPosition: {
              x: newX,
              y: newY
            }
          } );
        }

        if ( y - this.scrollbar.getScrollTop() > dimensions.height * AUTOSCROLL_THRESHOLD_FRACTION ) {
          const diff = dimensions.height - y + this.scrollbar.getScrollTop();
          const displace = ( dimensions.height * AUTOSCROLL_THRESHOLD_FRACTION - diff );
          this.scrollbar.scrollTop( this.scrollbar.getScrollTop() + displace * AUTOSCROLL_SPEED );
        }
        else if ( y - this.scrollbar.getScrollTop() < dimensions.height * ( 1 - AUTOSCROLL_THRESHOLD_FRACTION ) ) {
          const diff = dimensions.height - y + this.scrollbar.getScrollTop();
          const displace = ( dimensions.height * ( 1 - AUTOSCROLL_THRESHOLD_FRACTION ) - diff );
          this.scrollbar.scrollTop( this.scrollbar.getScrollTop() + displace * AUTOSCROLL_SPEED );
        }
      }
    };
    const onSpaceMouseUp = ( e ) => {
      e.stopPropagation();
      e.preventDefault();
      const { y, rect } = getEventRelativePosition( e, 'ticks-space' );

      const h = rect.height;
      const thatRatio = y / h;
      const seekTo = mediaDuration * thatRatio;
      if ( this.state.draggedItemId ) {
        this.setState( {
          lastDragYPositionSeconds: undefined,
          lastDragXPositionFraction: undefined,
          draggedItemType: undefined,
          draggedItemId: undefined,
        } );
      }
      else if ( this.state.dragStart && this.state.dragStart.y === seekTo ) {
        seekToMediaTime( seekTo );
      }
      else if ( dragStart && dragPosition ) {
        // handling reverse brushing cases
        const finalX = [ dragStart.x, dragPosition.x ].sort()[0];
        const width = Math.abs( dragPosition.x - dragStart.x );
        const ys = [ dragStart.y, seekTo ].sort( ( a, b ) => {
          if ( a > b ) {
            return 1;
          }
          else return -1;
        } );
        addChunk( {
          startTime: ys[0],
          endTime: ys[1],
          x: finalX,
          width
        } );
      }
      syncDragging( false );
      this.setState( {
        dragStart: undefined,
        dragPosition: undefined,
      } );
    };

    const onSpaceMouseLeave = ( e ) => {

      /*
       * this.setState( {
       *   dragStart: undefined,
       *   dragPosition: undefined,
       *   lastDragYPositionSeconds: undefined,
       *   lastDragXPositionFraction: undefined,
       *   draggedItemType: undefined,
       *   draggedItemId: undefined,
       * } );
       */
    };

    const onZoomInStart = ( e ) => {
      e.stopPropagation();
      e.preventDefault();
      this.zoomIn();
      this.setState( {
        zoomingIn: true
      } );
    };
    const onZoomOutStart = ( e ) => {
      e.stopPropagation();
      e.preventDefault();
      this.zoomOut();
      this.setState( {
        zoomingOut: true
      } );
    };

    const onZoomInEnd = ( e ) => {
      e.stopPropagation();
      e.preventDefault();
      this.setState( {
        zoomingIn: false
      } );
    };
    const onZoomOutEnd = ( e ) => {
      e.stopPropagation();
      e.preventDefault();
      this.setState( {
        zoomingOut: false
      } );
    };

    const bindScrollRef = ( scrollbar ) => {
      this.scrollbar = scrollbar;
    };
    let placeHolderPosition;
    if ( dragStart && dragPosition ) {
      const x = [ dragStart.x, dragPosition.x ].sort( ( a, b ) => {
        if ( a > b ) {
          return 1;
        }
        else return -1;
      } );
      const y = [ dragStart.y, dragPosition.y ].sort( ( a, b ) => {
        if ( a > b ) {
          return 1;
        }
        else return -1;
      } );
      placeHolderPosition = {
        left: `${x[0] * 100 }%`,
        top: y[0] * ratio,
        width: `${( x[1] - x[0] ) * 100 }%`,
        height: ( y[1] - y[0] ) * ratio
      };
    }
    const handleCut = () => {
      const toCut = items.filter( ( item ) => item.start < mediaCurrentTime && item.end > mediaCurrentTime );
      toCut.forEach( ( chunk ) => onCut( chunk, mediaCurrentTime ) );
    };
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
              ref={ measureRef }
              className={ 'dicto-ChunksSpace' }
            >
              <Scrollbars
                onScrollFrame={ this.onScroll }
                ref={ bindScrollRef }
              >
                <div
                  className={ 'ticks-space' }
                  style={ {
                    height: ratio * mediaDuration
                  } }
                  onMouseDown={ onSpaceMouseDown }
                  onMouseUp={ onSpaceMouseUp }
                  onMouseLeave={ onSpaceMouseLeave }
                  onMouseMove={ onSpaceMouseMove }
                >
                  {renderTicks( mediaDuration, ratio, chunkSpaceTimeScroll )}

                  {children}
                  {
                            placeHolderPosition ?
                              <div
                                className={ 'selection-placeholder' }
                                style={ placeHolderPosition }
                              />
                              : null
                          }
                  <div
                    className={ 'time-mark' }
                    style={ {
                      top: `${( mediaCurrentTime / mediaDuration ) * 100 }%`
                    } }
                  />
                  <MiniControl
                    mediaPlaying={ mediaPlaying }
                    setMediaPlaying={ setMediaPlaying }
                    seekBackward={ seekBackward }
                    seekForward={ seekForward }
                    allowCut={ activeChunk }
                    onCut={ handleCut }
                    style={ {
                      top: `${( mediaCurrentTime / mediaDuration ) * 100 }%`
                    } }
                  />
                </div>
              </Scrollbars>
              <ul className={ 'ratio-ui' }>
                <li
                  className={ '' }
                  style={ { display: 'flex', flexFlow: 'row nowrap' } }
                >
                  <button
                    className={ `button is-rounded ${searchActive ? 'is-primary' : ''}` }
                    onClick={ toggleSearch }
                  >
                    <i className={ 'fas fa-search' } />
                  </button>
                  <FocusedInput
                    style={ {
                      transition: 'all .5s ease',
                      background: 'rgba(0,0,0,0.3)',
                      border: 'none',
                      maxWidth: searchActive ? 200 : 0,
                      marginLeft: '1rem',
                      padding: searchActive ? undefined : 0,
                      overflow: 'hidden'
                    } }
                    type={ 'text' }
                    value={ searchTerm }
                    isActive={ searchActive }
                    onChange={ ( e ) => setSearchTerm( e.target.value ) }
                    className={ 'input' }
                  />

                </li>
                <li>
                  <button
                    className={ 'button is-rounded' }
                    onMouseDown={ onZoomInStart }
                    onMouseUp={ onZoomInEnd }
                  >
                    <i className={ 'fas fa-search-plus' } />
                  </button>
                </li>
                <li>
                  <button
                    className={ 'button is-rounded' }
                    onMouseDown={ onZoomOutStart }
                    onMouseUp={ onZoomOutEnd }
                  >
                    <i className={ 'fas fa-search-minus' } />
                  </button>
                </li>
              </ul>
              {
                isEmpty &&
                <div
                  style={ {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  } }
                >
                  <div
                    className={ 'title is-4' }
                    style={ { opacity: 0.8, maxWidth: '50%' } }
                  >
                    {contentsIfEmpty}
                  </div>
                </div>
              }
            </div>
          )
        }
      </Measure>
    );
  }
}
