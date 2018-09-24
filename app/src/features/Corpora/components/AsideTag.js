import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PaginatedList from '../../../components/PaginatedList';
import SearchInput from '../../../components/SearchInput';
import {
  abbrev,
  // secsToSrt,
} from '../../../helpers/utils';

class AsideTag extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      searchString: ''
    };
  }
  updateSearchString = ( searchString ) => {
    this.setState( { searchString } );
  }
  render = () => {
    const {
      props: {
        tag,
        tagCategory,
        mode,
        setMode,
        relatedChunks = [],
        allChunks = [],
        medias = {},
        fieldId,
        unlinkTag,
        linkTag,
        onDeselect,

        /*
         * onAnnotate,
         * onCreateComposition,
         * onDelete,
         */
      },
      state: {
        searchString = '',
      },
      context: { t },
      updateSearchString,
    } = this;
    if ( !tag ) {
      return null;
    }
    const onUnlink = ( chunkId ) => {
      unlinkTag( chunkId, tag.metadata.id );
    };
    const onLink = ( chunkId ) => {
      linkTag( chunkId, tag.metadata.id );
    };
    const visibleAllChunks = allChunks
      .filter( ( chunk ) => {
        if ( searchString.length > 1 ) {
          return Object
            .keys( chunk.fields )
            .map( ( id ) => chunk.fields[id] )
            .join( ' ' )
            .toLowerCase()
            .includes( searchString.toLowerCase() );
        }
        else {
          return true;
        }
      } );
    const onTagAll = () => {
      visibleAllChunks
        .forEach( ( chunk ) => {
          const chunkId = chunk.metadata.id;
          linkTag( chunkId, tag.metadata.id );
        } );
    };
    const renderNoExcerptsForTag = () => (
      <div
        className={ 'column' }
      >
        {t( 'No excerpts attached to this tag yet' )}
      </div>
                        );
    const renderTagChunks = ( chunk ) => {
                          const mediaTitle = medias[chunk.metadata.mediaId] && medias[chunk.metadata.mediaId].metadata.title;

                          return (
                            <div
                              style={ { marginBottom: '.5rem' } }
                              key={ chunk.metadata.id }
                            >
                              <div className={ 'card' }>
                                <div className={ 'card-content stretched-columns' }>
                                  <div>
                                    <div style={ { marginBottom: '1rem' } }>
                                      {chunk.fields[fieldId]}
                                    </div>
                                    <div
                                      className={ 'stretched-columns' }
                                      data-for={ 'tooltip' }
                                      data-tip={ mediaTitle }
                                    >
                                      <span style={ { marginRight: '.2rem' } }>
                                        <i className={ 'fas fa-video' } />
                                      </span>
                                      <span>
                                        {abbrev( mediaTitle || t( 'Untitled media' ), 20 )}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <button
                                      className={ 'button is-rounded' }
                                      data-for={ 'tooltip' }
                                      data-tip={ t( 'Untag excerpt' ) }
                                      onClick={ () => onUnlink( chunk.metadata.id ) }
                                    >
                                      <i className={ 'fas fa-unlink' } />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        };
    const renderNoMatchingTag = () => (
      <div className={ 'column' }>
        {
                                searchString.length ?
                                t( 'No excerpts matching search without this tag' )
                                : t( 'No excerpts attached to this tag yet' )
                              }
      </div>
                        );
    const renderSearchedTags = ( chunk ) => {
                          const mediaTitle = medias[chunk.metadata.mediaId] && medias[chunk.metadata.mediaId].metadata.title;
                          return (
                            <div
                              style={ { marginBottom: '.5rem' } }
                              key={ chunk.metadata.id }
                            >
                              <div className={ 'card' }>
                                <div className={ 'card-content stretched-columns' }>
                                  <div>
                                    <div style={ { marginBottom: '1rem' } }>
                                      {chunk.fields[fieldId]}
                                    </div>
                                    <div
                                      className={ 'stretched-columns' }
                                      data-for={ 'tooltip' }
                                      data-tip={ mediaTitle }
                                    >
                                      <span style={ { marginRight: '.2rem' } }>
                                        <i className={ 'fas fa-video' } />
                                      </span>
                                      <span>
                                        {abbrev( mediaTitle || t( 'Untitled media' ), 20 )}
                                      </span>
                                    </div>

                                  </div>
                                  <div>
                                    <button
                                      className={ 'button is-rounded' }
                                      data-for={ 'tooltip' }
                                      data-tip={ t( 'Tag excerpt' ) }
                                      onClick={ () => onLink( chunk.metadata.id ) }
                                    >
                                      <i className={ 'fas fa-link' } />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        };
    return (
      <div className={ 'is-flex-1 aside-media rows' }>
        <div className={ 'aside-media-header columns' }>
          <div className={ 'column is-11 is-flex-1' }>
            <h4 className={ 'title is-4' }>
              <span
                style={ { marginRight: '1rem' } }
                className={ 'icon' }
              >
                <i
                  style={ {
                                  color: tagCategory.color
                                } }
                  className={ 'fas fa-tag' }
                />
              </span>
              {abbrev( tag.name || t( 'Untitled tag' ), 60 )}
            </h4>
          </div>
          <div className={ 'column' }>
            <div
              onClick={ onDeselect }
              className={ 'delete' }
            />
          </div>
        </div>
        <div className={ 'is-flex-1 rows' }>
          <div
            className={ 'rows' }
            style={ {
                      maxHeight: mode === 'unlink' ? '100%' : 0,
                      flex: mode === 'unlink' ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all .5s ease'
                    } }
          >
            <h4 className={ 'title is-4' }>
              {t( 'Existing tagged excerpts' )}
            </h4>
            <PaginatedList
              style={ { flex: 1 } }
              items={ relatedChunks }
              minified
              renderNoItem={ renderNoExcerptsForTag }
              renderItem={ renderTagChunks }
            />
          </div>
          <div className={ 'stretched-columns' }>
            <button
              className={ `button is-fullwidth is-flex-1 ${mode === 'link' ? 'is-primary' : ''}` }
              onClick={ () => setMode( mode === 'link' ? 'unlink' : 'link' ) }
            >
              {t( 'Link new excerpts' )}
            </button>
          </div>
          <div
            className={ 'rows' }
            style={ {
                      maxHeight: mode === 'link' ? '100%' : 0,
                      flex: mode === 'link' ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all .5s ease'
                    } }
          >
            <div style={ { marginTop: '1rem', marginBottom: '1rem' } }>
              <SearchInput
                value={ searchString }
                onUpdate={ updateSearchString }
                placeholder={ t( 'Search excerpts' ) }
              />
            </div>
            {
                      searchString.length > 1 &&
                      <div
                        style={ { paddingBottom: '1rem' } }
                        className={ 'stretched-columns' }
                      >
                        <button
                          className={ `button is-fullwidth is-flex-1 ${visibleAllChunks.length ? '' : 'is-disabled'}` }
                          onClick={ onTagAll }
                        >
                          {t( 'Tag all matching excerpts' )}
                        </button>
                      </div>
                    }
            <PaginatedList
              style={ { flex: 1 } }
              items={ visibleAllChunks }
              minified
              renderNoItem={ renderNoMatchingTag }
              renderItem={ renderSearchedTags }
            />
          </div>
        </div>
      </div>
    );
  }
}

AsideTag.contextTypes = {
  t: PropTypes.func,
};

export default AsideTag;
