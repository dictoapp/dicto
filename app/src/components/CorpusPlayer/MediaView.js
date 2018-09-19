import React, { Component } from 'react';
import { uniq, flatten } from 'lodash';

import MediaCard from '../MediaCard';
import PaginatedList from '../PaginatedList';

import {
  mapToArray,
} from '../../helpers/utils';

export default class MediaView extends Component {
  constructor ( props ) {
    super( props );
    this.state = {
      playersPlaying: {}
    };
    this.cards = {};
  }

  render = () => {
    const {
      props: {
        corpus: {
          medias,
          chunks,
        },
        addPlaylistBuilder,
        translate
      },

    } = this;
    const corpus = this.props.corpus;
    const mediasList = mapToArray( medias );
    const chunksList = mapToArray( chunks );
    const bindCard = ( card, index ) => {
      this.cards[index] = card;
    };

    return (
      <div
        style={ { height: '100%' } }
        className={ 'is-stretched-column is-flex-1' }
      >
        <PaginatedList
          className={ 'medias-list is-flex-1' }
          items={ mediasList }
          renderItem={ ( media, index ) => {
            const onClick = () => addPlaylistBuilder( 'media', media );
            const mediaId = media.metadata.id;
            const chunksCount = chunksList.filter( ( c ) => c.metadata.mediaId === mediaId ).length;
            const tagsIds = uniq(
              flatten(
                chunksList.filter( ( c ) => c.metadata.mediaId === mediaId )
                  .map( ( c ) => c.tags )
              )
            );
            const bindRef = ( card ) => bindCard( card, index );
            return (
              <div
                ref={ bindRef }
                key={ media.metadata.id }
                className={ 'column' }
              >
                <MediaCard
                  media={ media }
                  chunksCount={ chunksCount }
                  tagsCount={ tagsIds.length }
                  onClick={ onClick }
                  actionContents={ [
                    <li
                      key={ 0 }
                      className={ '' }
                    >
                      <button
                        className={ 'button is-rounded' }
                        onClick={ addPlaylistBuilder }
                      >
                        <i className={ 'fas fa-plus' } />
                      </button>
                    </li>
                       ] }
                  href={ `/corpora/${corpus.metadata.id}/chunks?activeMedia=${media.metadata.id}` }
                />

              </div>
            );
          } }
          renderNoItem={ () => <div>{Object.keys( corpus.medias ).length ? translate( 'No matching media' ) : translate( 'No media yet' )}</div> }
        />
      </div>
    );
  }
}

