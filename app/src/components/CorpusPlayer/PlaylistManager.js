import React from 'react';

import ChunkCard from '../ChunkCard';
import PaginatedList from '../PaginatedList';

import {
  buildBuilderLabel,
} from './utils';
import {
  secsToSrt,
  abbrev
} from '../../helpers/utils';

const PlaylistManager = ( {
  playlistBuilders = [],
  onPlay,
  onChange,
  translate,
  tags,
  tagCategories,
  fields,
  activeMontageData: {
    summary,
    duration
  }
} ) => {

  const onClear = () => onChange( [] );
  return (
    <aside className={ 'playlist-manager' }>
      <div
        className={ 'playlist-manager-contents' }
        style={ {
          opacity: playlistBuilders.length > 0 ? '1' : '0',
          pointerEvents: playlistBuilders.length > 0 ? 'all' : 'none'
        } }
      >
        <ul className={ 'playlist-builders-list' }>
          {
            playlistBuilders.map( ( builder, index ) => {
              const label = buildBuilderLabel( builder, translate );
              const onDelete = () => {
                const newBuilders = playlistBuilders.filter( ( o, i ) => i !== index );
                onChange( newBuilders );
              };
              return (
                <li
                  data-for={ 'tooltip' }
                  data-tip={ `${label} (${translate( builder.type )})` }
                  className={ 'tag' }
                  key={ index }
                >
                  {abbrev( label, 30 )}{' ('}{translate( builder.type )})
                  <span
                    className={ 'icon' }
                    style={ { cursor: 'pointer', paddingLeft: '1em' } }
                    onClick={ onDelete }
                  >
                    <i className={ 'fas fa-times-circle' } />
                  </span>
                </li>
              );
            } )
          }
        </ul>
        <PaginatedList
          className={ 'playlist-chunks-container' }
          items={ summary }
          minified
          renderItem={ ( block, index ) => (
            <ChunkCard
              key={ index }
              chunk={ block.chunk }
              tags={ tags }
              tagCategories={ tagCategories }
              fields={ fields }
            />
          ) }
          renderNoItem={ () => <div>{translate( 'No excerpts in playlist' )}</div> }
        />
        {
          ( duration && duration > 0 ) ?
            <div className={ 'level' }>
              <div
                className={ 'columns column' }
                style={ { width: '100%' } }
              >
                <div className={ 'column' }>
                  <span className={ 'icon' }>
                    <i className={ 'fas fa-film' } />
                  </span>{translate( '{n} excerpts', { n: summary.length } )}
                </div>
                <div className={ 'column' }>
                  <span className={ 'icon' }>
                    <i className={ 'fas fa-clock' } />
                  </span>
                  <span>
                    {secsToSrt( duration )}
                  </span>
                </div>
              </div>
            </div>
            : null
        }
        <div>
          <ul className={ 'columns' }>
            <li className={ 'column' }>
              <button
                onClick={ onPlay }
                className={ 'button is-fullwidth is-primary' }
              >
                <i className={ 'fas fa-play' } />
                <span style={ { paddingLeft: '1em' } }>{translate( 'play selection' )}</span>
              </button>
            </li>
            <li className={ 'column' }>
              <button
                onClick={ onClear }
                className={ 'button is-fullwidth is-danger' }
              >
                <i className={ 'fas fa-times' } />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default PlaylistManager;
