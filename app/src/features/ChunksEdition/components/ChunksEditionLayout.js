/* eslint react/no-danger : 0 */
/**
 * This module exports a stateless component rendering the layout of the layout view
 * @module dicto/features/Layout
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { v4 as genId } from 'uuid';
import { HotKeys } from 'react-hotkeys';
import { flatten, uniq } from 'lodash';

import schema from 'dicto-schema';

import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import {
  mapToArray,
} from '../../../helpers/utils';

import PaginatedList from '../../../components/PaginatedList';
import MediaEditor from '../../../components/MediaEditor';
import MediaCard from '../../../components/MediaCard';
import ControlledMediaPlayer from '../../../components/ControlledMediaPlayer';
import Railway from '../../../components/Railway';
import TimelineChunk from '../../../components/TimelineChunk';
import TimeInput from '../../../components/TimeInput';
import ChunksSpace from '../../../components/ChunksSpace';
import ChunkCard from '../../../components/ChunkCard';
import ChunkContentEditor from '../../../components/ChunkContentEditor';
import Nav from '../../../components/Nav';
import DropZone from '../../../components/DropZone';
// import TagEditor from '../../../components/TagEditor';
import SimplePaginatedList from '../../../components/SimplePaginatedList';
import Loading from '../../../components/Loading';
import NotFound from '../../../components/NotFound';
import SchemaForm from '../../../components/SchemaForm';
import MontagePlayer from '../../../components/MontagePlayer';

import './ChunksEditionLayout.scss';

Modal.setAppElement( '#mount' );

const tagSchema = {
  type: 'object',
  properties: {
    ...schema.definitions.tag.properties,
  }
};
delete tagSchema.properties.metadata;
delete tagSchema.properties.tagCategoryId;

const tagCategorySchema = {
  type: 'object',
  properties: {
    ...schema.definitions.tagCategory.properties,
  }
};
delete tagCategorySchema.properties.metadata;

const hotKeysMap = {
  togglePause: 'alt+p',
  backward: 'alt+up',
  forward: 'alt+down',
  seekToBeginOfActiveChunk: 'alt+b',
  seekToEndOfActiveChunk: 'alt+e',
  startActiveChunkAtMediaPosition: 'alt+s',
  endActiveChunkAtMediaPosition: 'alt+d',
};

class PlaceHolderInput extends Component {
  componentDidMount = () => {
    this.input.focus();
  }
  render = () => {
    const bindInput = ( input ) => {
      this.input = input;
    };

    return ( <input
      ref={ bindInput }
      style={ { width: 0, height: 0 } }
             /> );
  }
}

export class ChunksEditionLayout extends Component {

  componentWillReceiveProps = ( nextProps ) => {

    /*
     * refocusing when closing selected chunk
     * to still enable shortcuts
     */
    if ( this.props.selectedChunkId && !nextProps.selectedChunkId ) {
      const inputs = document.getElementsByTagName( 'input' );
      if ( inputs ) {
        inputs[0].focus();
      }
    }
  }

  render = () => {
    const {
      props: {
        corpus,

        history,

        // medias related ui
        mediaPromptedToDelete,
        editedMedia,
        newMediaPrompted,
        activeMediaId,
        mediaPlaying,
        mediaCurrentTime,
        mediaDuration: localMediaDuration,
        seekedTime,
        chunkSpaceRatio,
        chunkSpaceTimeScroll,

        scrollTargetInSeconds,
        selectedChunkId,
        activeFieldId,
        mediaChoiceVisible,
        scrollLocked,
        editionMode,
        activeTagCategoryId,
        isChunkEditorExpanded,
        importPrompted,
        importedChunkCandidates,
        leftColumnWidth,
        editorModalOpen,
        editedTagId,
        stateLoaded,
        promptedToDeleteFieldId,
        isDragging,
        optionsDropdownOpen,
        tagsDropdownOpen,
        shortcutsHelpVisibility,
        tempNewFieldTitle,
        editedFieldId,
        editedFieldTempName,
        tagSearchTerm,
        newTagPrompted,
        newTagTempData,
        exportMediaPrompted,
        newTagCategoryPrompted,

        actions: {
          promptNewMedia,
          unpromptNewMedia,
          promptMediaEdition,
          unpromptMediaEdition,
          promptMediaDeletion,
          unpromptMediaDeletion,
          setActiveMediaId,

          createMedia,
          updateMedia,
          deleteMedia,

          updateField,
          deleteField,

          setMediaPlaying,
          setMediaCurrentTime,
          setMediaDuration,
          seekToMediaTime,
          setChunkSpaceRatio,
          setChunkSpaceTimeScroll,
          setScrollTargetInSeconds,
          setActiveFieldId,
          selectChunk,
          setMediaChoiceVisibility,
          toggleChunkEditorExpanded,
          setEditedFieldId,

          setActiveTagCategoryId,

          setScrollLocked,
          setExportMediaPrompted,

          updateChunk,
          deleteChunk,

          createTag,
          updateTag,
          deleteTag,

          createTagCategory,
          updateTagCategory,
          deleteTagCategory,

          setEditionMode,

          promptImport,
          unpromptImport,
          promptEditorModal,
          unpromptEditorModal,
          setLeftColumnWidth,
          setEditedTagId,
          unsetEditedTagId,
          setPromptedToDeleteFieldId,
          setIsDragging,
          setOptionsDropdownOpen,
          setTagsDropdownOpen,

          setShortcutsHelpVisibility,
          setTempNewFieldTitle,
          setEditedFieldTempName,
          setTagSearchTerm,
          setNewTagPrompted,
          setNewTagTempData,
          setNewTagCategoryPrompted,

        },
        addChunk,
        addField,
        addTagCategory,
        addTag,
        onTranscriptionFileDrop,
        regroupImportCandidates,
        importChunkCandidates,
        createChunk,
        onDownloadExcerptsSrt,
        onDownloadExcerptsOtr,
        onDownloadTagsTable,
        onDownloadExcerptsTable,
        onDownloadCompositionAsHTML,
      },
      context: { t }
    } = this;
    if ( corpus ) {
      const {
        medias: mediasMap,
        chunks: chunksMap,
        fields,
        tags,
        tagCategories
      } = corpus;
      const corpusId = corpus.metadata.id;
      const medias = mapToArray( mediasMap );
      const chunks = mapToArray( chunksMap )
        .filter( ( chunk ) => chunk.metadata.mediaId === activeMediaId );
      const mediaTags = uniq( flatten( chunks.map( ( chunk ) => chunk.tags ) ) );

      const defaultFieldId = Object.keys( fields ).find( ( fieldId ) => fields[fieldId].name === 'default' );

      let activeMedia = activeMediaId && mediasMap[activeMediaId];

      // automatically set an active media if none selected
      if ( !activeMedia && Object.keys( mediasMap ).length ) {
        const firstMedia = mapToArray( mediasMap ).sort( ( a, b ) => {
          if ( a.metadata.lastModifiedAt > b.metadata.lastModifiedAt ) {
            return 1;
          }
          return -1;
        } )[0];
        setActiveMediaId( firstMedia.metadata.id );
        activeMedia = firstMedia;
      }

      const chunksList = mapToArray( corpus.chunks );

      const mediaDuration = activeMedia ? activeMedia.duration || localMediaDuration : localMediaDuration;

      const handleModalCloseRequest = () => {
        if ( mediaPromptedToDelete ) {
          return unpromptMediaDeletion();
        }
        else if ( editedMedia ) {
          return unpromptMediaEdition();
        }
        else if ( newMediaPrompted ) {
          return unpromptNewMedia();
        }
        else if ( editorModalOpen ) {
          return unpromptEditorModal();
        }
        else if ( editedTagId ) {
          unsetEditedTagId();
        }
      };
      const handleMediaModalValidate = ( media ) => {
        if ( editedMedia ) {
          updateMedia( corpusId, media.metadata.id, media );
          unpromptMediaEdition();
        }
        else if ( newMediaPrompted ) {
          media.metadata.id = genId();
          createMedia( corpusId, media );
          unpromptNewMedia();
          setTimeout( () => {
            history.push( {
              search: `?activeMedia=${media.metadata.id }`
            } );
            setActiveMediaId( media.metadata.id );
          }, 500 )
          setMediaChoiceVisibility( false );
        }
      };

      const onDeleteMedia = () => {
        deleteMedia( corpus.metadata.id, mediaPromptedToDelete.mediaId );
        unpromptMediaDeletion();
      };

      const togglePlaying = () => {
        if ( mediaPlaying ) {
          setMediaPlaying( false );
        }
        else {
          setMediaPlaying( true );
        }
      };

      const onSeekToMediaTime = ( seconds ) => {
        const playing = mediaPlaying;
        setMediaPlaying( false );
        setTimeout( () => {
          seekToMediaTime( seconds );
          if ( playing ) {
            setMediaPlaying( true );
          }
        }, 100 )
        setScrollTargetInSeconds( seconds );
      };

      const seekForward = () => {
        let wanted = mediaCurrentTime + 5;
        wanted = wanted > mediaDuration ? mediaDuration : wanted;
        seekToMediaTime( wanted );
      };

      const seekBackward = () => {
        let wanted = mediaCurrentTime - 5;
        wanted = wanted < 0 ? 0 : wanted;
        seekToMediaTime( wanted );
      };

      const onCut = ( chunk, at ) => {
        const end = chunk.end;
        updateChunk(
          corpusId,
          chunk.metadata.id,
          {
            ...chunk,
            end: at,
          }
        );
        createChunk( {
          start: at,
          end,
          x: chunk.x
        } );
      };

      const hotKeysHandlers = {
        backward: ( event ) => {
          event.stopPropagation();
          event.preventDefault();
          seekBackward();
        },
        forward: ( event ) => {
          event.stopPropagation();
          event.preventDefault();
          seekForward();
        },
        togglePause: ( event ) => {
          event.stopPropagation();
          event.preventDefault();
          setMediaPlaying( !mediaPlaying );
        },
        seekToBeginOfActiveChunk: ( event ) => {
          event.stopPropagation();
          event.preventDefault();
          const activeChunk = chunksMap[selectedChunkId];
          if ( activeChunk ) {
            seekToMediaTime( activeChunk.start );
          }
        },
        seekToEndOfActiveChunk: ( event ) => {
          event.stopPropagation();
          event.preventDefault();
          const activeChunk = chunksMap[selectedChunkId];
          if ( activeChunk ) {
            seekToMediaTime( activeChunk.end );
          }
        },
        startActiveChunkAtMediaPosition: ( event ) => {
          event.stopPropagation();
          event.preventDefault();
          const activeChunk = chunksMap[selectedChunkId];
          if ( activeChunk ) {
            updateChunk(
              corpusId,
              activeChunk.metadata.id,
              {
                ...activeChunk,
                start: mediaCurrentTime,
              }
            );
          }
        },
        endActiveChunkAtMediaPosition: ( event ) => {
          event.stopPropagation();
          event.preventDefault();
          const activeChunk = chunksMap[selectedChunkId];
          if ( activeChunk ) {
            updateChunk(
              corpusId,
              activeChunk.metadata.id,
              {
                ...activeChunk,
                end: mediaCurrentTime,
              }
            );
          }
        }
      };

      const onChunkDrag = ( chunkId, {
        prevY,
        y,
        prevX,
        x,
        type = 'move'
      } ) => {

        if ( prevY !== undefined && y !== undefined && prevX !== undefined && x !== undefined ) {
          const chunk = chunksMap[chunkId];
          if ( selectedChunkId !== chunkId ) {
            selectChunk( chunkId );
          }

          switch ( type ) {
          case 'top':
            let start = y < 0 ? 0 : y;
            start = y > mediaDuration ? mediaDuration : y;
            if ( start < chunk.end ) {
              updateChunk(
                corpusId,
                chunkId,
                {
                  ...chunk,
                  start,
                }
              );
            }
            break;
          case 'bottom':
            let end = y < 0 ? 0 : y;
            end = y > mediaDuration ? mediaDuration : y;
            if ( end > chunk.start ) {
              updateChunk(
                corpusId,
                chunkId,
                {
                  ...chunk,
                  end,
                }
              );
            }

            break;
          case 'move':
          default:
            const diffY = prevY - y;
            const diffX = x - prevX;
            let newX = chunk.x + diffX;
            newX = newX > 0.7 ? 0.7 : newX;
            newX = newX < 0 ? 0 : newX;
            let newStart = chunk.start + diffY;
            newStart = newStart < 0 ? 0 : newStart;
            let newEnd = chunk.end + diffY;
            newEnd = newEnd > mediaDuration ? mediaDuration : newEnd;
            const initialLength = chunk.end - chunk.start;
            const newLength = newEnd - newStart;
            if ( newLength >= initialLength ) {
              updateChunk(
                corpusId,
                chunkId,
                {
                  ...chunk,
                  x: newX,
                  start: newStart,
                  end: newEnd,
                }
              );
            }
            break;
          }
        }
      };

      const handleRailwayDrag = ( { viewFrom, viewTo } ) => {
        if ( !scrollLocked ) {
          setScrollLocked( true );
        }
        setChunkSpaceTimeScroll( {
          viewFrom,
          viewTo,
        } );
        setTimeout( () => {
          this.chunksSpace.forceScrollView( { viewFrom, viewTo } );
        } );
      };

      const handleRailwayDragEnd = () => {
        setScrollLocked( false );
      };

      const bindChunksSpace = ( chunksSpace ) => {
        this.chunksSpace = chunksSpace;
      };

      const onSetMediaDuration = ( duration ) => {
        setMediaDuration( corpus.metadata.id, activeMedia.metadata.id, duration );
      };

      const onDelete = ( chunkId ) => {
        selectChunk( undefined );
        deleteChunk( corpus.metadata.id, chunkId );
      };

      const onActiveChunkFocusRequest = () => {
        const activeChunk = chunksMap[selectedChunkId];

        const {
          start,
          // end
        } = activeChunk;
        const span = chunkSpaceTimeScroll.viewTo - chunkSpaceTimeScroll.viewFrom;
        // const center = start + (end - start) /2;
        const viewFrom = start - span / 2;
        const viewTo = start + span / 2;
        setChunkSpaceTimeScroll( { viewFrom, viewTo } );
        this.chunksSpace.forceScrollView( { viewFrom, viewTo } );
      };

      const onImportChunks = () => {
        importChunkCandidates();
        unpromptImport();
        const { viewFrom, viewTo } = chunkSpaceTimeScroll;
        this.chunksSpace.forceScrollView( { viewFrom, viewTo } );
      };

      const deselectChunk = () => {
        selectChunk( undefined );
      };

      const expandLeftColumn = () => {
        if ( leftColumnWidth + 1 < 10 ) {
          setLeftColumnWidth( leftColumnWidth + 1 );
        }
      };

      const reduceLeftColumn = () => {
        if ( leftColumnWidth - 1 > 0 ) {
          setLeftColumnWidth( leftColumnWidth - 1 );
        }
      };

      const handleTagEditRequest = ( id ) => {
        setEditedTagId( id );
      };

      const editedTag = editedTagId && corpus.tags[editedTagId];

      const saveEditedTag = ( tag ) => {
        updateTag( corpusId, editedTagId, tag );
        handleModalCloseRequest();
      };

      const onSeekByInput = ( time ) => {
        seekToMediaTime( time );
      };

      const onDeleteField = () => {
        deleteField( corpusId, promptedToDeleteFieldId );
        setPromptedToDeleteFieldId( undefined );
        setActiveFieldId( defaultFieldId );
        setEditedFieldId( undefined );
        setEditedFieldTempName( undefined );
      };

      const displayMargin = ( chunkSpaceTimeScroll.viewTo - chunkSpaceTimeScroll.viewFrom );
      const activeChunk = chunks.find( ( item ) => mediaCurrentTime >= item.start && mediaCurrentTime <= item.end );

      const visibleChunks = chunks
        .filter( ( chunk ) =>
          (
          // starts after top
            chunk.start >= ( chunkSpaceTimeScroll.viewFrom - displayMargin ) &&
          // end before bottom
          chunk.end <= chunkSpaceTimeScroll.viewTo + displayMargin
          )
          ||
          (
            // start before top
            chunk.start <= chunkSpaceTimeScroll.viewFrom &&
            // end after top
            chunk.end >= chunkSpaceTimeScroll.viewTo )
          ||
          (
            // ends after top
            chunk.end > chunkSpaceTimeScroll.viewFrom
            // end before bottom
            && chunk.end < chunkSpaceTimeScroll.viewTo
          )
          ||
          (
            // starts after top
            chunk.start > chunkSpaceTimeScroll.viewFrom - displayMargin
            // starts before bottom
            && chunk.start < chunkSpaceTimeScroll.viewTo
          )
        );

      const onSubmitTempField = ( e ) => {
        e.preventDefault();
        e.stopPropagation();
        updateField(
          corpus.metadata.id,
          editedFieldId,
          {
            ...corpus.fields[editedFieldId],
            name: editedFieldTempName,
          }
        );
        setEditedFieldId( undefined );
        setEditedFieldTempName( undefined );
      };

      const onSubmitNewTag = ( e ) => {
        e.preventDefault();
        e.stopPropagation();
        const name = newTagTempData.name;
        const description = newTagTempData.description || '';
        const tagCategoryId = newTagTempData.tagCategoryId || Object.keys( tagCategories )[0];
        const id = genId();
        createTag(
          corpus.metadata.id,
          {
            name,
            description,
            tagCategoryId,
            metadata: {
              id,
              createdAt: new Date().getTime(),
              lastModifiedAt: new Date().getTime(),
            }
          }
        );
        updateChunk(
          corpus.metadata.id,
          selectedChunkId,
          {
            ...chunksMap[selectedChunkId],
            tags: [ ...chunksMap[selectedChunkId].tags, id ]
          }
        );
        setNewTagPrompted( false );
      };

      const onCreateNewTagCategory = ( data ) => {
        const metadata = {
          id: genId(),
          createdAt: new Date().getTime(),
          lastModifiedAt: new Date().getTime(),
        };
        const tagCategory = {
          metadata,
          ...data
        };
        createTagCategory(
          corpus.metadata.id,
          tagCategory,
        );
        setNewTagCategoryPrompted( false );
      }

      let editedFieldExcerptsLength;
      if ( editedFieldId && fields[editedFieldId] ) {
        editedFieldExcerptsLength = chunks
          .filter( ( chunk ) => {
            return chunk.fields[editedFieldId] !== undefined && chunk.fields[editedFieldId].length;
          } ).length;
      }

      let tempMediaComposition;
      if ( exportMediaPrompted ) {
        tempMediaComposition = {
          metadata: {
            title: activeMedia.metadata.title,
          },
          summary: chunks
            .sort( ( a, b ) => {
              if ( a.start > b.start ) {
                return 1;
              }
              return -1;
            } )
            .map( ( chunk ) => {
              return {
                metadata: {

                },
                blockType: 'chunk',
                content: chunk.metadata.id,
                asides: [],
              };
            } )
        };
      }
      
      return (
        <HotKeys
          className={ 'hot-keys' }
          style={ { height: '100%' } }
          focused
          handlers={ hotKeysHandlers }
          keyMap={ hotKeysMap }
        >
          <div className={ 'dicto-ChunksEditionLayout fix-height rows' }>
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
                          href: `/corpora/${corpus.metadata.id}/chunks`,
                          active: true,
                          name: ` / ${ t( 'medias' )
                          }${activeMedia && activeMedia.metadata.title ? ` / ${ activeMedia.metadata.title}` : ''}`
                        },
                      ] }
              importantOperations={ [] }
            />
            <div
              style={ { paddingBottom: 0, paddingTop: 0, maxHeight: 'calc(100% - 5rem)' } }
              className={ 'columns hero-body is-flex-1' }
            >
              {
                        medias.length ?
                          <div className={ `column is-${leftColumnWidth} rows chunks-space-wrapper` }>
                            <div className={ 'is-flex-1' }>
                              <ContextMenuTrigger id={ 'chunk-space' }>
                                {
                                      mediaDuration ?
                                        <ChunksSpace
                                          ref={ bindChunksSpace }
                                          items={ chunks }
                                          activeChunk={ activeChunk }
                                          isEmpty={ chunks.length === 0 }
                                          contentsIfEmpty={ t( 'No excerpts yet for this media. Drag inside this space to add a first excerpt.' ) }

                                          scrollLocked={ scrollLocked }
                                          setScrollLocked={ setScrollLocked }
                                          mediaDuration={ mediaDuration }
                                          mediaCurrentTime={ mediaCurrentTime }
                                          ratio={ chunkSpaceRatio }
                                          chunkSpaceTimeScroll={ chunkSpaceTimeScroll }
                                          setRatio={ setChunkSpaceRatio }
                                          seekToMediaTime={ seekToMediaTime }
                                          setMediaPlaying={ setMediaPlaying }
                                          mediaPlaying={ mediaPlaying }
                                          seekBackward={ seekBackward }
                                          seekForward={ seekForward }
                                          setChunkSpaceTimeScroll={ setChunkSpaceTimeScroll }
                                          scrollTargetInSeconds={ scrollTargetInSeconds }
                                          setScrollTargetInSeconds={ setScrollTargetInSeconds }
                                          setIsDragging={ setIsDragging }
                                          isDragging={ isDragging }
                                          onElementDrag={ onChunkDrag }
                                          onCut={ onCut }
                                          addChunk={ addChunk }
                                        >
                                          {
                                                visibleChunks
                                                  .map( ( chunk, index ) => {
                                                    const chunkTags = chunk.tags.map( ( tagId ) => corpus.tags[tagId] );
                                                    const onSelect = ( chunkId ) => {
                                                      if ( chunk.metadata.id === selectedChunkId ) {
                                                        selectChunk( undefined );
                                                      }
                                                      else {
                                                        selectChunk( chunkId );
                                                      }
                                                    };
                                                    const onTimelineChunkDelete = () => {
                                                      deleteChunk( corpusId, chunk.metadata.id );
                                                    };
                                                    const onDragStart = () => {
                                                      setIsDragging( true );
                                                    }
                                                    const indirectContent = !( chunk.fields[activeFieldId] && chunk.fields[activeFieldId].trim().length );
                                                    const displayedContent = !indirectContent ?
                                                      chunk.fields[activeFieldId]
                                                      : chunk.fields[defaultFieldId];
                                                    return (
                                                      <TimelineChunk
                                                        chunk={ chunk }
                                                        chunkSpaceRatio={ chunkSpaceRatio }
                                                        updateChunk={ updateChunk }
                                                        minified={ chunk.end - chunk.start < ( chunkSpaceTimeScroll.viewTo - chunkSpaceTimeScroll.viewFrom ) / 6 }
                                                        onDelete={ onTimelineChunkDelete }
                                                        selectChunk={ onSelect }
                                                        tags={ chunkTags }
                                                        onDragStart={ onDragStart }
                                                        tagCategories={ tagCategories }
                                                        displayedContent={ displayedContent }
                                                        indirectContent={ indirectContent }
                                                        selected={ chunk.metadata.id === selectedChunkId }
                                                        corpusId={ corpusId }
                                                        key={ index }
                                                      />
                                                    );
                                                  } )
                                              }
                                        </ChunksSpace> 
                                        : null
                                    }
                              </ContextMenuTrigger>
                              <ContextMenu id={ 'chunk-space' }>
                                <div className={ 'dropdown-content' }>

                                  <MenuItem
                                    attributes={ { className: 'dropdown-item' } }
                                    onClick={ () => {
                                                deselectChunk();
                                                setTimeout( () => chunks.forEach( ( chunk ) => deleteChunk( corpus.metadata.id, chunk.metadata.id ) ) );
                                              } }
                                  >
                                    {t( 'delete all excerpts for this media' )}
                                  </MenuItem>
                                </div>
                              </ContextMenu>
                            </div>
                            {
                              <ChunkContentEditor
                                chunk={ chunksMap[selectedChunkId] }
                                corpusId={ corpusId }
                                chunks={ chunks }
                                media={ activeMedia }

                                setNewTagPrompted={ setNewTagPrompted }
                                newTagTempData={ newTagTempData }
                                setNewTagTempData={ setNewTagTempData }

                                disabled={ isDragging }

                                setShortcutsHelpVisibility={ setShortcutsHelpVisibility }

                                tagSearchTerm={ tagSearchTerm }
                                setTagSearchTerm={ setTagSearchTerm }

                                tempNewFieldTitle={ tempNewFieldTitle }
                                setTempNewFieldTitle={ setTempNewFieldTitle }
                                setEditedFieldTempName={ setEditedFieldTempName }

                                editedFieldId={ editedFieldId }
                                setEditedFieldId={ setEditedFieldId }

                                activeFieldId={ activeFieldId }
                                setActiveFieldId={ setActiveFieldId }
                                setActiveTagCategoryId={ setActiveTagCategoryId }
                                activeTagCategoryId={ activeTagCategoryId }

                                optionsDropdownOpen={ optionsDropdownOpen }
                                setOptionsDropdownOpen={ setOptionsDropdownOpen }

                                tagsDropdownOpen={ tagsDropdownOpen }
                                setTagsDropdownOpen={ setTagsDropdownOpen }

                                fields={ fields }
                                tags={ tags }
                                tagCategories={ tagCategories }

                                editionMode={ editionMode }
                                setEditionMode={ setEditionMode }

                                updateChunk={ updateChunk }

                                createField={ addField }
                                updateField={ updateField }
                                deleteField={ ( thatUselessCorpusId, id ) => setPromptedToDeleteFieldId( id ) }

                                createTag={ addTag }
                                updateTag={ updateTag }
                                deleteTag={ deleteTag }

                                createTagCategory={ addTagCategory }
                                updateTagCategory={ updateTagCategory }
                                deleteTagCategory={ deleteTagCategory }
                                onTagEdit={ handleTagEditRequest }

                                deleteChunk={ onDelete }

                                expanded={ isChunkEditorExpanded }
                                toggleExpanded={ toggleChunkEditorExpanded }
                                onDeselect={ deselectChunk }
                                onOpen={ promptEditorModal }

                                onFocusRequest={ onActiveChunkFocusRequest }
                              />
                              }
                          </div> 
                        : 
                          null
                      }
              {
                        activeMedia &&
                        <div className={ 'column is-1 railway-wrapper fix-height rows' }>
                          <div
                            id={ 'resizer' }
                            className={ 'level' }
                          >
                            <button onClick={ reduceLeftColumn }>
                              <span className={ 'icon' }>
                                <i className={ 'fas fa-chevron-left' } />
                              </span>
                            </button>
                            <button onClick={ expandLeftColumn }>
                              <span className={ 'icon' }>
                                <i className={ 'fas fa-chevron-right' } />
                              </span>
                            </button>
                          </div>
                          <div className={ 'is-flex-1 level' }>
                            <Railway
                              mediaCurrentTime={ mediaCurrentTime }
                              mediaDuration={ mediaDuration }
                              seekToMediaTime={ onSeekToMediaTime }
                              chunkSpaceTimeScroll={ chunkSpaceTimeScroll }
                              onDrag={ handleRailwayDrag }
                              selectedChunkId={ selectedChunkId }
                              onDragEnd={ handleRailwayDragEnd }
                              chunks={ chunks }
                            />
                          </div>
                          <div className={ 'level' }>
                            <button
                              style={ { display: mediaPlaying === true ? 'block' : 'none' } }
                              onClick={ togglePlaying }
                              className={ 'button is-dark is-fullwidth' }
                            >
                              <i className={ 'fas fa-pause' } />
                            </button>
                            <button
                              style={ { display: mediaPlaying === false ? 'block' : 'none' } }
                              onClick={ togglePlaying }
                              className={ 'button is-dark is-fullwidth' }
                            >
                              <i className={ 'fas fa-play' } />
                            </button>
                          </div>
                          <div className={ 'seek-input-container' }>
                            <TimeInput
                              value={ mediaCurrentTime }
                              onChange={ onSeekByInput }
                            />
                          </div>
                        </div>
                      }
              <div className={ `column is-${11 - leftColumnWidth} media-wrapper rows` }>
                {
                          activeMedia &&
                          <div style={ { paddingLeft: '.5rem' } }>
                            <MediaCard
                              media={ activeMedia }
                              chunksCount={ chunks.length }
                              tagsCount={ mediaTags.length }
                              minified
                              onClick={ () => promptMediaEdition( corpusId, activeMedia.metadata.id, activeMedia ) }
                              actionContents={ [
                                <li
                                  key={ 0 }
                                  className={ 'import-transcriptions' }
                                >
                                  <button
                                    data-for={ 'tooltip' }
                                    data-tip={ t( 'import an existing transcription' ) }
                                    className={ 'button is-rounded' }
                                    onClick={ ( e ) => {
                                                e.stopPropagation();
                                                promptImport();
                                              } }
                                  >
                                    <i className={ 'fas fa-download' } />
                                  </button>
                                </li>,
                                <li
                                  key={ 1 }
                                  className={ 'export-media' }
                                >
                                  <button
                                    data-for={ 'tooltip' }
                                    data-tip={ t( 'export media annotations' ) }
                                    className={ 'button is-rounded' }
                                    onClick={ ( e ) => {
                                                e.stopPropagation();
                                                setExportMediaPrompted( true );
                                              } }
                                  >
                                    <i className={ 'fas fa-upload' } />
                                  </button>
                                </li>,
                                <li
                                  key={ 2 }
                                >
                                  <button
                                    data-for={ 'tooltip' }
                                    data-tip={ t( 'edit media' ) }
                                    className={ 'button is-rounded' }
                                    onClick={ () => promptMediaEdition( corpusId, activeMedia.metadata.id, activeMedia ) }
                                  >
                                    <i className={ 'fas fa-pencil-alt' } />
                                  </button>
                                </li>,
                              ] }
                            />
                          </div>
                        }
                {
                          activeMedia &&
                          <div
                            className={ `is-flex-1 rows media-player-container ${activeMedia && !mediaChoiceVisible ? 'active' : ''}` }
                            onClick={ togglePlaying }
                          >
                            <ControlledMediaPlayer
                              src={ activeMedia.metadata.mediaUrl }
                              shouldPlay={ mediaPlaying }
                              currentTime={ mediaCurrentTime }
                              setMediaDuration={ onSetMediaDuration }
                              setMediaPlaying={ setMediaPlaying }
                              setMediaCurrentTime={ setMediaCurrentTime }
                              seekedTime={ seekedTime }
                            />
                          </div>
                        }
                {
                          medias.length ?
                            <div className={ activeMedia && !mediaChoiceVisible ? '' : 'is-flex-1 is-stretched-column' }>
                              {
                                activeMediaId && corpus.medias[activeMediaId] &&
                                <div className={ '' }>
                                  <button
                                    id={ 'change-media' }
                                    onClick={ () => setMediaChoiceVisibility( !mediaChoiceVisible ) }
                                    className={ `button is-fullwidth ${mediaChoiceVisible ? 'is-primary' : ''}` }
                                  >
                                    {mediaChoiceVisible ? t( 'show media' ) : t( 'change-media' )}
                                  </button>
                                </div>
                              }

                              <PaginatedList
                                style={ { maxHeight: mediaChoiceVisible ? '100%' : 0 } }
                                itemsContainerClassName={ `medias-list ${mediaChoiceVisible ? 'active' : ''} is-flex-1` }
                                renderNoItem={ () => <div>{t( 'No media yet' )}</div> }
                                items={ medias }
                                renderItem={ ( media ) => {
                                    const id = media.metadata.id;
                                    const onSelect = () => {
                                      setActiveMediaId( id );
                                      setMediaChoiceVisibility( false );
                                      history.push( {
                                        search: `?activeMedia=${id}`
                                      } );
                                    };

                                    const onEdit = () => promptMediaEdition( corpusId, id, media );
                                    const onMediaDelete = () => promptMediaDeletion( corpusId, id );
                                    return (
                                      <li
                                        key={ media.metadata.id }
                                        className={ 'is-fullwidth column' }
                                      >
                                        <MediaCard
                                          active={ id === activeMediaId }
                                          media={ media }
                                          onSelect={ onSelect }
                                          chunksCount={ media.stats.chunksCount }
                                          tagsCount={ media.stats.tagsCount }
                                          onClick={ onSelect }
                                          onEdit={ onEdit }
                                          onDelete={ onMediaDelete }
                                        />
                                      </li>
                                    );
                                  } }
                              />

                              {
                            mediaChoiceVisible &&
                            <ul>
                              <li className={ 'column' }>
                                <button
                                  className={ 'button is-fullwidth is-dark' }
                                  onClick={ promptNewMedia }
                                >
                                  {t( 'add-media' )}
                                </button>
                              </li>
                            </ul>
                          }
                            </div>
                    :
                            <div 
                              style={ { 
                          position: 'absolute', 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          flexFlow: 'row nowrap', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        } }
                            >
                              <div 
                                style={ { 
                            display: 'flex', 
                            flexFlow: 'column nowrap', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          } }
                              >
                                <p>
                                  {t( 'no media yet' )}
                                  <br />
                                  <button
                                    className={ 'button is-dark' }
                                    onClick={ promptNewMedia }
                                  >
                                    {t( 'add a first media' )}
                                  </button>
                                </p>
                              </div>
                            </div>
                }
              </div>
            </div>
            <Modal
              isOpen={ editedMedia !== undefined || newMediaPrompted === true }
              onRequestClose={ handleModalCloseRequest }
            >
              <MediaEditor
                media={ editedMedia }
                onValidate={ handleMediaModalValidate }
                onCancel={ handleModalCloseRequest }
              />
              <div className={ 'close-modal-icon-container' }>
                <span
                  className={ 'icon' }
                  onClick={ handleModalCloseRequest }
                >
                  <i className={ 'fas fa-times-circle' } />
                </span>
              </div>
            </Modal>
            <Modal
              className={ 'small-modal' }
              isOpen={ mediaPromptedToDelete !== undefined }
              onRequestClose={ handleModalCloseRequest }
            >
              {
                <div className={ 'modal-content' }>
                  <div className={ 'modal-header' }>
                    <h1 className={ 'title is-1' }>{t( 'Delete media and related excerpts' )}</h1>
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
                      style={ { paddingLeft: '1rem' } }
                      className={ 'column content is-large' }
                    >
                      {t( 'sure-to-delete-media' )}
                    </div>
                  </div>
                  <ul className={ 'modal-footer' }>
                    <li>
                      <button
                        onClick={ onDeleteMedia }
                        className={ 'button is-fullwidth is-danger' }
                      >
                        {t( 'delete' )}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={ unpromptMediaDeletion }
                        className={ 'button is-fullwidth is-secondary' }
                      >
                        {t( 'abort' )}
                      </button>
                    </li>
                  </ul>
                </div>
              }
            </Modal>
            <Modal
              isOpen={ importPrompted }
              onRequestClose={ unpromptImport }
              style={ {
                        content: {
                          height: importedChunkCandidates && importedChunkCandidates.length > 0 ? '80%' : undefined
                        }
                      } }
            >
              <div className={ 'modal-content' }>
                <div className={ 'modal-header' }>
                  <h1 className={ 'title is-1' }>
                    {t( 'Import files' )}
                  </h1>
                  <div className={ 'close-modal-icon-container' }>
                    <span
                      className={ 'icon' }
                      onClick={ unpromptImport }
                    >
                      <i className={ 'fas fa-times-circle' } />
                    </span>
                  </div>
                </div>
                <div
                  className={ 'modal-body content is-large' }
                  style={ { 
                                position: 'relative', 
                                paddingLeft: '1rem' 
                              } }
                >
                  {
                              !( importedChunkCandidates && importedChunkCandidates.length > 0 ) &&
                              <div className={ 'level' }>
                                <p
                                  className={ 'import-instructions content is-large' }
                                  dangerouslySetInnerHTML={ {
                                          __html: t( 'import-instructions' )
                                        } }
                                />
                              </div>
                            }
                  {
                              !( importedChunkCandidates && importedChunkCandidates.length > 0 ) &&
                              <div
                                style={ { padding: '1rem', paddingLeft: 0 } }
                                className={ 'level' }
                              >
                                <DropZone
                                  onDrop={ onTranscriptionFileDrop }
                                >
                                  {t( 'Drag .srt (subtitles) or .otr (oTranscribe) transcription files here' )}
                                </DropZone>
                              </div>
                            }
                  {
                                importedChunkCandidates && importedChunkCandidates.length ?
                                  <div 
                                    style={ {
                                      position: 'absolute',
                                      height: '100%',
                                      width: '100%',
                                      left: 0,
                                      top: 0,
                                      overflow: 'hidden',
                                      padding: '1rem'
                                    } }
                                  >
                                    <div
                                      className={ 'rows' }
                                      style={ { position: 'relative', height: '100%' } }
                                    >
                                      <div className={ 'level' }>
                                        <h2 className={ 'title is-2' }>
                                          {t( 'Candidates to import' )}{' ('}{importedChunkCandidates.length})
                                        </h2>
                                      </div>
                                      <div className={ 'level' }>
                                        <div
                                          className={ 'columns' }
                                          style={ { width: '100%' } }
                                        >
                                          <div className={ 'column is-one-third' }>
                                            {t( 'Regroup to chunks of a minimum length of' )}
                                          </div>
                                          <div className={ 'column columns' }>
                                            <button
                                              onClick={ () => regroupImportCandidates( 10 ) }
                                              className={ 'button column is-one-quarter' }
                                            >
                                              {t( '10 seconds' )}
                                            </button>
                                            <button
                                              onClick={ () => regroupImportCandidates( 30 ) }
                                              className={ 'button column is-one-quarter' }
                                            >
                                              {t( '30 seconds' )}
                                            </button>
                                            <button
                                              onClick={ () => regroupImportCandidates( 60 ) }
                                              className={ 'button column is-one-quarter' }
                                            >
                                              {t( '1 minute' )}
                                            </button>
                                            <button
                                              onClick={ () => regroupImportCandidates( 300 ) }
                                              className={ 'button column is-one-quarter' }
                                            >
                                              {t( '5 minutes' )}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      <div className={ 'is-flex-1 rows' }>
                                        <SimplePaginatedList
                                          className={ 'is-flex-1' }
                                          items={ importedChunkCandidates.map( ( chunk, index ) => (
                                            <ChunkCard
                                              key={ index }
                                              chunk={ chunk }
                                              tags={ {} }
                                              tagCategories={ {} }
                                              fields={ fields }
                                              activeFieldId={ activeFieldId }
                                              allowAddComments={ false }
                                            />
                            ) ) }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                : null
                              }
                </div>
                {
                            importedChunkCandidates && importedChunkCandidates.length ?
                              <ul className={ 'modal-footer' }>
                                <button
                                  onClick={ onImportChunks }
                                  className={ 'button is-fullwidth is-primary' }
                                >
                                  {t( 'import chunks' )}
                                </button>
                                <button
                                  onClick={ unpromptImport }
                                  className={ 'button is-fullwidth is-danger' }
                                >
                                  {t( 'cancel' )}
                                </button>
                              </ul>
                            : null
                          }
              </div>
            </Modal>

            <Modal
              isOpen={ selectedChunkId && chunksMap[selectedChunkId] && editorModalOpen }
              onRequestClose={ handleModalCloseRequest }
            >

              <div className={ 'modal-content' }>
                <div className={ 'modal-header' }>
                  <h1 className={ 'title is-1' }>
                    {t( 'Excerpt edition' )}
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
                <div className={ 'modal-body editor-modal-content-container' }>
                  {
                              selectedChunkId && chunksMap[selectedChunkId] ?
                                <ChunkContentEditor
                                  chunk={ chunksMap[selectedChunkId] }
                                  corpusId={ corpusId }
                                  chunks={ chunks }

                                  media={ activeMedia }

                                  optionsDropdownOpen={ optionsDropdownOpen }
                                  setOptionsDropdownOpen={ setOptionsDropdownOpen }
                                  setEditedFieldTempName={ setEditedFieldTempName }

                                  setNewTagPrompted={ setNewTagPrompted }
                                  newTagTempData={ newTagTempData }
                                  setNewTagTempData={ setNewTagTempData }

                                  tagSearchTerm={ tagSearchTerm }
                                  setTagSearchTerm={ setTagSearchTerm }

                                  tempNewFieldTitle={ tempNewFieldTitle }
                                  setTempNewFieldTitle={ setTempNewFieldTitle }

                                  tagsDropdownOpen={ tagsDropdownOpen }
                                  setTagsDropdownOpen={ setTagsDropdownOpen }

                                  setShortcutsHelpVisibility={ setShortcutsHelpVisibility }

                                  activeFieldId={ activeFieldId }
                                  setActiveFieldId={ setActiveFieldId }
                                  editedFieldId={ editedFieldId }
                                  setEditedFieldId={ setEditedFieldId }
                                  setActiveTagCategoryId={ setActiveTagCategoryId }
                                  activeTagCategoryId={ activeTagCategoryId }

                                  fields={ fields }
                                  tags={ tags }
                                  tagCategories={ tagCategories }

                                  editionMode={ editionMode }
                                  setEditionMode={ setEditionMode }

                                  updateChunk={ updateChunk }

                                  createField={ addField }
                                  updateField={ updateField }
                                  deleteField={ deleteField }

                                  createTag={ addTag }
                                  updateTag={ updateTag }
                                  deleteTag={ deleteTag }

                                  createTagCategory={ addTagCategory }
                                  updateTagCategory={ updateTagCategory }
                                  deleteTagCategory={ deleteTagCategory }

                                  onTagEdit={ handleTagEditRequest }

                                  deleteChunk={ onDelete }

                                  expanded={ isChunkEditorExpanded }
                                  toggleExpanded={ toggleChunkEditorExpanded }
                                  onDeselect={ deselectChunk }

                                  onFocusRequest={ onActiveChunkFocusRequest }
                                  displayHeader={ false }
                                />
                                : null
                            }
                </div>
              </div>
            </Modal>
            <Modal
              isOpen={ editedFieldId !== undefined }
              style={ {
                        content: {
                          width: '50%',
                        }
                      } }
              onRequestClose={ () => setEditedFieldId( undefined ) }
            >
              <div className={ 'modal-content' }>
                <div className={ 'modal-header' }>
                  <h1 className={ 'title is-1' }>
                    {t( 'Edit an annotation field' )}
                  </h1>
                  <div className={ 'close-modal-icon-container' }>
                    <span
                      className={ 'icon' }
                      onClick={ () => setEditedFieldId( undefined ) }
                    >
                      <i className={ 'fas fa-times-circle' } />
                    </span>
                  </div>
                </div>
                <div className={ 'modal-body' }>
                  <div
                    className={ 'column content is-large' }
                    style={ { padding: '1rem' } }
                  >
                    <span
                      style={ { marginRight: '1rem' } }
                      className={ 'icon' }
                    >
                      <i className={ 'fas fa-list' } />
                    </span>
                    <span>
                      {t( [ 'one excerpt annotated with this field', '{n} excerpts annotated with this field', 'n' ], { n: editedFieldExcerptsLength } )}
                    </span>
                  </div>
                  <form
                    onSubmit={ onSubmitTempField }
                    className={ 'column contents is-large' }
                    style={ { padding: '1rem' } }
                  >
                    <div className={ 'field' }>
                      <div className={ 'label' }>
                        {t( 'Annotation field name' )}
                      </div>
                      <input
                        value={ editedFieldTempName || '' }
                        onChange={ ( e ) => setEditedFieldTempName( e.target.value ) }
                        className={ 'input' }
                        placeholder={ 'field name' }
                      />
                    </div>
                  </form>
                  <div className={ 'column' }>
                    <button
                      className={ 'button is-danger' }
                      onClick={ () => setPromptedToDeleteFieldId( editedFieldId ) }
                    >
                      <span className={ 'icon' }>
                        <i className={ 'fas fa-trash' } />
                      </span>
                      <span>
                        {t( 'delete annotation field' )}
                      </span>
                    </button>
                  </div>
                </div>
                <ul className={ 'modal-footer' }>
                  <li>
                    <button
                      onClick={ onSubmitTempField }
                      className={ 'button is-fullwidth is-info' }
                    >
                      {t( 'update field' )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={ () => {
                                        setEditedFieldId( undefined );
                                        setEditedFieldTempName( undefined );
                                      } }
                      className={ 'button is-fullwidth is-warning' }
                    >
                      {t( 'cancel' )}
                    </button>
                  </li>
                </ul>
              </div>
            </Modal>
            <Modal
              isOpen={ promptedToDeleteFieldId !== undefined }
              onRequestClose={ () => setPromptedToDeleteFieldId( undefined ) }
            >
              <div className={ 'modal-content' }>
                <div className={ 'modal-header' }>
                  <h1 className={ 'title is-1' }>
                    {t( 'Delete an annotation field' )}
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
                  <p
                    style={ { paddingLeft: '1rem' } }
                    className={ 'column content is-large' }
                  >
                    {t( 'This field will be deleted for all excerpts of your corpus and possibly erase content. Are you sure ?' )}
                  </p>
                </div>
                <ul className={ 'modal-footer' }>
                  <li>
                    <button
                      onClick={ onDeleteField }
                      className={ 'button is-fullwidth is-danger' }
                    >
                      {t( 'delete' )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={ () => setPromptedToDeleteFieldId( undefined ) }
                      className={ 'button is-fullwidth is-secondary' }
                    >
                      {t( 'cancel' )}
                    </button>
                  </li>
                </ul>
              </div>
            </Modal>
            <Modal
              isOpen={ editedTag !== undefined }
              style={ {
                        content: {
                          height: '80%'
                        }
                      } }
              onRequestClose={ handleModalCloseRequest }
            >
              <div className={ 'modal-content' }>
                <div className={ 'modal-header' }>
                  <h1 className={ 'title is-1' }>
                    {t( 'Edit tag "{n}"', { n: editedTag && editedTag.name } )}
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
                <div className={ 'modal-body tag-editor-container' }>
                  <SchemaForm
                    schema={ tagSchema }
                    document={ editedTag }
                    onCancel={ handleModalCloseRequest }
                    onSubmit={ saveEditedTag }
                  />

                </div>
              </div>
            </Modal>
            <Modal
              isOpen={ shortcutsHelpVisibility }
              style={ {
                        content: {
                          width: '50%',
                        }
                      } }
              onRequestClose={ () => setShortcutsHelpVisibility( false ) }
            >
              <div className={ 'modal-content' }>
                <div className={ 'modal-header' }>
                  <h1 className={ 'title is-1' }>
                    {t( 'help' )}
                  </h1>
                  <div className={ 'close-modal-icon-container' }>
                    <span
                      className={ 'icon' }
                      onClick={ () => setShortcutsHelpVisibility( false ) }
                    >
                      <i className={ 'fas fa-times-circle' } />
                    </span>
                  </div>
                </div>
                <div className={ 'modal-body' }>
                  <ul
                    style={ { paddingLeft: '2rem', paddingRight: '1rem' } }
                    className={ 'column content is-large' }
                  >
                    {
                                    Object.keys( hotKeysMap )
                                      .map( ( key ) =>
                                        (
                                          <li
                                            className={ 'level' }
                                            key={ key }
                                          >
                                            <span>
                                              {t( key )}
                                            </span>
                                            <span className={ 'tag' }>
                                              {t( hotKeysMap[key] )}
                                            </span>
                                          </li>
                                        )
                                      )
                                  }
                  </ul>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={ exportMediaPrompted }
              onRequestClose={ () => setExportMediaPrompted( false ) }
            >
              <div className={ 'modal-content' }>
                <div className={ 'modal-header' }>
                  <h1 className={ 'title is-1' }>
                    {t( 'Export media annotations' )}
                  </h1>
                  <div className={ 'close-modal-icon-container' }>
                    <span
                      className={ 'icon' }
                      onClick={ () => setExportMediaPrompted( false ) }
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
                        id={ 'download-media-composition' }
                        className={ 'box is-info' }
                        onClick={ () => onDownloadCompositionAsHTML( tempMediaComposition ) }
                      >{t( 'download media annotations as an HTML page' )}
                      </button>
                    </li>
                    <li className={ 'column' }>
                      <button
                        id={ 'download-excerpts-srt' }
                        className={ 'box' }
                        onClick={ onDownloadExcerptsSrt }
                      >{t( 'download excerpts for this media in .srt format (subtitles)' )}
                      </button>
                    </li>
                    <li className={ 'column' }>
                      <button
                        id={ 'download-excerpts-srt' }
                        className={ 'box' }
                        onClick={ onDownloadExcerptsOtr }
                      >{t( 'download excerpts for this media in .otr format' )}
                        {'('}
                        <a
                          target={ "blank" }
                          href={ "https://otranscribe.com/" }
                        >
                                            oTranscribe
                        </a>
                        {')'}
                      </button>
                    </li>
                    <li className={ 'column' }>
                      <button
                        id={ 'download-excerpts-table' }
                        className={ 'box' }
                        onClick={ onDownloadExcerptsTable }
                      >{t( 'download the table of excerpts for this media (tsv)' )}
                      </button>
                    </li>
                    <li className={ 'column' }>
                      <button
                        id={ 'download-tags-table' }
                        className={ 'box' }
                        onClick={ onDownloadTagsTable }
                      >{t( 'download the table of tags for this media' )}
                      </button>
                    </li>
                  </ul>
                  <div
                    style={ { position: 'relative' } }
                    className={ 'is-flex-1' }
                  >
                    {
                                    exportMediaPrompted && tempMediaComposition &&
                                    <MontagePlayer
                                      summary={ tempMediaComposition.summary }
                                      metadata={ tempMediaComposition.metadata }
                                      medias={ corpus.medias }
                                      chunks={ corpus.chunks }
                                      tags={ corpus.tags }
                                      fields={ corpus.fields }
                                      tagCategories={ corpus.tagCategories }
                                      translate={ t }
                                    />
                                  }
                  </div>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={ newTagPrompted }

              onRequestClose={ () => setNewTagPrompted( false ) }
            >
              <div className={ 'modal-content' }>
                <div className={ 'modal-header' }>
                  <h1 className={ 'title is-1' }>
                    {t( 'Create a new tag' )}
                  </h1>
                  <div className={ 'close-modal-icon-container' }>
                    <span
                      className={ 'icon' }
                      onClick={ () => setNewTagPrompted( false ) }
                    >
                      <i className={ 'fas fa-times-circle' } />
                    </span>
                  </div>
                </div>
                <div className={ 'modal-body' }>
                  <form onSubmit={ onSubmitNewTag }>
                    <div 
                      className={ "column" }
                      style={ {
                                        display: 'flex',
                                        flexFlow: 'row nowrap',
                                        justifyContent: 'stretch',
                                        padding: '1rem'
                                      } }
                    >
                      <div style={ { flex: 1, paddingRight: '1rem' } }>
                        <div className={ 'field' }>
                          <div className={ 'label' }>
                            {t( 'Tag category' )}
                          </div>
                        </div>
                        <div className={ 'dropdown-content' }>
                          {
                                                Object.keys( tagCategories )
                                                  .map( ( tagCategoryId ) => {
                                                    const onSelect = () => {
                                                      setNewTagTempData( {
                                                        ...newTagTempData,
                                                        tagCategoryId,
                                                      } );
                                                    };
                                                    return (
                                                      <div
                                                        onClick={ onSelect }
                                                        className={ `dropdown-item ${tagCategoryId === newTagTempData.tagCategoryId ? 'is-active' : ''}` }
                                                        key={ tagCategoryId }
                                                        style={ { cursor: 'pointer' } }
                                                      >
                                                        <span className={ 'icon' }>
                                                          <i
                                                            className={ 'fas fa-tags' }
                                                            style={ {
                                                                      color: tagCategories[tagCategoryId].color
                                                                    } }
                                                          />
                                                        </span>
                                                        <span>
                                                          {
                                                            tagCategories[tagCategoryId].name
                                                          }
                                                        </span>
                                                      </div>
                                                    );
                                                  } )
                                              }

                        </div>
                        <div style={ { paddingTop: '1rem' } }>
                          <button
                            onClick={ ( e ) => {
                                              e.stopPropagation();
                                              e.preventDefault();
                                              setNewTagCategoryPrompted( true )
                                            } }
                            className={ "button is-fullwidth" }
                          >
                            {t( 'Create new tag category' )}
                          </button>
                        </div>
                      </div>
                                          
                      <div style={ { flex: 1 } }>
                        <div className={ 'field' }>
                          <div className={ 'label' }>
                            {t( 'Tag name' )}
                          </div>
                          <input
                            placeholder={ t( 'Tag name' ) }
                            className={ 'input' }
                            value={ newTagTempData.name || '' }
                            onChange={ ( e ) => setNewTagTempData( {
                                                    ...newTagTempData,
                                                    name: e.target.value
                                                  } ) }
                          />
                        </div>
                        <div className={ 'field' }>
                          <div className={ 'label' }>
                            {t( 'Tag description' )}
                          </div>
                          <textarea
                            className={ 'textarea' }
                            value={ newTagTempData.description || '' }
                            placeholder={ t( 'Tag description' ) }
                            onChange={ ( e ) => setNewTagTempData( {
                                                    ...newTagTempData,
                                                    description: e.target.value
                                                  } ) }
                          />
                        </div>
                      </div>
                    </div>

                  </form>
                </div>
                <ul className={ 'modal-footer' }>
                  <li>
                    <button
                      onClick={ onSubmitNewTag }
                      className={ 'button is-fullwidth is-primary' }
                    >
                      {t( 'create tag' )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={ () => {
                                        setNewTagPrompted( false );
                                      } }
                      className={ 'button is-fullwidth is-warning' }
                    >
                      {t( 'cancel' )}
                    </button>
                  </li>
                </ul>

              </div>
            </Modal>

            <Modal
              isOpen={ newTagCategoryPrompted }
              style={ {
                        content: {
                          height: '80%'
                        }
                      } }
              onRequestClose={ () => setNewTagCategoryPrompted( false ) }
            >
              <div className={ 'modal-content' }>
                <div className={ 'modal-header' }>
                  <h1 className={ 'title is-1' }>
                    {t( 'Create new tag category' )}
                  </h1>
                  <div className={ 'close-modal-icon-container' }>
                    <span
                      className={ 'icon' }
                      onClick={ () => setNewTagCategoryPrompted( false ) }
                    >
                      <i className={ 'fas fa-times-circle' } />
                    </span>
                  </div>
                </div>
                <div className={ 'modal-body tag-editor-container' }>
                  <SchemaForm
                    schema={ tagCategorySchema }
                    document={ undefined }
                    onCancel={ () => setNewTagCategoryPrompted( false ) }
                    onSubmit={ onCreateNewTagCategory }
                  />

                </div>
              </div>
            </Modal>

            <PlaceHolderInput />
          </div>
        </HotKeys>
      );
    }
    else if ( stateLoaded ) {
      return ( <NotFound mode={ 'corpus' } /> );
    }
    else {
      return ( <Loading /> );
    }
  }
}

ChunksEditionLayout.contextTypes = {
  t: PropTypes.func
};

export default ChunksEditionLayout;
