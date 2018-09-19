import React from 'react';
import PropTypes from 'prop-types';

import Markdown from '../MarkdownPlayer';

import {
  secsToSrt
} from '../../helpers/utils';

import './TimelineChunk.scss';

const TimelineChunk = ( {
  chunk,
  chunkSpaceRatio,

  selectChunk,

  tags = [],
  tagCategories = {},
  selected = false,
  minified = false,
  displayedContent = '',
  indirectContent = false,
  // onDelete,
}, {
  spaceDimensions = {},
  onDragStart,
  draggedItemId
} ) => {

  const onClick = ( e ) => {
    e.stopPropagation();
    selectChunk( chunk.metadata.id, e );
  };

  const silenceEvent = ( e ) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const onSelect = () => {
    selectChunk( chunk.metadata.id );
  };

  const onChunkDragStart = ( e ) => {
    e.stopPropagation();
    if ( typeof onDragStart === 'function' ) {
      onDragStart( e, chunk.metadata.id, 'move' );
    }
    onSelect();
  };

  const onChunkTopDragStart = ( e ) => {
    onSelect();
    e.preventDefault();
    if ( typeof onDragStart === 'function' ) {
      onDragStart( e, chunk.metadata.id, 'top' );
    }
  };

  const onChunkBottomDragStart = ( e ) => {
    onSelect();
    e.preventDefault();
    if ( typeof onDragStart === 'function' ) {
      onDragStart( e, chunk.metadata.id, 'bottom' );
    }
  };

  return (
    <div
      className={ `dicto-TimelineChunk ${selected ? 'selected' : ''} ${minified ? 'minified' : ''}` }
      onMouseDown={ onSelect }
      style={ {
            left: spaceDimensions.width && chunk.x * spaceDimensions.width,
            top: chunk.start * chunkSpaceRatio,
            width: spaceDimensions.width && ( chunk.x + 0.3 >= 1 ? 1 - chunk.x : 0.3 ) * spaceDimensions.width,
            height: ( chunk.end - chunk.start ) * chunkSpaceRatio,
            pointerEvents: draggedItemId ? 'none' : 'all',
            zIndex: selected ? 2 : 1
          } }
    >

      <div className={ 'top-band level' } >
        <div
          className={ 'resize-top-grip' }
          onMouseDown={ onChunkTopDragStart }
          onMouseUp={ onClick }
        />
        <span className={ 'time-marker' }>
          {secsToSrt( chunk.start )}
        </span>
      </div>

      <div
        className={ 'middle-band' }
        onMouseUp={ onClick }
      >
        <div className={ 'tags-marks-container' }>
          {
                    tags.map( ( tag ) => {
                      const tagCategory = tagCategories[tag.tagCategoryId];
                      if ( tagCategory ) {
                        return (
                          <span
                            style={ { background: tagCategory.color } }
                            key={ tag.metadata.id }
                          />
                        );
                      }
                      return null;

                    } )
                  }
        </div>
        {
                displayedContent.length ?
                  <div
                    style={ { opacity: indirectContent ? 0.2 : 1 } }
                    className={ 'contents-preview content' }
                  >
                    <div
                      onMouseUp={ onClick }
                      onMouseDown={ silenceEvent }
                    >
                      <Markdown src={ displayedContent } />
                    </div>
                  </div>
                : 
                  null
              }
        <div
          className={ 'move-grip' }
          onMouseDown={ onChunkDragStart }
          onClick={ onClick }
        >
          <i className={ 'fas fa-arrows-alt' } />
        </div>

      </div>
      <div
        className={ 'bottom-band level' }
        onClick={ onClick }
      >
        <div
          className={ 'resize-bottom-grip' }
          onMouseDown={ onChunkBottomDragStart }
        />
        <span className={ 'time-marker' }>
          {secsToSrt( chunk.end )}
        </span>
      </div>
    </div>
  );
};

TimelineChunk.contextTypes = {
  spaceDimensions: PropTypes.object,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  draggedItemId: PropTypes.string
};

export default TimelineChunk;
