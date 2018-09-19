
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

const SET_MEDIA_DURATION = '§dicto/ChunksEdition/SET_MEDIA_DURATION';

const GET_CORPORA = '§dicto/data/GET_CORPORA';

const GET_CORPUS = '§dicto/data/GET_CORPUS';
const CREATE_CORPUS = '§dicto/data/CREATE_CORPUS';
const UPDATE_CORPUS = '§dicto/data/UPDATE_CORPUS';
const DELETE_CORPUS = '§dicto/data/DELETE_CORPUS';

const CREATE_COMPOSITION = '§dicto/data/CREATE_COMPOSITION';
const UPDATE_COMPOSITION = '§dicto/data/UPDATE_COMPOSITION';
const DELETE_COMPOSITION = '§dicto/data/DELETE_COMPOSITION';
const DUPLICATE_COMPOSITION = '§dicto/data/DUPLICATE_COMPOSITION';

const CREATE_MEDIA = '§dicto/data/CREATE_MEDIA';
const UPDATE_MEDIA = '§dicto/data/UPDATE_MEDIA';
const DELETE_MEDIA = '§dicto/data/DELETE_MEDIA';

const CREATE_CHUNK = '§dicto/data/CREATE_CHUNK';
const CREATE_CHUNKS = '§dicto/data/CREATE_CHUNKS';
const UPDATE_CHUNK = '§dicto/data/UPDATE_CHUNK';
const DELETE_CHUNK = '§dicto/data/DELETE_CHUNK';

const CREATE_FIELD = '§dicto/data/CREATE_FIELD';
const UPDATE_FIELD = '§dicto/data/UPDATE_FIELD';
const DELETE_FIELD = '§dicto/data/DELETE_FIELD';

const CREATE_TAG_CATEGORY = '§dicto/data/CREATE_TAG_CATEGORY';
const UPDATE_TAG_CATEGORY = '§dicto/data/UPDATE_TAG_CATEGORY';
const DELETE_TAG_CATEGORY = '§dicto/data/DELETE_TAG_CATEGORY';

const CREATE_TAG = '§dicto/data/CREATE_TAG';
const UPDATE_TAG = '§dicto/data/UPDATE_TAG';
const DELETE_TAG = '§dicto/data/DELETE_TAG';

