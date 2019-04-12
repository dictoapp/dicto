import { flatten, uniq } from 'lodash';
import { inElectron, default as requestToMain } from './electronUtils';

const queryPouchDb = ( method, query, key ) => {
  return new Promise( ( resolve, reject ) => {
    db[method]( query )
      .then( ( data ) => {
        resolve( {
          data: {
            [key]: data,
            success: true
          }
        } )
      } )
      .catch( reject )
  } );
}

export const requestCorpora = () => {
  if ( inElectron ) {
    return requestToMain( 'get-corpora' );
  }
  else {
    return queryPouchDb( 'get', 'corpora-list', 'corpora' );
  }
};

export const requestCorpus = ( corpusId ) => {
  if ( inElectron ) {
    return requestToMain( 'get-corpus', { corpusId } );
  }
  else {
    return queryPouchDb( 'get', corpusId, 'corpus' );
  }
}

const buildChunkViewData = ( corpus, mediaId ) => {
  const medias = Object.keys( corpus.medias ).reduce( ( res, thatMediaId ) => {
    const relatedChunksIds = Object.keys( corpus.chunks ).filter( ( chunkId ) => {
      return corpus.chunks[chunkId].metadata.mediaId === thatMediaId;
    } );

    const relatedTagsIds = uniq(
      flatten(
        relatedChunksIds.map( ( chunkId ) => corpus.chunks[chunkId].tags )
      )
    );

    return {
      ...res,
      [thatMediaId]: {
        ...corpus.medias[thatMediaId],
        stats: {
          chunksCount: relatedChunksIds.length,
          tagsCount: relatedTagsIds.length,
        }
      }
    };
  }, {} );
  const chunks = Object.keys( corpus.chunks ).filter( ( chunkId ) => 
    corpus.chunks[chunkId].metadata.mediaId === mediaId
  ).reduce( ( res, chunkId ) => ( {
    ...res,
    [chunkId]: corpus.chunks[chunkId]
  } ), {} );
  return {
    metadata: corpus.metadata,
    fields: corpus.fields,
    tagCategories: corpus.tagCategories,
    tags: corpus.tags,
    medias,
    chunks,
  }
}

export const requestChunkViewData = ( corpusId, mediaId ) => {
  if ( inElectron ) {
    return new Promise( ( resolve, reject ) => {
      requestToMain( 'get-corpus', { corpusId } )
        .then( ( { data: { corpus } } ) => {
          const data = buildChunkViewData( corpus, mediaId );
          resolve( {
            data,
            success: true,
          } )
        } )
        .catch( reject );
    } );
  }
  else {
    return new Promise( ( resolve, reject ) => {
      queryPouchDb( 'get', corpusId, 'corpus' )
        .then( ( { data: { corpus } } ) => {
          const data = buildChunkViewData( corpus, mediaId );
          resolve( {
            data,
            success: true,
          } )
        } )
        .catch( reject );
    } );
  }
}

export const requestCorpusCreation = ( corpus ) => {
  if ( inElectron ) {
    return requestToMain( 'create-corpus', { corpusId: corpus.metadata.id, corpus } );
  }
  else {
    const toDb = {
      ...corpus,
      _id: corpus.metadata.id,
    };
    delete toDb._rev;
    return new Promise( ( resolve, reject ) => {
      Promise.resolve()
        .then( () => db.put( toDb ) )
        .then( () => {
          return new Promise( ( res1, rej1 ) => {
            db.get( 'corpora-list' )
              .then( ( corporaList ) => {
                const newCorporaList = {
                  ...corporaList,
                  [corpus.metadata.id]: toDb
                }
                db.put( newCorporaList )
                  .then( res1 )
                  .catch( rej1 )

              } )
              .catch( () => {
                const newCorporaList = {
                  _id: 'corpora-list',
                  [corpus.metadata.id]: toDb
                }
                db.put( newCorporaList )
                  .then( res1 )
                  .catch( rej1 )
              } )
          } )
        } )
        .then( () => {
          return resolve( { data: {
            corpus: toDb,
            success: true
          } } )
        } )
        .catch( reject )
    } )
  }
}

