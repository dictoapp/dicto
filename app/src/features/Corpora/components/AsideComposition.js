import React from 'react';
import PropTypes from 'prop-types';
import { abbrev } from '../../../helpers/utils';

import MarkdownPlayer from '../../../components/MarkdownPlayer';

const AsideComposition = ( {
  chunks,
  composition,
  onDeselect,
  onAnnotate,
  // onCreateComposition,
  onDelete,
}, { t } ) => {
  if ( !composition ) {
    return null;
  }
  const { summary } = composition;
  return (
    <div className={ 'is-flex-1 aside-composition rows' }>
      <div className={ 'aside-composition-header columns' }>
        <div className={ 'column is-11 is-flex-1' }>
          <h4
            data-for={ 'tooltip' }
            data-place={ 'left' }
            data-tip={ composition.metadata.title || t( 'Untitled composition' ) }
            className={ 'title is-4' }
          >
            {abbrev( composition.metadata.title || t( 'Untitled composition' ), 60 )}
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
                summary
                  .map( ( compositionBlock ) => {
                    let content;
                    if ( compositionBlock.blockType === 'chunk' ) {
                      const chunk = chunks[compositionBlock.content];
                      content = chunk.fields[compositionBlock.activeFieldId];
                    }
                    else {
                      content = compositionBlock.content;
                    }
                    return (
                      <div
                        style={ { marginBottom: '.5rem' } }
                        key={ compositionBlock.metadata.id }
                      >
                        <div className={ 'card' }>
                          <div className={ 'card-content' }>
                            <MarkdownPlayer src={ content } />
                          </div>
                        </div>
                      </div>
                    );
                  } )
              }
      </div>
      <div
        style={ { padding: '1rem' } }
        className={ 'aside-composition-footer' }
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
            data-tip={ t( 'Annotate excerpts for this composition' ) }
            className={ 'button is-rounded' }
          >
            <i className={ 'fas fa-pencil-alt' } />
          </button>
          <span style={ { flex: 1, marginLeft: '1rem' } }>
            {t( 'Annotate' )}
          </span>
        </div>
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
            data-tip={ t( 'Delete this composition' ) }
            className={ 'button is-rounded' }
          >
            <i className={ 'fas fa-trash' } />
          </button>
          <span style={ { flex: 1, marginLeft: '1rem' } }>
            {t( 'delete' )}
          </span>
        </div>
      </div>
    </div>
  );
};

AsideComposition.contextTypes = {
  t: PropTypes.func,
};

export default AsideComposition;