const GET_CHUNK_VIEW_DATA = '§dicto/ChunksEdition/GET_CHUNK_VIEW_DATA';
const FORGET_DATA = '§dicto/ChunksEdition/FORGET_DATA';

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
module.exports =  function( state = CORPUSES_DEFAULT_STATE, action ) {
  const payload = action.payload;
  let newChunks;
  let newCorpus;
  switch ( action.type ) {

  case `${GET_CORPUS}_SUCCESS`:
    newCorpus = action.result.data.corpus;
    return Object.assign( {}, state, {
      [newCorpus.metadata.id]: newCorpus
    } );
  case `${GET_CHUNK_VIEW_DATA}_SUCCESS`:
    return Object.assign( {}, state, {
      [action.result.data.metadata.id]: action.result.data
    } );
  case FORGET_DATA:
    return {};

  case UPDATE_CORPUS:
    if ( payload && payload.corpus ) {
      return Object.assign( {}, state, {
        [payload.id]: payload.corpus
      } );
    }
    return state;
  case `${UPDATE_CORPUS}_SUCCESS`:
    newCorpus = action.result.data.corpus;
    return Object.assign( {}, state, {
      [newCorpus.metadata.id]: newCorpus
    } );

  case CREATE_COMPOSITION:
    return Object.assign(
      {}, 
      state, 
      {
        [payload.corpusId]: Object.assign(
          {}, 
          state[payload.corpusId],
          {
            compositions: Object.assign(
              {},
              state[payload.corpusId].compositions,
              {
                [payload.composition.metadata.id]: payload.composition
              }
            )
          }
        )
      } );

  case UPDATE_COMPOSITION:
    return Object.assign(
      {}, 
      state, 
      {
        [payload.corpusId]: Object.assign(
          {}, 
          state[payload.corpusId],
          {
            compositions: Object.assign(
              {},
              state[payload.corpusId].compositions,
              {
                [payload.composition.metadata.id]: payload.composition
              }
            )
          }
        )
      }
    );

  case DELETE_COMPOSITION:
    return Object.assign(
      {},
      state,
      {
        [payload.corpusId]: Object.assign(
          {},
          state[payload.corpusId],
          {
            compositions: Object.keys( state[payload.corpusId].compositions )
              .reduce( ( result, thatCompositionId ) => {
                if ( thatCompositionId !== payload.compositionId ) {
                  return Object.assign( result, {
                    [thatCompositionId]: Object.assign( {}, state[payload.corpusId].compositions[thatCompositionId] )
                  } );
                }
                return result;
              }, {} )
          }
        )
      }
    )

  case DUPLICATE_COMPOSITION:
    const composition = JSON.parse( JSON.stringify( payload.composition ) );
    composition.metadata.id = genId();
    return Object.assign(
      {},
      state,
      {
        [payload.corpusId]: Object.assign(
          {},
          state[payload.corpusId],
          {
            compositions: Object.assign(
              {},
              state[payload.corpusId].compositions,              
              {
                [composition.metadata.id]: composition
              }
            )
          }
        )
      }
    );

  case CREATE_MEDIA:
    return Object.assign(
      {},
      state,
      {
        [payload.corpusId]: Object.assign(
          {},
          state[payload.corpusId],
          {
            medias: Object.assign(
              {},
              state[payload.corpusId].medias,
              {
                [payload.media.metadata.id]: payload.media
              }
            )
          }
        )
      }
    );

  case UPDATE_MEDIA:
    return Object.assign( {}, state, {
      [payload.corpusId]: Object.assign(
        {},
        state[payload.corpusId],
        {
          medias: Object.assign(
            {},
            state[payload.corpusId].medias,
            {
              [payload.mediaId]: payload.media
            }
          )
        }
      )
    } );

  case DELETE_MEDIA:
    const mediaId = payload.mediaId;
    const chunksList = mapToArray( state[payload.corpusId].chunks );

    const chunksToKeep = chunksList
      .filter( ( c ) => c.metadata.mediaId !== mediaId );
    const chunks = chunksToKeep
      .reduce( ( res, chunk ) => Object.assign( {}, res, {
        [chunk.metadata.id]: chunk
      } ), {} );

    const chunksToDelete = chunksList
      .filter( ( c ) => c.metadata.mediaId === mediaId );
    const chunksToDeleteId = chunksToDelete.map( ( c ) => c.metadata.id );
    // filter delete chunks in compositions
    const compositions = Object.keys( state[payload.corpusId].compositions )
      .reduce( ( result, compositionId ) => {
        return Object.assign( {}, result, {
          [compositionId]: Object.assign(
            {},
            state[payload.corpusId].compositions[compositionId],
            {
              summary: state[payload.corpusId]
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
            }
          )
        } );
      }, {} );
    return Object.assign( {}, state, {
      [payload.corpusId]: Object.assign(
        {},
        state[payload.corpusId],
        {
          medias: Object.keys( state[payload.corpusId].medias )
            .reduce( ( result, thatMediaId ) => {
              if ( thatMediaId !== mediaId ) {
                return Object.assign( {}, result, {
                  [thatMediaId]: state[payload.corpusId].medias[thatMediaId]
                } );
              }
              return result;
            }, {} ),
          chunks,
          compositions
        }
      )
    } );

  case CREATE_CHUNK:
    return Object.assign(
      {},
      state,
      {
        [payload.corpusId]: Object.assign(
          {},
          state[payload.corpusId],
          {
            chunks: Object.assign(
              {},
              state[payload.corpusId].chunks,
              {
                [payload.chunk.metadata.id]: payload.chunk
              }
            )
          }
        )
      }
    );
  case CREATE_CHUNKS:
    return Object.assign(
      {},
      state,
      {
        [payload.corpusId]: Object.assign(
          {},
          state[payload.corpusId],
          {
            chunks: Object.assign(
              {},
              state[payload.corpusId].chunks,
              payload.chunks.reduce( ( result, chunk ) => 
                Object.assign(
                  {}, 
                  result, 
                  {
                    [chunk.metadata.id]: chunk
                  } 
                ), {} )
            )
          }
        )
      }
    );

  case UPDATE_CHUNK:
    return Object.assign(
      {},
      state,
      {
        [payload.corpusId]: Object.assign(
          {},
          state[payload.corpusId],
          {
            chunks: Object.assign(
              {}, 
              state[payload.corpusId].chunks,
              {
                [payload.chunkId]: payload.chunk
              }
            )
          }
        )
      }
    );

  case DELETE_CHUNK:
    return Object.assign(
      {},
      state,
      {
        [payload.corpusId]: Object.assign(
          {},
          state[payload.corpusId],
          {
            chunks: Object.keys( state[payload.corpusId].chunks )
              .reduce( ( result, thatChunkId ) => {
                if ( thatChunkId !== payload.chunkId ) {
                  return Object.assign( {}, result, {
                    [thatChunkId]: state[payload.corpusId].chunks[thatChunkId]
                  } );
                }
                return result;
              }, {} )
          }
        )
      }
    );

  case CREATE_FIELD:
    return Object.assign(
      {},
      state,
      {
        [payload.corpusId]: Object.assign(
          {}, 
          state[payload.corpusId],
          {
            fields: Object.assign(
              {},
              state[payload.corpusId].fields,
              {
                [payload.field.metadata.id]: payload.field
              }
            )
          }
        )
      }
    );

  case UPDATE_FIELD:
    return Object.assign( {}, state, {
      [payload.corpusId]: Object.assign(
        {},
        state[payload.corpusId],
        {
          fields: Object.assign(
            {},
            state[payload.corpusId].fields,
            {
              [payload.fieldId]: payload.field
            }
          )
        }
      )
    } );

  case DELETE_FIELD:
    return Object.assign(
      {}, 
      state, 
      {
        [payload.corpusId]: Object.assign(
          {},
          state[payload.corpusId],
          {
            fields: Object.keys( state[payload.corpusId].fields )
              .reduce( ( result, thatFieldId ) => {
                if ( thatFieldId !== payload.fieldId ) {
                  return Object.assign( {}, result, {
                    [thatFieldId]: Object.assign( {}, state[payload.corpusId].fields[thatFieldId] )
                  } );
                }
                return result;
              }, {} ),
            chunks: Object.keys( state[payload.corpusId].chunks ).reduce( ( res, chunkId ) => Object.assign( {}, res, {
              [chunkId]: Object.assign(
                {},
                state[payload.corpusId].chunks[chunkId],
                {
                  fields: Object.keys( state[payload.corpusId].chunks[chunkId].fields )
                    .filter( ( fieldId ) => fieldId !== payload.fieldId )
                    .reduce( ( thatRes, fieldId ) => Object.assign( {}, thatRes, {
                      [fieldId]: state[payload.corpusId].chunks[chunkId].fields[fieldId]
                    } ), {} )
                }
              )
            } ), {} )
          } )
      } );

  case CREATE_TAG_CATEGORY:
    return Object.assign( {}, state, {
      [payload.corpusId]: Object.assign(
        {},
        state[payload.corpusId],
        {
          tagCategories: Object.assign(
            {}, 
            state[payload.corpusId].tagCategories,
            {
              [payload.tagCategory.metadata.id]: payload.tagCategory
            }
          )
        }
      )
    } );

  case UPDATE_TAG_CATEGORY:
    return Object.assign( {}, state, {
      [payload.corpusId]: Object.assign(
        {},        
        state[payload.corpusId],
        {
          tagCategories: Object.assign(
            {},
            state[payload.corpusId].tagCategories,
            {
              [payload.tagCategoryId]: payload.tagCategory
            }
          )
        }
      )
    } );

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
      .reduce( ( res, tagId ) => Object.assign( {}, res, {
        [tagId]: state[payload.corpusId].tags[tagId]
      } ), {} );
      // update chunks
    newChunks = state[payload.corpusId].chunks;
    newChunks = Object.keys( newChunks ).reduce( ( res, chunkId ) => Object.assign( {}, res, {
      [chunkId]: Object.assign( {}, newChunks[chunkId], {
        tags: newChunks[chunkId].tags.filter( ( t ) => tagsToRemove.indexOf( t ) === -1 )
      } )
    } ), {} );
    return Object.assign( {}, state, {
      [payload.corpusId]: Object.assign(
        {},
        state[payload.corpusId],
        {
          chunks: newChunks,
          tags: newTags,
          tagCategories: Object.keys( tagCategories )
            .reduce( ( result, thatCatId ) => {
              if ( thatCatId !== payload.tagCategoryId ) {
                return Object.assign( {}, result, {
                  [thatCatId]: Object.assign( {}, tagCategories[thatCatId] )
                } );
              }
              return result;
            }, {} )
        } )
    } );

  case CREATE_TAG:
    return Object.assign( {}, state, {
      [payload.corpusId]: Object.assign(
        {},        
        state[payload.corpusId],
        {
          tags: Object.assign(
            {},
            state[payload.corpusId].tags,
            {
              [payload.tag.metadata.id]: payload.tag
            }
          )
        }
      )
    } );

  case UPDATE_TAG:
    return Object.assign( {}, state, {
      [payload.corpusId]: Object.assign( {}, 
        state[payload.corpusId],
        {
          tags: Object.assign( {}, 
            state[payload.corpusId].tags,
            {
              [payload.tagId]: payload.tag
            }
          )
        }
      )
    } );

  case DELETE_TAG:
    newChunks = state[payload.corpusId].chunks;
    newChunks = Object.keys( newChunks ).reduce( ( res, chunkId ) => 
      Object.assign(
        {},
        res,
        {
          [chunkId]: Object.assign(
            {},            
            newChunks[chunkId],
            {
              tags: newChunks[chunkId].tags.filter( ( t ) => t !== payload.tagId )
            } )
        }
      )
      , {} );
    return Object.assign(
      {}, 
      state, 
      {
        [payload.corpusId]: Object.assign(
          {},          
          state[payload.corpusId],
          {
            chunks: newChunks,
            tags: Object.keys( state[payload.corpusId].tags ).reduce( ( result, thatTagId ) => {
              if ( thatTagId !== payload.tagId ) {
                return Object.assign( {}, result, {
                  [thatTagId]: state[payload.corpusId].tags[thatTagId]
                } );
              }
              return result;
            }, {} )
          }
        )
      }
    );

  case SET_MEDIA_DURATION:
    return Object.assign(
      {},
      state,
      {
        [payload.corpusId]: Object.assign(
          {},
          state[payload.corpusId],
          {
            medias: Object.assign(
              {},
              state[payload.corpusId].medias,
              {
                [payload.mediaId]: Object.assign(
                  {},
                  state[payload.corpusId].medias[payload.mediaId],
                  {
                    duration: payload.duration
                  }
                ) 
              }
            )
          }
        )
      }
    );

  default:
    return state;
  }
}