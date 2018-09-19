import React from 'react';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import { nest } from 'd3-collection';

import {
  mapToArray,
  getColorByBgColor,
} from '../../helpers/utils';

import Markdown from '../MarkdownPlayer';

const SpaceView = ( {
  corpus: {
    tags,
    tagCategories
  },
  addPlaylistBuilder
} ) => {
  const tagsList = mapToArray( tags ).filter( ( tag ) => tag.dates && tag.dates.start );

  const dates = nest()
    .key( ( d ) => `${d.dates.start }-${ d.dates.end}` )
    .entries( tagsList )
    .map( ( place ) => ( {
      ...place,
      dates: { ...place.values[0].dates }
    } ) );
  return (
    <div>
      <VerticalTimeline>
        {
          dates.map( ( date ) => {
            const onClick = () => addPlaylistBuilder( 'dates', date );
            return (
              <VerticalTimelineElement
                key={ date.key }
                className={ 'vertical-timeline-element--work' }
                date={ `${new Date( date.dates.start ).toLocaleDateString()} ${date.dates.end && date.dates.end !== date.dates.start ? ` - ${ new Date( date.dates.end ).toLocaleDateString()}` : ''}` }
              >
                <div onClick={ onClick }>
                  <ul>
                    {
                      date.values.map( ( tag ) => (
                        <li key={ tag.metadata.id }>
                          <div>
                            <span
                              className={ 'tag' }
                              style={ {
                                cursor: 'pointer',
                                background: tagCategories[tag.tagCategoryId].color,
                                color: getColorByBgColor( tagCategories[tag.tagCategoryId].color )
                              } }
                            >
                              {tag.name}
                            </span>
                          </div>
                          <Markdown src={ tag.description || '' } />
                        </li>
                      ) )
                    }
                  </ul>
                </div>
              </VerticalTimelineElement>
            );
          } )
        }
      </VerticalTimeline>
    </div>
  );
};

export default SpaceView;
