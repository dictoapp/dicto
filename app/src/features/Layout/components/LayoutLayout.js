/**
 * This module exports a stateless component rendering the layout of the layout view
 * @module dicto/features/Layout
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReduxToastr from 'react-redux-toastr';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

import './LayoutLayout.scss';

Modal.setAppElement( '#mount' );

const LayoutLayout = ( {
  children,
  allowExamplePrompted,
  rgpdAgreementPrompted,
  actions: {
    setAllowExamplePrompted,
    setRgpdAgreementPrompted,
  }
  // location: {pathname}
}, {
  currentGuidedTourView,
  startTour,
  t
} ) => {
  const onCloseExamplePrompt = () => setAllowExamplePrompted( false );
  const onLoadExample = () => {
                                  setAllowExamplePrompted( false );
                                  startTour( { view: currentGuidedTourView } );
                                };
  const onAcceptRgpd = () => {
                                  localStorage.setItem( 'dicto/rgpd-agreement', true )
                                  setRgpdAgreementPrompted( false );
                                };
  const onRefuseRgpd =  () => {
                                  setRgpdAgreementPrompted( false )
                                };
  return (
    <div className={ 'dicto-Layout hero is-light' }>
      {children}
      <ReduxToastr
        timeOut={ 4000 }
        newestOnTop={ false }
        position={ 'top-right' }
        transitionIn={ 'fadeIn' }
        transitionOut={ 'fadeOut' }
        closeOnToastrClick
      />

      <Modal
        isOpen={ allowExamplePrompted }
        onRequestClose={ onCloseExamplePrompt }
      >

        <div className={ 'modal-content' }>
          <div className={ 'modal-header' }>
            <h1 className={ 'title is-1' }>
              {
                            t( 'Start guided tour' )
                          }
            </h1>
            <div className={ 'close-modal-icon-container' }>
              <span
                className={ 'icon' }
                onClick={ onCloseExamplePrompt }
              >
                <i className={ 'fas fa-times-circle' } />
              </span>
            </div>
          </div>
          <div className={ 'modal-body composition-modal' }>
            <div
              style={ { paddingLeft: '2rem' } }
              className={ 'column content is-large' }
            >
              {t( 'Dicto needs to load an example corpus to walk you through its features. Your actual work will not be lost though. Do you want to continue ?' )}
            </div>
          </div>
          <ul className={ 'modal-footer' }>
            <li>
              <button
                className={ 'button is-fullwidth is-primary' }
                onClick={ onLoadExample }
              >
                {t( 'Load example corpus and start the tour' )}
              </button>
            </li>
            <li>
              <button
                id={ 'copy-clipboard' }
                className={ 'button is-fullwidth is-secondary' }
                onClick={ onCloseExamplePrompt }
              >
                {t( 'Cancel' )}
              </button>
            </li>
          </ul>
        </div>
      </Modal>

      <div
        style={ {
                  position: 'fixed',
                  display: rgpdAgreementPrompted ? 'block' : 'none',
                  right: '1rem',
                  bottom: '1rem',
                  maxWidth: '40%'
                } }
        className={ "card" }
      >

        <div className={ 'modal-content' }>
          <div className={ 'modal-body composition-modal' }>
            <div className={ 'column content' }>
              {t( 'Dicto needs to use your web browser local storage to store your data in order to run this web version of the tool. That way your data will remain in your browser and won\'t have to be sent to any distant server. Do you allow Dicto to use your web browser local storage ?' )}
            </div>
          </div>
          <ul className={ 'modal-footer' }>
            <li>
              <button
                className={ 'button is-fullwidth is-primary' }
                onClick={ onAcceptRgpd }
              >
                {t( 'Yes, use the local storage' )}
              </button>
            </li>
            <li>
              <Link
                to={ "/" }
                className={ 'button is-fullwidth is-secondary' }
                onClick={ onRefuseRgpd }
              >
                {t( 'No, get me back to home' )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

LayoutLayout.contextTypes = {
  startTour: PropTypes.func,
  t: PropTypes.func,
  currentGuidedTourView: PropTypes.string,
};

export default LayoutLayout;
