import React, { Component } from 'react';
import { debounce } from 'lodash';

const DEFAULT_DEBOUNCE = 200;

export default class SearchInput extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      value: props.value
    };
    const debounceTime = props.delay || DEFAULT_DEBOUNCE;
    this.sendUpdate = debounce( this.sendUpdate, debounceTime );
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( this.props.value !== nextProps.value ) {
      this.setState( {
        value: nextProps.value
      } );
    }
  }

  componentWillUnmount = () => {
    this.sendUpdate.cancel();
  }

  sendUpdate = ( value ) => {
    this.props.onUpdate( value );
  }

  onUpdate = ( value ) => {
    this.setState( { value } );
    this.sendUpdate( value );
  }

  onInstantUpdate = () => {
    this.props.onUpdate( this.state.value );
  }

  render = () => {
    const {
      state: { value },
      onUpdate,
      onInstantUpdate,
      props: {
        placeholder,
        className
      }
    } = this;

    const onChange = ( e ) => onUpdate( e.target.value );

    return (
      <form
        className={ className }
        style={ { position: 'relative' } }
        onSubmit={ onInstantUpdate }
      >
        <input
          className={ 'input' }
          style={ { paddingLeft: '2em' } }
          value={ value || '' }
          onChange={ onChange }
          placeholder={ placeholder }
        />
        <span
          style={ {
                  position: 'absolute',
                  left: '.4em',
                  top: '.4em'
                } }
          className={ 'icon' }
        >
          <i className={ 'fas fa-search' } />
        </span>
      </form>
    );
  }

}
