import React from 'react';

import GMap from 'google-map-react';

import {
  extent,
  mean,
} from 'd3-array';
import { nest } from 'd3-collection';
import { scaleLinear } from 'd3-scale';

import getConfig from '../../helpers/getConfig';
const { googleApiKey } = getConfig();

import {
  mapToArray,
  getColorByBgColor
} from '../../helpers/utils';

// const MIN_LATITUDE =  -90;
const MAX_LATITUDE = 90;

// const MIN_LONGITUDE =  -180;
const MAX_LONGITUDE = 180;

const LocalizationMarker = ( {
  location,
  tags = [],
  onClick,
  tagCategories = {}
} ) => {
  let color = 'white';
  if ( tags.length ) {
    color = tagCategories[tags[0].tagCategoryId].color || 'white';
  }
  return (
    <div
      onClick={ onClick }
      className={ 'localization-marker' }
    >
      <span
        style={ {
          color,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          border: `1px ${color} solid`,
          padding: '1em',
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          top: '-15px',
          left: '-15px'
        } }
      >
        <i className={ 'fas fa-map-marker' } />
      </span>
      <div
        style={ {
          position: 'absolute',
          left: 5,
          top: -15,
          width: 50
        } }
      >
        {
          location.adress &&
          <h3
            className={ 'title is-3' }
          >
              {location.adress}
          </h3>
        }
        <ul>
          {
            tags.map( ( tag ) => (
              <li
                className={ 'tag' }
                style={ {
                  background: tagCategories[tag.tagCategoryId].color || 'white',
                  color: getColorByBgColor( tagCategories[tag.tagCategoryId].color )
                } }
                key={ tag.metadata.id }
              >
                {tag.name}
              </li>
            ) )
          }
        </ul>
      </div>
    </div>
  );
}

const SpaceView = ( {
  corpus: {
    tags,
    tagCategories
  },
  addPlaylistBuilder
} ) => {

  const tagsList = mapToArray( tags ).filter( ( tag ) => tag.location && tag.location.latitude );

  const places = nest()
    .key( ( d ) => `${d.location.latitude }-${ d.location.longitude}` )
    .entries( tagsList )
    .map( ( place ) => ( {
      ...place,
      location: { ...place.values[0].location }
    } ) );

  const latitudeExtent = extent( places, ( d ) => d.location.latitude );
  const longitudeExtent = extent( places, ( d ) => d.location.longitude );
  const latMean = mean( places, ( d ) => d.location.latitude );
  const lngMean = mean( places, ( d ) => d.location.longitude );
  const area = ( latitudeExtent[1] - latitudeExtent[0] ) * ( longitudeExtent[1] - longitudeExtent[0] );

  const zoomScale = scaleLinear().domain( [ 0, ( MAX_LATITUDE * 2 ) * ( MAX_LONGITUDE * 2 ) ] )
    .range( [ 1, 12 ] );
  const zoom = area > 0 ? zoomScale( area ) : 6;

  return (
    <div>
      <div className={ 'map-wrapper' }>
        <div className={ 'map-container' }>
          <GMap
            bootstrapURLKeys={ { key: [ googleApiKey ] } }
            defaultCenter={ { lat: latMean, lng: lngMean } }
            defaultZoom={ zoom }
          >
            {
              places.map( ( place, index ) => {
                const onClick = () => addPlaylistBuilder( 'place', place );
                return (
                  <LocalizationMarker
                    key={ index }
                    onClick={ onClick }
                    lat={ place.location.latitude }
                    lng={ place.location.longitude }
                    tags={ place.values }
                    tagCategories={ tagCategories }
                    location={ place.location }
                  />
                );
              } )
            }
          </GMap>
        </div>
      </div>

      <ul />
    </div>
  );
};

export default SpaceView;
