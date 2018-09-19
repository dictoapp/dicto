/* eslint react/no-danger : 0 */
/* eslint react/prefer-stateless-function : 0 */
/**
 * This module exports a stateless component rendering the layout of the layout view
 * @module dicto/features/Layout
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Nav from '../../../components/Nav';
import Md from '../../../components/MarkdownPlayer';

import fr from 'raw-loader!../about.fr.md';
import en from 'raw-loader!../about.en.md';

import { inElectron } from '../../../helpers/electronUtils';

import './AboutLayout.scss';

export class AboutLayout extends Component {

  render = () => {
    const {
      props: {
        lang
      },
      context: { t }
    } = this;

    return (
      <div className={ 'dicto-AboutLayout hero is-light' }>
        <Nav
          style={ {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%'
                } }
          localizationCrumbs={ [
                  {
                    href: '/corpora/',
                    name: t( 'my corpora' )
                  }
                ] }
          importantOperations={ [] }
        />
        <section className={ 'hero-body column is-half is-offset-one-quarter about-container' }>
          <h1 className={ 'title is-1 hero-title' }>
            <img
              className={ 'logo-img' }
              src={ require( '../assets/logo.png' ) }
            />
            <span>DICTO </span><span className={ 'tag' }>alpha</span>
          </h1>
          <h2 className={ 'subtitle is-3' }>{t( 'dicto-baseline' )}</h2>
          <div className={ 'content' }>
            <Md src={ lang === 'fr' ? fr : en } />
            {
                      !inElectron && 
                      <div
                        style={ { marginTop: '2rem' } }
                        className={ "legal-mentions" }
                      >
                        <h3 className={ "title is-5" }>{t( 'Legal mentions' )}</h3>
                        <div>
                          {t( 'legal mentions detail' )}
                        </div>
                      </div>
                    }
          </div>
        </section>
      </div>
    );
  }
}

AboutLayout.contextTypes = {
  t: PropTypes.func
};

export default AboutLayout;
