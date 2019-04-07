/**
 * This module exports logic-related elements for the montages feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module dicto/features/Corpora
 */

import { combineReducers } from 'redux';
import { createStructuredSelector } from 'reselect';
import { v4 as genId } from 'uuid';

import { mapToArray } from '../helpers/utils';

import { inElectron } from '../helpers/electronUtils';
import {
  requestCorpora,
  requestCorpusCreation,
  requestCorpus,
  requestCorpusDeletion,
  requestCorpusUpdate,
  requestCorpusUpdatePart,
  requestChunkViewData,
} from '../helpers/dataClient';

let electronStore;
if ( inElectron ) {
  const electronStoreLib = require( 'electron-store' );
  electronStore = new electronStoreLib();
}

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Action names
 * ===========
 * ===========
 * ===========
 * ===========
 */

export const SET_MEDIA_DURATION = '§dicto/ChunksEdition/SET_MEDIA_DURATION';

export const GET_CORPORA = '§dicto/data/GET_CORPORA';

export const GET_CORPUS = '§dicto/data/GET_CORPUS';
export const CREATE_CORPUS = '§dicto/data/CREATE_CORPUS';
export const UPDATE_CORPUS = '§dicto/data/UPDATE_CORPUS';
export const DELETE_CORPUS = '§dicto/data/DELETE_CORPUS';

export const CREATE_COMPOSITION = '§dicto/data/CREATE_COMPOSITION';
export const UPDATE_COMPOSITION = '§dicto/data/UPDATE_COMPOSITION';
export const DELETE_COMPOSITION = '§dicto/data/DELETE_COMPOSITION';
export const DUPLICATE_COMPOSITION = '§dicto/data/DUPLICATE_COMPOSITION';

export const CREATE_MEDIA = '§dicto/data/CREATE_MEDIA';
export const UPDATE_MEDIA = '§dicto/data/UPDATE_MEDIA';
export const DELETE_MEDIA = '§dicto/data/DELETE_MEDIA';

export const CREATE_CHUNK = '§dicto/data/CREATE_CHUNK';
export const CREATE_CHUNKS = '§dicto/data/CREATE_CHUNKS';
export const UPDATE_CHUNK = '§dicto/data/UPDATE_CHUNK';
export const DELETE_CHUNK = '§dicto/data/DELETE_CHUNK';
export const DELETE_CHUNKS = '§dicto/data/DELETE_CHUNKS';

export const CREATE_FIELD = '§dicto/data/CREATE_FIELD';
export const UPDATE_FIELD = '§dicto/data/UPDATE_FIELD';
export const DELETE_FIELD = '§dicto/data/DELETE_FIELD';

export const CREATE_TAG_CATEGORY = '§dicto/data/CREATE_TAG_CATEGORY';
export const UPDATE_TAG_CATEGORY = '§dicto/data/UPDATE_TAG_CATEGORY';
export const DELETE_TAG_CATEGORY = '§dicto/data/DELETE_TAG_CATEGORY';

export const CREATE_TAG = '§dicto/data/CREATE_TAG';
export const UPDATE_TAG = '§dicto/data/UPDATE_TAG';
export const DELETE_TAG = '§dicto/data/DELETE_TAG';

export const GET_CHUNK_VIEW_DATA = '§dicto/ChunksEdition/GET_CHUNK_VIEW_DATA';
export const FORGET_DATA = '§dicto/ChunksEdition/FORGET_DATA';

const SET_RGPD_AGREEMENT_PROMPTED = '§dicto/ChunksEdition/SET_RGPD_AGREEMENT_PROMPTED';

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Reducers
 * ===========
 * ===========
 * ===========
 * ===========
 */

