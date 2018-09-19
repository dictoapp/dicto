import React from 'react';
import PropTypes from 'prop-types';

import mac from './assets/mac.png';
import linux from './assets/linux.png';
import windows from './assets/windows.png';

import './DownloadDesktop.scss';

const repo = __SOURCE_REPOSITORY__ || '';
const version = __DICTO_VERSION__ || '0.0.1';
const links = {
  macos: `${repo}/releases/download/${version}/dicto-${version}-mac.zip`,
  linux: `${repo}/releases/download/${version}/dicto-${version}.tar.gz`,
  windows: `${repo}/releases/download/${version}/dicto Setup ${version}.exe`,
};

const DownloadDesktop = ( { mode = 'horizontal' }, { t } ) => {
  return (
    <div className={ 'dicto-DownloadDesktop' }>
      <div className={ 'title is-4' }>{t( 'Download Dicto for desktop' )}</div>
      <div className={ mode === 'horizontal' ? 'columns' : '' }>
        <div className={ 'column is-4' }>
          <a
            target={ 'blank' }
            className={ 'box is-fullwidth' }
            href={ links.macos }
          >
            <span className={ 'icon is-large' }>
              <img src={ mac } />
            </span>
            <span>{t( 'Download for mac' )}</span>
          </a>
        </div>
        <div className={ 'column is-4' }>
          <a
            target={ 'blank' }
            className={ 'box is-fullwidth' }
            href={ links.linux }
          >
            <span className={ 'icon is-large' }>
              <img src={ linux } />
            </span>
            <span>{t( 'Download for linux' )}</span>
          </a>
        </div>
        <div className={ 'column is-4' }>
          <a
            target={ 'blank' }
            className={ 'box is-fullwidth' }
            href={ links.windows }
          >
            <span className={ 'icon is-large' }>
              <img src={ windows } />
            </span>
            <span>{t( 'Download for windows' )}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

DownloadDesktop.contextTypes = {
  t: PropTypes.func
};

export default DownloadDesktop;
