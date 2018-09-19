/**
 * Dicto backoffice Application
 * =======================================
 * Combining the app's reducers
 * @module dicto
 */
import { combineReducers } from 'redux';
import { persistentReducer } from 'redux-pouchdb';
import { reducer as toastr } from 'react-redux-toastr';

import { i18nState } from 'redux-i18n';

import corpora from '../features/Corpora/duck';
import chunks from '../features/ChunksEdition/duck';
import compositionEdition from '../features/CompositionEdition/duck';
import data from './duck';

export default combineReducers( {
  data,
  corpora,
  chunks,
  compositionEdition,
  i18nState: persistentReducer( i18nState, 'dicto-lang' ),
  toastr,
} );
