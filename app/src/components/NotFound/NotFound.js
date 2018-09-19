/* eslint react/no-danger : 0 */
/* eslint react/prefer-stateless-function : 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

export default class NotFound extends Component {
  static contextTypes = {
    t: PropTypes.func
  }

  render = () => {
    const {
      props: {
        mode = 'page'
      }
    } = this;

    const { t } = this.context;
    let message;

    switch ( mode ) {
    case 'composition':
      message = t( 'The composition you are looking for does not exist.' );
      break;
    case 'corpus':
      message = t( 'The corpus you are looking for does not exist.' );
      break;

    case 'page':
    default:
      message = t( 'The page you are looking for does not exist.' );
    }

    return (
      <div 
        style={ {
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            background: '#f8f5f0'
          } }
      >
        <div 
          style={ {
                display: 'flex',
                flexFlow: 'column nowrap',
                alignItems: 'center',
                justifyContent: 'center'
              } }
        >
          <h1 className={ 'title is-1' }>DICTO</h1>
          <h2 className={ 'title is-2' }>{t( 'Page not found' )}</h2>
          <p>
            {message}
          </p>
          <p className={ 'column' }>
            <Link
              to={ '/corpora/' }
              className={ 'button is-link' }
            >
              {t( 'Come back to your corpora' )}
            </Link>
          </p>
        </div>
      </div>
    );
  }
}