export const requestCorpusDeletion = ( corpusId ) => {
  if ( inElectron ) {
    return requestToMain( 'delete-corpus', { corpusId } );
  }
  else {
    return new Promise( ( resolve, reject ) => {
      let newCorporaList;
      db.get( corpusId )
        .then( ( { _rev } ) => db.remove( corpusId, _rev ) )
        .then( () => {
          return new Promise( ( res1, rej1 ) => {
            db.get( 'corpora-list' )
              .then( ( corporaList ) => {
                newCorporaList = Object.keys( corporaList ).reduce( ( res, id ) => {
                  if ( id === corpusId ) {
                    return res;
                  }
                  return {
                    ...res,
                    [id]: corporaList[id]
                  }
                }, {} );
                db.put( newCorporaList )
                  .then( res1 )
                  .catch( rej1 )

              } )
              .catch( () => {
                newCorporaList = {
                  _id: 'corpora-list',
                }
                db.put( newCorporaList )
                  .then( res1 )
                  .catch( rej1 )
              } )
          } )
        } )
        .then( () => {
          return resolve( { data: {
            success: true,
            corpora: newCorporaList
          } } )
        } )
        .catch( reject )
    } )
  }
}

const updateCorpusPartInDb = ( action, reducer, callback ) => {
  return new Promise( ( resolve, reject ) => {
    let newCorporaList;
    let newCorpus;
    db.get( action.payload.corpusId )
      .then( ( updatedCorpus ) => {
        const state = {
          [updatedCorpus.metadata.id]: updatedCorpus
        };
        const newState = reducer( state, action );
        newCorpus = newState[updatedCorpus.metadata.id];
        return db.put( newCorpus );
      } )
      .then( () => {
        return new Promise( ( res1, rej1 ) => {
          db.get( 'corpora-list' )
            .then( ( corporaList ) => {
              newCorporaList = {
                ...corporaList,
                [newCorpus.metadata.id]: newCorpus
              }
              db.put( newCorporaList )
                .then( res1 )
                .catch( rej1 )

            } )
            .catch( () => {
              newCorporaList = {
                _id: 'corpora-list',
                [newCorpus.metadata.id]: newCorpus
              }
              db.put( newCorporaList )
                .then( res1 )
                .catch( rej1 )
            } )
        } )
      } )
      .then( () => {
        if ( callback ) {
          callback( null, newCorpus );;
        }
        return resolve( { data: {
          success: true,
          id: newCorpus.metadata.id,
          corpus: newCorpus,
        } } )
      } )
      .catch( ( err ) => {
        if ( callback ) {
          callback( err );
        }
        reject( err );
      } )
  } )
}

export const requestCorpusUpdatePart = ( action, reducer, callback ) => {
  if ( inElectron ) {
    return requestToMain( 'update-corpus-part', { action, callback } )
  }
  else {
    return updateCorpusPartInDb( action, reducer, callback );
  }
}

export const requestCorpusUpdate = ( corpusId, corpus ) => {
  if ( inElectron ) {
    return requestToMain( 'update-corpus', { corpusId, corpus } );
  }
  else {
    return new Promise( ( resolve, reject ) => {
      let newCorporaList;
      let newCorpus;
      db.get( corpusId )
        .then( ( { _rev } ) => {
          newCorpus = {
            ...corpus,
            _id: corpusId,
            _rev,
          };
          return db.put( newCorpus );
        } )
        .then( () => {
          return new Promise( ( res1, rej1 ) => {
            db.get( 'corpora-list' )
              .then( ( corporaList ) => {
                newCorporaList = {
                  ...corporaList,
                  [newCorpus.metadata.id]: newCorpus
                }
                db.put( newCorporaList )
                  .then( res1 )
                  .catch( rej1 )

              } )
              .catch( () => {
                newCorporaList = {
                  _id: 'corpora-list',
                  [newCorpus.metadata.id]: newCorpus
                }
                db.put( newCorporaList )
                  .then( res1 )
                  .catch( rej1 )
              } )
          } )
        } )
        .then( () => {
          return resolve( { data: {
            success: true,
            id: newCorpus.metadata.id,
            corpus: newCorpus,
          } } )
        } )
        .catch( reject )
    } )
  }
}