import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import {
  Draggable
} from 'react-beautiful-dnd';

import MediaThumbnail from '../../../components/MediaThumbnail';
import {
  abbrev,
  secsToSrt
} from '../../../helpers/utils';

class CompositionChunk extends Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }
  render = () => {
    const {
      props: {
        chunk,
        index,
        corpus,
        addChunkToComposition,
        onAddAllFromSameMedia,
        history,
        activeFieldId,
        medias,
        canQuote,
      },
      context: { t }
    } = this;
    const duration = Math.abs( chunk.end - chunk.start );
    return (
      <Draggable
        key={ chunk.metadata.id }
        draggableId={ chunk.metadata.id }
        type={ 'CHUNK' }
        index={ index }
      >

        {( providedChunk, chunkSnapshot ) => (
          <ContextMenuTrigger id={ chunk.metadata.id }>
            <div
              className={ chunkSnapshot.isDragging ? 'dragged-chunk' : 'still-chunk' }
              ref={ providedChunk.innerRef }
              { ...providedChunk.dragHandleProps }
              { ...providedChunk.draggableProps }
            >
              <div
                style={ { cursor: 'move', padding: 0 } }
                className={ 'card dicto-ChunkCard' }
              >
                <div
                  style={ { padding: 0, margin: 0 } }
                  className={ 'card-content stretched-columns' }
                >
                  <MediaThumbnail
                    mediaUrl={ medias[chunk.metadata.mediaId].metadata.mediaUrl }
                    mediaThumbnailUrl={ medias[chunk.metadata.mediaId].metadata.mediaThumbnailUrl }
                  />
                  <div
                    style={ { padding: '1rem' } }
                    className={ 'is-flex-1' }
                  >
                    <div
                      data-for={ 'tooltip' }
                      data-tip={ chunk.fields[activeFieldId] }
                    >
                      {abbrev( chunk.fields[activeFieldId] || '', 50 )}
                    </div>
                    <ul className={ 'info-numbers' }>
                      <li>
                        <i className={ 'fas fa-clock' } />
                        <span className={ 'info-number' }>
                          {secsToSrt( parseInt( duration, 10 ), false )}
                        </span>
                      </li>
                      <li>
                        <i className={ 'fas fa-video' } />
                        <span className={ 'info-number' }>
                          {t( [ 'one tag', '{n} tags', 'n' ], { n: chunk.tags.length } )}
                        </span>
                      </li>

                    </ul>
                  </div>
                  <div className={ 'actions-container' }>
                    <button
                      data-for={ 'tooltip' }
                      data-tip={ t( 'Edit related media excerpts' ) }
                      onClick={ () => {
                                            history.push( `/corpora/${corpus.metadata.id}/chunks?activeMedia=${corpus.medias[chunk.metadata.mediaId].metadata.mediaUrl}` );
                                        } }
                      className={ 'button is-rounded' }
                    >
                      <i className={ 'fas fa-eye' } />
                    </button>
                    <button
                      data-for={ 'tooltip' }
                      data-tip={ t( 'Add this excerpt to your composition' ) }
                      onClick={ () => addChunkToComposition( chunk, false ) }
                      className={ `button is-rounded ${canQuote ? '' : 'is-disabled'}` }
                    >
                      <i className={ 'fas fa-link' } />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {providedChunk.placeholder}
            <ContextMenu
              key={ chunk.metadata.id }
              id={ chunk.metadata.id }
            >
              <div className={ 'dropdown-content' }>
                <MenuItem
                  attributes={ { className: 'dropdown-item' } }
                  onClick={ () => {
                                    addChunkToComposition( chunk, true );
                                  } }
                >
                  {t( 'add excerpt at begining of composition' )}
                </MenuItem>
                <MenuItem
                  attributes={ { className: 'dropdown-item' } }
                  onClick={ () => {
                                    addChunkToComposition( chunk, false );
                                  } }
                >
                  {t( 'add excerpt at end of composition' )}
                </MenuItem>
                <MenuItem
                  attributes={ { className: 'dropdown-divider' } }
                  divider
                />
                <MenuItem
                  attributes={ { className: 'dropdown-item' } }
                  onClick={ () => {
                                    onAddAllFromSameMedia();
                                  } }
                >
                  {t( 'add all excerpts from this media' )}
                </MenuItem>
                <MenuItem
                  attributes={ { className: 'dropdown-divider' } }
                  divider
                />
                <MenuItem
                  attributes={ { className: 'dropdown-item' } }
                  onClick={ () => {
                                    history.push( `/corpora/${corpus.metadata.id}/chunks?activeMedia=${corpus.medias[chunk.metadata.mediaId].metadata.mediaUrl}` );
                                  } }
                >
                  {t( 'edit related media excerpts' )}
                </MenuItem>
              </div>
            </ContextMenu>
          </ContextMenuTrigger>
        )}

      </Draggable>
    );
  }
}

CompositionChunk.contextTypes = {
  t: PropTypes.func
};

export default CompositionChunk;

