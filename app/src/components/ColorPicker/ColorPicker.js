import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SwatchesPicker as Picker } from 'react-color';

export default class ColorPicker extends Component {

  static contextTypes = {
    t: PropTypes.func,
  }
  constructor( props ) {
    super( props );
    this.state = {
      edited: false,
      color: props.color,
    };
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( this.props.color !== nextProps.color ) {
      this.setState( { color: nextProps.color } );
    }
  }

  setEdited = ( edited ) => {
    this.setState( { edited } );
    if ( typeof this.props.onEdit === 'function' && edited ) {
      this.props.onEdit();
    }
  }

  toggleEdited = () => {
    this.setEdited( !this.state.edited );
  }

  onSubmit = () => {
    this.props.onChange( this.state.color );
    this.setEdited( false );
  }

  onCancel = () => {
    this.setEdited( false );
    this.setState( { color: this.props.color } );
  }

  onChange = ( { hex } ) => {
    this.setState( { color: hex } );
  }

  render = () => {
    const {
      state: {
        edited,
        color
      },
      toggleEdited,
      onSubmit,
      onCancel,
      onChange,
      context: { t }
    } = this;

    return (
      <div style={ { position: 'relative' } }>
        <button
          className={ 'button' }
          onClick={ toggleEdited }
        >
          <span 
            style={ {
              width: '1em',
              height: '1em',
              background: color
            } }
          />
        </button>
        {
          edited &&
          <div style={ { position: 'absolute' } }>
            <Picker
              color={ color }
              onChange={ onChange }
            />
            <div>
              <button
                className={ 'button' }
                onClick={ onSubmit }
              >
                {t( 'save-color' )}
              </button>
              <button
                className={ 'button' }
                onClick={ onCancel }
              >
                {t( 'cancel' )}
              </button>
            </div>
          </div>
        }
      </div>
    );
  }
}
