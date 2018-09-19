import { get } from 'lodash';

import { mapToArray } from './utils';

const mediasAreTheSame = ( media1, media2 ) =>
  get( media1, 'metadata', 'title' ) === get( media2, 'metadata', 'title' );

const tagCategoriesAreTheSame = ( category1, category2 ) =>
  get( category1, 'name' ) === get( category2, 'name' );

const tagsAreTheSame = ( tag1, tag2, category1, category2 ) =>
  get( category1, 'name' ) === get( category2, 'name' ) &&
  get( tag1, 'name' ) === get( tag2, 'name' );

const getCollisions = ( prevCollection, nextCollection, compareFn, type ) => {
  const collisions = [];
  prevCollection.forEach( ( prevObject ) => {
    nextCollection.forEach( ( nextObject ) => {
      const collision = compareFn( prevObject, nextObject );
      if ( collision ) {
        collisions.push( {
          type,
          prevId: prevObject.metadata.id,
          nextId: nextObject.metadata.id,
        } );
      }
    } );
  } );
  return collisions;
};

export const getCorpusCollisions = ( prevCorpus, newCorpus ) => {
  const prevMedias = mapToArray( prevCorpus.medias );
  const nextMedias = mapToArray( newCorpus.medias );
  const prevTagCategories = mapToArray( prevCorpus.tagCategories );
  const nextTagCategories = mapToArray( newCorpus.tagCategories );
  const prevTags = mapToArray( prevCorpus.tags );
  const nextTags = mapToArray( newCorpus.tags );

  return [
    ...getCollisions( prevMedias, nextMedias, mediasAreTheSame, 'medias' ),
    ...getCollisions( prevTagCategories, nextTagCategories, tagCategoriesAreTheSame, 'tagCategories' ),
    ...getCollisions( prevTags, nextTags, tagsAreTheSame, 'tags' ),
  ];
};

export const mergeTag = ( corpus, prevTag, newTag ) => {
  return {
    ...corpus,
    chunks: Object.keys( corpus.chunks ).reduce( ( res, chunkId ) => {
      const chunk = corpus.chunks[chunkId];
      return {
        ...res,
        [chunkId]: chunk.tags.includes( newTag.metadata.id ) ?
          {
            ...chunk,
            // replace tag reference with prev tag id
            tags: [ ...chunk.tags.filter( ( tId ) => tId !== newTag.metadata.id ), prevTag.metadata.id ]
          }
          : chunk
      };
    }, {} ),
    // remove tag reference
    tags: Object.keys( corpus.tags ).reduce( ( res, tagId ) => {
      if ( tagId === newTag.metadata.id ) {
        return res;
      }
      return {
        ...res,
        [tagId]: corpus.tags[tagId]
      };
    }, {} ),
  };
};
export const mergeTagCategory = ( corpus, prevTagCategory, newTagCategory ) => {
  return {
    ...corpus,
    // update tags
    tags: Object.keys( corpus.tags ).reduce( ( res, tagId ) => {
      return {
        ...res,
        [tagId]: corpus.tags[tagId].tagCategoryId === newTagCategory.metadata.id ?
          {
            ...corpus.tags[tagId],
            tagCategoryId: prevTagCategory.metadata.id,
          }
          : corpus.tags[tagId]
      };
    }, {} ),
    // remove tag category reference
    tagCategories: Object.keys( corpus.tagCategories ).reduce( ( res, tagCategoryId ) => {
      if ( tagCategoryId === newTagCategory.metadata.id ) {
        return res;
      }
      return {
        ...res,
        [tagCategoryId]: corpus.tagCategories[tagCategoryId]
      };
    }, {} ),
  };
};
export const mergeMedia = ( corpus, prevMedia, newMedia ) => {
  return {
    ...corpus,
    // update chunks
    chunks: Object.keys( corpus.chunks ).reduce( ( res, chunkId ) => {
      const chunk = corpus.chunks[chunkId];
      return {
        ...res,
        [chunkId]: {
          ...chunk,
          // replace tag reference with prev tag id
          metadata: {
            ...chunk.metadata,
            mediaId: chunk.metadata.mediaId === newMedia.metadata.id ?
              prevMedia.metadata.id
              : chunk.metadata.mediaId
          }
        }
      };
    }, {} ),
    // remove media reference
    medias: Object.keys( corpus.medias ).reduce( ( res, mediaId ) => {
      if ( mediaId === newMedia.metadata.id ) {
        return res;
      }
      return {
        ...res,
        [mediaId]: corpus.medias[mediaId]
      };
    }, {} ),
  };
};
export const forgetTag = ( corpus, tagId ) => {
  return {
    ...corpus,
    // filter chunks tags
    chunks: Object.keys( corpus.chunks ).reduce( ( res, chunkId ) => {
      const chunk = corpus.chunks[chunkId];
      return {
        ...res,
        [chunkId]: chunk.tags.includes( tagId ) ?
          {
            ...chunk,
            // replace tag reference with prev tag id
            tags: [ ...chunk.tags.filter( ( tId ) => tId !== tagId ) ]
          }
          : chunk
      };
    }, {} ),
    // remove tag reference
    tags: Object.keys( corpus.tags ).reduce( ( res, thatTagId ) => {
      if ( tagId === thatTagId ) {
        return res;
      }
      return {
        ...res,
        [thatTagId]: corpus.tags[thatTagId]
      };
    }, {} ),
  };
};
export const forgetTagCategory = ( corpus, tagCategoryId ) => {
  return {
    ...corpus,
    // filter tags
    tags: Object.keys( corpus.tags ).reduce( ( res, tagId ) => {
      const tag = corpus.tags[tagId];
      if ( tag.tagCategoryId === tagCategoryId ) {
        return res;
      }
      return {
        ...res,
        [tagId]: tag
      };
    }, {} ),
    // remove tag category reference
    tagCategories: Object.keys( corpus.tagCategories ).reduce( ( res, thatTagCategoryId ) => {
      if ( tagCategoryId === thatTagCategoryId ) {
        return res;
      }
      return {
        ...res,
        [thatTagCategoryId]: corpus.tagCategories[thatTagCategoryId]
      };
    }, {} ),
  };
};
export const forgetMedia = ( corpus, mediaId ) => {
  return {
    ...corpus,
    // filter chunks
    chunks: Object.keys( corpus.chunks ).reduce( ( res, chunkId ) => {
      const chunk = corpus.chunks[chunkId];
      if ( chunk.metadata.mediaId === mediaId ) {
        return res;
      }
      return {
        ...res,
        [chunkId]: chunk
      };
    }, {} ),
    // remove media reference
    medias: Object.keys( corpus.medias ).reduce( ( res, thatMediaId ) => {
      if ( mediaId === thatMediaId ) {
        return res;
      }
      return {
        ...res,
        [thatMediaId]: corpus.medias[thatMediaId]
      };
    }, {} ),
  };
};

export const mergeCorpuses = ( prevCorpus, newCorpus ) => {
  return {
    ...prevCorpus,
    chunks: {

      /*
       * we set the prev corpus in last position
       * to prevent (very unlikely) id duplicates
       */
      ...newCorpus.chunks,
      ...prevCorpus.chunks,
    },
    fields: {
      ...newCorpus.fields,
      ...prevCorpus.fields,
    },
    medias: {
      ...newCorpus.medias,
      ...prevCorpus.medias,
    },
    tags: {
      ...newCorpus.tags,
      ...prevCorpus.tags,
    },
    tagCategories: {
      ...newCorpus.tagCategories,
      ...prevCorpus.tagCategories,
    }
  };
};

