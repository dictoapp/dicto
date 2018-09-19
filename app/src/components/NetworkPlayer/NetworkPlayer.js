import React, { Component } from 'react';
import Measure from 'react-measure';
import {
  Sigma,
  RandomizeNodePositions,
  ForceAtlas2,
  RelativeSize
} from 'react-sigma';

export default class NetworkPlayer extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      dimensions: {}
    };
  }

  render = () => {
    const {
      props: {
        graph,
        onClickNode
      },
      state: {
        dimensions: {
          width,
          height
        }
      }
    } = this;

    return (
      <Measure
        bounds
        onResize={ ( contentRect ) => {
              this.setState( { dimensions: contentRect.bounds } );
            } }
      >
        {( { measureRef } ) =>
            (
              <div
                className={ 'graph-container' }
                ref={ measureRef }
              >
                <Sigma
                  style={ {
                          width,
                          height
                        } }
                  graph={ graph }
                  onClickNode={ onClickNode }
                  settings={ {
                          labelThreshold: 7
                        } }
                >
                  <ForceAtlas2
                    worker
                    barnesHutOptimize
                    barnesHutTheta={ 0.1 }
                    iterationsPerRender={ 10 }
                    timeout={ 3000 }
                    linLogMode
                  />
                  <RandomizeNodePositions />
                  <RelativeSize initialSize={ 15 } />
                </Sigma>
              </div>
            )
          }
      </Measure>
    );
  }
}
