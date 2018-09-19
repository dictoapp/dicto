/* eslint no-nested-ternary : 0 */
/**
 * This module exports a stateless component rendering the layout of the layout view
 * @module dicto/features/Layout
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { v4 as genId } from 'uuid';
import Select from 'react-select';

import {
  DragDropContext,
  Droppable,
} from 'react-beautiful-dnd';

import './CompositionEditionLayout.scss';

import MontagePlayer from '../../../components/MontagePlayer';
import SchemaForm from '../../../components/SchemaForm';
import Nav from '../../../components/Nav';
import AsidesEditor from '../../../components/AsidesEditor';
import Loading from '../../../components/Loading';
import NotFound from '../../../components/NotFound';
import PaginatedList from '../../../components/PaginatedList';
import CompositionCard from '../../../components/CompositionCard';
import SearchInput from '../../../components/SearchInput';
import CompositionChunk from './CompositionChunk';
import CompositionBlock from './CompositionBlock';

import filterChunks from './filters';

Modal.setAppElement( '#mount' );

import {
  mapToArray,
} from '../../../helpers/utils';

import 'react-select/dist/react-select.css';

const CompositionEditionLayout = ( {
  corpus,
  composition,

  displayFilterMode = 'all',
  displayFilterParam = '',
  metadataVisible,
  previewVisible,
  activeFieldId,
  filtersVisible,
  searchTerm,
  activeCompositionBlockId,
  stateLoaded,
  history,

  actions: {
    setDisplayFilterMode,
    setDisplayFilterParam,
    updateComposition,

    setMetadataVisibility,
    setPreviewVisibility,
    setActiveFieldId,
    toggleFiltersVisibility,
    setSearchTerm,
    setActiveCompositionBlockId,
    unsetActiveCompositionBlockId,
  },
  schema,
  downloadComposition,
  copyCompositionAsHtml,

}, { t } ) => {
  if ( composition && corpus ) {

    const filterModes = [
      {
        id: 'all',
        title: t( 'all' ),
        filterType: 'none',
        available: true
      },
      {
        id: 'media',
        title: t( 'media' ),
        filterType: 'select',
        available: mapToArray( corpus.medias ).length,
        options: mapToArray( corpus.medias )
          .map( ( item ) => ( {
            value: item.metadata.id,
            label: item.metadata.title
          } ) )
      },
      {
        id: 'tagCategory',
        title: t( 'tag-category' ),
        filterType: 'select',
        available: mapToArray( corpus.tagCategories ).length > 1,
        options: mapToArray( corpus.tagCategories )
          .map( ( item ) => ( {
            value: item.metadata.id,
            label: item.name === 'default' ? t( 'default category' ) : item.name
          } ) )
      },
      {
        id: 'tag',
        title: t( 'tag' ),
        filterType: 'select',
        available: mapToArray( corpus.tags ).length > 1,
        options: mapToArray( corpus.tags )
          .map( ( item ) => ( {
            value: item.metadata.id,
            label: item.name
          } ) )
      },
    ];

    const activeFilterMode = filterModes.find( ( f ) => f.id === displayFilterMode );
    if ( !activeFieldId ) {
      const fieldId = Object.keys( corpus.fields )
        .find( ( id ) => corpus.fields[id].name === 'default' );
      setActiveFieldId( fieldId );
    }
    const fieldsSelectChoices = Object.keys( corpus.fields )
    .map( ( id ) => ( {
      value: id,
      label: corpus.fields[id].name === 'default'
        ? t( 'default field' ) : corpus.fields[id].name
    } ) )
    .sort( ( a, b ) => {
      if ( a.label > b.label ) {
        return 1;
      }
      return -1;
    } )

    const displayFilterUi = () => {
      let onChange;
      if ( activeFilterMode ) {
        switch ( activeFilterMode.filterType ) {
        case 'input':
          onChange = ( e ) => setDisplayFilterParam( e.target.value );
          return (
            <div className={ 'columns' }>
              <div className={ 'column is-one-half' }>
                {t( 'search for text' )}
              </div>
              <div className={ 'column' }>

                <input
                  className={ 'input' }
                  value={ displayFilterParam || '' }
                  onChange={ onChange }
                />
              </div>
            </div>
          );
        case 'select':
          onChange = ( e ) => setDisplayFilterParam( e.value );
          return (
            <div className={ 'columns' }>
              <div className={ 'column is-one-half' }>
                {t( 'select a filter' )}
              </div>
              <div className={ 'column' }>
                <Select
                  name={ 'form-field-name' }
                  clearable={ false }
                  value={ displayFilterParam }
                  onChange={ onChange }
                  options={ activeFilterMode.options.sort( ( a, b ) => {
                            if ( a.label > b.label ) {
                              return 1;
                            }
                            return -1;
                          } ) }
                />
              </div>
            </div>
          );

        default:
          return null;
        }
      }
    };
    const quotedChunks = composition.summary.filter( ( c ) => c.blockType === 'chunk' ).map( ( c ) => c.content );
    const displayedChunks = filterChunks( displayFilterMode, displayFilterParam, corpus, searchTerm );

    const onDragEnd = ( {
      destination,
      source,
      draggableId
    } ) => {
      const summary = composition.summary;
      // add to composition compositions blocks
      if (
        source.droppableId === 'chunks-summary'
        && destination
        && !summary.filter( ( c ) => c.blockType === 'chunk' && c.content === draggableId ).length
      ) {
        const dropIndex = destination.index;
        const compositionBlock = {
          metadata: {
            id: genId(),
            createdAt: new Date().getTime(),
            lastModifiedAt: new Date().getTime()
          },
          blockType: 'chunk',
          content: draggableId,
          activeFieldId,
        };
        const newComposition = {
          ...composition,
          summary: [ ...summary.slice( 0, dropIndex ), compositionBlock, ...summary.slice( dropIndex ) ]
        };
        updateComposition( corpus.metadata.id, composition.metadata.id, newComposition );
      // moving a block
      }
      else if ( source.droppableId === 'composition-summary' && destination ) {
        const compositionBlock = summary[source.index];
        let newSummary = [
          ...summary.slice( 0, source.index ),
          ...summary.slice( source.index + 1 )
        ];
        const destinationIndex = destination.index; // > source.index ? destination.index - 1 : destination.index;
        newSummary = destinationIndex === 0 ? [ compositionBlock, ...newSummary ] :
          [
            ...newSummary.slice( 0, destinationIndex ),
            compositionBlock,
            ...newSummary.slice( destinationIndex )
          ];
        updateComposition( corpus.metadata.id, composition.metadata.id, { ...composition, summary: newSummary } );

      }
    };

    const onAddAll = () => {
      const newSummary = [
        ...composition.summary,
        ...displayedChunks
          .filter( ( chunk ) => !quotedChunks.includes( chunk.metadata.id ) )
        // @todo setup pagination system
          .map( ( chunk ) => ( {
            metadata: {
              id: genId(),
              createdAt: new Date().getTime(),
              lastModifiedAt: new Date().getTime()
            },
            blockType: 'chunk',
            content: chunk.metadata.id,
            activeFieldId
          } ) )
      ];
      updateComposition( corpus.metadata.id, composition.metadata.id, { ...composition, summary: newSummary } );
    };

    const handleModalCloseRequest = () => {
      setMetadataVisibility( false );
      setPreviewVisibility( false );
      unsetActiveCompositionBlockId();
    };

    const onSubmitCompositionMetadata = ( metadata ) => {
      const newComposition = {
        ...composition,
        metadata: {
          ...composition.metadata,
          ...metadata
        }
      };
      updateComposition( corpus.metadata.id, composition.metadata.id, newComposition );
      handleModalCloseRequest();
    };

    const onActiveFieldIdChange = ( { value } ) => {
      setActiveFieldId( value );
    };

    const openPreview = () => {
      setPreviewVisibility( true );
    };

    const activeCompositionBlock = activeCompositionBlockId
      && composition.summary.find( ( comp ) =>
        comp.metadata.id === activeCompositionBlockId
      );

    const onActiveCompositionBlockAsideChange = ( asides ) => {
      const newBlock = {
        ...activeCompositionBlock,
        asides
      };
      const newComposition = {
        ...composition,
        summary: composition.summary.map( ( block ) => {
          if ( block.metadata.id === activeCompositionBlockId ) {
            return newBlock;
          }
          return block;
        } )
      };
      updateComposition( corpus.metadata.id, composition.metadata.id, newComposition );
    };
    const onActiveCompositionBlockFieldIdChange = ( { value } ) => {
      const newBlock = {
        ...activeCompositionBlock,
        activeFieldId: value
      };
      const newComposition = {
        ...composition,
        summary: composition.summary.map( ( block ) => {
          if ( block.metadata.id === activeCompositionBlockId ) {
            return newBlock;
          }
          return block;
        } )
      };
      updateComposition( corpus.metadata.id, composition.metadata.id, newComposition );
    };

    const addChunkToComposition = ( chunk, atBegining ) => {
      const compositionBlock = {
        metadata: {
          id: genId(),
          createdAt: new Date().getTime(),
          lastModifiedAt: new Date().getTime()
        },
        blockType: 'chunk',
        content: chunk.metadata.id,
        activeFieldId,
      };
      const summary = atBegining ? [ compositionBlock, ...composition.summary ] : [ ...composition.summary, compositionBlock ];
      updateComposition(
        corpus.metadata.id,
        composition.metadata.id,
        {
          ...composition,
          summary
        }
      );
    };

    const addChunksToComposition = ( chunks, atBegining ) => {
      const newBlocks = chunks.map( ( chunk ) => ( {
        metadata: {
          id: genId(),
          createdAt: new Date().getTime(),
          lastModifiedAt: new Date().getTime()
        },
        blockType: 'chunk',
        content: chunk.metadata.id,
        activeFieldId,
      } ) );
      const summary = atBegining ? [ ...newBlocks, ...composition.summary ] : [ ...composition.summary, ...newBlocks ];
      updateComposition(
        corpus.metadata.id,
        composition.metadata.id,
        {
          ...composition,
          summary
        }
      );
    };

    const metadataSchema = {
      type: 'object',
      properties: schema.definitions.composition.properties.metadata.properties
    };

    return (
      <div className={ 'dicto-CompositionEditionLayout fix-height rows' }>
        <Nav
          localizationCrumbs={ [
                  {
                    href: '/corpora/',
                    name: t( 'my corpora' )
                  },
                  {
                    href: `/corpora/${corpus.metadata.id}`,
                    name: `/ ${ corpus.metadata.title}` || t( 'untitled corpus' )
                  },
                  {
                    href: `/corpora/${corpus.metadata.id}/composition/${composition.metadata.id}`,
                    active: true,
                    name: ` / ${ composition.metadata.title}` || t( 'untitled composition' )
                  },
                ] }
          localOperations={ [] }
          importantOperations={ [] }
        />
        <DragDropContext
          onDragEnd={ onDragEnd }
        >
          <div className={ 'columns container is-fluid hero-body is-flex-1' }>
            <div
              id={ 'corpus-excerpts-container' }
              className={ `column is-collapsable ${'is-half'} rows` }
            >

              <div
                style={ {
                              paddingLeft: '.5rem',
                              paddingRight: '.5rem',
                            } }
                className={ 'level' }
              >
                <SearchInput
                  value={ searchTerm }
                  className={ 'is-flex-1' }
                  onUpdate={ ( value ) => setSearchTerm( value ) }
                  delay={ 500 }
                  placeholder={ t( 'search an excerpt' ) }
                />
              </div>

              <ul className={ 'accordions' }>
                <li
                  className={ `filters-container column accordion ${filtersVisible ? 'is-active' : ''}` }
                >
                  <div
                    id={ 'filters-header' }
                    onClick={ toggleFiltersVisibility }
                    className={ 'accordion-header' }
                  >
                    <h4
                      className={ 'title is-4' }
                      style={ {
                                          display: 'flex',
                                          flexFlow: 'row nowrap',
                                          alignItems: 'center',
                                          justifyContents: 'stretch'
                                        } }
                    >
                      <button
                        style={ { marginRight: '1rem' } }
                        className={ 'button is-rounded' }
                      >
                        <span
                          className={ 'icon' }
                        >
                          <i
                            style={ {
                                                      display: filtersVisible ? 'inline' : 'none',
                                                    } }
                            className={ 'fas fa-minus-circle' }
                          />
                          <i
                            style={ {
                                                      display: !filtersVisible ? 'inline' : 'none',
                                                    } }
                            className={ 'fas fa-plus-circle' }
                          />
                        </span>
                      </button>
                      <span style={ { flex: 1 } }>
                        {t( 'Filters and settings' )}
                      </span>
                    </h4>
                  </div>
                  <div className={ 'accordion-body' }>
                    <div className={ 'accordion-content' }>
                      <div className={ 'column' }>
                        {
                                              displayedChunks.length > 0 && fieldsSelectChoices.length > 1 ?
                                                <ul className={ 'column columns' }>
                                                  <li className={ 'column is-one-half' }>
                                                    <div className={ 'subtitle is-6' }>{t( 'Use chunks field' )}</div>
                                                  </li>
                                                  <li className={ 'column' }>
                                                    <Select
                                                      name={ 'fieldSelect' }
                                                      clearable={ false }
                                                      value={ activeFieldId }
                                                      onChange={ onActiveFieldIdChange }
                                                      options={ fieldsSelectChoices }
                                                    />
                                                  </li>
                                                </ul> 
                                              : 
                                                null
                                            }
                        <ul className={ 'columns' }>
                          <li className={ 'column ' }>
                            <div className={ 'subtitle is-6' }>{t( 'Display chunks from' )}</div>
                          </li>
                          <li className={ 'column' }>
                            <div className={ 'field has-addons filter-modes' }>
                              {
                                                        filterModes
                                                          .filter( ( filter ) => filter.available )
                                                          .map( ( filterMode ) => {
                                                            const onClick = () => {
                                                              setDisplayFilterMode( filterMode.id );
                                                              if ( filterMode.options && filterMode.options.length ) {
                                                                setTimeout( () => setDisplayFilterParam( filterMode.options[0].value ) );
                                                              }
                                                            };
                                                            return (
                                                              <p
                                                                key={ filterMode.id }
                                                                className={ 'control' }
                                                              >
                                                                <a
                                                                  onClick={ onClick }
                                                                  className={ `button ${filterMode.id === displayFilterMode ? ' is-primary' : ''}` }
                                                                >
                                                                  <span>{' '}{filterMode.title}</span>
                                                                </a>
                                                              </p>
                                                            );
                                                          } )
                                                      }
                            </div>
                          </li>

                        </ul>
                      </div>
                      <div className={ 'columns column' }>

                        <div className={ 'column' }>
                          {
                                                displayFilterUi()
                                              }
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              <Droppable
                isDropDisabled
                droppableId={ 'chunks-summary' }
              >
                {( provided, snapshot ) => (
                  <div className={ 'chunks-wrapper is-flex-1 column' }>
                    <div
                      ref={ provided.innerRef }
                      className={ `droppable-container ${snapshot.isDraggingOver ? 'active' : ''}  is-flex-1` }
                      { ...provided.droppableProps }
                    >
                      <PaginatedList
                        items={ displayedChunks }
                        className={ 'is-flex-1' }
                        itemsPerPage={ 30 }

                        renderItem={ ( chunk, index ) => {
                                              const onAddAllFromSameMedia = () => {
                                                const mediaId = chunk.metadata.mediaId;
                                                const otherChunks = Object.keys( corpus.chunks )
                                                  .filter( ( chunkId ) => corpus.chunks[chunkId].metadata.mediaId === mediaId )
                                                  .map( ( chunkId ) => corpus.chunks[chunkId] );
                                                addChunksToComposition( otherChunks, false );
                                              };
                                              return (
                                                <CompositionChunk
                                                  key={ chunk.metadata.id }
                                                  chunk={ chunk }
                                                  index={ index }
                                                  medias={ corpus.medias }
                                                  onAddAllFromSameMedia={ onAddAllFromSameMedia }
                                                  canQuote={ !quotedChunks.includes( chunk.metadata.id ) }
                                                  addChunkToComposition={ addChunkToComposition }
                                                  history={ history }
                                                  corpus={ corpus }
                                                  activeFieldId={ activeFieldId }
                                                />
                                              );
                                            } }
                        renderNoItem={ () => (
                          <div className={ 'column' }>
                            <article className={ 'message is-info' }>
                              <div className={ 'message-header' }>
                                <p>{t( 'No excerpts to display' )}</p>
                              </div>
                              <div className={ 'message-body' }>
                                {t( 'The current filter does not allow to pick any excerpt in your corpus.' )}
                              </div>
                            </article>
                          </div>
                                            ) }
                      />
                      {provided.placeholder}
                    </div>

                  </div>
                          )}
              </Droppable>

              {
                          displayedChunks.length > 0 ?
                            <div
                              id={ 'add-all-chunks' }
                              style={ { paddingLeft: '.5rem', paddingRight: '.5rem' } }
                            >
                              <div
                                style={ { padding: 0 } }
                                className={ 'column' }
                              >
                                <button
                                  onClick={ onAddAll }
                                  className={ 'button is-fullwidth is-dark' }
                                >{t( 'add-all-chunks' )}
                                </button>
                              </div>
                            </div>
                          : 
                            null
                          }

            </div>
            <div
              id={ 'composition-summary-container' }
              className={ `column is-collapsable ${'is-half'} rows` }
            >
              <div
                style={ { marginBottom: 0 } }
                className={ 'is-fullwidth column' }
              >
                <CompositionCard
                  composition={ composition }
                  medias={ corpus.medias }
                  chunks={ corpus.chunks }
                  minified
                  onClick={ () => setMetadataVisibility( true ) }
                  actionContents={ [
                    <li
                      key={ 1 }
                      className={ '' }
                    >
                      <button
                        data-for={ 'tooltip' }
                        data-tip={ t( 'edit composition' ) }
                        className={ 'button is-rounded' }
                        onClick={ () => setMetadataVisibility( true ) }
                      >
                        <i className={ 'fas fa-pencil-alt' } />
                      </button>
                    </li>,
                                ] }
                />
              </div>

              <Droppable droppableId={ 'composition-summary' }>
                {( provided, snapshot ) => (
                  <div
                    style={ { flex: 6 } }
                    ref={ provided.innerRef }
                    className={ `droppable-container ${snapshot.isDraggingOver ? 'active' : ''}  is-scrollable is-flex-1` }
                    { ...provided.droppableProps }
                  >
                    <PaginatedList
                      items={ composition.summary }
                      className={ 'is-flex-1' }
                      itemsPerPage={ 30 }
                      renderItem={ ( compositionBlock, index ) => {
                                          const onMoveUp = () => {
                                            const newIndex = index - 1;
                                            let newSummary;
                                            if ( newIndex === 0 ) {
                                              newSummary = [
                                                compositionBlock,
                                                composition.summary[0],
                                                ...composition.summary.slice( 2 )
                                              ];
                                            }
                                            else {
                                              newSummary = [
                                                ...composition.summary.slice( 0, index - 1 ),
                                                compositionBlock,
                                                composition.summary[index - 1],
                                                ...composition.summary.slice( index + 1 ),
                                              ];
                                            }
                                            updateComposition(
                                              corpus.metadata.id,
                                              composition.metadata.id,
                                              {
                                                ...composition,
                                                summary: newSummary,
                                              }
                                            );
                                          };
                                          const onMoveDown = () => {
                                            const newIndex = index + 1;
                                            const newSummary = [
                                              ...composition.summary.slice( 0, index ),
                                              composition.summary[index + 1],
                                              compositionBlock,
                                              ...(
                                                newIndex === composition.summary.length - 1 ?
                                                  []
                                                  :
                                                  composition.summary.slice( index + 2 )
                                              ),
                                            ];
                                            updateComposition(
                                              corpus.metadata.id,
                                              composition.metadata.id,
                                              {
                                                ...composition,
                                                summary: newSummary,
                                              }
                                            );
                                          };
                                          const onMoveTo = ( newIndex ) => {
                                            let newSummary;
                                            if ( newIndex === 0 ) {
                                              newSummary = [
                                                compositionBlock,
                                                ...composition.summary.filter( ( c, i ) => i !== index ),
                                              ];
                                            }
                                            else {
                                              newSummary = [
                                                ...composition.summary.filter( ( c, i ) => i !== index ),
                                                compositionBlock,
                                              ];
                                            }
                                            updateComposition(
                                              corpus.metadata.id,
                                              composition.metadata.id,
                                              {
                                                ...composition,
                                                summary: newSummary,
                                              }
                                            );
                                          };
                                          const onDeleteAll = () => {
                                            updateComposition(
                                              corpus.metadata.id,
                                              composition.metadata.id,
                                              {
                                                ...composition,
                                                summary: [],
                                              }
                                            );
                                          };
                                          const onReorder = () => {
                                            let mediasMap = [ ...composition.summary ].reduce( ( result, block ) => {
                                              let key;
                                              if ( block.blockType === 'chunk' ) {
                                                const mediaId = corpus.chunks[block.content].metadata.mediaId;
                                                key = mediaId;
                                              }
                                              else key = 'comment';
                                              return {
                                                ...result,
                                                [key]: result[key] ? [ ...result[key], block ] : [ block ]
                                              };
                                            }, {} );
                                            mediasMap = Object.keys( mediasMap ).reduce( ( result, mediaId ) => ( {
                                              ...result,
                                              [mediaId]: mediasMap[mediaId].sort( ( a, b ) => {
                                                if ( a.start > b.start ) {
                                                  return 1;
                                                }
                                                return -1;
                                              } )
                                            } ), {} );
                                            const newSummary = Object.keys( mediasMap ).reduce( ( result, mediaKey ) => [ ...result, ...mediasMap[mediaKey] ], [] );

                                            updateComposition(
                                              corpus.metadata.id,
                                              composition.metadata.id,
                                              {
                                                ...composition,
                                                summary: newSummary
                                              }
                                            );
                                          };
                                          return (
                                            <CompositionBlock
                                              compositionBlock={ compositionBlock }
                                              index={ index }
                                              onMoveOut={ onMoveDown }
                                              onMoveTo={ onMoveTo }
                                              key={ compositionBlock.metadata.id }
                                              onMoveUp={ onMoveUp }
                                              onDeleteAll={ onDeleteAll }
                                              onMoveDown={ onMoveDown }
                                              onReorder={ onReorder }
                                              maxIndex={ composition.summary.length - 1 }
                                              medias={ corpus.medias }
                                              updateComposition={ updateComposition }
                                              corpus={ corpus }
                                              composition={ composition }
                                              setActiveCompositionBlockId={ setActiveCompositionBlockId }
                                            />
                                          );
                                        } }
                      renderNoItem={ () => (
                        <div className={ 'column' }>
                          <article className={ 'message is-success' }>
                            <div className={ 'message-header' }>
                              <p>{t( 'The composition summary is empty' )}</p>
                            </div>
                            <div className={ 'message-body' }>
                              {t( 'Drag & drop excerpts here to add items to your composition !' )}
                            </div>
                          </article>
                        </div>
                                        ) }
                    />

                    {provided.placeholder}

                  </div>
                          )}
              </Droppable>
              <div
                id={ 'preview-and-export' }
                className={ 'level' }
                style={ { marginTop: '.5rem' } }
              >
                <button
                  id={ 'export' }
                  className={ 'button is-fullwidth' }
                  onClick={ openPreview }
                >
                  {t( 'preview and export' )}
                </button>
              </div>

            </div>

          </div>

        </DragDropContext>

        <Modal
          isOpen={ ( activeCompositionBlockId && activeCompositionBlock ) !== undefined }
          onRequestClose={ handleModalCloseRequest }
          style={ {
                  content: {
                    height: '80%'
                  }
                } }
        >
          {activeCompositionBlock &&
            <div className={ 'modal-content' }>
              <div className={ 'modal-header' }>
                <h1 className={ 'title is-1' }>
                  {
                            t( 'edit composition part' )
                          }
                </h1>
                <div className={ 'close-modal-icon-container' }>
                  <span
                    className={ 'icon' }
                    onClick={ handleModalCloseRequest }
                  >
                    <i className={ 'fas fa-times-circle' } />
                  </span>
                </div>
              </div>

              <div className={ 'modal-body' }>
                <div
                  className={ 'columns' }
                  style={ { height: '100%' } }
                >
                  <div
                    className={ 'column is-half' }
                    style={ { overflow: 'auto' } }
                  >
                    {
                                fieldsSelectChoices.length > 1 &&
                                <div className={ 'column' }>
                                  <div className={ 'field' }>
                                    <label className={ 'label' }>{t( 'field to display' )}</label>
                                    <Select
                                      options={ fieldsSelectChoices }
                                      clearable={ false }
                                      value={ activeCompositionBlock.activeFieldId }
                                      onChange={ onActiveCompositionBlockFieldIdChange }
                                    />
                                  </div>
                                </div>
                              }
                    <AsidesEditor
                      asides={ activeCompositionBlock.asides }
                      onChange={ onActiveCompositionBlockAsideChange }
                    />
                  </div>
                  <div className={ 'column is-half' }>
                    <div className={ 'montage-container' }>
                      <MontagePlayer
                        summary={ [ activeCompositionBlock ] }
                        metadata={ composition.metadata }
                        medias={ corpus.medias }
                        chunks={ corpus.chunks }
                        tags={ corpus.tags }
                        fields={ corpus.fields }
                        tagCategories={ corpus.tagCategories }
                        translate={ t }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </Modal>

        <Modal
          isOpen={ metadataVisible || previewVisible }
          onRequestClose={ handleModalCloseRequest }
          style={ {
                  content: {
                    height: '80%'
                  }
                } }
        >
          <div className={ 'modal-content' }>
            <div className={ 'modal-header' }>
              <h1 className={ 'title is-1' }>
                {
                            previewVisible ?
                              t( 'Preview and export composition' )
                              : t( 'Composition metadata' )
                          }
              </h1>
              <div className={ 'close-modal-icon-container' }>
                <span
                  className={ 'icon' }
                  onClick={ handleModalCloseRequest }
                >
                  <i className={ 'fas fa-times-circle' } />
                </span>
              </div>
            </div>
            <div
              style={ { display: 'flex' } }
              className={ 'modal-body composition-modal' }
            >
              {
                        previewVisible &&
                        <div className={ 'stretched-columns is-flex-1' }>
                          <ul
                            style={ { maxWidth: '20%', overflow: 'auto' } }
                            className={ 'column' }
                          >
                            <li className={ 'column' }>
                              <button
                                id={ 'download-html' }
                                className={ 'box' }
                                onClick={ downloadComposition }
                              >{t( 'download composition as page' )}
                              </button>
                            </li>
                            <li className={ 'column' }>
                              <button
                                id={ 'copy-clipboard' }
                                className={ 'box' }
                                onClick={ copyCompositionAsHtml }
                              >{t( 'copy to clipboard as html' )}
                              </button>
                            </li>
                          </ul>
                          <div
                            style={ { position: 'relative' } }
                            className={ 'is-flex-1' }
                          >
                            <MontagePlayer
                              summary={ composition.summary }
                              metadata={ composition.metadata }
                              medias={ corpus.medias }
                              chunks={ corpus.chunks }
                              tags={ corpus.tags }
                              fields={ corpus.fields }
                              tagCategories={ corpus.tagCategories }
                              translate={ t }
                            />
                          </div>
                        </div>
                      }
              {
                        metadataVisible &&
                        <SchemaForm
                          schema={ metadataSchema }
                          document={ composition.metadata }
                          onSubmit={ onSubmitCompositionMetadata }
                        />
                      }
            </div>

          </div>
        </Modal>
      </div>
    );
  }
  else if ( stateLoaded && !composition ) {
    return ( <NotFound mode={ 'composition' } /> );
  }
  else if ( stateLoaded && !corpus ) {
    return ( <NotFound mode={ 'corpus' } /> );
  }
  else {
    // @todo redirect here
    return ( <Loading /> );
  }
};

CompositionEditionLayout.contextTypes = {
  t: PropTypes.func
};

export default CompositionEditionLayout;
