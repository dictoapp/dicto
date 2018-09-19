import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';
import { debounce } from 'lodash';

export default class Editor extends Component {

  static contextTypes = {
    t: PropTypes.func
  }

  constructor( props ) {
    super( props );
    this.state = {
      value: props.value || ''
    };
    this.transmitChange = debounce( this.transmitChange, 500 );
  }
  componentWillReceiveProps = ( nextProps ) => {
    if ( this.props.value !== nextProps.value ) {
      this.setState( {
        value: nextProps.value
      } );
    }
  }
  componentWillUnmount = () => {
    this.transmitChange.flush();
  }
  transmitChange = ( value, contentId ) => {
    if ( !this.props.contentId || this.props.contentId === contentId ) {
      this.props.onChange( value );
    }
  }

  focus = () => {
    if ( this.textarea ) {
      this.textarea._rootDOMNode.focus();
    }
  }
  render = () => {
    const {
      props: {
        placeholder,
        contentId
      },
      state: {
        value
      },
      context: {
        t
      },
      transmitChange,
    } = this;
    const handleChange = ( e ) => {
      const thatValue = e.target.value;
      this.setState( { value: thatValue } );
      transmitChange( thatValue, contentId );
    };
    const onBlur = () => {
      transmitChange( value, contentId );
    };
    const bindRef = ( textarea ) => {
      this.textarea = textarea;
    };
    return (
      <Textarea
        value={ value || '' }
        onChange={ handleChange }
        onBlur={ onBlur }
        ref={ bindRef }
        placeholder={ placeholder || t( 'write some markdown' ) }
        className={ 'textarea' }
      />
    );
  }
}

