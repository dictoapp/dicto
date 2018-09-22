import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { uniq, flatten } from 'lodash';
import FlipMove from 'react-flip-move';

import TimeInput from '../TimeInput/TimeInput';
import { mapToArray } from '../../helpers/utils';

import MarkdownEditor from '../MarkdownEditor';
import MarkdownPlayer from '../MarkdownPlayer';
import ReverseDropdown from '../ReverseDropdown';

import { abbrev } from '../../helpers/utils';

import './ChunkContentEditor.scss';

class FocusableInput extends Component {
  componentWillReceiveProps = ( nextProps ) => {
    if ( !this.props.isActive && nextProps.isActive ) {
      setTimeout( () => {
        if ( this.input ) {
          this.input.focus();
        }
      } );

    }
  }
  render = () => {
    const bindRef = ( input ) => {
      this.input = input;
    };
    const {
      // not passing isActive to the DOM element
      isActive, /* eslint no-unused-vars : 0 */
      ...props
    } = this.props;
    return (
      <input
        { ...props }
        ref={ bindRef }
      />
    );
  }
}

export default class ChunkContentEditor extends Component {

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor( props ) {
    super( props );
  }

  componentDidMount = () => {
    setTimeout( () => {
      if ( this.mainTextarea ) {
        this.mainTextarea.focus();
      }
    } );
  }

  componentWillReceiveProps = ( nextProps ) => {
    ReactTooltip.rebuild();
    if ( this.props.disabled && !nextProps.disabled ) {
      setTimeout( () => {
        if ( this.mainTextarea ) {
          this.mainTextarea.focus();
        }
      } );
    }
  }

  onStartChange = ( start = 0 ) => {
    if ( start < this.props.chunk.end ) {
      const realStart =  start > 0 ? start : 0;
      const { props: { updateChunk, corpusId, chunk: { metadata: { id } } } } = this;
      updateChunk( corpusId, id, { ...this.props.chunk, start: realStart } );
    }
  }

  onEndChange = ( end = 0 ) => {
    if ( end > this.props.chunk.start ) {
      const realEnd = end < this.props.media.duration ? end : this.props.media.duration;
      const { props: { updateChunk, corpusId, chunk: { metadata: { id } } } } = this;
      updateChunk( corpusId, id, { ...this.props.chunk, end: realEnd } );
    }
  }

