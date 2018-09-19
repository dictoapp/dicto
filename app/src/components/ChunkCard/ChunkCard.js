import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../MarkdownPlayer';

import {
  getColorByBgColor
} from '../../helpers/utils';

const getIconFromAsideType = ( type ) => {
  switch ( type ) {
  case 'link':
    return 'fas fa-link';
  case 'markdown':
    return 'fas fa-align-justify';
  case 'images':
    return 'fas fa-images';
  default:
    return 'fas fa-images';
  }
};

const ChunkCard = ( {
  chunk,
  tags,
  tagCategories,
  fields,
  deletable = false,
  activeFieldId,
  asides,
  onDelete,
  allowAddComments,
  onAddCommentBefore,
  onAddCommentAfter,
  displayFooter = false,
  onSetActive,
}, { t } ) => {
  const onContentClick = () => {
    if ( typeof onSetActive === 'function' ) {
      onSetActive();
    }
  };
  const shownFieldId = activeFieldId || Object.keys( fields )[0];
  const defaultFieldId = Object.keys( fields ).find( ( f ) => fields[f].name === 'default' );
  const isShownEmpty = !( chunk.fields[shownFieldId] && chunk.fields[shownFieldId].trim().length > 0 );

  return (
    <div className={ 'dicto-ChunkCard' }>
      {
        allowAddComments &&
        <div className={ 'add-comment-container' }>
          <button
            onClick={ onAddCommentBefore }
            className={ 'button is-info is-fullwidth' }
          >
            {t( 'add comment before' )}
          </button>
        </div>
      }
      <div className={ 'card' }>
        <div className={ 'card-content column' }>
          <div
            style={ { opacity: isShownEmpty ? 0.5 : 1 } }
            className={ 'content column main-content-container' }
            onClick={ onContentClick }
          >
            <Markdown src={ isShownEmpty ? chunk.fields[defaultFieldId] : chunk.fields[shownFieldId] || '' } />
          </div>
          {
            asides && asides.length &&
            <div
              className={ 'content column' }
              onClick={ onContentClick }
            >
                {
                asides.map( ( aside, asideIndex ) => (
                  <span
                    key={ asideIndex }
                    className={ 'tag' }
                  >{' '}<i className={ getIconFromAsideType( aside.type ) } />
                  </span>
                ) )
              }
            </div>
          }
          {
            chunk.tags && chunk.tags.length > 0 ?
              <div className={ 'content column tags-container' }>
                {chunk.tags.map( ( id ) => {
                  const tag = tags[id];
                  return (
                    <span
                      className={ 'tag' }
                      style={ {
                        background: tagCategories[tag.tagCategoryId].color,
                        color: getColorByBgColor( tagCategories[tag.tagCategoryId].color )
                      } }
                      key={ tag.metadata.id }
                    >
                      {tag.name}
                    </span>
                  );

                } )}
              </div>
              : 
              null
          }
          <div className={ 'column columns additionals-container' }>
            <span className={ 'column' }>
              <span className={ 'icon' }><i className={ 'fas fa-clock' } /></span>
              <span>{parseInt( chunk.end - chunk.start, 10 )}{' '}{t( 'seconds' )}</span>
            </span>
            {
              deletable &&
              <div className={ 'column' }>
                <button
                  className={ 'button is-danger is-fullwidth' }
                  onClick={ onDelete }
                >
                  <span
                    className={ 'icon' }
                    style={ { marginRight: '1em' } }
                  >
                    <i className={ 'fas fa-trash' } />
                  </span>
                  {t( 'delete from playlist' )}
                </button>
              </div>
            }
          </div>
          {
            typeof onSetActive === 'function' &&
            <div className={ 'level footer-container' }>
              <div className={ 'column' }>
                <button
                  id={ 'edit-composition-block' }
                  onClick={ onSetActive }
                  className={ 'button is-primary is-fullwidth' }
                >
                  {t( 'edit' )}
                </button>
              </div>
            </div>
          }
        </div>
        {
          displayFooter &&
          <footer className={ 'card-footer' }>
            <span className={ 'card-footer-item' }>
              {t( 'created' )}{' '}{new Date( chunk.metadata.createdAt ).toLocaleDateString()}
            </span>
            <span className={ 'card-footer-item' }>
              {t( 'modified' )}{' '}{new Date( chunk.metadata.lastModifiedAt ).toLocaleDateString()}
            </span>
          </footer>
        }
      </div>
      {
        allowAddComments &&
        <div className={ 'add-comment-container' }>
          <button
            onClick={ onAddCommentAfter }
            className={ 'button is-info is-fullwidth' }
          >
            {t( 'add comment after' )}
          </button>
        </div>
      }
    </div>
  );
};

ChunkCard.contextTypes = {
  t: PropTypes.func,
};

export default ChunkCard;
