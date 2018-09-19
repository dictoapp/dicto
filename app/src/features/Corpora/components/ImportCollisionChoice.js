import React from 'react';
import PropTypes from 'prop-types';

const ImportCollisionChoice = ( {
  collision,
  corpus,
  onForget,
  onDuplicate,
  onMerge
}, { t } ) => {
  let message;
  switch ( collision.type ) {
  case 'tags':
    message = t( 'The tag "{n}" is already in your corpus. What should we do ?', { n: corpus.tags[collision.prevId].name } );
    break;
  case 'tagCategories':
    message = t( 'The tag category "{n}" is already in your corpus. What should we do ?', { n: corpus.tagCategories[collision.prevId].name } );
    break;
  case 'medias':
    message = t( 'The media "{n}" is already in your corpus. What should we do ?', { n: corpus.medias[collision.prevId].metadata.title } );
    break;
  default:
    break;
  }
  return (
    <div className={ 'column' }>
      <div className={ 'content' }>
        {message}
      </div>
      <ul className={ 'stretched-columns' }>
        <li onClick={ onMerge }>
          <button className={ 'button' }>{t( 'merge new item into old one' )}</button>
        </li>
        <li onClick={ onDuplicate }>
          <button className={ 'button' }>{t( 'duplicate new item' )}</button>
        </li>
        <li onClick={ onForget }>
          <button className={ 'button' }>{t( 'do not import new item' )}</button>
        </li>
      </ul>
    </div>
  );
};

ImportCollisionChoice.contextTypes = {
  t: PropTypes.func,
};

export default ImportCollisionChoice;
