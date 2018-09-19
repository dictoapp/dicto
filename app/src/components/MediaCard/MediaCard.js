import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

// import {Link} from 'react-router-dom';

import MediaThumbnail from '../MediaThumbnail';

import './MediaCard.scss';

import {
  secsToSrt,
  abbrev
} from '../../helpers/utils';

const MediaCard = ( {
  active,
  media: {
    metadata: { title, creators, ...metadata },
    duration,
  },
  chunksCount = 0,
  tagsCount = 0,
  onClick,
  minified = false,
  actionContents = [],
},
{
  t
} ) => {
  const handleClick = () => {
    if ( typeof onClick === 'function' ) {
      onClick();
    }
  };
  return (
    <div
      onClick={ handleClick }
      className={ 'card dicto-MediaCard' }
      style={ { background: active ? '#f0e9df' : undefined } }
    >
      <div className={ 'columns' }>
        <div className={ 'column is-4 preview-container' }>
          <MediaThumbnail { ...metadata } />
        </div>
        <div className={ 'column is-8 info-container' }>
          <h3
            data-tip={ title }
            data-for={ 'tooltip' }
            className={ `title media-title ${minified ? 'is-6' : 'is-3'}` }
          >
            {abbrev( title, 50 )}
          </h3>
          {
                    creators && creators.length > 0 && !minified &&
                    <div className={ 'creators' }>
                        {creators.reduce( ( cur, author, authorIndex ) => [
                        ...cur,
                        authorIndex === 0 ? null : ',',
                          <span key={ authorIndex }>{author.given}{' '}{author.family}</span>
                      ], [] )}
                    </div>
                  }
          {
                    !minified &&
                    <ul className={ 'info-numbers' }>
                      <li>
                        <i className={ 'fas fa-film' } />
                        <span className={ 'info-number' }>
                          {t( [ 'one excerpt', '{n} excerpts', 'n' ], { n: chunksCount } )}
                        </span>
                      </li>
                      <li>
                        <i className={ 'fas fa-tags' } />
                        <span className={ 'info-number' }>
                          {t( [ 'one tag', '{n} tags', 'n' ], { n: tagsCount } )}
                        </span>
                      </li>
                        {
                        duration !== undefined &&
                        <li>
                          <i className={ 'fas fa-clock' } />
                          <span className={ 'info-number' }>
                            {secsToSrt( parseInt( duration, 10 ), false )}
                          </span>
                        </li>
                      }
                    </ul>
                  }
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
    </div>
  );

};

MediaCard.contextTypes = {
  t: PropTypes.func,
};

export default MediaCard;
