import React, { Component } from 'react';

import NetworkPlayer from '../NetworkPlayer';

import Markdown from '../MarkdownPlayer';

import { scalePow } from 'd3-scale';
import { extent } from 'd3-array';

import {
  mapToArray
} from '../../helpers/utils';

export default class TagsView extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      viewMode: 'graph'
    };
  }
  setViewMode = ( viewMode ) => {
    this.setState( { viewMode } );
  }

  render = () => {
    const {
      props: {
        translate,
        addPlaylistBuilder,
        corpus: {
          chunks,
          tags,
          tagCategories
        }
      },
      state: {
        viewMode
      },
      setViewMode,
    } = this;
    const chunksList = mapToArray( chunks );
    const tagsList = mapToArray( tags )
      .map( ( tag ) => {
        const id = tag.metadata.id;
        const size = chunksList.filter( ( c ) => c.tags.includes( id ) ).length;
        const color = tagCategories[tag.tagCategoryId].color;
        return {
          ...tag,
          label: `${tag.name} (${translate( [ 'one excerpt', '{n} excerpts', 'n' ], { n: size } )})`,
          id: tag.metadata.id,
          size,
          color
        };
      } )
      .filter( ( t ) => t.size > 0 );
    let links = mapToArray(
      mapToArray( chunks ).reduce( ( activeLinks, chunk ) => {
        const chunkTags = chunk.tags;
        chunkTags.forEach( ( tag1, index ) => {
          chunkTags.slice( index ).forEach( ( tag2 ) => {
            const footPrint = [ tag1, tag2 ].sort().join( '-' );
            if ( activeLinks[footPrint] ) {
              activeLinks[footPrint].weight = activeLinks[footPrint].weight + 1;
            }
            else {
              activeLinks[footPrint] = {
                source: tag1,
                target: tag2,
                id: footPrint,
                color: 'rgb(240,240,240)',
                opacity: 0.3,
                weight: 1
              };
            }
          } );
        } );
        return activeLinks;
      }, {} )
    );

    const linkColorScale = scalePow().domain(
      extent(
        links.map( ( link ) => link.weight )
      )
    ).range( [ 220, 0 ] );
    links = links.map( ( link ) => {
      const color = parseInt( linkColorScale( link.weight ), 10 );
      return {
        ...link,
        color: `rgb(${color},${color},${color})`
      };
    } );
    const graph = { nodes: tagsList, edges: links };
    const onClickNode = ( e ) => addPlaylistBuilder( 'tag', e.data.node );
    return (
      <div>

        <ul
          style={ { zIndex: 2, width: '51%', position: 'absolute' } }
          className={ 'columns' }
        >
          <li className={ 'column' }>
            <button
              onClick={ () => setViewMode( 'graph' ) }
              className={ `button is-fullwidth ${viewMode === 'graph' ? 'is-primary' : ''}` }
            >
              <i className={ 'fas fa-asterisk' } />
            </button>
          </li>
          <li className={ 'column' }>
            <button
              onClick={ () => setViewMode( 'list' ) }
              className={ `button is-fullwidth ${viewMode === 'list' ? 'is-primary' : ''}` }
            >
              <i className={ 'fas fa-list' } />
            </button>
          </li>
        </ul>

        {
          viewMode === 'graph' ?
            (
              <div className={ 'graph-wrapper' }>
                <NetworkPlayer
                  graph={ graph }
                  onClickNode={ onClickNode }
                />
              </div>
            )
            :
            (
              <ul style={ { paddingTop: '10%' } }>
                {
                  tagsList
                    .sort( ( a, b ) => {
                      if ( a.name.trim() > b.name.trim() ) {
                        return 1;
                      }
                      return -1;
                    } )
                    .filter( ( t ) => t.size > 0 )
                    .map( ( tag ) => {
                      const onClick = () => addPlaylistBuilder( 'tag', tag );
                      return (
                        <li
                          key={ tag.metadata.id }
                          className={ 'level' }
                          onClick={ onClick }
                          style={ { cursor: 'pointer' } }
                        >

                          <div className={ 'card column' }>
                            <div className={ 'card-header' }>
                              <div className={ 'column' }>
                                <h3
                                  className={ 'title is-3' }
                                >
                                  <i
                                    style={ { color: tagCategories[tag.tagCategoryId].color } }
                                    className={ 'fas fa-tag' }
                                  />
                                  <span style={ { paddingLeft: '1em' } }>{tag.label}</span>
                                </h3>
                              </div>
                            </div>
                            {
                              tag.description &&
                              <div className={ 'card-content' }>
                                <Markdown src={ tag.description || '' } />
                              </div>
                            }
                          </div>
                        </li>
                      );
                    } )
                }
              </ul>
            )
        }
      </div>
    );
  }
}

