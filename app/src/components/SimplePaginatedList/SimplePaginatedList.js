import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SimplePaginatedList extends Component {
  static contextTypes = {
    t: PropTypes.func
  }
  constructor( props ) {
    super( props );
    this.state = {
      currentPage: 0
    };
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( this.props.items !== nextProps.items ) {
      this.setState( {
        currentPage: 0
      } );
    }
  }

  onPrevious = () => {
    this.setState( {
      currentPage: this.state.currentPage - 1,
    } );
  }
  onNext = () => {
    this.setState( {
      currentPage: this.state.currentPage + 1,
    } );
  }

  render = () => {
    const {
      props: {
        items = [],
        itemsPerPage = 10,
        className = ''
      },
      state: {
        currentPage = 0,
      },
      context: { t },
      onPrevious,
      onNext,
    } = this;

    const previousIsPossible = currentPage > 0;
    const nextIsPossible = currentPage * itemsPerPage + itemsPerPage <= items.length;

    return (
      <div className={ `rows ${className}` }>
        <div
          className={ 'column is-flex-1' }
          style={ { overflow: 'auto' } }
        >
          {items.slice( currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage )}
        </div>
        <div className={ 'columns' }>
          <div className={ 'column' }>
            <button
              onClick={ onPrevious }
              className={ `button is-fullwidth ${previousIsPossible ? '' : 'is-disabled'}` }
            >
              {t( 'previous' )}
            </button>
          </div>
          <div className={ 'column' }>
            <button
              onClick={ onNext }
              className={ `button is-fullwidth ${nextIsPossible ? '' : 'is-disabled'}` }
            >
              {t( 'next' )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
