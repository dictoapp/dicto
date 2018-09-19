/**
 * This module exports some filtering logic
 * @module dicto/features/CompositionEdition
 */
import {
  mapToArray
} from '../../../helpers/utils';

const applyFilter = ( filterMode, filterParam, corpus ) => {
  switch ( filterMode ) {
  case 'content':
    return mapToArray( corpus.chunks ).filter( ( chunk ) => JSON.stringify( {
      ...chunk,
      tags: chunk.tags.map( ( id ) => corpus.tags[id] )
    } ).toLowerCase().includes( filterParam.toLowerCase() ) );
  case 'media':
    return mapToArray( corpus.chunks ).filter( ( chunk ) => chunk.metadata.mediaId === filterParam );
  case 'tagCategory':
    const tags = mapToArray( corpus.tags ).filter( ( tag ) => tag.tagCategoryId === filterParam ).map( ( t ) => t.metadata.id );
    return mapToArray( corpus.chunks ).filter( ( chunk ) => chunk.tags.find( ( t ) => tags.includes( t ) ) !== undefined );
  case 'tag':
    return mapToArray( corpus.chunks ).filter( ( chunk ) => chunk.tags.includes( filterParam ) );

  case 'all':
  default:
    return mapToArray( corpus.chunks );
  }
};

/**
 * Filter chunks from a corpus
 * @return {array} filteredChunks
 */
export default function filterChunks( filterMode, filterParam, corpus, searchTerm ) {
  return applyFilter( filterMode, filterParam, corpus )
  // search term
    .filter( ( chunk ) => {
      if ( searchTerm.length > 1 ) {
        const contents = `${Object
          .keys( chunk.fields )
          .map( ( id ) => chunk.fields[id] ).join( ' ' )
        } ${
          chunk.tags.map( ( id ) => corpus.tags[id] && corpus.tags[id].name ).join( ' ' )}`;
        return contents.toLowerCase().includes( searchTerm.toLowerCase() );
      }
      return true;
    } );
}
