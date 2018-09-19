/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the montages view
 * @module dicto/features/Corpora
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import { v4 as genId } from 'uuid';
// import FlipMove from 'react-flip-move';
import { uniq, flatten } from 'lodash';
import defaults from 'json-schema-defaults';

import DropZone from '../../../components/DropZone';

import AsideMedia from './AsideMedia';
import AsideComposition from './AsideComposition';
import AsideTag from './AsideTag';
import ImportCollisionChoice from './ImportCollisionChoice';

import SchemaForm from '../../../components/SchemaForm';
import CompositionCard from '../../../components/CompositionCard';
import MediaCard from '../../../components/MediaCard';
import MediaEditor from '../../../components/MediaEditor';
import CorpusPlayer from '../../../components/CorpusPlayer';
import Loading from '../../../components/Loading';
import Nav from '../../../components/Nav';
import NotFound from '../../../components/NotFound';
import PaginatedList from '../../../components/PaginatedList';
import SearchInput from '../../../components/SearchInput';

import {
  mapToArray,
  abbrev,
  // convertRemToPixels,
} from '../../../helpers/utils';

import './CorpusLayout.scss';

Modal.setAppElement( '#mount' );

const CorpusLayout = ( {
  corpusId,
  corpus,
  corpusMetadataModalOpen,
  newCompositionModalOpen,
  newMediaPrompted,
  newTagPrompted,
  editedTagId,

  previewModalOpen,
  promptedToDeleteMediaId,
  promptedToDeleteCompositionId,
  stateLoaded,
  mediaSearchString = '',
  compositionsSearchString = '',
  tagsSearchString = '',
  activeSubview,
  asideMediaId,
  asideCompositionId,
  visibleTagCategoriesIds,
  history,

  newTagCategoryPrompted,
  editedTagCategoryId,
  promptedToDeleteTagCategoryId,

  promptedToDeleteTagId,
  asideTagId,
  asideTagMode,
  importModalVisible,
  importCorpusCandidate,
  importCollisionsList,
  actions: {

    promptCorpusMetadataEdition,
    unpromptCorpusMetadataEdition,
    promptNewMedia,
    unpromptNewMedia,
    promptNewComposition,
    promptNewTag,
    unpromptNewTag,
    setPromptedToDeleteMediaId,
    setPromptedToDeleteCompositionId,
    setPromptedToDeleteTagId,
    setPromptedToDeleteTagCategoryId,
    setVisibleTagCategoriesIds,

    setEditedTagId,
    // unpromptNewComposition,
    updateCorpus,

    createMedia,

    // updateComposition,
    deleteComposition,
    // duplicateComposition,

    deleteMedia,

    openPreview,
    closePreview,

    setMediaSearchString,
    setCompositionsSearchString,
    setTagsSearchString,

    setActiveSubview,
    setAsideMediaId,
    setAsideCompositionId,

    createComposition,

    promptNewTagCategory,
    unpromptNewTagCategory,
    setEditedTagCategoryId,

    createTag,
    updateTag,
    deleteTag,

    updateChunk,

    updateTagCategory,
    createTagCategory,
    deleteTagCategory,

    setAsideTagId,
    setAsideTagMode,
    setImportModalVisible,
  },
  schema,
  onDownloadJSON,
  onDownloadHTML,
  onDownloadTags,
  onDownloadMedias,
  onDownloadExcerpts,
  onSubmitNewComposition,
  onCorpusDrop,
  onMergeAllImportCollisions,
  onDuplicateAllImportCollisions,
  onForgetActiveCollision,
  onMergeActiveCollision,
  onDuplicateActiveCollision,
  // downloadComposition
}, { t } ) => {
  if ( corpus ) {

    /*
     * const {
     * metadata: {
     * title,
     * creators,
     * description
     * }
     * } = corpus;
     */
    const onSubmitMetadataChange = ( metadata ) => {
      const newCorpus = {
        ...corpus,
        metadata: {
          ...corpus.metadata,
          ...metadata
        }
      };
      updateCorpus( newCorpus.metadata.id, newCorpus );
      unpromptCorpusMetadataEdition();
    };

    const onSubmitForm = ( metadata ) => {
      if ( corpusMetadataModalOpen ) {
        onSubmitMetadataChange( metadata );
      }
      else {
        onSubmitNewComposition( metadata );
      }
    };

    const onSubmitNewTagCategory = ( catData ) => {
      if ( editedTagCategoryId ) {
        updateTagCategory( corpus.metadata.id, editedTagCategoryId, catData );
        setEditedTagCategoryId( undefined );
      }
      else {
        const category = Object.assign(
          defaults( schema.definitions.tagCategory ),
          {
            metadata: {
              id: genId()
            }
          },
          catData
        );
        createTagCategory( corpus.metadata.id, category );
        unpromptNewTagCategory();
      }
    };
    const onSubmitNewTag = ( tagData ) => {
      if ( editedTagId ) {
        updateTag( corpus.metadata.id, editedTagId, tagData );
        setEditedTagId( undefined );
      }
      else {
        const tag = Object.assign(
          defaults( schema.definitions.tagCategory ),
          {
            metadata: {
              id: genId(),
            },
            tagCategoryId: newTagPrompted
          },
          tagData
        );
        createTag( corpus.metadata.id, tag );
        unpromptNewTag();
      }
    };

    const compositionMetadataSchema = {
      type: 'object',
      properties: schema.definitions.composition.properties.metadata.properties
    };

    const tagCategoryDataSchema = {
      type: 'object',
      properties: {
        name: schema.definitions.tagCategory.properties.name,
        color: schema.definitions.tagCategory.properties.color,
      }
    };
    const tagSchema = {
      type: 'object',
      properties: {
        ...schema.definitions.tag.properties,
      }
    };
    delete tagSchema.properties.metadata;
    delete tagSchema.properties.tagCategoryId;

    const closeModals = () => {
      unpromptCorpusMetadataEdition();
      closePreview();
      unpromptNewMedia();
      unpromptNewTag();
      unpromptNewTagCategory();
      setEditedTagId( undefined );
      setEditedTagCategoryId( undefined );
      setPromptedToDeleteMediaId( undefined );
      setPromptedToDeleteCompositionId( undefined );
      setPromptedToDeleteTagCategoryId( undefined );
      setPromptedToDeleteTagId( undefined );
      setEditedTagId( undefined );
    };

    const handleMediaModalValidate = ( media ) => {
      media.metadata.id = genId();
      createMedia( corpus.metadata.id, media );
      unpromptNewMedia();
      setTimeout( () => {
        history.push( `/corpora/${corpus.metadata.id}/chunks?activeMedia=${media.metadata.id}` );        
      }, 500 )
    };

    const chunksList = mapToArray( corpus.chunks );

    const visibleMedias = mapToArray( corpus.medias || {} )
      .filter( ( c ) => {
        if ( mediaSearchString.length > 1 ) {
          const related = mapToArray( corpus.chunks ).filter( ( ch ) => ch.metadata.mediaId === c.metadata.id );
          return JSON.stringify( [ ...related, c.metadata ] ).toLowerCase().includes( mediaSearchString.toLowerCase() );
        }
        return true;
      } );

    const visibleCompositions = mapToArray( corpus.compositions || {} )
      .filter( ( thatComposition ) => {
        if ( compositionsSearchString.length > 1 ) {

          const related = thatComposition.summary.map( ( thatCompositionBlock ) => thatCompositionBlock.content ).map( ( id ) => corpus.chunks[id] );
          return JSON.stringify( [ ...related, thatComposition.metadata ] ).toLowerCase().includes( compositionsSearchString.toLowerCase() );
        }
        return true;
      } );

    const defaultFieldId = Object.keys( corpus.fields ).find( ( fieldId ) => {
      return corpus.fields[fieldId].name === 'default';
    } );

    const promptedToDeleteTagCategoryData = {
      relatedTags: [],
      relatedChunks: []
    };
    if ( promptedToDeleteTagCategoryId ) {
      promptedToDeleteTagCategoryData.relatedTags = Object.keys( corpus.tags )
        .filter( ( tagId ) => corpus.tags[tagId].tagCategoryId === promptedToDeleteTagCategoryId );
      promptedToDeleteTagCategoryData.relatedChunks = Object.keys( corpus.chunks )
        .filter( ( chunkId ) => corpus.chunks[chunkId].tags.find( ( tagId ) => promptedToDeleteTagCategoryData.relatedTags.includes( tagId ) ) !== undefined );
    }

    const unlinkTag = ( chunkId, tagId ) => {
      const chunk = corpus.chunks[chunkId];
      const newChunk = {
        ...chunk,
        tags: chunk.tags.filter( ( thatTag ) => thatTag !== tagId )
      };
      updateChunk( corpus.metadata.id, chunk.metadata.id, newChunk );
    };
    const linkTag = ( chunkId, tagId ) => {
      const chunk = corpus.chunks[chunkId];
      if ( chunk.tags.indexOf( tagId ) === -1 ) {
        updateChunk( corpus.metadata.id, chunk.metadata.id, {
          ...chunk,
          tags: [ ...chunk.tags, tagId ]
        } );
      }
    };

    const onDeleteTagCategory = ( categoryId ) => {
      const relatedTagsIds = Object.keys( corpus.tags )
        .filter( ( tagId ) => corpus.tags[tagId].tagCategoryId === promptedToDeleteTagCategoryId );
      Object.keys( corpus.chunks )
        .forEach( ( chunkId ) => {
          const chunk = corpus.chunks[chunkId];
          const newTags = chunk.tags.filter( ( tagId ) => relatedTagsIds.indexOf( tagId ) === -1 );
          if ( newTags.length !== chunk.tags.length ) {
            const newChunk = {
              ...chunk,
              tags: newTags
            };
            updateChunk( corpus.metadata.id, chunk.metadata.id, newChunk );
          }
        } );
      relatedTagsIds.forEach( ( tagId ) => deleteTag( corpus.metadata.id, tagId ) );

      deleteTagCategory( corpus.metadata.id, categoryId );
    };

    let promptedToDeleteTagRelatedChunks = 0;
    if ( promptedToDeleteTagId ) {
      promptedToDeleteTagRelatedChunks = Object.keys( corpus.chunks )
        .filter( ( chunkId ) => corpus.chunks[chunkId].tags.includes( promptedToDeleteTagId ) );
    }

    const onDeleteTag = ( tagId ) => {
      promptedToDeleteTagRelatedChunks.forEach( ( chunkId ) => {
        const chunk = corpus.chunks[chunkId];
        const newChunk = {
          ...chunk,
          tags: chunk.tags.filter( ( thatTagId ) => tagId !== thatTagId )
        };
        updateChunk( corpus.metadata.id, chunk.metadata.id, newChunk );
      } );
      deleteTag( corpus.metadata.id, tagId );
    };

    const createCompositionFromAsideMedia = () => {
      const compositionBlocks = chunksList
        .filter( ( c ) => c.metadata.mediaId === asideMediaId )
        .map( ( chunk ) => {
          const compositionBlock = defaults( schema.definitions.compositionBlock );
          compositionBlock.metadata = { id: genId() };
          compositionBlock.content = chunk.metadata.id;
          compositionBlock.activeFieldId = defaultFieldId;
          compositionBlock.duration = Math.abs( chunk.end - chunk.start );
          return compositionBlock;
        } );

      const composition = defaults( schema.definitions.composition );
      composition.metadata.id = genId();
      composition.metadata.title = corpus.medias[asideMediaId].metadata.title || t( 'Untitled composition' );
      composition.summary = compositionBlocks;
      createComposition( corpusId, composition );
      setTimeout( () => {
        history.push( `/corpora/${corpusId}/composition/${composition.metadata.id}` );
      }, 500 )
    };

    const onActiveSubviewClick = ( to ) => {
      switch ( to ) {
      case 'export':
        openPreview();
        break;
      case 'metadata':
        promptCorpusMetadataEdition();
        break;
      case 'import':
        setImportModalVisible( true );
        break;

      case 'medias':
      case 'compositions':
      case 'tags':
      default:
        setActiveSubview( to );
        break;
      }
    };

    const renderMain = () => {
      switch ( activeSubview ) {
      case 'medias':
        return (
          <div className={ 'column is-9 is-full-height columns' }>
            <div className={ 'column is-8 is-full-height rows' }>
              {
                      Object.keys( corpus.medias ).length > 1 &&
                      <div
                        style={ { paddingLeft: 0, marginBottom: 0 } }
                        className={ 'level column is-full' }
                      >
                        <SearchInput
                          value={ mediaSearchString }
                          onUpdate={ ( value ) => setMediaSearchString( value ) }
                          delay={ 500 }
                          placeholder={ t( 'find a media' ) }
                        />
                      </div>
                    }
              <div
                style={ { paddingLeft: 0 } }
                className={ 'level column is-full' }
              >
                <button
                  className={ 'button is-fullwidth' }
                  onClick={ promptNewMedia }
                >
                  {t( 'Add a new media' )}
                </button>
              </div>
              <PaginatedList
                className={ 'medias-list is-flex-1' }
                items={ visibleMedias }
                renderNoItem={ () => <div className={ 'column' }>{Object.keys( corpus.medias ).length ? t( 'No matching media' ) : t( 'No media yet' )}</div> }
                renderItem={ ( media ) => {
                          const onDelete = ( e ) => {
                            e.stopPropagation();
                            setPromptedToDeleteMediaId( media.metadata.id );
                          };
                          const attachedChunks = chunksList.filter( ( c ) => c.metadata.mediaId === media.metadata.id );
                          const attachedTags = uniq( flatten( attachedChunks.reduce( ( cur, chunk ) => [ ...cur, chunk.tags ], [] ) ) );
                          const onClick = () => history.push( `/corpora/${corpusId}/chunks?activeMedia=${media.metadata.id}` );
                          const onSetAside = ( e ) => {
                            e.stopPropagation();
                            if ( asideMediaId === media.metadata.id ) {
                              setAsideMediaId( undefined );
                            }
                            else {
                              setAsideMediaId( media.metadata.id );
                            }
                          };
                          return (
                            <li
                              key={ media.metadata.id }
                              className={ 'level column is-full' }
                            >
                              <MediaCard
                                media={ media }
                                allowPreview
                                onDelete={ onDelete }
                                chunksCount={ attachedChunks.length }
                                tagsCount={ attachedTags.length }
                                onClick={ onClick }
                                actionContents={ [
                                  <li
                                    key={ 0 }
                                  >
                                    <button
                                      data-for={ 'tooltip' }
                                      data-tip={ t( 'delete media' ) }
                                      className={ 'button is-rounded' }
                                      onClick={ onDelete }
                                    >
                                      <i className={ 'fas fa-trash' } />
                                    </button>
                                  </li>,
                                  <li
                                    key={ 1 }
                                  >
                                    <button
                                      data-for={ 'tooltip' }
                                      data-tip={ t( 'more info' ) }
                                      className={ `button is-rounded ${asideMediaId === media.metadata.id ? 'is-primary' : ''}` }
                                      onClick={ onSetAside }
                                    >
                                      <i className={ 'fas fa-eye' } />
                                    </button>
                                  </li>,
                                  <li
                                    key={ 2 }
                                  >
                                    <button
                                      data-for={ 'tooltip' }
                                      data-tip={ t( 'edit annotations' ) }
                                      className={ 'button is-rounded' }
                                      onClick={ onClick }
                                    >
                                      <i className={ 'fas fa-pencil-alt' } />
                                    </button>
                                  </li>
                                      ] }
                                href={ `/corpora/${corpusId}/chunks?activeMedia=${media.metadata.id}` }
                                showMedia
                                showFooter
                              />
                            </li>
                          );
                        } }
              />
            </div>
            <div className={ 'column is-4 is-full-height rows' }>
              {
                      asideMediaId &&
                      <AsideMedia
                        media={ corpus.medias[asideMediaId] }
                        fieldId={ defaultFieldId }
                        chunks={ chunksList.filter( ( c ) => c.metadata.mediaId === asideMediaId ) }
                        onDeselect={ () => setAsideMediaId( undefined ) }
                        onAnnotate={ () => history.push( `/corpora/${corpusId}/chunks?activeMedia=${asideMediaId}` ) }
                        onCreateComposition={ () => createCompositionFromAsideMedia() }
                        onDelete={ () => setPromptedToDeleteMediaId( corpusId, asideMediaId ) }
                      />
                    }
            </div>
          </div>
        );
      case 'compositions':
        return (
          <div className={ 'column is-9 is-full-height columns' }>
            <div className={ 'column is-8 is-full-height rows' }>
              {
                      Object.keys( corpus.compositions ).length > 1 &&
                      <div
                        style={ { paddingLeft: 0, marginBottom: 0 } }
                        className={ 'level column is-full' }
                      >
                        <SearchInput
                          value={ compositionsSearchString }
                          onUpdate={ ( value ) => setCompositionsSearchString( value ) }
                          delay={ 500 }
                          placeholder={ t( 'find a composition' ) }
                        />
                      </div>
                    }
              <div
                style={ { paddingLeft: 0 } }
                className={ 'level column is-full' }
              >
                <button
                  className={ 'button is-fullwidth' }
                  onClick={ promptNewComposition }
                >
                  {t( 'Add a new composition' )}
                </button>
              </div>
              <PaginatedList
                className={ 'medias-list is-flex-1' }
                items={ visibleCompositions }
                renderNoItem={ () => <div className={ 'column' }>{Object.keys( corpus.compositions ).length ? t( 'No matching composition' ) : t( 'No composition yet' )}</div> }
                renderItem={ ( composition ) => {
                          const onDelete = ( e ) => {
                            e.stopPropagation();
                            setPromptedToDeleteCompositionId( composition.metadata.id );
                          };
                          const onClick = () => history.push( `/corpora/${corpusId}/composition/${composition.metadata.id}` );
                          const onSetAside = ( e ) => {
                            e.stopPropagation();
                            if ( asideCompositionId === composition.metadata.id ) {
                              setAsideCompositionId( undefined );
                            }
                            else {
                              setAsideCompositionId( composition.metadata.id );
                            }
                          };
                          return (
                            <li
                              key={ composition.metadata.id }
                              className={ 'level column is-full' }
                            >
                              <CompositionCard
                                composition={ composition }
                                medias={ corpus.medias }
                                chunks={ corpus.chunks }
                                onDelete={ onDelete }
                                onClick={ onClick }
                                actionContents={ [
                                  <li
                                    key={ 0 }
                                  >
                                    <button
                                      data-for={ 'tooltip' }
                                      data-tip={ t( 'delete composition' ) }
                                      className={ 'button is-rounded' }
                                      onClick={ onDelete }
                                    >
                                      <i className={ 'fas fa-trash' } />
                                    </button>
                                  </li>,
                                  <li
                                    key={ 1 }
                                  >
                                    <button
                                      data-for={ 'tooltip' }
                                      data-tip={ t( 'more info' ) }
                                      className={ `button is-rounded ${asideCompositionId === composition.metadata.id ? 'is-primary' : ''}` }
                                      onClick={ onSetAside }
                                    >
                                      <i className={ 'fas fa-eye' } />
                                    </button>
                                  </li>,
                                  <li
                                    key={ 2 }
                                  >
                                    <button
                                      data-for={ 'tooltip' }
                                      data-tip={ t( 'edit annotations' ) }
                                      className={ 'button is-rounded' }
                                      onClick={ onClick }
                                    >
                                      <i className={ 'fas fa-pencil-alt' } />
                                    </button>
                                  </li>
                                      ] }
                                href={ `/corpora/${corpusId}/composition/${composition.metadata.id}` }
                              />
                            </li>
                          );
                        } }
              />
            </div>
            <div className={ 'column is-4 is-full-height rows' }>
              {
                      asideCompositionId &&
                      <AsideComposition
                        composition={ corpus.compositions[asideCompositionId] }
                        chunks={ corpus.chunks }
                        onDeselect={ () => setAsideCompositionId( undefined ) }
                        onAnnotate={ () => history.push( `/corpora/${corpusId}/compositions/${asideCompositionId}` ) }
                        onDelete={ () => setPromptedToDeleteCompositionId( corpusId, asideCompositionId ) }
                      />
                    }
            </div>
          </div>
        );
      case 'tags':
        const categoriesList = Object.keys( corpus.tagCategories ).map( ( tagCategoryId ) => corpus.tagCategories[tagCategoryId] )
          .map( ( tagCategory ) => {
            const relatedTags = Object.keys( corpus.tags ).filter( ( tagId ) => {
                const tag = corpus.tags[tagId];
                return tag.tagCategoryId === tagCategory.metadata.id;
              } )
              .sort( ( a, b ) => {
                if ( a.name > b.name ) {
                  return 1;
                }
                return -1;
              } );
            return {
              ...tagCategory,
              relatedTags
            };
          } );

        return (
          <div className={ 'column is-9 is-full-height columns' }>
            <div className={ 'column is-8 is-full-height rows' }>
              {
                      Object.keys( corpus.tags ).length > 1 &&
                      <div
                        style={ { paddingRight: 0, paddingLeft: 0, marginBottom: 0 } }
                        className={ 'level column is-full' }
                      >
                        <SearchInput
                          value={ tagsSearchString }
                          onUpdate={ ( value ) => setTagsSearchString( value ) }
                          delay={ 500 }
                          placeholder={ t( 'find a tag' ) }
                        />
                      </div>
                    }
              <div className={ 'is-scrollable is-flex-1' }>
                <div className={ 'accordions' }>
                  {
                              categoriesList
                              .sort( ( a, b ) => {
                                if ( a.name > b.name ) {
                                  return 1;
                                }
                                return -1;
                              } )
                              .map( ( category ) => {

                                const isOpen = visibleTagCategoriesIds.includes( category.metadata.id );
                                const onToggleVisibility = () => {
                                  if ( isOpen ) {
                                    setVisibleTagCategoriesIds( visibleTagCategoriesIds.filter( ( cid ) => cid !== category.metadata.id ) );
                                  }
                                  else {
                                    setVisibleTagCategoriesIds( [ category.metadata.id ] );
                                  }
                                };
                                const onEdit = () => {
                                  setEditedTagCategoryId( category.metadata.id );
                                };
                                const onDelete = () => {
                                  setPromptedToDeleteTagCategoryId( category.metadata.id );
                                };
                                return (
                                  <div
                                    key={ category.metadata.id }
                                    className={ `accordion category-container ${isOpen || tagsSearchString.length > 1 ? 'is-active  is-scrollable' : ''}` }
                                    style={ { marginBottom: '1rem' } }
                                  >
                                    <div className={ 'accordion-header category-header stretched-columns' }>
                                      <h3
                                        className={ 'title level is-3 stretched-columns is-flex-1' }
                                      >
                                        <div className={ 'color-toggle-container' }>
                                          <span
                                            className={ 'button color-toggle' }
                                            onClick={ onEdit }
                                            style={ {
                                                          width: '2em',
                                                          height: '2em',
                                                          background: category.color,
                                                          marginRight: '1rem'
                                                        } }
                                          />
                                        </div>
                                        <span
                                          onClick={ onToggleVisibility }
                                          className={ 'is-flex-1' }
                                        >
                                          {abbrev( category.name, 50 )}
                                        </span>

                                        <button
                                          onClick={ onEdit }
                                          data-for={ 'tooltip' }
                                          data-tip={ t( 'Edit tag category' ) }
                                          className={ 'button is-rounded' }
                                        >
                                          <i className={ 'fas fa-pencil-alt' } />
                                        </button>

                                        <button
                                          onClick={ onToggleVisibility }
                                          data-for={ 'tooltip' }
                                          data-tip={ t( 'Show category tags' ) }
                                          className={ 'button is-rounded' }
                                        >
                                          <span style={ { display: isOpen ? 'inline' : 'none' } }>
                                            <i className={ 'fas fa-minus' } />
                                          </span>
                                          <span style={ { display: !isOpen ? 'inline' : 'none' } }>
                                            <i className={ 'fas fa-plus' } />
                                          </span>
                                        </button>

                                        <button
                                          onClick={ onDelete }
                                          data-for={ 'tooltip' }
                                          data-tip={ t( 'Delete tag category' ) }
                                          className={ 'button is-rounded' }
                                        >
                                          <i className={ 'fas fa-trash' } />
                                        </button>
                                      </h3>
                                    </div>
                                    <div className={ 'category-body accordion-body' }>
                                      {
                                              tagsSearchString.length === 0 &&
                                              <div className={ 'column' }>
                                                <div
                                                  onClick={ () => promptNewTag( category.metadata.id ) }
                                                  className={ 'button is-fullwidth' }
                                                >
                                                  {t( 'Create a new tag in this category' )}
                                                </div>
                                              </div>
                                            }
                                      {
                                              category
                                              .relatedTags
                                              .sort( ( a, b ) => {
                                                if ( corpus.tags[a].name > corpus.tags[b].name ) {
                                                  return 1;
                                                }
                                                return -1;
                                              } )
                                                .filter( ( thatTag ) => {
                                                  if ( tagsSearchString.length > 1 ) {
                                                    return corpus.tags[thatTag].name.toLowerCase().includes( tagsSearchString.toLowerCase() );
                                                  }
                                                  else {
                                                    return true;
                                                  }
                                                } )
                                                .map( ( tagId ) => {
                                                  const tag = corpus.tags[tagId];
                                                  const relatedChunksIds = Object.keys( corpus.chunks ).filter( ( chunkId ) => {
                                                    return corpus.chunks[chunkId].tags.includes( tagId );
                                                  } );
                                                  const onThisTagDelete = ( e ) => {
                                                    e.stopPropagation();
                                                    setPromptedToDeleteTagId( tagId );
                                                  };
                                                  const onThisTagEdit = ( e ) => {
                                                    e.stopPropagation();
                                                    setEditedTagId( tagId );
                                                  };
                                                  const onLink = ( e ) => {
                                                    e.stopPropagation();
                                                    if ( asideTagId === tagId ) {
                                                      setAsideTagId( undefined );
                                                    }
                                                    else {
                                                      setAsideTagId( tagId );
                                                    }
                                                  };
                                                  return (
                                                    <div
                                                      className={ 'column tag-card' }
                                                      key={ tag.metadata.id }
                                                      onClick={ onLink }
                                                    >
                                                      <div className={ 'card' }>
                                                        <div
                                                          className={ 'card-content' }
                                                          style={ {
                                                                    display: 'flex',
                                                                    flexFlow: 'row nowrap',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'stretch'
                                                                  } }
                                                        >
                                                          <span style={ { marginRight: '1rem' } }>
                                                            <i className={ 'fas fa-tag' } />
                                                          </span>
                                                          <span className={ 'is-flex-1' }>
                                                            {tag.name}
                                                          </span>
                                                          <span className={ 'is-flex-1' }>
                                                            <span
                                                              style={ { marginRight: '1rem' } }
                                                              data-for={ 'tooltip' }
                                                              data-tip={ t( [ 'one chunk tagged in corpus', '{n} chunks tagged in corpus', '{n}' ], { n: relatedChunksIds.length } ) }
                                                            >
                                                              <i className={ 'fas fa-film' } />
                                                              <span style={ { marginLeft: '.2rem' } }>{relatedChunksIds.length}</span>
                                                            </span>
                                                            {
                                                                        tag.location && tag.location.latitude &&
                                                                        <span
                                                                          style={ { marginRight: '1rem' } }
                                                                          data-for={ 'tooltip' }
                                                                          data-tip={ t( 'tag has geographical information' ) }
                                                                        >
                                                                          <i className={ 'fas fa-map-marker' } />
                                                                        </span>
                                                                      }
                                                            {
                                                                        tag.dates && tag.dates.start &&
                                                                        <span
                                                                          style={ { marginRight: '1rem' } }
                                                                          data-for={ 'tooltip' }
                                                                          data-tip={ t( 'tag has dates information' ) }
                                                                        >
                                                                          <i className={ 'fas fa-clock' } />
                                                                        </span>
                                                                      }
                                                            {
                                                                        tag.description && tag.description.length &&
                                                                        <span
                                                                          data-for={ 'tooltip' }
                                                                          data-tip={ t( 'tag has a description' ) }
                                                                        >
                                                                          <i className={ 'fas fa-map-align-left' } />
                                                                        </span>
                                                                      }
                                                          </span>
                                                          <span
                                                            className={ 'is-flex-1' }
                                                            style={ { textAlign: 'right' } }
                                                          >
                                                            <button
                                                              onClick={ onThisTagEdit }
                                                              data-for={ 'tooltip' }
                                                              data-tip={ t( 'edit tag' ) }
                                                              className={ 'button is-rounded' }
                                                            >
                                                              <i className={ 'fas fa-pencil-alt' } />
                                                            </button>
                                                            <button
                                                              onClick={ onLink }
                                                              data-for={ 'tooltip' }
                                                              data-tip={ t( 'edit tag annotations on excerpts' ) }
                                                              className={ `button link-tag-button is-rounded ${asideTagId === tagId ? 'is-primary' : ''}` }
                                                            >
                                                              <i className={ 'fas fa-link' } />
                                                            </button>
                                                            <button
                                                              onClick={ onThisTagDelete }
                                                              data-for={ 'tooltip' }
                                                              data-tip={ t( 'delete tag' ) }
                                                              className={ 'button is-rounded' }
                                                            >
                                                              <i className={ 'fas fa-trash' } />
                                                            </button>
                                                          </span>
                                                        </div>
                                                      </div>
                                                      <ReactTooltip
                                                        effect={ 'solid' }
                                                        delayShow={ 500 }
                                                        id={ 'tooltip' }
                                                      />
                                                    </div>
                                                  );
                                                } )
                                            }
                                    </div>
                                  </div>
                                );
                              } )
                            }
                </div>
                {tagsSearchString.length === 0 &&
                <div className={ 'stretched-columns' }>
                  <button
                    className={ 'button is-fullheight is-flex-1' }
                    onClick={ promptNewTagCategory }
                  >
                    {t( 'Add a new tag category' )}
                  </button>
                </div>}
              </div>
            </div>
            <div className={ 'column is-4 is-full-height rows' }>
              {
                      asideTagId && corpus.tags[asideTagId] &&
                      <AsideTag
                        tag={ corpus.tags[asideTagId] }
                        tagCategory={ corpus.tagCategories[corpus.tags[asideTagId].tagCategoryId] }
                        fieldId={ defaultFieldId }
                        medias={ corpus.medias }
                        linkTag={ linkTag }
                        unlinkTag={ unlinkTag }
                        allChunks={ chunksList.filter( ( c ) => !c.tags.includes( asideTagId ) ) }
                        relatedChunks={ chunksList.filter( ( c ) => c.tags.includes( asideTagId ) ) }
                        mode={ asideTagMode }
                        setMode={ setAsideTagMode }
                        onDeselect={ () => setAsideTagId( undefined ) }
                      />
                    }
            </div>
          </div>
        );
      default:
        return (
          <div className={ 'column is-9 is-full-height columns' }>
            <div className={ 'column is-6 is-full-height' }>
              {activeSubview}
            </div>
            <div className={ 'column is-6 is-full-height' }>
                right
            </div>
          </div>
        );
      }
    };

    return (
      <section className={ 'dicto-Corpus rows' }>
        <Nav
          localizationCrumbs={ [
                  {
                    href: '/corpora/',
                    name: t( 'my corpora' )
                  },
                  {
                    href: `/corpora/${corpus.metadata.id}`,
                    active: true,
                    name: `/ ${ corpus.metadata.title}` || t( 'untitled corpus' )
                  },
                ] }
          localOperations={ [] }
          importantOperations={ [] }
        />
        <div className={ 'container is-fluid hero-body  is-flex-1 is-stretched-column' }>
          <div className={ 'columns is-flex-1' }>
            <nav
              id={ 'corpus-nav' }
              className={ 'column is-3 is-full-height' }
            >
              <h1
                style={ { marginTop: 0 } }
                className={ 'title is-1' }
              >
                {abbrev( corpus.metadata.title || t( 'Untitled corpus' ), 60 )}
              </h1>

              <ul className={ 'subviews-menu' }>
                <li
                  id={ 'list-medias' }
                  onClick={ () => onActiveSubviewClick( 'medias' ) }
                  className={ `subview-menu-item title is-4 ${activeSubview === 'medias' ? 'is-active' : ''}` }
                >
                  <i className={ 'fas fa-video' } />
                  <span className={ 'subview-title' }>{t( 'medias' )}</span>
                </li>

                <li
                  id={ 'list-tags' }
                  onClick={ () => onActiveSubviewClick( 'tags' ) }
                  className={ `subview-menu-item title is-4 ${activeSubview === 'tags' ? 'is-active' : ''}` }
                >
                  <i className={ 'fas fa-tags' } />
                  <span className={ 'subview-title' }>{t( 'tags' )}</span>
                </li>

                <li
                  id={ 'list-compositions' }
                  onClick={ () => onActiveSubviewClick( 'compositions' ) }
                  className={ `subview-menu-item title is-4 ${activeSubview === 'compositions' ? 'is-active' : ''}` }
                >
                  <i className={ 'fas fa-list' } />
                  <span className={ 'subview-title' }>{t( 'compositions' )}</span>
                </li>

                <li
                  id={ 'edit-metadata' }
                  onClick={ () => onActiveSubviewClick( 'metadata' ) }
                  className={ `subview-menu-item title is-4 ${activeSubview === 'metadata' ? 'is-active' : ''}` }
                >
                  <i className={ 'fas fa-file' } />
                  <span className={ 'subview-title' }>{t( 'metadata' )}</span>
                </li>

                <li
                  id={ 'import-corpus' }
                  onClick={ () => onActiveSubviewClick( 'import' ) }
                  className={ `subview-menu-item title is-4 ${activeSubview === 'export' ? 'is-active' : ''}` }
                >
                  <i className={ 'fas fa-download' } />
                  <span className={ 'subview-title' }>{t( 'import' )}</span>
                </li>

                <li
                  id={ 'export-corpus' }
                  onClick={ () => onActiveSubviewClick( 'export' ) }
                  className={ `subview-menu-item title is-4 ${activeSubview === 'export' ? 'is-active' : ''}` }
                >
                  <i className={ 'fas fa-upload' } />
                  <span className={ 'subview-title' }>{t( 'export' )}</span>
                </li>
              </ul>
            </nav>
            {renderMain()}
          </div>
        </div>

        <Modal
          isOpen={ corpusMetadataModalOpen || newCompositionModalOpen }
          onRequestClose={ closeModals }
        >
          <div className={ 'modal-content' }>
            <div className={ 'modal-header' }>
              <h1 className={ 'title is-1' }>
                {
                            corpusMetadataModalOpen ?
                              t( 'edit corpus metadata' )
                              :
                              t( 'create a new composition' )
                          }
              </h1>
            </div>
            <SchemaForm
              schema={ corpusMetadataModalOpen ? schema.properties.metadata : compositionMetadataSchema }
              document={ corpusMetadataModalOpen ? corpus.metadata : undefined }
              onCancel={ closeModals }
              onSubmit={ onSubmitForm }
            />
          </div>
          <div className={ 'close-modal-icon-container' }>
            <span
              className={ 'icon' }
              onClick={ closeModals }
            >
              <i className={ 'fas fa-times-circle' } />
            </span>
          </div>
        </Modal>
        <Modal
          isOpen={ newMediaPrompted }
          onRequestClose={ closeModals }
        >
          <MediaEditor
            media={ undefined }
            onValidate={ handleMediaModalValidate }
            onCancel={ closeModals }
          />
          <div className={ 'close-modal-icon-container' }>
            <span
              className={ 'icon' }
              onClick={ closeModals }
            >
              <i className={ 'fas fa-times-circle' } />
            </span>
          </div>
        </Modal>

        <Modal
          isOpen={ newTagCategoryPrompted || editedTagCategoryId !== undefined }
          onRequestClose={ closeModals }
        >
          <div className={ 'modal-content' }>
            <div className={ 'modal-header' }>
              <h1 className={ 'title is-1' }>
                {
                          editedTagCategoryId ?
                            t( 'edit tag category "{n}"', { n: corpus.tagCategories[editedTagCategoryId] && corpus.tagCategories[editedTagCategoryId].name } )
                            :
                            t( 'create a new tag category' )
                        }
              </h1>
            </div>
            <SchemaForm
              schema={ tagCategoryDataSchema }
              document={ editedTagCategoryId ? corpus.tagCategories[editedTagCategoryId] : undefined }
              onCancel={ closeModals }
              onSubmit={ onSubmitNewTagCategory }
            />
          </div>
          <div className={ 'close-modal-icon-container' }>
            <span
              className={ 'icon' }
              onClick={ closeModals }
            >
              <i className={ 'fas fa-times-circle' } />
            </span>
          </div>
        </Modal>
        <Modal
          isOpen={ newTagPrompted !== false || editedTagId !== undefined }
          onRequestClose={ closeModals }
        >
          <div className={ 'modal-content' }>
            <div className={ 'modal-header' }>
              <h1 className={ 'title is-1' }>
                {
                          editedTagId ?
                            t( 'edit tag "{n}"', { n: corpus.tags[editedTagId] && corpus.tags[editedTagId].name } )
                            :
                            t( 'create a new tag in category "{n}"', { n: corpus.tagCategories[newTagPrompted] && corpus.tagCategories[newTagPrompted].name } )
                        }
              </h1>
            </div>
            <SchemaForm
              schema={ tagSchema }
              document={ editedTagId ? corpus.tags[editedTagId] : undefined }
              onCancel={ closeModals }
              onSubmit={ onSubmitNewTag }
            />
          </div>
          <div className={ 'close-modal-icon-container' }>
            <span
              className={ 'icon' }
              onClick={ closeModals }
            >
              <i className={ 'fas fa-times-circle' } />
            </span>
          </div>
        </Modal>
        <Modal
          isOpen={ promptedToDeleteMediaId !== undefined }
          onRequestClose={ closeModals }
        >
          <div className={ 'modal-content' }>
            <div className={ 'modal-header' }>
              <h1 className={ 'title is-1' }>
                {t( 'delete a media' )}
              </h1>
            </div>
            <div className={ 'modal-body' }>
              <div
                style={ { paddingLeft: '1rem' } }
                className={ 'column content is-large' }
              >
                {t( 'Are you sure you want to delete this media and all related excerpts ?' )}
              </div>
            </div>

            <div className={ 'modal-footer' }>
              <button
                onClick={ () => {
                              deleteMedia( corpus.metadata.id, promptedToDeleteMediaId ); setPromptedToDeleteMediaId( undefined );
                            } }
                className={ 'button is-danger is-fullwidth' }
              >
                {t( 'delete the media' )}
              </button>
              <button
                onClick={ () => setPromptedToDeleteMediaId( undefined ) }
                className={ 'button is-warning is-fullwidth' }
              >
                {t( 'cancel' )}
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={ promptedToDeleteTagCategoryId !== undefined }
          onRequestClose={ closeModals }
        >
          <div className={ 'modal-content' }>
            <div className={ 'modal-header' }>
              <h1 className={ 'title is-1' }>
                {t( 'delete a tag category' )}
              </h1>
            </div>
            <div className={ 'modal-body' }>
              <div
                style={ { paddingLeft: '1rem' } }
                className={ 'column content is-large' }
              >
                {
                              t( 'You are going to destroy {x} tags and untag {y} excerpts. Are you sure you want to delete this tag category ?', {
                                x: promptedToDeleteTagCategoryData.relatedTags.length,
                                y: promptedToDeleteTagCategoryData.relatedChunks.length
                              } )
                            }
              </div>
            </div>

            <div className={ 'close-modal-icon-container' }>
              <span
                className={ 'icon' }
                onClick={ closeModals }
              >
                <i className={ 'fas fa-times-circle' } />
              </span>
            </div>

            <div className={ 'modal-footer' }>
              <button
                onClick={ () => {
                              onDeleteTagCategory( promptedToDeleteTagCategoryId ); setPromptedToDeleteTagCategoryId( undefined );
                            } }
                className={ 'button is-danger is-fullwidth' }
              >
                {t( 'delete the tag category' )}
              </button>
              <button
                onClick={ () => setPromptedToDeleteTagCategoryId( undefined ) }
                className={ 'button is-warning is-fullwidth' }
              >
                {t( 'cancel' )}
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={ promptedToDeleteTagId !== undefined }
          onRequestClose={ closeModals }
        >
          <div className={ 'modal-content' }>
            <div className={ 'modal-header' }>
              <h1 className={ 'title is-1' }>
                {t( 'delete a tag' )}
              </h1>
            </div>
            <div className={ 'modal-body' }>
              <div
                style={ { paddingLeft: '1rem' } }
                className={ 'column content is-large' }
              >
                {t( 'You are going to untag {n} excerpts. Are you sure you want to delete this tag ?', { n: promptedToDeleteTagRelatedChunks.length } )}
              </div>
            </div>

            <div className={ 'close-modal-icon-container' }>
              <span
                className={ 'icon' }
                onClick={ closeModals }
              >
                <i className={ 'fas fa-times-circle' } />
              </span>
            </div>

            <div className={ 'modal-footer' }>
              <button
                onClick={ () => {
                              onDeleteTag( promptedToDeleteTagId ); setPromptedToDeleteTagId( undefined );
                            } }
                className={ 'button is-danger is-fullwidth' }
              >
                {t( 'delete the tag' )}
              </button>
              <button
                onClick={ () => setPromptedToDeleteTagId( undefined ) }
                className={ 'button is-warning is-fullwidth' }
              >
                {t( 'cancel' )}
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={ promptedToDeleteCompositionId !== undefined }
          onRequestClose={ closeModals }
        >
          <div className={ 'modal-content' }>
            <div className={ 'modal-header' }>
              <h1 className={ 'title is-1' }>
                {t( 'delete a composition' )}
              </h1>
            </div>
            <div className={ 'modal-body' }>
              <div
                style={ { paddingLeft: '1rem' } }
                className={ 'column content is-large' }
              >
                {t( 'Are you sure you want to delete this composition ?' )}
              </div>
            </div>

            <div className={ 'modal-footer' }>
              <button
                onClick={ () => {
                              deleteComposition( corpus.metadata.id, promptedToDeleteCompositionId ); setPromptedToDeleteCompositionId( undefined );
                            } }
                className={ 'button is-danger is-fullwidth' }
              >
                {t( 'delete the composition' )}
              </button>
              <button
                onClick={ () => setPromptedToDeleteCompositionId( undefined ) }
                className={ 'button is-warning is-fullwidth' }
              >
                {t( 'cancel' )}
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={ importModalVisible }
          onRequestClose={ () => setImportModalVisible( false ) }
        >
          <div className={ 'modal-content' }>
            <div className={ 'modal-header' }>
              <h1 className={ 'title is-1' }>{t( 'import corpus' )}</h1>
              <div className={ 'close-modal-icon-container' }>
                <span
                  className={ 'icon' }
                  onClick={ () => setImportModalVisible( false ) }
                >
                  <i className={ 'fas fa-times-circle' } />
                </span>
              </div>
            </div>
            <div className={ 'modal-body stretched-columns' }>
              {
                          !importCorpusCandidate &&
                          <div
                            style={ { padding: '2rem' } }
                            className={ 'column content is-large' }
                          >
                            <p>
                              {t( 'Import an existing corpus into the current corpus to add media, tags, and tags categories.' )}
                            </p>
                            <DropZone
                              onDrop={ onCorpusDrop }
                            >
                              {t( 'import-corpus' )}
                            </DropZone>
                          </div>
                        }
              {
                          importCollisionsList && importCollisionsList.length > 0 &&
                          <div style={ { padding: '1rem' } }>
                            <h3 className={ 'title is-3' }>
                              {t( 'Import duplicate spotted ({n} others)', { n: importCollisionsList.length } )}
                            </h3>
                            <ImportCollisionChoice
                              collision={ importCollisionsList[0] }
                              corpus={ corpus }
                              onForget={ onForgetActiveCollision }
                              onDuplicate={ onDuplicateActiveCollision }
                              onMerge={ onMergeActiveCollision }
                            />
                          </div>
                        }
            </div>
            {
                      importCollisionsList && importCollisionsList.length > 0 &&
                      <ul className={ 'modal-footer' }>
                        <li>
                          <button
                            className={ 'button is-fullwidth is-fullheight is-primary' }
                            onClick={ () => onMergeAllImportCollisions() }
                          >{t( 'merge all duplicates' )}
                          </button>
                        </li>
                        <li>
                          <button
                            className={ 'button is-fullwidth is-fullheight is-info' }
                            onClick={ () => onDuplicateAllImportCollisions() }
                          >{t( 'keep all duplicates' )}
                          </button>
                        </li>
                        <li>
                          <button
                            className={ 'button is-fullwidth is-fullheight is-warning' }
                            onClick={ () => setImportModalVisible( false ) }
                          >{t( 'cancel' )}
                          </button>
                        </li>
                      </ul>
                    }
          </div>
        </Modal>
        <Modal
          isOpen={ previewModalOpen }
          onRequestClose={ closeModals }
          style={ {
                  content: {
                    height: '80%'
                  }
                } }
        >
          <div className={ 'modal-content' }>
            <div className={ 'modal-header' }>
              <h1 className={ 'title is-1' }>{t( 'export corpus' )}</h1>
              <div className={ 'close-modal-icon-container' }>
                <span
                  className={ 'icon' }
                  onClick={ closeModals }
                >
                  <i className={ 'fas fa-times-circle' } />
                </span>
              </div>
            </div>
            <div className={ 'modal-body  corpus-modal-body stretched-columns' }>
              <ul
                style={ { maxWidth: '20%', overflow: 'auto' } }
                className={ 'column' }
              >
                <li className={ 'column' }>
                  <button
                    id={ 'download-as-html' }
                    className={ 'box' }
                    onClick={ onDownloadHTML }
                  >{t( 'download as an html page' )}
                  </button>
                </li>
                <li className={ 'column' }>
                  <button
                    id={ 'download-as-json' }
                    className={ 'box' }
                    onClick={ onDownloadJSON }
                  >{t( 'download as a json file' )}
                  </button>
                </li>
                <li className={ 'column' }>
                  <button
                    id={ 'download-tags' }
                    className={ 'box' }
                    onClick={ onDownloadTags }
                  >{t( 'download tags list (tsv)' )}
                  </button>
                </li>
                <li className={ 'column' }>
                  <button
                    id={ 'download-medias' }
                    className={ 'box' }
                    onClick={ onDownloadMedias }
                  >{t( 'download medias list (tsv)' )}
                  </button>
                </li>
                <li className={ 'column' }>
                  <button
                    id={ 'download-excerpts' }
                    className={ 'box' }
                    onClick={ onDownloadExcerpts }
                  >{t( 'download excerpts list (tsv)' )}
                  </button>
                </li>
              </ul>
              <div
                style={ { position: 'relative' } }
                className={ 'is-flex-1' }
              >
                <CorpusPlayer
                  corpus={ corpus }
                  translate={ t }
                />
              </div>
            </div>
          </div>
        </Modal>
      </section>
    );
  }
  else if ( stateLoaded ) {
    return ( <NotFound mode={ 'corpus' } /> );
  }
  else {
    return ( <Loading /> );
  }
};

/**
 * Context data used by the component
 */
CorpusLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};

export default CorpusLayout;
