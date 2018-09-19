/* eslint react/no-set-state : 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import schema from 'dicto-schema';

import SchemaForm from '../SchemaForm';
import MediaThumbnail from '../MediaThumbnail';

import { enrichMediaMetadata } from '../../helpers/mediaApis';

import Player from '../ControlledMediaPlayer';

import './MediaEditor.scss';

const mediaSchema = schema.definitions.media.properties;

export default class MediaEditor extends Component {

  static contextTypes = {
    t: PropTypes.func
  }

  constructor( props ) {
    super( props );
    this.state = {
      media: props.media ? props.media : {
        metadata: {}
      }
    };
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( nextProps.media !== this.props.media && nextProps.media ) {
      this.setState( {
        media: nextProps.media
      } );
    }
  }

  render = () => {
    const {
      media: {
        metadata: stateMetadata = {}
      }
    } = this.state;
    const {
      // title,
      mediaUrl,
      mediaThumbnailUrl
    } = stateMetadata;
    const {
      onValidate,
      onCancel,
      media,
    } = this.props;
    const { t } = this.context;

    const onChange = ( metadata ) => {
      return new Promise( ( resolve ) => {
        const thatMedia = {
          ...this.state.media,
          metadata
        };
        if ( this.state.media &&
            this.state.media.metadata &&
            metadata.mediaUrl !== this.state.media.metadata.mediaUrl ) {
          enrichMediaMetadata( thatMedia )
            .then( ( thatMetadata ) => {
              this.setState( {
                media: {
                  ...thatMedia,
                  metadata: thatMetadata
                }
              } );
              resolve( thatMetadata );
            } )
            .catch( console.error );/* eslint no-console : 0 */
        }
        else {
          this.setState( {
            media: thatMedia
          } );
          resolve( thatMedia.metadata );
        }
      } );
    };

    const handleValidate = ( metadata ) => {
      onChange( metadata )
        .then( () => {
          onValidate( this.state.media );
        } );
    };
    return (
      <div className={ 'dicto-MediaEditor modal-content' }>
        <div className={ 'modal-header' }>
          <h1 className={ 'title is-1' }>{media === undefined ? t( 'Add new media' ) : t( 'Edit media' )}</h1>
        </div>
        <div className={ 'modal-body media-modal-body' }>
          { 
                  mediaUrl &&
                        mediaUrl.length &&
                        <div className={ 'media-player-wrapper' }>
                          <div className={ 'media-player' }>
                            <Player src={ mediaUrl } />
                          </div>
                          <div className={ 'media-thumbnail-wrapper' }>
                            <MediaThumbnail
                              mediaUrl={ mediaUrl }
                              mediaThumbnailUrl={ mediaThumbnailUrl }
                            />
                          </div>
                        </div>
                }
          <SchemaForm
            schema={ mediaSchema.metadata }
            onAfterChange={ onChange }
            document={ this.state.media.metadata }
            onCancel={ onCancel }
            onSubmit={ handleValidate }
          />
        </div>
      </div>
    );
  }
}
