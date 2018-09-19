import React from 'react';
import PropTypes from 'prop-types';

import TimeInput from '../TimeInput';

import Editor from '../MarkdownEditor';

const CommentCard = ( {
  comment,
  deletable = false,
  onDelete,
  allowAddComments,
  onAddCommentBefore,
  onAddCommentAfter,
  onContentChange,
  onDurationChange,
  displayFooter = false,
}, { t } ) => {
  const autoSetDuration = () => {
    // avarage reading speed is 200 words per minutes, so ~4/seconds
    const wordsLength = comment.content.split( /\s+/ ).length;
    onDurationChange( wordsLength / 4 );
  };
  return (
    <div className={ 'dicto-CommentCard' }>
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
        <div className={ 'card-content' }>
          <div className={ 'content column main-content-container' }>
            <div className={ 'level' }>
              <Editor
                value={ comment.content || '' }
                onChange={ onContentChange }
              />

            </div>

            <div className={ 'level actions-container' }>
              {t( 'duration' )}{': '}<TimeInput
                value={ comment.duration || 0 }
                onChange={ onDurationChange }
                                     />
              <button
                onClick={ autoSetDuration }
                className={ 'button' }
              >
                {t( 'Auto-set duration' )}
              </button>
              {
                deletable &&
                <div className={ '' }>
                  <button
                    className={ 'button is-danger is-fullwidth' }
                    onClick={ onDelete }
                  >
                    <span className={ 'icon' }>
                      <i className={ 'fas fa-trash' } />
                    </span>
                  </button>
                </div>
              }
            </div>
          </div>

        </div>
        {
          displayFooter &&
          <footer className={ 'card-footer' }>
            <span className={ 'card-footer-item' }>
              {t( 'created' )}{' '}{new Date( comment.metadata.createdAt ).toLocaleDateString()}
            </span>
            <span className={ 'card-footer-item' }>
              {t( 'modified' )}{' '}{new Date( comment.metadata.lastModifiedAt ).toLocaleDateString()}
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

CommentCard.contextTypes = {
  t: PropTypes.func,
};

export default CommentCard;
