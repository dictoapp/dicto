import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { get } from 'axios';

import Markdown from '../components/MarkdownPlayer/MarkdownPlayer';
import { secsToSrt } from './utils';

import montageHtml from 'raw-loader!../templates/montage.html';
import corpusHtml from 'raw-loader!../templates/corpus.html';
import { inElectron } from './electronUtils';

const basename = `/${  ( __PUBLIC_URL__ || '' ).split( '/' ).pop()}`;

export const buildCorpusRendering = ( corpus, lang = 'en' ) => {
  const {
    metadata: {
      title
    }
  } = corpus;
  const bundleUrl = inElectron ? 'bundles/corpus-player/bundle.js' : `${basename  }/bundles/corpus-player/bundle.js`;
  return get( bundleUrl )
    .then( ( { data: corpusBundle } ) => {
      return new Promise( ( resolve ) => {
        let finalHtml = corpusHtml;
        const toReplace = {
          title,
          code: corpusBundle,
          data: JSON.stringify( corpus ),
          lang
        };
        for ( const key in toReplace ) {
          const regex = new RegExp( `\\\$\\\{${key}\\\}`, 'g' );
          const match = regex.exec( finalHtml );
          if ( match ) {
            const length = match[0].length;
            const index = match.index;
            finalHtml = finalHtml.substr( 0, index ) + toReplace[key] + finalHtml.substr( index + length );
          }
        }
        resolve( finalHtml );
      } );
    } );
};

export const buildMontage = ( montage, lang = 'en' ) => {
  const {
    metadata: {
      title
    }
  } = montage;

  const bundleUrl = inElectron ? 'bundles/montage-player/bundle.js' : `${basename  }/bundles/montage-player/bundle.js`;
  return get( bundleUrl )
    .then( ( { data: montageBundle } ) => {
      return new Promise( ( resolve ) => {
        let finalHtml = montageHtml;
        const toReplace = {
          title,
          code: montageBundle,
          data: JSON.stringify( montage ),
          lang
        };
        for ( const key in toReplace ) {
          const regex = new RegExp( `\\\$\\\{${key}\\\}`, 'g' );
          const match = regex.exec( finalHtml );
          if ( match ) {
            const length = match[0].length;
            const index = match.index;
            finalHtml = finalHtml.substr( 0, index ) + toReplace[key] + finalHtml.substr( index + length );
          }
        }
        resolve( finalHtml );
      } );
    } );
};

const youtubeIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
const vimeoIdRegex = /vimeo\.com\/([\d]+)/i;
const buildProperSrc = ( media, chunk ) => {
  const url = media.metadata.mediaUrl;
  const start = chunk.start;
  // youtube
  if ( url.includes( 'youtube' ) ) {
    let youtubeId = url.match( youtubeIdRegex );
    youtubeId = youtubeId && youtubeId[1];
    if ( youtubeId ) {
      return `https://www.youtube.com/embed/${youtubeId}?start=${start}`;
    }
  }
  // vimeo
  else if ( url.includes( 'vimeo' ) ) {
    let vimeoId = url.match( vimeoIdRegex );
    vimeoId = vimeoId && vimeoId[1];
    if ( vimeoId ) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
  }
  return media.metadata.mediaUrl;
};

export const buildCompositionAsStaticHtml = ( composition, corpus ) => {
  const { summary } = composition;
  const StaticComposition = [
    // header
    (
      <div key={ 'title' }>
        <h1>{composition.metadata.title}</h1>
        <div>
          <Markdown src={ composition.metadata.description } />
        </div>
      </div>
    ),
    // blocks
    [
      ...summary.map( ( block, index ) => {
        if ( block.blockType === 'chunk' ) {
          const chunk = corpus.chunks[block.content];
          const activeFieldId = block.activeFieldId || Object.keys( chunk.fields )[0];
          const content = chunk.fields[activeFieldId];
          const media = corpus.medias[chunk.metadata.mediaId];
          const properSrc = buildProperSrc( media, chunk );
          return (
            <src key={ index }>
              <iframe src={ properSrc } />
              <blockquote
                cite={ media.mediaUrl }
              >
                <Markdown src={ content } />
                <footer>
                  <a
                    target={ 'blank' }
                    href={ media.mediaUrl }
                  >
                    {media.title}
                  </a>{', '}{secsToSrt( chunk.start )}{' - '}{secsToSrt( chunk.end )}
                </footer>
              </blockquote>
            </src>
          );
        }
        return ( <Markdown
          key={ index }
          src={ block.content }
                 /> );
      } )
    ]
  ];
  return renderToStaticMarkup( StaticComposition );
};