const CORPUSES_DEFAULT_STATE = {
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function corpora( state = CORPUSES_DEFAULT_STATE, action ) {
  const payload = action.payload;
  let newChunks;
  let newCorpus;
  switch ( action.type ) {

  case `${GET_CORPUS}_SUCCESS`:
    newCorpus = action.result.data.corpus;
    return {
      ...state,
      [newCorpus.metadata.id]: newCorpus
    };
  case `${GET_CHUNK_VIEW_DATA}_SUCCESS`:
    return {
      ...state,
      [action.result.data.metadata.id]: action.result.data
    };
  case FORGET_DATA:
    return {};

  case UPDATE_CORPUS:
    if ( payload && payload.corpus ) {
      return {
        ...state,
        [payload.id]: payload.corpus
      };
    }
    return state;
  case `${UPDATE_CORPUS}_SUCCESS`:
    newCorpus = action.result.data.corpus;
    return {
      ...state,
      [newCorpus.metadata.id]: newCorpus
    };

  case CREATE_COMPOSITION:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        compositions: {
          ...state[payload.corpusId].compositions,
          [payload.composition.metadata.id]: payload.composition
        }
      }
    };

  case UPDATE_COMPOSITION:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        compositions: {
          ...state[payload.corpusId].compositions,
          [payload.compositionId]: payload.composition
        }
      }
    };

  case DELETE_COMPOSITION:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        compositions: Object.keys( state[payload.corpusId].compositions )
          .reduce( ( result, thatCompositionId ) => {
            if ( thatCompositionId !== payload.compositionId ) {
              return {
                ...result,
                [thatCompositionId]: {
                  ...state[payload.corpusId].compositions[thatCompositionId]
                }
              };
            }
            return result;
          }, {} )
      }
    };

  case DUPLICATE_COMPOSITION:
    const composition = JSON.parse( JSON.stringify( payload.composition ) );
    composition.metadata.id = genId();
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        compositions: {
          ...state[payload.corpusId].compositions,
          [composition.metadata.id]: composition
        }
      }
    };

  case CREATE_MEDIA:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        medias: {
          ...state[payload.corpusId].medias,
          [payload.media.metadata.id]: payload.media
        }
      }
    };

  case UPDATE_MEDIA:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        medias: {
          ...state[payload.corpusId].medias,
          [payload.mediaId]: payload.media
        }
      }
    };

  case DELETE_MEDIA:
    const mediaId = payload.mediaId;
    const chunksList = mapToArray( state[payload.corpusId].chunks );

    const chunksToKeep = chunksList
      .filter( ( c ) => c.metadata.mediaId !== mediaId );
    const chunks = chunksToKeep
      .reduce( ( res, chunk ) => ( {
        ...res,
        [chunk.metadata.id]: chunk
      } ), {} );

    const chunksToDelete = chunksList
      .filter( ( c ) => c.metadata.mediaId === mediaId );
    const chunksToDeleteId = chunksToDelete.map( ( c ) => c.metadata.id );
    // filter delete chunks in compositions
    const compositions = Object.keys( state[payload.corpusId].compositions )
      .reduce( ( result, compositionId ) => {
        return {
          ...result,
          [compositionId]: {
            ...state[payload.corpusId].compositions[compositionId],
            summary: [
              ...state[payload.corpusId]
                .compositions[compositionId]
                .summary
                .filter( ( item ) => {
                  if ( item.blockType !== 'chunk' ) {
                    return true;
                  }
                  else {
                    return chunksToDeleteId.indexOf( item.content ) === -1;
                  }
                } )
            ]
          }
        };
      }, {} );
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        medias: Object.keys( state[payload.corpusId].medias )
          .reduce( ( result, thatMediaId ) => {
            if ( thatMediaId !== mediaId ) {
              return {
                ...result,
                [thatMediaId]: state[payload.corpusId].medias[thatMediaId]
              };
            }
            return result;
          }, {} ),
        chunks,
        compositions
      }
    };

  case CREATE_CHUNK:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        chunks: {
          ...state[payload.corpusId].chunks,
          [payload.chunk.metadata.id]: payload.chunk
        }
      }
    };
  case CREATE_CHUNKS:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        chunks: {
          ...state[payload.corpusId].chunks,
          ...payload.chunks.reduce( ( result, chunk ) => ( {
            ...result,
            [chunk.metadata.id]: chunk
          } ), {} )
        }
      }
    };

  case UPDATE_CHUNK:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        chunks: {
          ...state[payload.corpusId].chunks,
          [payload.chunkId]: payload.chunk
        }
      }
    };

  case DELETE_CHUNK:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        chunks: Object.keys( state[payload.corpusId].chunks )
          .reduce( ( result, thatChunkId ) => {
            if ( thatChunkId !== payload.chunkId ) {
              return {
                ...result,
                [thatChunkId]: state[payload.corpusId].chunks[thatChunkId]
              };
            }
            return result;
          }, {} )
      }
    };
  
   case DELETE_CHUNKS:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        chunks: Object.keys( state[payload.corpusId].chunks )
          .reduce( ( result, thatChunkId ) => {
            if ( !payload.chunksIds.includes( thatChunkId ) ) {
              return {
                ...result,
                [thatChunkId]: state[payload.corpusId].chunks[thatChunkId]
              };
            }
            return result;
          }, {} )
      }
    };

  case CREATE_FIELD:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        fields: {
          ...state[payload.corpusId].fields,
          [payload.field.metadata.id]: payload.field
        }
      }
    };

  case UPDATE_FIELD:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        fields: {
          ...state[payload.corpusId].fields,
          [payload.fieldId]: payload.field
        }
      }
    };

  case DELETE_FIELD:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        fields: Object.keys( state[payload.corpusId].fields )
          .reduce( ( result, thatFieldId ) => {
            if ( thatFieldId !== payload.fieldId ) {
              return {
                ...result,
                [thatFieldId]: {
                  ...state[payload.corpusId].fields[thatFieldId]
                }
              };
            }
            return result;
          }, {} ),
        chunks: Object.keys( state[payload.corpusId].chunks ).reduce( ( res, chunkId ) => ( {
          ...res,
          [chunkId]: {
            ...state[payload.corpusId].chunks[chunkId],
            fields: Object.keys( state[payload.corpusId].chunks[chunkId].fields )
              .filter( ( fieldId ) => fieldId !== payload.fieldId )
              .reduce( ( thatRes, fieldId ) => ( {
                ...thatRes,
                [fieldId]: state[payload.corpusId].chunks[chunkId].fields[fieldId]
              } ), {} )
          }
        } ), {} )
      }
    };

  case CREATE_TAG_CATEGORY:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        tagCategories: {
          ...state[payload.corpusId].tagCategories,
          [payload.tagCategory.metadata.id]: payload.tagCategory
        }
      }
    };

  case UPDATE_TAG_CATEGORY:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        tagCategories: {
          ...state[payload.corpusId].tagCategories,
          [payload.tagCategoryId]: payload.tagCategory
        }
      }
    };

  case DELETE_TAG_CATEGORY:
    const tagCategories = state[payload.corpusId].tagCategories;
    const tagsToRemove = [];
    // remove related tags
    const newTags = Object.keys( state[payload.corpusId].tags )
      .filter( ( tagId ) => {
        const toKeep = state[payload.corpusId].tags[tagId].tagCategoryId !== payload.tagCategoryId;
        if ( !toKeep ) {
          tagsToRemove.push( tagId );
        }
        return toKeep;
      } )
      .reduce( ( res, tagId ) => ( {
        ...res,
        [tagId]: state[payload.corpusId].tags[tagId]
      } ), {} );
      // update chunks
    newChunks = state[payload.corpusId].chunks;
    newChunks = Object.keys( newChunks ).reduce( ( res, chunkId ) => ( {
      ...res,
      [chunkId]: {
        ...newChunks[chunkId],
        tags: newChunks[chunkId].tags.filter( ( t ) => tagsToRemove.indexOf( t ) === -1 )
      }
    } ), {} );
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        chunks: newChunks,
        tags: newTags,
        tagCategories: Object.keys( tagCategories )
          .reduce( ( result, thatCatId ) => {
            if ( thatCatId !== payload.tagCategoryId ) {
              return {
                ...result,
                [thatCatId]: {
                  ...tagCategories[thatCatId]
                }
              };
            }
            return result;
          }, {} )
      }
    };

  case CREATE_TAG:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        tags: {
          ...state[payload.corpusId].tags,
          [payload.tag.metadata.id]: payload.tag
        }
      }
    };

  case UPDATE_TAG:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        tags: {
          ...state[payload.corpusId].tags,
          [payload.tagId]: payload.tag
        }
      }
    };

  case DELETE_TAG:
    newChunks = state[payload.corpusId].chunks;
    newChunks = Object.keys( newChunks ).reduce( ( res, chunkId ) => ( {
      ...res,
      [chunkId]: {
        ...newChunks[chunkId],
        tags: newChunks[chunkId].tags.filter( ( t ) => t !== payload.tagId )
      }
    } ), {} );
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        chunks: newChunks,
        tags: Object.keys( state[payload.corpusId].tags ).reduce( ( result, thatTagId ) => {
          if ( thatTagId !== payload.tagId ) {
            return {
              ...result,
              [thatTagId]: state[payload.corpusId].tags[thatTagId]
            };
          }
          return result;
        }, {} )
      }
    };

  case SET_MEDIA_DURATION:
    return {
      ...state,
      [payload.corpusId]: {
        ...state[payload.corpusId],
        medias: {
          ...state[payload.corpusId].medias,
          [payload.mediaId]: {
            ...state[payload.corpusId].medias[payload.mediaId],
            duration: payload.duration
          }
        }
      }
    };

  default:
    return state;
  }
}

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Action creators
 * ===========
 * ===========
 * ===========
 * ===========
 */

