import React from 'react';

import {
  mapToArray
} from '../../helpers/utils';

const NavContent = ( {
  corpus: {
    tags,
    chunks,
  },
  locationId,
  setLocation,
  toggleInfoVisibility,
  translate
} ) => {
  const navItems = [
    {
      id: 'tags-view',
      title: translate( 'Browse tags' ),
      icon: 'tags',
      visible: Object.keys( tags )
        .find( ( tagId ) => {
          return Object.keys( chunks )
            .find( ( chunkId ) => {
              const chunk = chunks[chunkId];
              return chunk.tags.includes( tagId );
            } );
        } ) !== undefined
    },
    {
      id: 'medias-view',
      title: translate( 'Browse medias' ),
      icon: 'video',
      visible: true
    },
    {
      id: 'space-view',
      title: translate( 'Browse places' ),
      icon: 'map',
      visible: mapToArray( tags ).filter( ( tag ) => tag.location && tag.location.latitude ).length > 0
    },
    {
      id: 'time-view',
      title: translate( 'Browse time' ),
      icon: 'clock',
      visible: mapToArray( tags ).filter( ( tag ) => tag.dates && tag.dates.start ).length > 0
    }
  ];
  return (
    <div className={ 'nav-contents' }>
      <ul>
        <li
          onClick={ toggleInfoVisibility }
          className={ 'nav-item' }
        >
          <h4 className={ 'title is-4' }>
            <button
              className={ 'link' }
            >
              <i className={ 'fas fa-info-circle' } />
              <span
                style={ { paddingLeft: '1em' } }
                className={ 'nav-item-title' }
              >
                <span className={ 'nav-item-title-content' }>{translate( 'about this corpus' )}</span>
              </span>
            </button>
          </h4>
        </li>
        {
          navItems
            .filter( ( item ) => item.visible )
            .map( ( navItem ) => {
              const goTo = () => setLocation( navItem.id );
              return (
                <li
                  className={ `nav-item ${navItem.id === locationId ? 'is-active' : ''}` }
                  key={ navItem.id }
                >
                  <h4 className={ 'title is-4' }>
                    <button
                      className={ `link ${locationId === navItem.id ? 'active' : ''}` }
                      onClick={ goTo }
                    >
                      <i className={ `fas fa-${navItem.icon}` } />
                      <span
                        style={ { paddingLeft: '1em' } }
                        className={ 'nav-item-title' }
                      >
                        <span className={ 'nav-item-title-content' }>{navItem.title}</span>
                      </span>
                    </button>
                  </h4>
                </li>
              );
            } )
        }
      </ul>
    </div>
  );
};

export default NavContent;
