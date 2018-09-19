import React, { Component } from 'react';

import {
  secsToSrt,
  srtToSecs,
} from '../../helpers/utils';

export default class TimeInput extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      value: props.value ? secsToSrt( props.value ) : secsToSrt( 0 )
    };
  }

  componentWillReceiveProps = ( props ) => {
    if ( this.props.value !== props.value ) {
      this.setState( {
        value: secsToSrt( props.value )
      } );
    }
  }

  onChange = ( e ) => {
    this.setState( {
      value: e.target.value
    } );
  }

  onValidate = ( e ) => {
    e.stopPropagation();
    e.preventDefault();
    const value = srtToSecs( e.target.value );
    // todo: verify timecode is valid
    if ( value !== undefined && !isNaN( value ) ) {
      this.props.onChange( value );
    }
    else {
      this.setState( {
        value: secsToSrt( this.props.value )
      } );
    }
    this.input.blur();
  }

  render = () => {
    const {
      state: {
        value = ''
      },
      onChange,
      onValidate,
      props: {
        placeholder
      }
    } = this;
    const silenceEvent = ( e ) => {
      e.stopPropagation();
    };

    const ref = ( input ) => {
      this.input = input;
    };
    const onClick = ( e ) => {
      this.input.focus();
      silenceEvent( e );
    };

    return (
      <form
        onClick={ onClick }
        onSubmit={ onValidate }
        onMouseDown={ silenceEvent }
        onMouseMove={ silenceEvent }
        onMouseUp={ silenceEvent }
      >
        <input
          className={ 'input' }
          ref={ ref }
          value={ value }
          onChange={ onChange }
          onBlur={ onValidate }
          placeholder={ placeholder }
        />
      </form>
    );
  }
}