export const getCorpora = () => ( {
  type: GET_CORPORA,
  promise: () => {
    return requestCorpora();
  }
} );

export const getCorpus = ( corpusId ) => ( {
  type: GET_CORPUS,
  promise: () => {
    return requestCorpus( corpusId );
  }
} );
export const createCorpus = ( newCorpus ) => {
  const corpus = {
    ...newCorpus,
    metadata: {
      ...newCorpus.metadata,
      createdAt: new Date().getTime(),
      lastModifiedAt: new Date().getTime(),
    }
  };
  return {
    type: CREATE_CORPUS,
    promise: () => {
      return requestCorpusCreation( corpus );
    }
  };
};

export const deleteCorpus = ( corpusId ) => {
  return {
    type: DELETE_CORPUS,
    promise: () => {
      return requestCorpusDeletion( corpusId );
    }
  };
};

export const updateCorpus = ( id, newCorpus ) => {
  const corpus = {
    ...newCorpus,
    metadata: {
      ...newCorpus.metadata,
      lastModifiedAt: new Date().getTime(),
    }
  };
  return {
    type: UPDATE_CORPUS,
    promise: () => {
      return requestCorpusUpdate( corpus.metadata.id, corpus );
    }
  }
};

/**
 * UPDATE CORPUS ACTIONS
 */

