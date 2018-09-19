/* eslint react/no-set-state : 0 */
/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the layout container
 * @module dicto/features/Chunks
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AboutLayout from './AboutLayout';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  ( state ) => ( {
    lang: state.i18nState.lang,
  } ),
  ( dispatch ) => ( {
    actions: bindActionCreators( {}, dispatch )
  } )
)
class ChunksContainer extends Component {

  /**
   * Context data used by the component
   */
  static contextTypes = {

    /**
     * Un-namespaced translate function
     */
    t: PropTypes.func.isRequired,

    /**
     * Redux store
     */
    store: PropTypes.object.isRequired
  }

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor( props ) {
    super( props );
  }

  shouldComponentUpdate() {
    return true;
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {

    return (
      <AboutLayout
        { ...this.props }
      />
    );
  }
}

export default ChunksContainer;
