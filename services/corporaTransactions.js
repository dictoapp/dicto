const electron = require( 'electron' );
const path = require( 'path' );
const {
  ensureDir,
  writeFile,
  readdir,
  readFile,
  remove,
  lstatSync,
  createWriteStream,
  copy,
} = require( 'fs-extra' );
const archiver = require( 'archiver' );

const reducer = require( './storiesDuck' );

const userDataPath = ( electron.app || electron.remote.app ).getPath( 'userData' );

const contentPath = path.join( userDataPath, '/corpora' );

ensureDir( contentPath );

const getCorpora = () => {
  return new Promise( ( resolve, reject ) => {
    readdir( contentPath )
      .then( ( files ) => {
        const parseFile = ( dirName ) => {
          const jsonPath = path.join( contentPath, `${dirName}/${dirName}.json` );
          return new Promise( ( resolveThat, rejectThat ) => {
            return readFile( jsonPath, 'utf8' )
              .then( ( str ) => {
                try {
                  return resolveThat( [ dirName, JSON.parse( str ) ] );
                }
                catch ( error ) {
                  rejectThat( error );
                }
              } )
              .catch( rejectThat );
          } );
        };
        const filesToParse = files.filter( ( f ) => lstatSync( `${contentPath}/${f}` ).isDirectory() );
        return Promise.all( filesToParse.map( parseFile ) );
      } )
      .then( ( couples ) => {
        const corpora = couples.reduce( ( result, couple ) => Object.assign( result, {
          [couple[0]]: couple[1]
        } ), {} );

        resolve( { corpora } );
      } )
      .catch( ( e ) => {
        console.log( e );/* eslint no-console: 0 */
        reject( e );
      } );
  } );
};

const createCorpus = ( { corpusId, corpus } ) => {
  return new Promise( ( resolve, reject ) => {

    const dirPath = `${contentPath}/${corpusId}`;
    ensureDir( dirPath )
      .then( () =>
        writeFile( `${dirPath}/${corpusId}.json`, JSON.stringify( corpus ), 'utf8' )
      )
      .then( () => resolve( { corpusId, corpus } ) )
      .catch( ( error ) => reject( { corpusId, error } ) );
  } );
};

const getCorpus = ( { corpusId } ) =>
  new Promise( ( resolve, reject ) => {
    const jsonPath = path.join( contentPath, `${corpusId}/${corpusId}.json` );
    return readFile( jsonPath, 'utf8' )
      .then( ( str ) => {
        try {
          return resolve( { corpus: JSON.parse( str ) } );
        }
        catch ( error ) {
          return reject( error );
        }
      } )
      .catch( reject );
  } );

const updateCorpus = ( { corpusId, corpus } ) => {
  return new Promise( ( resolve, reject ) => {
    const thatPath = `${contentPath}/${corpusId}/${corpusId}.json`;
    writeFile( thatPath, JSON.stringify( corpus ), 'utf8' )
      .then( () => {
        return resolve( { corpusId, corpus } );
      } )
      .catch( ( error ) =>
        reject( { corpusId, error } )
      );
  } );
};

const updateCorpusPart = ( { action } ) => {
  return new Promise( ( resolve, reject ) => {
    const corpusId = action.payload.corpusId;
    getCorpus( { corpusId } )
      .then( ( { corpus } ) => {
        const state = {
          [corpus.metadata.id]: corpus
        }
        const newState = reducer( state, action );
        const newCorpus = newState[corpus.metadata.id];
        const thatPath = `${contentPath}/${corpusId}/${corpusId}.json`;
        writeFile( thatPath, JSON.stringify( newCorpus ), 'utf8' )
      } )
      .then( () => {
        return resolve( { corpusId, corpus } );
      } )
      .catch( ( error ) => {
        reject( { corpusId, error } )
      }
      );
  } );
};

const deleteCorpus = ( { corpusId } ) => {
  return new Promise( ( resolve, reject ) => {
    const thatPath = `${contentPath}/${corpusId}`;
    remove( thatPath )
      .then( () => getCorpora() )
      .then( ( data ) => resolve( data ) )
      // .then( () => resolve( { corpusId } ) )
      .catch( ( error ) => reject( { corpusId, error } ) )
  } );
};

const packCorpus = ( {
  html = '',
  filename = 'dicto-corpus.zip',
  mediasToSave = [],
} ) => new Promise( ( resolve ) => {
  const tempPath = path.join( userDataPath, '/temp' );
  ensureDir( tempPath )
    .then( () => ensureDir( `${tempPath}/medias` ) )
    .then( () => writeFile( `${tempPath}/index.html`, html, 'utf8' ) )
    .then( () => {
      return mediasToSave.reduce( ( cur, mediaPath ) => {
        const mediaFileName = mediaPath.split( '/' ).pop();
        const source = mediaPath.slice( 'file://'.length );
        const target = `${tempPath}/medias/${mediaFileName}`;
        return cur
          .then( () => copy( source, target ) );
      }
        , Promise.resolve() );
    } )
    .then( () => {
      return new Promise( ( resolve1, reject1 ) => {
        const output = createWriteStream( filename );
        const archive = archiver( 'zip', {
          zlib: { level: 9 } // Sets the compression level.
        } );

        output.on( 'finish', function() {
          return resolve1();
        } );

        /*
         * listen for all archive data to be written
         * 'close' event is fired only when a file descriptor is involved
         */
        output.on( 'close', function() {

        /*
         * console.log(archive.pointer() + ' total bytes');
         * console.log('archiver has been finalized and the output file descriptor has closed.');
         */
          return resolve1();
        } );

        /*
         * This event is fired when the data source is drained no matter what was the data source.
         * It is not part of this library but rather from the NodeJS Stream API.
         * @see: https://nodejs.org/api/stream.html#stream_event_end
         */
        output.on( 'end', function() {
        // console.log('Data has been drained');
          return resolve1();
        } );

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on( 'warning', function( err ) {
          if ( err.code === 'ENOENT' ) {
          // log warning
            console.warn( err );/* eslint no-console : 0 */
          }
          else {
          // throw error
            reject1( err );
          }
        } );

        // good practice to catch this error explicitly
        archive.on( 'error', function( err ) {
          reject1( err );
        } );

        // pipe archive data to the file
        archive.pipe( output );

        archive.directory( tempPath, false );
        archive.finalize();
      } );

    } )

    .then( () => remove( tempPath ) )
    .then( resolve )
    .catch( ( e ) => console.log( e ) );/* eslint no-console : 0 */
} );

module.exports = {
  getCorpus,
  createCorpus,
  updateCorpus,
  updateCorpusPart,
  deleteCorpus,
  getCorpora,
  packCorpus,
};