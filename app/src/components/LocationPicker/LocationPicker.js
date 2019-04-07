import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import Map from 'pigeon-maps'
import Overlay from 'pigeon-overlay'

const Marker = () =>
  (
    <span
      style={ {
            color: 'red',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '1px red solid',
            padding: '1em',
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
            justifyContent: 'center'
          } }
    >
      <i className={ 'fas fa-map-marker' } />
    </span> );

const PrevMarker = () =>
  (
    <span
      style={ {
            background: 'pink',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            display: 'inline-block'
          } }
    />
  );

export default class LocationPickerContainer extends Component {

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor( props ) {
    super( props );
    this.state = {
      isEdited: false,
      latitude: props.location && props.location.latitude,
      longitude: props.location && props.location.longitude,
      address: props.location && props.location.address,
    };
  }

  componentWillReceiveProps = ( nextProps ) => {

    if (
      this.props.location &&
      this.props.location.latitude &&
      nextProps.location &&
      nextProps.location.latitude &&
      this.props.location.latitude !== nextProps.location.latitude
    ) {
      this.setState( {
        latitude: nextProps.location.latitude
      } );
    }
    if (
      this.props.location &&
      this.props.location.longitude &&
      nextProps.location &&
      nextProps.location.longitude &&
      this.props.location.longitude !== nextProps.location.longitude
    ) {
      this.setState( {
        longitude: nextProps.location.longitude
      } );
    }
  }

  toggleEdited = ( e ) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState( {
      isEdited: !this.state.isEdited
    } );
  }

  setLatitude = ( latitude ) => {
    this.setState( {
      latitude
    } );
  }

  setLongitude = ( longitude ) => {
    this.setState( {
      longitude
    } );
  }

  setAddress = ( address ) => {
    this.setState( {
      address
    } );
  }

  handleAddressSubmit = () => {
    event.preventDefault();
    geocodeByAddress( this.state.address )
      .then( ( results ) => getLatLng( results[0] ) )
      .then( ( coordinates ) => {
        const { lat, lng } = coordinates;
        this.setState( {
          latitude: lat,
          longitude: lng
        } );
        this.handleSubmit( true );
      } )
      .catch( () => {

      } );
  }

  onMapChange = ( { center } ) => {
    const lat = center[0];
    const lng = center[1];
    this.setState( {
      latitude: lat,
      longitude: lng,
      isEdited: true
    } );
    this.handleSubmit( true );
  }

  handleSubmit = ( isEdited = false ) => {
    const {
      latitude,
      longitude,
      address
    } = this.state;
    this.setState( {
      isEdited
    } );
    this.props.onChange( {
      latitude,
      longitude,
      address
    } );
  }

  onReset = () => {
    this.setState( {
      latitude: undefined,
      longitude: undefined,
      address: undefined,
      isEdited: false,
    } );
    this.props.onChange( {
      latitude: undefined,
      longitude: undefined,
      address: undefined
    } );
  }

  handleCancel = () => {
    this.setState( {
      isEdited: false,
      latitude: this.props.location && this.props.location.latitude,
      longitude: this.props.location && this.props.location.longitude,
      address: this.props.location && this.props.location.address,
    } );
  }

  render = () => {
    const {
      state: {
        isEdited,
        latitude,
        longitude,
        address = '',
      },
      props: {
        location,
      },
      context: { t },
      toggleEdited,

      /*
       * handleSubmit,
       * handleCancel,
       */

      setLatitude,
      setLongitude,
      setAddress,

      handleAddressSubmit,
      onMapChange,
      onReset,
    } = this;

    const isInitialized = location && location.latitude;

    const silentEvent = ( e ) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const onLatitudeChange = ( e ) => !isNaN( +e.target.value ) && setLatitude( +e.target.value );
    const onLongitudeChange = ( e ) => !isNaN( +e.target.value ) && setLongitude( +e.target.value );
    return (
      <div
        className={ 'stretched-columns' }
        onClick={ silentEvent }
      >

        {
          !isInitialized && !isEdited &&
          <button
            className={ 'button is-dark is-fullwidth' }
            onClick={ toggleEdited }
          >
              {t( 'add location' )}
          </button>
        }

        <div className={ 'column is-flex-1' }>
          {
            isEdited ?
              <div className={ 'is-flex-1' }>
                <div className={ 'stretched-columns' }>
                  <div className={ 'is-flex-1' }>
                    <h6 className={ 'title is-6' }>
                      {t( 'Search location by address' )}
                    </h6>
                    <form
                      onSubmit={ handleAddressSubmit }
                      className={ 'stretched-columns' }
                    >
                      <div className={ 'is-flex-1' }>
                        <PlacesAutocomplete
                          className={ 'input' }
                          inputProps={ {
                            value: address,
                            placeholder: t( 'input an address' ),
                            onChange: setAddress,
                            onSubmit: handleAddressSubmit
                          } }
                        />
                      </div>
                      <div
                        className={ '' }
                        style={ {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 0
                        } }
                      >
                        <button
                          style={ { height: '100%', marginLeft: '1rem' } }
                          className={ 'button is-info' }
                          onClick={ handleAddressSubmit }
                        >
                          <span className={ 'icon' }>
                            <i className={ 'fas fa-search' } />
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              : null
          }

          {
            isEdited ?
              <div
                style={ { paddingTop: '1rem' } }
              >
                <div className={ 'field' }>
                  <label className={ 'label' }>{t( 'Latitude' )}</label>
                  <div className={ 'control' }>
                    <input
                      className={ 'input' }
                      value={ latitude || '' }
                      placeholder={ t( 'input latitude' ) }
                      onChange={ onLatitudeChange }
                    />

                  </div>
                </div>

                <div>
                  <label className={ 'label' }>{t( 'Longitude' )}</label>
                  <div className={ 'control' }>
                    <input
                      className={ 'input' }
                      value={ longitude || '' }
                      placeholder={ t( 'input longitude' ) }
                      onChange={ onLongitudeChange }
                    />
                  </div>
                </div>
              </div>
              : 
              null
          }
          {
            latitude ?
              <div
                style={ { marginTop: '1rem' } }
                className={ '' }
              >
                <button
                  onClick={ onReset }
                  className={ 'button is-danger is-fullwidth' }
                >
                  {t( 'delete location' )}
                </button>
              </div>
              : 
              null
          }
        </div>
        {
          latitude && longitude &&
          <div className={ 'is-flex-1' }>
            <div style={ { width: '100%', height: '20rem' } }>
              <Map
                center={ [ latitude, longitude ] }
                zoom={ 11 }
                onBoundsChanged={ onMapChange }
              >
                {
                      location &&
                              location.latitude &&
                              location.latitude !== latitude &&
                              location.longitude !== longitude &&
                              <Overlay anchor={ [ location.latitude, location.longitude ] }>
                                <PrevMarker />
                              </Overlay>
                              
                    }
                <Overlay anchor={ [ latitude, longitude ] }>
                  <Marker />
                </Overlay>
              </Map>
            </div>
          </div>
        }

      </div>
    );
  }
}
