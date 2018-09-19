
/**
 * Wraps a request to electron main process
 */
export default function request( type, payload ) {
  return new Promise( ( resolve, reject ) => {
    global.ipcRequester.send( type, payload, ( err, data ) => {
      if ( err ) {
        reject( err );
        return;
      }
      resolve( { data } );
    } );
  } );
}

export const inElectron = window.process && window.process.versions.hasOwnProperty( 'electron' );

/**
 * Check if corpus contains local media references
 */
export const corpusNeedsBundling = ( corpus ) => {
  return Object
    .keys( corpus.medias )
    .find( ( mediaId ) =>
      corpus.medias[mediaId].metadata.mediaUrl.indexOf( 'file://' ) === 0
    ) !== undefined;
};

const transformCompositionBlockForExport = ( compositionBlock ) => {
  const transformedMedias = [];
  if ( compositionBlock.asides && compositionBlock.asides.length ) {
    const newCompositionBlock = {
      ...compositionBlock,
      asides: compositionBlock.asides.map( ( aside ) => {
        if ( aside.type === 'images' ) {
          return {
            ...aside,
            images: aside.images.map( ( image ) => {
              let url = image.url;
              if ( url.indexOf( 'file://' ) === 0 ) {
                transformedMedias.push( url );
                url = `medias/${url.split( '/' ).pop()}`;
                return {
                  ...image,
                  url
                };
              }
              return image;
            } )
          };
        }
        return aside;
      } )
    };
    return { compositionBlock: newCompositionBlock, transformedMedias };
  }
  return { compositionBlock, transformedMedias };
};

export const transformCorpusForExport = ( corpus ) => {
  let mediasToSave = [];
  const transformedCorpus = {
    ...corpus,
    summary: corpus.summary ? corpus.summary.map( ( inputCompositionBlock ) => {
      const { compositionBlock, transformedMedias } = transformCompositionBlockForExport( inputCompositionBlock );
      if ( transformedMedias.length ) {
        mediasToSave = [ ...mediasToSave, ...transformedMedias ];
      }
      return compositionBlock;
    } ) : corpus.summary,
    compositions: corpus.compositions && Object.keys( corpus.compositions ).reduce( ( res, compositionId ) => {
      const composition = corpus.compositions[compositionId];
      return {
        ...res,
        [composition]: {
          ...composition,
          summary: composition.summary.map( ( inputCompositionBlock ) => {
            const { compositionBlock, transformedMedias } = transformCompositionBlockForExport( inputCompositionBlock );
            if ( transformedMedias.length ) {
              mediasToSave = [ ...mediasToSave, ...transformedMedias ];
            }
            return compositionBlock;
          } )
        }
      };
    }, {} ),
    medias: Object.keys( corpus.medias ).reduce( ( res, mediaId ) => {
      const media = corpus.medias[mediaId];
      let mediaThumbnailUrl = media.metadata.mediaThumbnailUrl;
      if ( mediaThumbnailUrl && mediaThumbnailUrl.length && mediaThumbnailUrl.indexOf( 'file://' === 0 ) ) {
        mediasToSave.push( mediaThumbnailUrl );
        mediaThumbnailUrl = `medias/${mediaThumbnailUrl.split( '/' ).pop()}`;
      }
      if ( media.metadata.mediaUrl.indexOf( 'file://' ) === 0 ) {
        mediasToSave.push( media.metadata.mediaUrl );
        const mediaUrl = `medias/${media.metadata.mediaUrl.split( '/' ).pop()}`;
        return {
          ...res,
          [mediaId]: {
            ...media,
            metadata: {
              ...media.metadata,
              mediaUrl,
              mediaThumbnailUrl,
            }
          }
        };
      }
      return {
        ...res,
        [mediaId]: corpus.medias[mediaId]
      };
    }, {} )
  };
  return {
    mediasToSave,
    transformedCorpus
  };
};
