import React from 'react';

import { getMediaPlatformFromUrl } from '../../helpers/utils';

import vimeo from './logos/vimeo.png';
import youtube from './logos/youtube.png';
import dailymotion from './logos/dailymotion.png';
import facebook from './logos/facebook.png';
import soundcloud from './logos/soundcloud.png';
import twitch from './logos/twitch.png';
import defaultImage from './logos/default.png';

import './MediaThumbnail.scss';

const platformLogos = {
  vimeo,
  youtube,
  dailymotion,
  facebook,
  soundcloud,
  twitch,
  defaultImage,
  local: defaultImage
};

const MediaThumbnail = ( {
  mediaUrl,
  mediaThumbnailUrl,
} ) => {
  const platform = getMediaPlatformFromUrl( mediaUrl );
  const platformLogo = platformLogos[platform];
  const hasImage = mediaThumbnailUrl && mediaThumbnailUrl.length;
  return (
    <div className={ `dicto-MediaThumbnail ${hasImage ? '' : 'without-image'}` }>
      {
            hasImage && 
            <img
              className={ 'main-image' }
              src={ mediaThumbnailUrl }
            />
          }
      <img
        className={ 'platform-logo' }
        src={ platformLogo }
      />
    </div>
  );
};

export default MediaThumbnail;
