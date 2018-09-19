import React from 'react';
import PropTypes from 'prop-types';
import { abbrev } from '../../../helpers/utils';

const AsideMedia = ( {
  media,
  fieldId,
  chunks,
  onDeselect,
  onAnnotate,
  onCreateComposition,
  onDelete,
}, { t } ) => {
  if ( !media ) {
    return null;
  }
  return (
    <div className={ 'is-flex-1 aside-media rows' }>
      <div className={ 'aside-media-header columns' }>
        <div className={ 'column is-11 is-flex-1' }>
          <h4
            data-for={ 'tooltip' }
            data-place={ 'left' }
            data-tip={ media.metadata.title || t( 'Untitled media' ) }
            className={ 'title is-4' }
          >
            {abbrev( media.metadata.title || t( 'Untitled media' ), 60 )}
          </h4>
        </div>
        <div className={ 'column' }>
          <div
            onClick={ onDeselect }
            className={ 'delete' }
          />
        </div>
      </div>
      <div className={ 'is-flex-1 is-scrollable' }>
        {
                chunks
                  .sort( ( a, b ) => {
                    if ( a.start > b.start ) {
                      return 1;
                    }
                    return -1;
                  } )
                  .map( ( chunk ) => {
                    return (
                      <div
                        style={ { marginBottom: '.5rem' } }
                        key={ chunk.metadata.id }
                      >
                        <div className={ 'card' }>
                          <div className={ 'card-content' }>
                            {chunk.fields[fieldId]}
                          </div>
                        </div>
                      </div>
                    );
                  } )
              }
      </div>
      <div
        style={ { padding: '1rem' } }
        className={ 'aside-media-footer' }
      >
        <div
          style={ {
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    alignItems: 'center'
                  } }
          onClick={ onAnnotate }
          className={ 'title is-6' }
        >
          <button
            data-for={ 'tooltip' }
            data-tip={ t( 'Annotate excerpts for this media' ) }
            className={ 'button is-rounded' }
          >
            <i className={ 'fas fa-pencil-alt' } />
          </button>
          <span style={ { flex: 1, marginLeft: '1rem' } }>
            {t( 'Annotate' )}
          </span>
        </div>
        {
                chunks.length > 0 &&
                <div
                  style={ {
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    alignItems: 'center'
                  } }
                  onClick={ onCreateComposition }
                  className={ 'title is-6' }
                >
                  <button
                    data-for={ 'tooltip' }
                    data-tip={ t( 'Create a new composition out of this media excerpts' ) }
                    className={ 'button is-rounded' }
                  >
                    <i className={ 'fas fa-list' } />
                  </button>
                  <span style={ { flex: 1, marginLeft: '1rem' } }>
                    {t( 'Start a composition' )}
                  </span>
                </div>
              }
        <div
          style={ {
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    alignItems: 'center'
                  } }
          onClick={ onDelete }
          className={ 'title is-6' }
        >
          <button
            data-for={ 'tooltip' }
            data-tip={ t( 'Delete this media and related annotations' ) }
            className={ 'button is-rounded' }
          >
            <i className={ 'fas fa-trash' } />
          </button>
          <span style={ { flex: 1, marginLeft: '1rem' } }>
            {t( 'Delete' )}
          </span>
        </div>
      </div>
    </div>
  );
};

AsideMedia.contextTypes = {
  t: PropTypes.func,
};

export default AsideMedia;
