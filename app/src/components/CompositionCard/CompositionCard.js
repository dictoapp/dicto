import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { uniq } from 'lodash';

import MediaThumbnail from '../MediaThumbnail';

import './CompositionCard.scss';

import {
  abbrev,
  secsToSrt,
} from '../../helpers/utils';

const CompositionCard = ( {
  composition: {
    metadata: {
      title,
      creators,
    },
    summary
  },
  chunks,
  medias,
  onClick,
  minified,

  active,
  actionContents
}, { t } ) => {
  const duration = summary.reduce( ( sum, item ) =>
    sum + Math.abs(
      item.blockType === 'chunk' ?
        chunks[item.content] && chunks[item.content].end - chunks[item.content].start
        :
        item.duration
    )
    , 0 );
  const relatedChunks = summary.filter( ( c ) => c.blockType === 'chunk' ).map( ( compositionBlock ) => {
    const chunkId = compositionBlock.content;
    return chunks[chunkId];
  } );
  const relatedMedias = uniq( relatedChunks.map( ( c ) => c.metadata.mediaId ) )
    .map( ( mediaId ) => medias[mediaId] );
  const mediasCount = relatedMedias.length;
  const handleClick = () => {
    if ( typeof onClick === 'function' ) {
      onClick();
    }
  };
  let templateColumns;
  if ( mediasCount <= 1 ) {
    templateColumns = '100%';
  }
  else if ( mediasCount === 2 ) {
    templateColumns = '50% 50%';
  }
  else if ( mediasCount <= 6 ) {
    templateColumns = '30% 30% 30%';
  }
  else {
    templateColumns = '25% 25% 25% 25%';
  }

  return (
    <div
      onClick={ handleClick }
      className={ `card dicto-CompositionCard ${minified ? 'is-minified' : ''}` }
      style={ { background: active ? '#f0e9df' : undefined } }
    >
      <div className={ 'columns' }>
        <div
          style={ { gridTemplateColumns: templateColumns } }
          className={ 'column is-4 preview-container' }
        >
          {
            relatedMedias.map( ( media ) =>
              (
                <MediaThumbnail
                  key={ media.metadata.id }
                  { ...media.metadata }
                />
              )
            )
          }
        </div>
        <div className={ 'column is-8 info-container' }>
          <h3 className={ `title media-title  ${minified ? 'is-6' : 'is-3'}` }>
            {abbrev( title || t( 'Untitled composition' ), 50 )}
          </h3>
          {
            creators && creators.length > 0 &&
            <div className={ 'creators' }>
                {creators.reduce( ( cur, author, authorIndex ) => [
                ...cur,
                authorIndex === 0 ? null : ',',
                  <span key={ authorIndex }>{author.given}{' '}{author.family}</span>
              ], [] )}
            </div>
          }
          <ul className={ 'info-numbers' }>
            <li>
              <i className={ 'fas fa-film' } />
              <span className={ 'info-number' }>
                {t( [ 'one excerpt', '{n} excerpts' ], { n: summary.length } )}
              </span>
            </li>
            <li>
              <i className={ 'fas fa-video' } />
              <span className={ 'info-number' }>
                {t( [ 'one media', '{n} medias' ], { n: mediasCount } )}
              </span>
            </li>
            <li>
              <i className={ 'fas fa-clock' } />
              <span className={ 'info-number' }>
                {secsToSrt( parseInt( duration, 10 ), false )}
              </span>
            </li>
          </ul>
          <ul className={ 'buttons-row' }>
            {actionContents}
          </ul>
        </div>
      </div>
      <ReactTooltip
        effect={ 'solid' }
        id={ 'tooltip' }
        delayShow={ 500 }
      />
    </div> );
};

CompositionCard.contextTypes = {
  t: PropTypes.func,
};

export default CompositionCard;
