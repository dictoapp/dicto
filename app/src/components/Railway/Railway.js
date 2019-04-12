import React, { Component } from 'react';
import {
  getEventRelativePosition,
  abbrev,
} from '../../helpers/utils';

import CommonMark from 'commonmark';

const reader = new CommonMark.Parser();
const writer = new CommonMark.HtmlRenderer();

import './Railway.scss';

import Tooltip from 'react-tooltip';

export default class Railway extends Component {

  constructor ( props ) {
    super( props );
    this.state = {
      dragStart: undefined,
      dragPosition: undefined,
      dragOnLift: undefined,
      tooltipContent: undefined,
    };
  }

  render = () => {
    const {
      mediaCurrentTime,
      mediaDuration,
      seekToMediaTime,
      chunkSpaceTimeScroll = {},
      chunks,
      orientation = 'vertical',
      onDrag,
      onDragEnd,
      selectedChunkId,
      enableTooltip = false,
    } = this.props;

    const {
      tooltipContent
    } = this.state;

    const silentEvent = ( e ) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const onClick = ( e ) => {
      silentEvent( e );
      const rect = e.target.getBoundingClientRect();
      const y = orientation === 'vertical' ? e.clientY - rect.top : e.clientX - rect.left; //y position within the element.
      const h = orientation === 'vertical' ? rect.height : rect.width;
      const ratio = y / h;
      const seekTo = mediaDuration * ratio;
      seekToMediaTime( seekTo );
      this.setState( {
        mouseDown: false
      } );
    };

    const setStartDrag = ( e ) => {
      const { x, y, rect } = getEventRelativePosition( e, 'dicto-Railway' );
      const h = orientation === 'vertical' ? rect.height : rect.width;
      const position = orientation === 'vertical' ? y : x;
      const thatRatio = position / h;
      const seekTo = mediaDuration * thatRatio;

      this.setState( {
        dragStart: seekTo,
        dragPosition: seekTo,
      } );
    };

    const onMouseDown = ( e ) => {
      silentEvent( e );

      if ( typeof onDrag === 'function' ) {
        this.setState( {
          mouseDown: true
        } );
      }
      else {
        onClick( e );
      }
    };

    const onMouseMove = ( e ) => {
      silentEvent( e );

      if (enableTooltip) {
        const { x, y, rect } = getEventRelativePosition( e, 'dicto-Railway' );
        const h = orientation === 'vertical' ? rect.height : rect.width;
        const position = orientation === 'vertical' ? y : x;
        const thatRatio = position / h;
        const realPosition = mediaDuration * thatRatio;
        const hoveredChunk = chunks.find(thatChunk => thatChunk.start < realPosition && thatChunk.end > realPosition);
        if (hoveredChunk) {
          const tooltipFieldId = hoveredChunk.activeFieldId;
          let newTooltipContent = hoveredChunk.chunk && hoveredChunk.chunk.fields[tooltipFieldId];
          newTooltipContent = newTooltipContent && abbrev(newTooltipContent.split('\n')[0], 100);
          newTooltipContent = newTooltipContent && writer.render(reader.parse(newTooltipContent));
          if (newTooltipContent !== tooltipContent) {
            this.setState({
              tooltipContent: newTooltipContent
            });
            this.tooltip.tooltipRef.innerHTML = newTooltipContent;
            Tooltip.rebuild();
          }
        }
      }

      if ( typeof onDrag === 'function' && this.state.mouseDown && !this.state.dragStart ) {
        setStartDrag( e );
      }

      else if ( typeof onDrag === 'function' && this.state.dragStart ) {
        const { x, y, rect } = getEventRelativePosition( e, 'dicto-Railway' );
        const h = orientation === 'vertical' ? rect.height : rect.width;
        const position = orientation === 'vertical' ? y : x;
        const thatRatio = position / h;
        const seekTo = mediaDuration * thatRatio;

        this.setState( {
          dragPosition: seekTo,
        } );

        const values = [ this.state.dragStart, seekTo ].sort( ( a, b ) => {
          if ( a > b ) {
            return 1;
          }
          return -1;
        } );
        const viewFrom = values[0];
        const viewTo = values[1];
        onDrag( { viewFrom, viewTo } );
      }
    };

    const onMouseUp = ( e ) => {
      silentEvent( e );

      if ( typeof onDrag === 'function' && this.state.dragStart ) {
        const { x, y, rect } = getEventRelativePosition( e, 'dicto-Railway' );
        const h = orientation === 'vertical' ? rect.height : rect.width;
        const position = orientation === 'vertical' ? y : x;
        const thatRatio = position / h;
        const seekTo = mediaDuration * thatRatio;

        this.setState( {
          dragPosition: seekTo,
        } );
        if ( this.state.dragStart === seekTo ) {
          return onClick( e );
        }
        else if ( typeof onDragEnd === 'function' ) {
          setTimeout( () => onDragEnd() );
        }
        const values = [ this.state.dragStart, seekTo ].sort( ( a, b ) => {
          if ( a > b ) {
            return 1;
          }
          return -1;
        } );
        const viewFrom = values[0];
        const viewTo = values[1];

        onDrag( { viewFrom, viewTo } );
      }
      else onClick( e );

      this.setState( {
        dragStart: undefined,
        dragPosition: undefined,
        dragOnLift: undefined,
        mouseDown: false
      } );
    };

    const onMouseLeave = ( e ) => {
      silentEvent( e );
      if ( typeof onDragEnd === 'function' ) {
        onDragEnd();
      }
      this.setState( {
        dragStart: undefined,
        dragPosition: undefined,
        dragOnLift: undefined,
        mouseDown: false
      } );
    };

    const onMouseWheel = ( e ) => {
      silentEvent( e );

      const absDelta = orientation === 'vertical' ? e.deltaY : e.deltaX;
      // const relDelta = absDelta * 100 / mediaDuration;
      const span = chunkSpaceTimeScroll.viewFrom - chunkSpaceTimeScroll.viewTo;
      let delta = span * 0.1;
      delta = absDelta > 0 ? delta : -delta;
      const viewFrom = chunkSpaceTimeScroll.viewFrom + delta;
      const viewTo = chunkSpaceTimeScroll.viewTo + delta;
      if ( viewFrom >= 0 && viewTo <= mediaDuration ) {
        onDrag( { viewFrom, viewTo } );
      }
    };

    let scrollTop;
    let scrollHeight;
    if ( chunkSpaceTimeScroll.viewFrom !== undefined ) {
      scrollHeight = ( chunkSpaceTimeScroll.viewTo - chunkSpaceTimeScroll.viewFrom ) / mediaDuration;
      scrollHeight = scrollHeight * 100;
      scrollTop = ( ( chunkSpaceTimeScroll.viewFrom ) / mediaDuration ) * ( 100 );
    }
    const buildChunkStyle = ( chunk ) => {
      const active = chunk.metadata && selectedChunkId === chunk.metadata.id;
      const railwayStyle = {
        position: 'absolute',
        left: chunk.x !== undefined ? `${chunk.x * 100 }%` : 0,
        top: `${chunk.start / mediaDuration * 100 }%`,
        width: chunk.x !== undefined ? `${Math.abs( ( chunk.x + 0.3 > 1 ? 1 - chunk.x : 0.3 ) * 100 ) }%` : '100%',
        height: `${Math.abs( ( chunk.end - chunk.start ) / mediaDuration * 100 ) }%`,
        background: active ? '#8e8c84' : '#f8f5f0',
        pointerEvents: 'none',
        border: '1px solid #8e8c84',
        boxSizing: 'border-box',
      };
      if ( orientation === 'horizontal' ) {
        const width = railwayStyle.height;
        const height = railwayStyle.width;
        const top = railwayStyle.left;
        const left = railwayStyle.top;
        return {
          ...railwayStyle,
          width, height, top, left,
        };
      }
      return railwayStyle;
    };

    const bindTooltip = tooltip => {
      this.tooltip = tooltip;
    }

    const timeMarkPosition = `${( mediaCurrentTime / mediaDuration ) * 100 }%`;

    return (
      <div
        className={ `dicto-Railway ${orientation}` }
        onMouseDown={ onMouseDown }
        onMouseUp={ onMouseUp }
        onMouseMove={ onMouseMove }
        onWheel={ onMouseWheel }
        onMouseLeave={ onMouseLeave }
        data-tip={tooltipContent}
        data-for="railway-tooltip"
        data-html={true}
      >
        {
              chunks.map( ( chunk, index ) => {
                return (
                  <div
                    key={ index }
                    style={ buildChunkStyle( chunk ) }
                  />
                );
              } )
            }
        {
              scrollHeight ?
                <div
                  className={ 'scroll-mark' }
                  style={ {
                      top: orientation === 'vertical' ? `${scrollTop }%` : undefined,
                      height: orientation === 'vertical' ? `${scrollHeight }%` : undefined,

                      left: orientation === 'horizontal' ? `${scrollTop }%` : undefined,
                      width: orientation === 'horizontal' ? `${scrollHeight }%` : undefined,
                    } }
                />
              : 
                null
            }
        <div
          className={ 'time-mark' }
          style={ {
                  top: orientation === 'vertical' ? timeMarkPosition : undefined,
                  left: orientation === 'horizontal' ? timeMarkPosition : undefined,
                } }
        />
        <Tooltip ref={bindTooltip} id="railway-tooltip" />
      </div>
    );
  }
}
