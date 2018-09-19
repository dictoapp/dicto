import copy from 'copy-to-clipboard';

export const mapToArray = ( map ) =>
  Object.keys( map ).reduce( ( res, id ) => [
    ...res,
    map[id]
  ], [] );

const youtubeRegexp = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/gi;
const vimeoRegexp = /^(https?\:\/\/)?(www\.)?(vimeo\.com)/gi;
const validMediaRegexps = [ youtubeRegexp, vimeoRegexp ];

export const mediaUrlIsValid = ( url = '' ) => {
  return validMediaRegexps.find( ( regexp ) => url.match( regexp ) ) !== undefined;
};

export const convertRemToPixels = ( rem ) => {
  return rem * parseFloat( getComputedStyle( document.documentElement ).fontSize );
};

export const getMediaPlatformFromUrl = ( url = '' ) => {
  if ( url.indexOf( 'file://' ) === 0 ) {
    return 'local';
  }
  const simple = [ 'youtube', 'vimeo', 'wistia', 'dailymotion', 'facebook', 'soundcloud', 'wistia', 'twitch' ];
  const platform = simple.find( ( s ) => {
    if ( url.includes( s ) ) {
      return true;
    }
  } );
  if ( platform ) {
    return platform;
  }
  else if ( url.includes( 'youtu.be' ) ) {
    return 'youtube';
  }
  else {
    return 'defaultImage';
  }
};

export const getEventRelativePosition = ( e, targetClassName ) => {
  let element = e.target;
  let parentNode = element.parentNode;
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left; //y position within the element.
  let y = e.clientY - rect.top; //y position within the element.
  if ( element.className && element.className.includes( targetClassName ) ) {
    return { x, y, rect };
  }
  else {
    while (
      parentNode.tagName.toLowerCase() !== 'body' &&
            parentNode.className !== targetClassName
    ) {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = parentNode;
      parentNode = element.parentNode;
      rect = parentNode.getBoundingClientRect();
    }
    return { x, y, rect };
  }
};

export const secsToHMS = ( secs ) => {
  const output = {};
  const vals = ( `${ secs}` ).split( '.' );
  let seconds = +vals[0];
  if ( seconds < 0 ) seconds = 0;
  const hours = parseInt( ( +seconds ) / 3600, 10 );
  const minutes = parseInt( ( +seconds ) / 60, 10 ) - hours * 60;
  seconds = parseInt( +seconds, 10 ) - hours * 3600 - minutes * 60;
  const miliseconds = parseInt( +seconds, 10 ) - seconds;
  if ( hours < 10 )
    output.hours = `0${ hours}`;
  else output.hours = hours;
  if ( minutes < 10 )
    output.minutes = `0${ minutes}`;
  else output.minutes = minutes;
  if ( seconds < 10 )
    output.seconds = `0${ seconds}`;
  else output.seconds = seconds;

  if ( vals[1] ) {
    output.miliseconds = ( `${vals[1] }000` ).substring( 0, 3 );
  }
  else {
    output.miliseconds = ( `${ miliseconds}` ).substring( 0, 3 );
    while ( output.miliseconds.length < 3 ) {
      output.miliseconds += '0';
    }
  }
  return output;
};

export const secsToSrt = ( secs, showMiliseconds = true ) => {
  const time = secsToHMS( secs );
  return `${time.hours
  }:${ time.minutes
  }:${ time.seconds
  }${showMiliseconds ? `,${ time.miliseconds}` : ''}`;
};

export const srtToSecs = ( srtTime ) => {
  let vals = ( `${ srtTime}` ).match( /([\d+]*):([\d+]*):([\d+]*)(?:,|:)([\d+]*)?/ );

  if ( !vals )
    return undefined;
  else vals = vals.splice( 1, 4 );
  if ( vals.length < 3 ) {
    return undefined;
  }
  else {
    return ( vals.length > 3 ) ?
      +vals[0] * 3600 + ( +vals[1] * 60 ) + ( +vals[2] ) + parseFloat( `0.${ vals[3]}` )
      : +vals[0] * 3600 + +vals[1] * 60 + +vals[2];
  }
};

export const copyToClipboard = ( text ) => {
  copy( text );
};

export const computePlaylist = ( {
  summary,
  fields,
  chunks
} ) => {
  const defaultFieldId = Object.keys( fields )
    .find( ( fieldId ) => fields[fieldId].name === 'default' );
  // console.log(defaultFieldId);
  return summary.reduce( ( playlist, compositionBlock, index ) => {
    const type = compositionBlock.blockType;
    const duration = type === 'chunk' ?
      Math.abs( chunks[compositionBlock.content].end - chunks[compositionBlock.content].start )
      : ( compositionBlock.duration || 5 );
    const next = index < summary.length - 1 ? summary[index + 1] : undefined;

    const element = { ...compositionBlock };

    if ( type === 'chunk' ) {
      const chunk = chunks[compositionBlock.content];
      element.chunk = { ...chunk };
      element.activeFieldId = element.activeFieldId || defaultFieldId;
      if ( next && next.blockType === 'chunk' ) {
        // check if not overlapping with next chunk
        if ( next.metadata.mediaId === chunk.metadata.mediaId && chunk.end > next.start ) {
          element.chunk.end = next.start;
        }
      }
      element.duration = element.chunk.end - element.chunk.start;
      element.start = playlist.duration;
      element.end = playlist.duration + element.duration;
    }
    else {
      element.duration = duration;
      element.start = playlist.duration;
      element.end = playlist.duration + element.duration;
    }
    return {
      list: [ ...playlist.list, element ],
      duration: playlist.duration + element.duration
    };
  }, {
    list: [],
    duration: 0
  } );
};

export const getColorByBgColor = ( bgColor ) => {
  if ( !bgColor ) {
    return '';
  }
  else if ( bgColor.toUpperCase() === '#FFF' ) {
    return '#000';
  }
  return ( parseInt( bgColor.replace( '#', '' ).toUpperCase(), 16 ) > 0xffffff / 2 ) ? '#000' : '#fff';
};

export const abbrev = ( str, maxLength = 10 ) => {
  if ( str.length > maxLength ) {
    return `${str.slice( 0, maxLength ) }...`;
  }
  return str;
};

/**
 * Redirect logic
 * taken from React for GitHub Pages - https://github.com/rafrex/react-github-pages
 * (thanks!)
 */
export const checkForRedirect = ( location, history ) => {
  if ( location.search.includes( 'redirect=true' ) ) {
    parseRedirectQuery( location, history );
  }
}

const parseRedirectQuery = ( location, history ) => {
  const redirectTo = {}

  if ( typeof location.pathname === 'string' && location.pathname !== '' ) {
    redirectTo.pathname = decodeURIComponent( location.pathname );
  }

  if ( typeof location.search === 'string' && location.search !== '' ) {
    const queryObject = {};
    location.search.split( '&' ).map( ( q ) => q.split( '=' ) ).forEach( ( arr ) => {
      queryObject[arr[0]] = arr.slice( 1 ).join( '=' );
    } )
    redirectTo.query = queryObject;
    if ( queryObject.pathname ) {
      redirectTo.pathname = decodeURIComponent( queryObject.pathname );
    }
  }

  if ( typeof location.hash === 'string' && location.hash !== '' ) {
    redirectTo.hash = `#${location.hash}`
  }

  redirectTo.pathname = redirectTo.pathname.replace( '/dicto', '' );

  setTimeout( () => history.replace( redirectTo ) );
}
