import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as genId } from 'uuid';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import CommentCard from '../../../components/CommentCard';
import MediaThumbnail from '../../../components/MediaThumbnail';

import {
  Draggable
} from 'react-beautiful-dnd';

import {
  abbrev,
  secsToSrt
} from '../../../helpers/utils';

class CompositionBlock extends Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }
  render = () => {
    const {
      props: {
        compositionBlock,
        index,
        maxIndex,
        updateComposition,
        corpus,
        composition,
        setActiveCompositionBlockId,
        onReorder,
        medias,
        onMoveUp,
        onMoveDown,
        onMoveTo,
        onDeleteAll,
      },
      context: { t }
    } = this;
    const type = compositionBlock.blockType;

    let chunk;
    let duration;
    let invalidChunk;
    if ( type === 'chunk' ) {
      chunk = corpus.chunks[compositionBlock.content];
      if ( chunk ) {
        duration = Math.abs( chunk.end - chunk.start );
      }
 else {
        invalidChunk = true;
      }
    }
    else {
      duration = compositionBlock.duration;
    }

    const createComment = () => ( {
      metadata: {
        id: genId(),
        createdAt: new Date().getTime(),
        lastModifiedAt: new Date().getTime(),
      },
      blockType: 'comment',
      content: '',
      duration: 5
    } );

    const onAddCommentBefore = () => {
      const comment = createComment();
      updateComposition(
        corpus.metadata.id,
        composition.metadata.id,
        {
          ...composition,
          summary: index === 0 ? [ comment, ...composition.summary.slice( index ) ] :
            [ ...composition.summary.slice( 0, index ), comment, ...composition.summary.slice( index ) ]
        }
      );
    };
    const onAddCommentAfter = () => {
      const comment = createComment();

      updateComposition(
        corpus.metadata.id,
        composition.metadata.id,
        {
          ...composition,
          summary: [ ...composition.summary.slice( 0, index + 1 ), comment, ...composition.summary.slice( index + 1 ) ]
        }
      );
    };
    const onDelete = () => {
      updateComposition(
        corpus.metadata.id,
        composition.metadata.id,
        {
          ...composition,
          summary: index === 0 ? composition.summary.slice( index + 1 ) :
            [ ...composition.summary.slice( 0, index ), ...composition.summary.slice( index + 1 ) ]
        }
      );
    };
    if ( type === 'chunk' ) {

      const onSetActiveAsideEdition = () => {
        if (
          compositionBlock.blockType !== 'chunk' ||
          corpus.chunks[compositionBlock.content]
        ) {
          setActiveCompositionBlockId( compositionBlock.metadata.id );
        }
      };

      const handleMoveUp = ( e ) => {
        e.stopPropagation();
        onMoveUp();
      };
      const handleMoveDown = ( e ) => {
        e.stopPropagation();
        onMoveDown();
      };
      const handleDelete = ( e ) => {
        e.stopPropagation();
        onDelete();
      };
      return (
        <Draggable
          key={ compositionBlock.metadata.id }
          draggableId={ compositionBlock.metadata.id }
          type={ 'CHUNK' }
          index={ index }
        >
          {( providedChunk, blockChunkSnapshot ) => (
            <ContextMenuTrigger id={ compositionBlock.metadata.id }>
              <div
                ref={ providedChunk.innerRef }
                className={ blockChunkSnapshot.isDragging ? 'dragged-chunk' : 'still-chunk' }
                { ...providedChunk.draggableProps }
                { ...providedChunk.dragHandleProps }
              >
                <div
                  onClick={ onSetActiveAsideEdition }
                  className={ 'card dicto-ChunkCard' }
                  style={ { padding: 0 } }
                >
                  {invalidChunk ?
                    <div
                      style={ { margin: 0, padding: 0 } }
                      className={ 'card-content stretched-columns' }
                    >
                      <div
                        style={ { padding: '1rem' } }
                        className={ "is-flex-1" }
                      >
                        {t( 'Citation of an excerpt deleted from your corpus' )}
                      </div>
                      <div className={ 'actions-container' }>
                        <button
                          data-for={ 'tooltip' }
                          data-place={ 'left' }
                          data-tip={ t( 'remove this excerpt citation from the composition (the excerpt will not be deleted)' ) }
                          onClick={ handleDelete }
                          className={ 'button is-rounded' }
                        >
                          <i className={ 'fas fa-unlink' } />
                        </button>
                      </div>
                    </div>
                  :
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
                          data-tip={ chunk.fields[compositionBlock.activeFieldId] }
                        >
                          {abbrev( chunk.fields[compositionBlock.activeFieldId], 40 )}
                        </div>
                        <ul className={ 'info-numbers' }>
                          <li>
                            <i className={ 'fas fa-clock' } />
                            <span className={ 'info-number' }>
                              {secsToSrt( parseInt( duration, 10 ), false )}
                            </span>
                          </li>
                          {compositionBlock.asides && compositionBlock.asides.length > 0 &&
                          <li>
                            <i className={ 'fas fa-image' } />
                            <span className={ 'info-number' }>
                              {t( [ 'one additional content', '{n} additional contents', 'n' ], { n: compositionBlock.asides && compositionBlock.asides.length } )}
                            </span>
                          </li>}
                        </ul>
                      </div>
                      <div className={ 'actions-container' }>
                        <button
                          onClick={ handleMoveUp }
                          data-for={ 'tooltip' }
                          data-tip={ t( 'move up in composition' ) }
                          className={ `button is-rounded ${index === 0 ? 'is-disabled' : ''}` }
                        >
                          <i className={ 'fas fa-caret-up' } />
                        </button>
                        <button
                          onClick={ handleMoveDown }
                          data-for={ 'tooltip' }
                          data-tip={ t( 'move down in composition' ) }
                          className={ `button is-rounded ${index >= maxIndex ? 'is-disabled' : ''}` }
                        >
                          <i className={ 'fas fa-caret-down' } />
                        </button>

                        <button
                          onClick={ onSetActiveAsideEdition }
                          id={ 'edit-composition-block' }
                          data-for={ 'tooltip' }
                          data-tip={ t( 'edit additional contents' ) }

                          className={ 'button is-rounded' }
                        >
                          <i className={ 'fas fa-pencil-alt' } />
                        </button>

                        <button
                          data-for={ 'tooltip' }
                          data-place={ 'left' }
                          data-tip={ t( 'remove this excerpt citation from the composition (the excerpt will not be deleted)' ) }
                          onClick={ handleDelete }
                          className={ 'button is-rounded' }
                        >
                          <i className={ 'fas fa-unlink' } />
                        </button>
                      </div>
                    </div>}
                </div>
              </div>
              {providedChunk.placeholder}
              <ContextMenu
                key={ compositionBlock.metadata.id }
                id={ compositionBlock.metadata.id }
              >
                <div className={ 'dropdown-content' }>
                  <MenuItem
                    attributes={ { className: 'dropdown-item' } }
                    onClick={ () => {
                                    onMoveTo( 0 );
                                  } }
                  >
                    {t( 'move this excerpt to the begining of composition' )}
                  </MenuItem>
                  <MenuItem
                    attributes={ { className: 'dropdown-item' } }
                    onClick={ () => {
                                    onMoveTo( maxIndex );
                                  } }
                  >
                    {t( 'move this excerpt to the end of composition' )}
                  </MenuItem>
                  <MenuItem
                    attributes={ { className: 'dropdown-divider' } }
                    divider
                  />
                  <MenuItem
                    attributes={ { className: 'dropdown-item' } }
                    onClick={ () => {
                                    onReorder();
                                  } }
                  >
                    {t( 'reorder composition excerpts by media' )}
                  </MenuItem>
                  <MenuItem
                    attributes={ { className: 'dropdown-divider' } }
                    divider
                  />
                  <MenuItem
                    attributes={ { className: 'dropdown-item' } }
                    onClick={ () => {
                                    onDeleteAll();
                                  } }
                  >
                    {t( 'remove all excerpts citations from this composition' )}
                  </MenuItem>
                </div>
              </ContextMenu>
            </ContextMenuTrigger>
          )}
        </Draggable>
      );
    }

    const onContentUpdate = ( val ) => {
      const newBlock = {
        ...compositionBlock,
        metadata: {
          ...compositionBlock.metadata,
          lastModifiedAt: new Date().getTime()
        },
        content: val
      };
      updateComposition(
        corpus.metadata.id,
        composition.metadata.id,
        {
          ...composition,
          summary: index === 0 ? [ newBlock, ...composition.summary.slice( index + 1 ) ] :
            [ ...composition.summary.slice( 0, index ), newBlock, ...composition.summary.slice( index + 1 ) ]
        }
      );
    };
    const onDurationChange = ( val ) => {
      const newBlock = {
        ...compositionBlock,
        metadata: {
          ...compositionBlock.metadata,
          lastModifiedAt: new Date().getTime()
        },
        duration: val
      };
      updateComposition(
        corpus.metadata.id,
        composition.metadata.id,
        {
          ...composition,
          summary: index === 0 ? [ newBlock, ...composition.summary.slice( index + 1 ) ] :
            [ ...composition.summary.slice( 0, index ), newBlock, ...composition.summary.slice( index + 1 ) ]
        }
      );
    };
    // case COMMENT
    return (
      <Draggable
        key={ compositionBlock.metadata.id }
        draggableId={ compositionBlock.metadata.id }
        type={ 'COMMENT' }
        index={ index }
      >
        {( providedComment, commentSnapshot ) => (
          <ContextMenuTrigger id={ compositionBlock.metadata.id }>
            <div
              className={ commentSnapshot.isDragging ? 'dragged-chunk' : 'still-chunk' }
              ref={ providedComment.innerRef }
              { ...providedComment.draggableProps }
              { ...providedComment.dragHandleProps }
            >
              <CommentCard
                comment={ compositionBlock }
                fields={ corpus.fields }
                allowAddComments
                onAddCommentBefore={ onAddCommentBefore }
                onAddCommentAfter={ onAddCommentAfter }
                onContentChange={ onContentUpdate }
                onDurationChange={ onDurationChange }
                tags={ corpus.tags }
                deletable
                onDelete={ onDelete }
                tagCategories={ corpus.tagCategories }
              />
            </div>
            {providedComment.placeholder}
            <ContextMenu
              key={ compositionBlock.metadata.id }
              id={ compositionBlock.metadata.id }
            >
              <div className={ 'dropdown-content' }>
                <MenuItem
                  attributes={ { className: 'dropdown-item' } }
                  onClick={ () => {
                                  updateComposition(
                                    corpus.metadata.id,
                                    composition.metadata.id,
                                    {
                                      ...composition,
                                      summary: [
                                        compositionBlock,
                                        ...composition.summary.filter( ( b ) => b.metadata.id !== compositionBlock.metadata.id ),
                                      ]
                                    }
                                  );
                                } }
                >
                  {t( 'move composition block to begining of composition' )}
                </MenuItem>
                <MenuItem
                  attributes={ { className: 'dropdown-item' } }
                  onClick={ () => {
                                  updateComposition(
                                    corpus.metadata.id,
                                    composition.metadata.id,
                                    {
                                      ...composition,
                                      summary: [
                                        ...composition.summary.filter( ( b ) => b.metadata.id !== compositionBlock.metadata.id ),
                                        compositionBlock
                                      ]
                                    }
                                  );
                                } }
                >
                  {t( 'move composition block to end of composition' )}
                </MenuItem>
                <MenuItem
                  attributes={ { className: 'dropdown-divider' } }
                  divider
                />
                <MenuItem
                  attributes={ { className: 'dropdown-item' } }
                  onClick={ () => {
                                  updateComposition(
                                    corpus.metadata.id,
                                    composition.metadata.id,
                                    {
                                      ...composition,
                                      summary: index === 0 ? composition.summary.slice( index + 1 ) :
                                        [ ...composition.summary.slice( 0, index ), ...composition.summary.slice( index + 1 ) ]
                                    }
                                  );
                                } }
                >
                  {t( 'delete this composition block' )}
                </MenuItem>
                <MenuItem
                  attributes={ { className: 'dropdown-divider' } }
                  divider
                />
                <MenuItem
                  attributes={ { className: 'dropdown-item' } }
                  onClick={ () => {
                                  updateComposition(
                                    corpus.metadata.id,
                                    composition.metadata.id,
                                    {
                                      ...composition,
                                      summary: []
                                    }
                                  );
                                } }
                >
                  {t( 'delete all composition blocks' )}
                </MenuItem>
              </div>
            </ContextMenu>
          </ContextMenuTrigger>
        )}
      </Draggable>
    );
  }
}

CompositionBlock.contextTypes = {
  t: PropTypes.func
};

export default CompositionBlock;

