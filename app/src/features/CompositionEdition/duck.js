/**
 * This module exports logic-related elements for the chunks edition feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module dicto/features/COmpositionEdition
 */

import { combineReducers } from 'redux';
import { createStructuredSelector } from 'reselect';

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Action names
 * ===========
 * ===========
 * ===========
 * ===========
 */
import {
  GET_CORPUS,
} from '../../redux/duck';
const SET_FILTER_DISPLAY_MODE = '§dicto/CompositionEdition/SET_FILTER_DISPLAY_MODE';
const SET_FILTER_DISPLAY_PARAM = '§dicto/CompositionEdition/SET_FILTER_DISPLAY_PARAM';

const SET_METADATA_VISIBILITY = '§dicto/CompositionEdition/SET_METADATA_VISIBILITY';
const SET_PREVIEW_VISIBILITY = '§dicto/CompositionEdition/SET_PREVIEW_VISIBILITY';

const SET_ACTIVE_FIELD_ID = '§dicto/CompositionEdition/SET_ACTIVE_FIELD_ID';

const SET_PAGINATION_POSITION = '§dicto/CompositionEdition/SET_PAGINATION_POSITION';
const TOGGLE_FILTERS_VISIBILITY = '§dicto/CompositionEdition/TOGGLE_FILTERS_VISIBILITY';
const SET_SEARCH_TERM = '§dicto/CompositionEdition/SET_SEARCH_TERM';

const SET_ACTIVE_COMPOSITION_BLOCK_ID = '§dicto/CompositionEdition/SET_ACTIVE_COMPOSITION_BLOCK_ID';
const UNSET_ACTIVE_COMPOSITION_BLOCK_ID = '§dicto/CompositionEdition/UNSET_ACTIVE_COMPOSITION_BLOCK_ID';

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Action creators
 * ===========
 * ===========
 * ===========
 * ===========
 */
export const setDisplayFilterMode = ( mode ) => ( {
  type: SET_FILTER_DISPLAY_MODE,
  payload: mode
} );

export const setDisplayFilterParam = ( param ) => ( {
  type: SET_FILTER_DISPLAY_PARAM,
  payload: param
} );

export const setMetadataVisibility = ( visible ) => ( {
  type: SET_METADATA_VISIBILITY,
  payload: visible
} );

export const setPreviewVisibility = ( visible ) => ( {
  type: SET_PREVIEW_VISIBILITY,
  payload: visible
} );

export const setActiveFieldId = ( id ) => ( {
  type: SET_ACTIVE_FIELD_ID,
  payload: id
} );

export const setPaginationPosition = ( position ) => ( {
  type: SET_PAGINATION_POSITION,
  payload: position
} );

export const toggleFiltersVisibility = () => ( {
  type: TOGGLE_FILTERS_VISIBILITY,
} );

export const setSearchTerm = ( term ) => ( {
  type: SET_SEARCH_TERM,
  payload: term
} );

export const setActiveCompositionBlockId = ( id ) => ( {
  type: SET_ACTIVE_COMPOSITION_BLOCK_ID,
  payload: id
} );

export const unsetActiveCompositionBlockId = () => ( {
  type: UNSET_ACTIVE_COMPOSITION_BLOCK_ID,
} );

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Reducers
 * ===========
 * ===========
 * ===========
 * ===========
 */

/**
 * Default/fallback state of the chunks edition ui state
 */
const UI_DEFAULT_STATE = {
  displayFilterMode: 'all',
  displayFilterParam: undefined,
  metadataVisible: false,
  previewVisible: false,
  activeFieldId: undefined,
  paginationPosition: 0,
  filtersVisible: false,
  activeCompositionBlockId: undefined,
  searchTerm: '',
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 * @todo automate status messages management in all ui reducers
 */
function ui( state = UI_DEFAULT_STATE, action ) {
  const payload = action.payload;
  switch ( action.type ) {
  case '@@redux-pouchdb/INIT':
    return {
      ...state,
      stateLoaded: true
    };

  case SET_FILTER_DISPLAY_MODE:
    return {
      ...state,
      displayFilterMode: payload,
      displayFilterParam: undefined,
      paginationPosition: 0
    };
  case SET_FILTER_DISPLAY_PARAM:
    return {
      ...state,
      displayFilterParam: payload,
      paginationPosition: 0,
    };
  case SET_METADATA_VISIBILITY:
    return {
      ...state,
      metadataVisible: payload
    };
  case SET_PREVIEW_VISIBILITY:
    return {
      ...state,
      previewVisible: payload
    };
  case SET_ACTIVE_FIELD_ID:
    return {
      ...state,
      activeFieldId: payload
    };
  case SET_PAGINATION_POSITION:
    return {
      ...state,
      paginationPosition: payload
    };
  case TOGGLE_FILTERS_VISIBILITY:
    return {
      ...state,
      filtersVisible: !state.filtersVisible
    };
  case SET_SEARCH_TERM:
    return {
      ...state,
      searchTerm: payload,
    };
  case SET_ACTIVE_COMPOSITION_BLOCK_ID:
    return {
      ...state,
      activeCompositionBlockId: payload
    };
  case UNSET_ACTIVE_COMPOSITION_BLOCK_ID:
    return {
      ...state,
      activeCompositionBlockId: undefined,
    };
  case GET_CORPUS:
    return {
      ...state,
      stateLoaded: false,
    };
  case `${GET_CORPUS}_SUCCESS`:
  case `${GET_CORPUS}_FAIL`:
    return {
      ...state,
      stateLoaded: true,
    }
  default:
    return state;
  }
}

const DATA_DEFAULT_STATE = {
  editedMedia: undefined
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data( state = DATA_DEFAULT_STATE, action ) {
  // const payload = action.payload;
  switch ( action.type ) {

  default:
    return state;
  }
}

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Exported reducer
 * ===========
 * ===========
 * ===========
 * ===========
 */

/**
 * The module exports a reducer
 */
export default combineReducers( {
  ui,
  data,
} );

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Selectors
 * ===========
 * ===========
 * ===========
 * ===========
 */
/**
 * Selectors related to the feature
 */
const displayFilterMode = ( state ) => state.ui.displayFilterMode;
const displayFilterParam = ( state ) => state.ui.displayFilterParam;
const metadataVisible = ( state ) => state.ui.metadataVisible;
const previewVisible = ( state ) => state.ui.previewVisible;
const activeFieldId = ( state ) => state.ui.activeFieldId;
const paginationPosition = ( state ) => state.ui.paginationPosition;
const filtersVisible = ( state ) => state.ui.filtersVisible;
const searchTerm = ( state ) => state.ui.searchTerm;
const activeCompositionBlockId = ( state ) => state.ui.activeCompositionBlockId;
const stateLoaded = ( state ) => state.ui.stateLoaded;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector( {
  displayFilterMode,
  displayFilterParam,
  metadataVisible,
  previewVisible,
  activeFieldId,
  paginationPosition,
  filtersVisible,
  searchTerm,
  activeCompositionBlockId,
  stateLoaded,
} );
