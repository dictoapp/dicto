import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';

import 'react-dates/lib/css/_datepicker.css';

export default class DatesPicker extends Component {

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor( props ) {
    super( props );
    this.state = {
      isEdited: false,
      focusedInput: undefined,
      start: props.dates && props.dates.start && moment( props.dates.start ),
      end: props.dates && props.dates.end && moment( props.dates.end )
    };
  }

  componentWillReceiveProps = ( nextProps ) => {
    let stateChanges = {};
    if (
      this.props.dates &&
      this.props.dates.start &&
      nextProps.dates &&
      nextProps.dates.start &&
      this.props.dates.start !== nextProps.dates.start
    ) {
      stateChanges.start = moment( nextProps.dates.start );
    }
    if (
      this.props.dates &&
      this.props.dates.end &&
      nextProps.dates &&
      nextProps.dates.end &&
      this.props.dates.end !== nextProps.dates.end
    ) {
      stateChanges.end = moment( nextProps.dates.end );
    }
    if ( !nextProps.dates ) {
      stateChanges = {
        start: undefined,
        end: undefined,
      };
    }
    if ( Object.keys( stateChanges ) ) {
      this.setState( stateChanges );
    }
  }

  toggleEdited = ( e ) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState( {
      isEdited: !this.state.isEdited
    } );
  }

  handleChange = ( { startDate, endDate } ) => {
    this.setState( {
      start: startDate || this.state.start,
      end: endDate || this.state.end
    } );
    this.props.onChange( {
      start: startDate ? startDate.valueOf() : this.props.dates && this.props.dates.start,
      end: endDate ? endDate.valueOf() : this.props.dates && this.props.dates.end,
    } );
  }

  handleSubmit = () => {
    const {
      start,
      end
    } = this.state;
    this.setState( {
      isEdited: false
    } );
    this.props.onChange( {
      start: start ? start.valueOf() : this.props.dates && this.props.dates.start,
      end: end ? end.valueOf() : this.props.dates && this.props.dates.end,
    } );
  }

  handleDelete = () => {
    this.props.onChange( undefined );
  }

  handleCancel = () => {
    this.setState( {
      isEdited: false,
      start: this.props.dates && this.props.dates.start && moment( this.props.dates.start ),
      end: this.props.dates && this.props.dates.end && moment( this.props.dates.end ),
    } );
  }

  onFocusChange = ( focusedInput ) => {
    this.setState( {
      focusedInput
    } );
    if ( !focusedInput ) {
      this.handleSubmit();
    }
  }

  render = () => {
    const {
      state: {
        isEdited,
        focusedInput,
        start,
        end
      },
      props: {
        dates,
        id
      },
      context: { t },
      toggleEdited,
      handleChange,
      onFocusChange,

      handleDelete,
    } = this;

    const isInitialized = dates && dates.start;

    const silentEvent = ( e ) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const isOutsideRange = () => false;

    return (
      <div onClick={ silentEvent }>
        <div className={ 'level' }>
          {
                  !isInitialized && !isEdited &&
                  <button
                    className={ 'button is-primary is-fullwidth' }
                    onClick={ toggleEdited }
                  >
                      {t( 'add-dates' )}
                  </button>
                }
        </div>
        <div className={ 'level' }>
          {
                  isInitialized || isEdited ?
                    <DateRangePicker
                      openDirection={ 'up' }
                      startDate={ start }
                      startDateId={ `${id} start` }
                      isOutsideRange={ isOutsideRange }
                      startDatePlaceholderText={ t( 'start date' ) }
                      endDatePlaceholderText={ t( 'end date' ) }
                      displayFormat={ 'DD/MM/YYYY' }
                      endDate={ end }
                      endDateId={ `${id} end` }
                      onDatesChange={ handleChange }
                      onFocusChange={ onFocusChange }
                      focusedInput={ focusedInput }
                    />
                    : 
                    null
                }
        </div>
        <div className={ 'level' }>
          {
                  isInitialized &&
                  <button
                    className={ 'button is-danger' }
                    onClick={ handleDelete }
                  >
                      {t( 'delete dates' )}
                  </button>
                }
        </div>
      </div>
    );
  }
}
