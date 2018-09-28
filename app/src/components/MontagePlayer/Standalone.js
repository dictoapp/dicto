/**
 * Application Endpoint
 * ======================================
 *
 * Rendering the application.
 * @module dicto
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';

import getTranslateFunction from 'redux-i18n/dist/getTranslateFunction';

import MontagePlayer from './MontagePlayer';

const mountNode = document.getElementById( 'mount' );

const lang = window.lang || 'en';
const translations = require( `../../translations/locales/${lang}.json` );

import './Standalone.scss';

const translateFn = getTranslateFunction( { [lang]: translations }, lang, 'en' );

class Wrapper extends Component {

  static childContextTypes = {
    t: PropTypes.func
  }

  getChildContext = () => ( {
    t: this.translate
  } )

  translate = ( t, params ) => {
    return translateFn( t, params );
  }

  render = () => {
    const data = window.data;
    const {
      summary,
      metadata,
      medias,
      chunks,
      tags,
      fields,
      tagCategories
    } = data;

    const style = {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      background: 'white',
    };
    return (
      <div style={ style }>
        <MontagePlayer
          summary={ summary }
          metadata={ metadata }
          medias={ medias }
          chunks={ chunks }
          tags={ tags }
          fields={ fields }
          tagCategories={ tagCategories }
          translate={ this.translate }
        />
      </div>
    );
  }

}

/**
 * Mounts the application to the given mount node
 */
export function renderApplication() {
  const group = (
    <Wrapper />
  );
  render( group, mountNode );
}

renderApplication();
