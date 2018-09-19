import get from 'axios';
import { getMediaPlatformFromUrl } from './utils';

import {
  googleApiKey,

  /*
   * soundcloudClientId,
   * vimeoClientId,
   * vimeoKey
   */
} from '../../config.prod.json';

const getYoutubeThumbnailUrl = ( thumbnails ) => {
  if ( thumbnails.maxres ) {
    return thumbnails.maxres.url;
  }
  else if ( thumbnails.high ) {
    return thumbnails.high.url;
  }
  else if ( thumbnails.default ) {
    return thumbnails.default.url;
  }
}

const getYoutubeMetadata = ( url ) => {
  return new Promise( ( resolve, reject ) => {
    let videoId = url.match( /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/ );
    if ( videoId !== null ) {
      videoId = videoId[1];
      const endPoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${googleApiKey}`;
      get( endPoint )
        .then( ( res ) => {
          const info = res.data && res.data.items && res.data.items[0] && res.data.items[0].snippet;
          if ( info ) {
            return resolve( {
              mediaUrl: url,
              description: info.description,
              // source: info.channelTitle + ` (youtube: ${url})`,
              title: info.title,
              mediaThumbnailUrl: getYoutubeThumbnailUrl( info.thumbnails ),
              creators: [
                {
                  family: info.channelTitle,
                  role: 'publisher'
                }
              ],
            } );
          }
          return resolve( {} )
            
        } )
        .catch( ( e ) => reject( e ) );
    }
  } );
};

// const getSoundcloudMetadata = url => {
  // nope :> https://docs.google.com/forms/d/e/1FAIpQLSfNxc82RJuzC0DnISat7n4H-G7IsPQIdaMpe202iiHZEoso9w/closedform
  // https://soundcloud.com/wearesaintantoine/la-plage-romeo
  // return new Promise((resolve/*, reject*/) => {
// resolve();
// first get the track id
// const lookupEndpoint = `https://api.soundcloud.com/resolve.json?url=${url}&client_id=${soundcloudClientId}`;
// get(lookupEndpoint)
// .then((res) => {
//   // console.log(res);
//   resolve();
// });
// .catch(reject);
  // });
// };

const vimeoIdRegex = /vimeo.*\/([\d]{6,9})/i;
const getVimeoMetadata = ( url ) => {
  return new Promise( ( resolve, reject ) => {
    let videoId = url.match( vimeoIdRegex );
    if ( videoId !== null ) {
      videoId = videoId[1];
      const endpoint = `http://vimeo.com/api/v2/video/${videoId}.json?callback`;
      get( endpoint )
        .then( ( { data } ) => {
          const info = data[0];
          if ( info ) {
            return resolve( {
              mediaUrl: info.url,
              description: info.description,
              // source: info.channelTitle + ` (youtube: ${url})`,
              title: info.title,
              mediaThumbnailUrl: info.thumbnail_large,
              creators: [
                {
                  family: info.user_name,
                  role: 'publisher'
                }
              ],
            } );
          }
          else {
            reject();
          }
        } );
    }
  } );
};

const getLocalMetadata = ( path ) => {
  return new Promise( ( resolve ) => {
    const fileName = path.split( '/' ).pop();
    const name = fileName.split( '.' ).reverse().pop();
    resolve( {
      mediaUrl: path,
      title: name
    } );
  } );
};

const dailymotionIdRegex = /dailymotion.*\/(.{7})$/i;
const getDailymotionMetadata = ( url ) => {
  // https://www.dailymotion.com/thumbnail/video/

  return new Promise( ( resolve ) => {
    let videoId = url.match( dailymotionIdRegex );
    if ( videoId !== null ) {
      videoId = videoId[1];
      const endpoint = `https://api.dailymotion.com/video/${videoId}`;
      get( endpoint )
        .then( ( { data: info } ) => {
          return resolve( {
            mediaUrl: url,
            title: info.title,
            mediaThumbnailUrl: `https://www.dailymotion.com/thumbnail/video/${videoId}`,
          } );
        } );
    }
  } );
};

const resolvers = {
  youtube: getYoutubeMetadata,
  vimeo: getVimeoMetadata,
  dailymotion: getDailymotionMetadata,
  local: getLocalMetadata,

  /*
   * not available
   * 'soundcloud': getSoundcloudMetadata,
   * twitch : @todo
   * wikia : @todo
   */

};

export const enrichMediaMetadata = ( media ) =>
  new Promise( ( resolve, reject ) => {
    const url = media.metadata.mediaUrl;
    const platform = getMediaPlatformFromUrl( url );
    if ( resolvers[platform] ) {
      resolvers[platform]( url )
        .then( ( newMetadata ) => {
          newMetadata.id = media.metadata.id;
          resolve( newMetadata );
        } )
        .catch( reject );
    }
    else resolve( media.metadata );
  } );