const updateCorpusPart = ( action, callback ) => {
  return {
    type: action.type,
    promise: () => {
      return requestCorpusUpdatePart( action, corpora, callback );
    },
    payload: action.payload
  }
}

export const createComposition = ( corpusId, composition ) => updateCorpusPart ( {
  type: CREATE_COMPOSITION,
  payload: {
    corpusId,
    composition: {
      ...composition,
      metadata: {
        ...composition.metadata,
        createdAt: new Date().getTime(),
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const updateComposition = ( corpusId, compositionId, composition ) => updateCorpusPart ( {
  type: UPDATE_COMPOSITION,
  payload: {
    corpusId,
    compositionId,
    composition: {
      ...composition,
      metadata: {
        ...composition.metadata,
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const deleteComposition = ( corpusId, compositionId ) => updateCorpusPart ( {
  type: DELETE_COMPOSITION,
  payload: {
    corpusId,
    compositionId
  }
} );

export const duplicateComposition = ( corpusId, composition ) => updateCorpusPart ( {
  type: DUPLICATE_COMPOSITION,
  payload: {
    corpusId,
    composition
  }
} );

export const createMedia = ( corpusId, media ) => updateCorpusPart ( {
  type: CREATE_MEDIA,
  payload: {
    corpusId,
    media: {
      ...media,
      metadata: {
        ...media.metadata,
        createdAt: new Date().getTime(),
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const updateMedia = ( corpusId, mediaId, media ) => updateCorpusPart ( {
  type: UPDATE_MEDIA,
  payload: {
    corpusId,
    mediaId,
    media: {
      ...media,
      metadata: {
        ...media.metadata,
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const setMediaDuration = ( corpusId, mediaId, duration ) => updateCorpusPart ( {
  type: SET_MEDIA_DURATION,
  payload: { corpusId, mediaId, duration }
} );

export const deleteMedia = ( corpusId, mediaId ) => updateCorpusPart ( {
  type: DELETE_MEDIA,
  payload: {
    corpusId,
    mediaId
  }
} );

export const createChunk = ( corpusId, chunk ) => updateCorpusPart ( {
  type: CREATE_CHUNK,
  payload: {
    corpusId,
    chunk: {
      ...chunk,
      metadata: {
        ...chunk.metadata,
        createdAt: new Date().getTime(),
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const createChunks = ( corpusId, chunks ) => updateCorpusPart ( {
  type: CREATE_CHUNKS,
  payload: {
    corpusId,
    chunks
  }
} );

export const updateChunk = ( corpusId, chunkId, chunk ) => updateCorpusPart ( {
  type: UPDATE_CHUNK,
  payload: {
    corpusId,
    chunkId,
    chunk: {
      ...chunk,
      metadata: {
        ...chunk.metadata,
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const deleteChunk = ( corpusId, chunkId, callback ) => updateCorpusPart ( {
  type: DELETE_CHUNK,
  payload: {
    corpusId,
    chunkId
  }
}, callback );

export const deleteChunks = ( corpusId, chunksIds, callback ) => updateCorpusPart ( {
  type: DELETE_CHUNKS,
  payload: {
    corpusId,
    chunksIds
  }
}, callback );

export const createField = ( corpusId, field ) => updateCorpusPart ( {
  type: CREATE_FIELD,
  payload: {
    corpusId,
    field: {
      ...field,
      metadata: {
        ...field.metadata,
        createdAt: new Date().getTime(),
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const updateField = ( corpusId, fieldId, field ) => updateCorpusPart ( {
  type: UPDATE_FIELD,
  payload: {
    corpusId,
    fieldId,
    field: {
      ...field,
      metadata: {
        ...field.metadata,
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const deleteField = ( corpusId, fieldId ) => updateCorpusPart ( {
  type: DELETE_FIELD,
  payload: {
    corpusId,
    fieldId
  }
} );

export const createTagCategory = ( corpusId, tagCategory ) => updateCorpusPart ( {
  type: CREATE_TAG_CATEGORY,
  payload: {
    corpusId,
    tagCategory: {
      ...tagCategory,
      metadata: {
        ...tagCategory.metadata,
        createdAt: new Date().getTime(),
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const updateTagCategory = ( corpusId, tagCategoryId, tagCategory ) => updateCorpusPart ( {
  type: UPDATE_TAG_CATEGORY,
  payload: {
    corpusId,
    tagCategoryId,
    tagCategory: {
      ...tagCategory,
      metadata: {
        ...tagCategory.metadata,
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const deleteTagCategory = ( corpusId, tagCategoryId ) => updateCorpusPart ( {
  type: DELETE_TAG_CATEGORY,
  payload: {
    corpusId,
    tagCategoryId
  }
} );

export const createTag = ( corpusId, tag ) => updateCorpusPart ( {
  type: CREATE_TAG,
  payload: {
    corpusId,
    tag: {
      ...tag,
      metadata: {
        ...tag.metadata,
        createdAt: new Date().getTime(),
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const updateTag = ( corpusId, tagId, tag ) => updateCorpusPart ( {
  type: UPDATE_TAG,
  payload: {
    corpusId,
    tagId,
    tag: {
      ...tag,
      metadata: {
        ...tag.metadata,
        lastModifiedAt: new Date().getTime(),
      }
    }
  }
} );

export const deleteTag = ( corpusId, tagId ) => updateCorpusPart ( {
  type: DELETE_TAG,
  payload: {
    corpusId,
    tagId
  }
} );

export const getChunkViewData = ( payload ) => ( {
  type: GET_CHUNK_VIEW_DATA,
  promise: () => {
    return requestChunkViewData( payload.corpusId, payload.mediaId );
  },
  payload
} );

export const forgetData = ( ) => ( {
  type: FORGET_DATA,
} );

export const setRgpdAgreementPrompted = ( payload ) => ( {
  type: SET_RGPD_AGREEMENT_PROMPTED,
  payload
} )

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Exported reducer
 * ===========
 * ===========
 * ===========
 * ===========
 */
const utils = ( state = {}, action ) => {
  switch ( action.type ) {
  case 'REDUX_I18N_SET_LANGUAGE':
    if ( inElectron ) {
      electronStore.set( '§dicto-lang', action.lang );
    }
    return state;
  case SET_RGPD_AGREEMENT_PROMPTED:
    return {
      rgpdAgreementPrompted: action.payload,
    }
  default:
    return state;
  }
}

/**
 * The module exports a reducer
 */
export default combineReducers( {
  corpora,
  utils,
} );

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Selectors
 * ===========
 * ===========
 * ===========
 * ===========
 */
/**
 * Selectors related to the feature
 */
const allCorpora = ( data ) => data.corpora;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector( {
  corpora: allCorpora,
} );
