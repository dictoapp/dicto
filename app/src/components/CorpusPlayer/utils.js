import { v4 as genId } from 'uuid';

import {
  computePlaylist,
  mapToArray,
} from '../../helpers/utils';

export const buildBuilderLabel = ( builder, translate ) => {
  switch ( builder.type ) {
  case 'media':
    return builder.data.metadata.title || translate( 'unnamed media' );
  case 'place':
    return builder.data.location.address || `${builder.data.location.latitude } - ${ builder.data.location.longitude}`;
  case 'dates':
    const start = builder.data.dates.start;
    const end = builder.data.dates.end;
    return new Date( start ).toLocaleDateString() + ( end && start !== end ? new Date( end ).toLocaleDateString() : '' );
  case 'tag':
    return builder.data.name || translate( 'unnamed tag' );
  default:
    return '';
  }
};

const filterChunksFromTags = ( chunksList, relevantTags ) => {
  const searchedTags = relevantTags.map( ( tag ) => tag.metadata.id );
  return chunksList.filter( ( c ) => {
    const chunkTags = c.tags;
    return chunkTags.find( ( tagId ) => {
      if ( searchedTags.includes( tagId ) ) {
        return true;
      }
      return false;
    } ) !== undefined;
  } );
};

const fetchBlocksFromBuilder = ( builder, corpus ) => {
  const { data, type } = builder;
  const chunksList = mapToArray( corpus.chunks );
  const tagsList = mapToArray( corpus.tags );
  let relevantTags;
  switch ( type ) {
  case 'media':
    return chunksList.filter( ( c ) => c.metadata.mediaId === data.metadata.id );
  case 'place':
    relevantTags = tagsList.filter( ( tag ) =>
      tag.location && tag.location.latitude === data.location.latitude && tag.location.longitude === data.location.longitude
    );
    return filterChunksFromTags( chunksList, relevantTags );
  case 'dates':
    relevantTags = tagsList.filter( ( tag ) =>
      tag.dates && tag.dates.start === data.dates.start && tag.dates.end === data.dates.end
    );
    return filterChunksFromTags( chunksList, relevantTags );
  case 'tag':
    return filterChunksFromTags( chunksList, [ data ] );
  default:
    return '';
  }
};

export const buildMontageData = ( corpus, builders = [] ) => {
  const activeFieldId = Object.keys( corpus.fields )
    .find( ( id ) => corpus.fields[id].name === 'default' );
  const playlist = builders.reduce( ( res, builder ) => {
    return [
      ...res,
      ...fetchBlocksFromBuilder( builder, corpus )
        .map( ( chunk ) => ( {
          metadata: {
            id: genId(),

          },
          blockType: 'chunk',
          content: chunk.metadata.id,
          activeFieldId,
        } ) )
    ];
  }, [] );
  const summary = computePlaylist( {
    summary: playlist,
    fields: corpus.fields,
    chunks: corpus.chunks
  } );
  return {
    summary: summary.list,
    duration: summary.duration
  };
};