  render = () => {
    const {
      props: {
        chunk,
        chunks,
        expanded = true,
        disabled = false,
        fields,
        tags,
        tagCategories,
        activeFieldId: inputActiveFieldId,
        corpusId,
        updateChunk,

        createField,

        setActiveFieldId,

        deleteChunk,

        onFocusRequest,
        toggleExpanded,
        onDeselect,
        onTagEdit,

        optionsDropdownOpen,
        setOptionsDropdownOpen,

        tagsDropdownOpen,
        setTagsDropdownOpen,

        setShortcutsHelpVisibility,

        tempNewFieldTitle,
        setTempNewFieldTitle,

        setEditedFieldId,
        setEditedFieldTempName,

        tagSearchTerm,
        setTagSearchTerm,
        setNewTagPrompted,
        setNewTagTempData,
      },
      context: { t },
      onStartChange,
      onEndChange,
    } = this;

    if ( !chunk || disabled ) {
      return (
        <div className={ 'dicto-ChunkContentEditor rows inactive disabled' }>
          <div className={ `inactive-placeholder ${chunk ? '' : 'is-visible'}` }>
            <span>{t( 'Select an excerpt or create an item' )}</span>
          </div>
        </div>
      );
    }

    const {
      start,
      end,
      fields: chunkFields,
      tags: chunkTags,
    } = chunk;

    const tagsArray = mapToArray( tags );

    const fieldsArray = mapToArray( fields );
    const activeFieldId = inputActiveFieldId
      || fieldsArray
        .find( ( field ) => field.name === 'default' ).metadata.id;
    const activeFieldName = fields[activeFieldId].name;
    let otherMediaTags = [];
    if ( tagsDropdownOpen ) {
      const mediaTags = uniq( flatten( chunks.map( ( thatChunk ) => thatChunk.tags ) ) );
      otherMediaTags = mediaTags.filter( ( otherTagId ) => !chunk.tags.includes( otherTagId ) );
    }
    let tagsMatchingSearch = [];
    if ( tagSearchTerm && tagSearchTerm.length > 2 ) {
      tagsMatchingSearch = tagsArray.filter( ( tag ) => {
        return tag.name.toLowerCase().includes( tagSearchTerm.toLowerCase() );
      } )
        .filter( ( otherTag ) => !chunk.tags.includes( otherTag.metadata.id ) );
    }

    const activeFieldContent = chunkFields[activeFieldId] || '';
    const onActiveFieldChange = ( value ) => {
      const newChunk = {
        ...chunk,
        fields: {
          ...chunk.fields,
          [activeFieldId]: value
        }
      };
      updateChunk( corpusId, chunk.metadata.id, newChunk );
    };
    const defaultFieldId = Object.keys( fields ).find( ( f ) => fields[f].name === 'default' );

    const onDelete = () => {
      setTimeout( () => deleteChunk( chunk.metadata.id ) );
    };

    const bindMainTextarea = ( textarea ) => {
      this.mainTextarea = textarea;
    };

    const handleDeselect = ( e ) => {
      e.stopPropagation();
      onDeselect();
    };

    const onNewFieldSubmit = ( e ) => {
      e.preventDefault();
      e.stopPropagation();
      createField( tempNewFieldTitle, true );
      setTempNewFieldTitle( undefined );
    };

    const onSelectNextField = () => {
      let activeFieldIndex;
      fieldsArray.some( ( field, index ) => {
        if ( field.metadata.id === activeFieldId ) {
          activeFieldIndex = index;
          return true;
        }
      } );
      let nextIndex;
      if ( activeFieldIndex + 1 <= fieldsArray.length - 1 ) {
        nextIndex = activeFieldIndex + 1;
      }
      else {
        nextIndex = 0;
      }
      const nextFieldId = fieldsArray[nextIndex].metadata.id;
      setActiveFieldId( nextFieldId );
    };

    const onSubmitMatchingTags = ( e ) => {
      e.preventDefault();
      e.stopPropagation();
      if ( tagsMatchingSearch.length ) {
        updateChunk(
          corpusId,
          chunk.metadata.id,
          {
            ...chunk,
            tags: [ ...chunk.tags, ...tagsMatchingSearch.map( ( thatTag ) => thatTag.metadata.id ) ]
          }
        );
        setTagSearchTerm( '' );
      }
      else if ( tagSearchTerm.length ) {
        setNewTagPrompted( true );
        setNewTagTempData( {
          name: tagSearchTerm
        } );

      }
    };

    const silentEvent = ( e ) => {
      e.stopPropagation();
    };

    return (
      <div className={ `dicto-ChunkContentEditor rows ${expanded ? 'expanded' : ''} ${disabled ? 'disabled' : ''}` }>
        <ul className={ 'time-input-container' }>
          <ReverseDropdown
            data-for={ 'content-editor-tooltip' }
            data-tip={ t( 'Options' ) }
            isActive={ optionsDropdownOpen }
            onClose={ () => setOptionsDropdownOpen( false ) }
          >
            <div
              onClick={ () => setShortcutsHelpVisibility( true ) }
              className={ 'dropdown-item' }
            >
              <span className={ 'button is-rounded' }>
                <i className={ 'fas fa-info-circle' } />
              </span>
              <span className={ 'dropdown-item-main-content' }>{t( 'keyboard shortcuts' )}</span>
            </div>
            <div
              onClick={ onFocusRequest }
              className={ 'dropdown-item' }
            >
              <span className={ 'button is-rounded' }>
                <i className={ 'fas fa-dot-circle' } />
              </span>
              <span className={ 'dropdown-item-main-content' }>{t( 'focus on excerpt' )}</span>
            </div>
            <div className={ 'dropdown-item-label' }>
              {t( 'Active annotation field' )}
            </div>
            <div
              style={ { display: tempNewFieldTitle === undefined ? 'flex' : 'none' } }
              onClick={ ( e ) => e.stopPropagation() }
              className={ 'dropdown-item' }
            >
              <span
                data-for={ 'content-editor-tooltip' }
                data-tip={ t( 'create a new annotation field' ) }
                onClick={ () => setTempNewFieldTitle( '' ) }
                className={ 'button is-rounded' }
              >
                <i className={ 'fas fa-plus-circle' } />
              </span>
              <span
                onClick={ () => {
                      if ( activeFieldName !== 'default' ) {
                        setEditedFieldTempName( activeFieldName );
                        setEditedFieldId( activeFieldId );
                        setOptionsDropdownOpen( false );
                      }
                    } }
                className={ 'dropdown-item-main-content' }
              >
                {
                      activeFieldName === 'default' ? 
                        t( 'default field' ) 
                        : 
                        abbrev( activeFieldName, 20 )
                    }
                {
                      activeFieldName === 'default' ? 
                        null :
                        <span
                          style={ { marginLeft: '1rem' } }
                          className={ 'icon' }
                        >
                          <i className={ 'fas fa-pencil-alt' } />
                        </span>
                    }
              </span>
              <span
                data-for={ 'content-editor-tooltip' }
                data-tip={ fieldsArray.length > 1 ? t( 'change annotation field' ) : undefined }
                onClick={ onSelectNextField }
                className={ `button is-rounded ${fieldsArray.length > 1 ? '' : 'is-disabled'}` }
              >
                <i className={ 'fas fa-caret-right' } />
              </span>
            </div>
            <div
              style={ { display: tempNewFieldTitle !== undefined ? 'flex' : 'none' } }
              onClick={ ( e ) => e.stopPropagation() }
              className={ 'dropdown-item' }
            >
              <span
                data-for={ 'content-editor-tooltip' }
                data-tip={ t( 'cancel field creation' ) }
                onClick={ () => setTempNewFieldTitle( undefined ) }
                className={ 'button is-rounded' }
              >
                <i className={ 'fas fa-times' } />
              </span>
              <form
                onClick={ silentEvent }
                onKeyUp={ silentEvent }
                onKeyDown={ silentEvent }
                className={ 'dropdown-item-main-content' }
                onSubmit={ onNewFieldSubmit }
              >
                <FocusableInput
                  className={ 'input' }
                  style={ { textAlign: 'left', padding: '.3rem' } }
                  value={ tempNewFieldTitle || '' }
                  isActive={ tempNewFieldTitle !== undefined }
                  placeholder={ t( 'New field name' ) }
                  onChange={ ( e ) => setTempNewFieldTitle( e.target.value ) }
                />
              </form>
              <span
                data-for={ 'content-editor-tooltip' }
                data-tip={ t( 'create annotation field' ) }
                onClick={ onNewFieldSubmit }
                className={ 'button is-rounded' }
              >
                <i className={ 'fas fa-plus-circle' } />
              </span>
            </div>

          </ReverseDropdown>
          <li>
            <button
              className={ `button is-rounded options-toggle ${optionsDropdownOpen ? 'is-primary' : ''}` }
              onClick={ () => {
                setOptionsDropdownOpen( !optionsDropdownOpen );
                
              } }
            >
              <i className={ 'fas fa-plus' } />
            </button>
          </li>
          <li className={ 'main-time-input-column' }>
            <TimeInput
              value={ start }
              onChange={ onStartChange }
            />
          </li>
          <li>
            <button
              onClick={ toggleExpanded }
              data-for={ 'content-editor-tooltip' }
              data-tip={ t( 'Change editor size' ) }
              className={ 'button is-rounded' }
            >
              <i className={ 'fas fa-expand' } />
            </button>
            <button
              onClick={ handleDeselect }
              className={ 'button is-rounded' }
              data-for={ 'content-editor-tooltip' }
              data-tip={ t( 'Close editor' ) }
            >
              <i className={ 'fas fa-times' } />
            </button>
          </li>
        </ul>

        <div className={ 'main-editor-container is-flex-1 rows' }>
          <div className={ 'stretched-columns' }>
            {
              activeFieldId !== defaultFieldId &&
              <div style={ { padding: '1rem', paddingTop: 0 } }>
                <h6
                  style={ { display: 'flex', alignItems: 'center' } }
                  className={ 'title is-6' }
                >
                  {t( 'Default field contents' )}
                </h6>
                <MarkdownPlayer src={ chunkFields[defaultFieldId] || '' } />
              </div>
            }
            <div
              style={ { minWidth: '70%', overflow: 'auto' } }
              className={ 'is-flex-1' }
            >
              {
                activeFieldId !== defaultFieldId &&
                <h6 className={ 'title is-6' }>{t( '{f} field contents', { f: fields[activeFieldId].name } )}</h6>
              }
              <MarkdownEditor
                contentId={ activeFieldId }
                value={ activeFieldContent }
                onChange={ onActiveFieldChange }
                ref={ bindMainTextarea }
              />
            </div>
          </div>
        </div>
        <ul className={ 'time-input-container' }>
          <ReverseDropdown
            isActive={ tagsDropdownOpen }
            onClose={ () => setTagsDropdownOpen( false ) }
          >
            {
                                chunkTags.length > 0 &&
                                <div className={ 'dropdown-item-label' }>
                                    {t( 'Tags attached to the excerpt' )}
                                </div>
                              }
            <div style={ { maxHeight: '20rem', overflow: 'auto' } }>
              <FlipMove>
                {
                        chunkTags
                          .sort( ( a, b ) => {
                            if ( tags[a].name > tags[b].name ) {
                              return 1;
                            }
                            return -1;
                          } )
                          .map( ( tagId ) => {
                            const tag = tags[tagId];
                            if ( !tag ) {
                              return null;
                            }
                            const tagCategory = tagCategories[tag.tagCategoryId];

                            const onUnlink = ( e ) => {
                              e.stopPropagation();
                              updateChunk(
                                corpusId,
                                chunk.metadata.id,
                                {
                                  ...chunk,
                                  tags: chunkTags.filter( ( otherTagId ) => otherTagId !== tagId )
                                }
                              );
                            };
                            const onEdit = ( e ) => {
                              e.stopPropagation();
                              onTagEdit( tagId );
                            };
                            return (
                              <div
                                key={ tagId }
                                className={ 'dropdown-item' }
                                onClick={ onUnlink }
                              >
                                <span
                                  style={ {
                                    paddingLeft: '1rem',
                                    color: tagCategory && tagCategory.color,
                                  } }
                                  data-for={ 'content-editor-tooltip' }
                                  data-tip={ tagCategory.name }
                                  className={ 'icon' }
                                >
                                  <i className={ 'fas fa-tag' } />
                                </span>
                                <span className={ 'dropdown-item-main-content' }>
                                  {abbrev( tag.name, 30 )}
                                </span>
                                <span
                                  data-for={ 'content-editor-tooltip' }
                                  data-tip={ t( 'Edit tag' ) }
                                  onClick={ onEdit }
                                  className={ 'button is-rounded' }
                                >
                                  <i className={ 'fas fa-pencil-alt' } />
                                </span>
                                <span
                                  data-for={ 'content-editor-tooltip' }
                                  data-tip={ t( 'Unlink tag from excerpt' ) }
                                  onClick={ onUnlink }
                                  className={ 'button is-rounded' }
                                >
                                  <i className={ 'fas fa-unlink' } />
                                </span>
                              </div>
                            );
                          } )
                      }
              </FlipMove>
            </div>
            {
                                otherMediaTags.length > 0 &&
                                <div className={ 'dropdown-item-label' }>
                                    {t( 'Other tags used for this media annotations' )}
                                </div>
                              }
            {
                    otherMediaTags.length > 0 &&
                    <div style={ { maxHeight: '20rem', overflow: 'auto' } }>
                      <FlipMove>
                        {
                          otherMediaTags
                            .sort( ( a, b ) => {
                              if ( tags[a].name > tags[b].name ) {
                                return 1;
                              }
                              return -1;
                            } )
                            .map( ( tagId ) => {
                              const tag = tags[tagId];
                              const tagCategory = tagCategories[tag.tagCategoryId];

                              const onLink = ( e ) => {
                                e.stopPropagation();
                                updateChunk(
                                  corpusId,
                                  chunk.metadata.id,
                                  {
                                    ...chunk,
                                    tags: [ ...chunkTags, tagId ]
                                  }
                                );
                              };
                              const onEdit = ( e ) => {
                                e.stopPropagation();
                                onTagEdit( tagId );
                              };
                              return (
                                <div
                                  key={ tagId }
                                  className={ 'dropdown-item' }
                                  onClick={ onLink }
                                >
                                  <span
                                    style={ {
                                      paddingLeft: '1rem',
                                      color: tagCategory && tagCategory.color,
                                    } }
                                    data-for={ 'content-editor-tooltip' }
                                    data-tip={ tagCategory.name }
                                    className={ 'icon' }
                                  >
                                    <i className={ 'fas fa-tag' } />
                                  </span>
                                  <span className={ 'dropdown-item-main-content' }>
                                    {abbrev( tag.name, 30 )}
                                  </span>
                                  <span
                                    data-for={ 'content-editor-tooltip' }
                                    data-tip={ t( 'Edit tag' ) }
                                    onClick={ onEdit }
                                    className={ 'button is-rounded' }
                                  >
                                    <i className={ 'fas fa-pencil-alt' } />
                                  </span>
                                  <span
                                    data-for={ 'content-editor-tooltip' }
                                    data-tip={ t( 'Link this tag to excerpt' ) }
                                    onClick={ onLink }
                                    className={ 'button is-rounded' }
                                  >
                                    <i className={ 'fas fa-link' } />
                                  </span>
                                </div>
                              );
                            } )
                        }
                      </FlipMove>
                    </div>
                  }
            <div className={ 'dropdown-item-label' }>
              {t( 'Attach new tags' )}
            </div>
            {
                    tagsMatchingSearch && tagsMatchingSearch.length > 0 &&
                    <div style={ { maxHeight: '20rem', overflow: 'auto' } }>
                      <FlipMove>
                        {
                          tagsMatchingSearch
                            .sort( ( a, b ) => {
                              if ( a.name > b.name ) {
                                return 1;
                              }
                              return -1;
                            } )
                            .map( ( tag ) => {
                              const tagId = tag.metadata.id;
                              const tagCategory = tagCategories[tag.tagCategoryId];

                              const onLink = ( e ) => {
                                e.stopPropagation();
                                updateChunk(
                                  corpusId,
                                  chunk.metadata.id,
                                  {
                                    ...chunk,
                                    tags: [ ...chunkTags, tagId ]
                                  }
                                );
                              };
                              const onEdit = ( e ) => {
                                e.stopPropagation();
                                onTagEdit( tagId );
                              };
                              return (
                                <div
                                  key={ tagId }
                                  className={ 'dropdown-item' }
                                  onClick={ onLink }
                                >
                                  <span
                                    style={ {
                                            paddingLeft: '1rem',
                                            color: tagCategory && tagCategory.color,
                                          } }
                                    data-for={ 'content-editor-tooltip' }
                                    data-tip={ tagCategory.name }
                                    className={ 'icon' }
                                  >
                                    <i className={ 'fas fa-tag' } />
                                  </span>
                                  <span className={ 'dropdown-item-main-content' }>
                                    {abbrev( tag.name, 30 )}
                                  </span>
                                  <span
                                    data-for={ 'content-editor-tooltip' }
                                    data-tip={ t( 'Edit tag' ) }
                                    onClick={ onEdit }
                                    className={ 'button is-rounded' }
                                  >
                                    <i className={ 'fas fa-pencil-alt' } />
                                  </span>
                                  <span
                                    data-for={ 'content-editor-tooltip' }
                                    data-tip={ t( 'Link this tag to excerpt' ) }
                                    onClick={ onLink }
                                    className={ 'button is-rounded' }
                                  >
                                    <i className={ 'fas fa-link' } />
                                  </span>
                                </div>
                              );
                            } )
                        }
                      </FlipMove>
                    </div>
                  }
            <div className={ 'dropdown-item' }>
              <span
                onClick={ onSubmitMatchingTags }
                className={ 'button is-rounded' }
              >
                <i className={ 'fas fa-search' } />
              </span>
              <span className={ 'dropdown-item-main-content' }>
                <form
                  onSubmit={ onSubmitMatchingTags }
                >
                  <FocusableInput
                    style={ { textAlign: 'left', paddingLeft: '.5rem' } }
                    className={ 'input' }
                    value={ tagSearchTerm }
                    isActive={ tagsDropdownOpen }
                    onChange={ ( e ) => setTagSearchTerm( e.target.value ) }
                    placeholder={ t( 'Search tags' ) }
                  />
                </form>
              </span>
              <span
                onClick={ () => {
                        setNewTagPrompted( true );
                        setNewTagTempData( {
                          name: tagSearchTerm || ''
                        } );
                      } }
                className={ 'button is-rounded' }
              >
                <i className={ 'fas fa-plus' } />
              </span>
            </div>
          </ReverseDropdown>
          <li>
            <button
              className={ 'button is-rounded tags-toggle' }
              data-for={ 'content-editor-tooltip' }
              data-tip={ t( 'Edit excerpt tags' ) }
              onClick={ () => {
                setTagsDropdownOpen( !tagsDropdownOpen );
              } }
            >

              <i className={ 'fas fa-tags' } />
            </button>
            <span className={ 'tags-counter' }>{Object.keys( chunkTags ).length}</span>
          </li>
          <li className={ 'main-time-input-column' }>
            <TimeInput
              value={ end }
              onChange={ onEndChange }
            />
          </li>
          <li>
            <button
              onClick={ onDelete }
              className={ 'button is-rounded trash-button' }
              data-for={ 'content-editor-tooltip' }
              data-tip={ t( 'Delete excerpt' ) }
            >
              <i className={ 'fas fa-trash' } />
            </button>
          </li>
        </ul>
        <ReactTooltip
          effect={ 'solid' }
          delayShow={ 500 }
          id={ 'content-editor-tooltip' }
        />
      </div>
    );
  }
}
