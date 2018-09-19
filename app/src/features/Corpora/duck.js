/**
 * This module exports logic-related elements for the corpora feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module dicto/features/Corpora
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
  GET_CORPORA,
  GET_CORPUS,
  CREATE_CORPUS,
  UPDATE_CORPUS,
  DELETE_CORPUS,
  FORGET_DATA,
} from '../../redux/duck';

const RESET_UI = '§dicto/Corpora/RESET_UI';
const PROMPT_NEW_CORPUS = '§dicto/Corpora/PROMPT_NEW_CORPUS';
const UNPROMPT_NEW_CORPUS = '§dicto/Corpora/UNPROMPT_NEW_CORPUS';
const PROMPT_NEW_MEDIA = '§dicto/Corpora/PROMPT_NEW_MEDIA';
const PROMPT_NEW_TAG = '§dicto/Corpora/PROMPT_NEW_TAG';
const UNPROMPT_NEW_TAG = '§dicto/Corpora/UNPROMPT_NEW_TAG';
const UNPROMPT_NEW_MEDIA = '§dicto/Corpora/UNPROMPT_NEW_MEDIA';
const SET_PROMPTED_TO_DELETE_CORPUS_ID = '§dicto/Corpora/SET_PROMPTED_TO_DELETE_CORPUS_ID';
const SET_PROMPTED_TO_DELETE_MEDIA_ID = '§dicto/Corpora/SET_PROMPTED_TO_DELETE_MEDIA_ID';
const SET_PROMPTED_TO_DELETE_COMPOSITION_ID = '§dicto/Corpora/SET_PROMPTED_TO_DELETE_COMPOSITION_ID';
const SET_MEDIA_SEARCH_STRING = '§dicto/Corpora/SET_MEDIA_SEARCH_STRING';
const SET_COMPOSITIONS_SEARCH_STRING = '§dicto/Corpora/SET_COMPOSITIONS_SEARCH_STRING';
const SET_TAGS_SEARCH_STRING = '§dicto/Corpora/SET_TAGS_SEARCH_STRING';
const SET_ACTIVE_SUBVIEW = '§dicto/Corpora/SET_ACTIVE_SUBVIEW';
const SET_ASIDE_MEDIA_ID = '§dicto/Corpora/SET_ASIDE_MEDIA_ID';
const SET_ASIDE_COMPOSITION_ID = '§dicto/Corpora/SET_ASIDE_COMPOSITION_ID';
const SET_ASIDE_TAG_ID = '§dicto/Corpora/SET_ASIDE_TAG_ID';
const SET_ASIDE_TAG_MODE = '§dicto/Corpora/SET_ASIDE_TAG_MODE';

const SET_IMPORT_MODAL_VISIBLE = '§dicto/Corpora/SET_IMPORT_MODAL_VISIBLE';
const SET_IMPORT_CORPUS_CANDIDATE = '§dicto/Corpora/SET_IMPORT_CORPUS_CANDIDATE';
const SET_IMPORT_COLLISIONS_LIST = '§dicto/Corpora/SET_IMPORT_COLLISIONS_LIST';

const SET_VISIBLE_TAG_CATEGORIES_IDS = '§dicto/Corpora/SET_VISIBLE_TAG_CATEGORIES_IDS';
const SET_PROMPTED_TO_DELETE_TAG_CATEGORY_ID = '§dicto/Corpora/SET_PROMPTED_TO_DELETE_TAG_CATEGORY_ID';
const SET_PROMPTED_TO_DELETE_TAG_ID = '§dicto/Corpora/SET_PROMPTED_TO_DELETE_TAG_ID';

const PROMPT_CORPUS_METADATA_EDITION = '§dicto/Corpora/PROMPT_CORPUS_METADATA_EDITION';
const UNPROMPT_CORPUS_METADATA_EDITION = '§dicto/Corpora/UNPROMPT_CORPUS_METADATA_EDITION';

const PROMPT_NEW_COMPOSITION = '§dicto/Corpora/PROMPT_NEW_COMPOSITION';
const UNPROMPT_NEW_COMPOSITION = '§dicto/Corpora/UNPROMPT_NEW_COMPOSITION';

const OPEN_PREVIEW = '§dicto/Corpora/OPEN_PREVIEW';
const CLOSE_PREVIEW = '§dicto/Corpora/CLOSE_PREVIEW';

const PROMPT_NEW_TAG_CATEGORY = '§dicto/Corpora/PROMPT_NEW_TAG_CATEGORY';
const UNPROMPT_NEW_TAG_CATEGORY = '§dicto/Corpora/UNPROMPT_NEW_TAG_CATEGORY';
const SET_EDITED_TAG_CATEGORY_ID = '§dicto/Corpora/SET_EDITED_TAG_CATEGORY_ID';
const SET_EDITED_TAG_ID = '§dicto/Corpora/SET_EDITED_TAG_ID';

const FORGET_CORPORA_LIST  = '§dicto/Corpora/FORGET_CORPORA_LIST';

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
export const resetUi = () => ( {
  type: RESET_UI,
} )
export const promptNewCorpus = () => ( {
  type: PROMPT_NEW_CORPUS
} );

export const unpromptNewCorpus = () => ( {
  type: UNPROMPT_NEW_CORPUS
} );

export const promptNewComposition = () => ( {
  type: PROMPT_NEW_COMPOSITION
} );

export const unpromptNewComposition = () => ( {
  type: UNPROMPT_NEW_COMPOSITION
} );

export const promptCorpusMetadataEdition = () => ( {
  type: PROMPT_CORPUS_METADATA_EDITION
} );

export const unpromptCorpusMetadataEdition = () => ( {
  type: UNPROMPT_CORPUS_METADATA_EDITION
} );

export const promptNewMedia = () => ( {
  type: PROMPT_NEW_MEDIA
} );

export const unpromptNewMedia = () => ( {
  type: UNPROMPT_NEW_MEDIA
} );

export const promptNewTag = ( payload ) => ( {
  type: PROMPT_NEW_TAG,
  payload
} );

export const unpromptNewTag = () => ( {
  type: UNPROMPT_NEW_TAG
} );

export const openPreview = () => ( {
  type: OPEN_PREVIEW
} );

export const closePreview = () => ( {
  type: CLOSE_PREVIEW
} );

export const setPromptedToDeleteCorpusId = ( payload ) => ( {
  type: SET_PROMPTED_TO_DELETE_CORPUS_ID,
  payload
} );

export const setPromptedToDeleteMediaId = ( payload ) => ( {
  type: SET_PROMPTED_TO_DELETE_MEDIA_ID,
  payload
} );

export const setPromptedToDeleteCompositionId = ( payload ) => ( {
  type: SET_PROMPTED_TO_DELETE_COMPOSITION_ID,
  payload
} );

export const setMediaSearchString = ( payload ) => ( {
  type: SET_MEDIA_SEARCH_STRING,
  payload
} );

export const setCompositionsSearchString = ( payload ) => ( {
  type: SET_COMPOSITIONS_SEARCH_STRING,
  payload
} );

export const setTagsSearchString = ( payload ) => ( {
  type: SET_TAGS_SEARCH_STRING,
  payload
} );

export const setActiveSubview = ( payload ) => ( {
  type: SET_ACTIVE_SUBVIEW,
  payload
} );

export const setAsideMediaId = ( payload ) => ( {
  type: SET_ASIDE_MEDIA_ID,
  payload
} );

export const setAsideCompositionId = ( payload ) => ( {
  type: SET_ASIDE_COMPOSITION_ID,
  payload
} );

export const setAsideTagId = ( payload ) => ( {
  type: SET_ASIDE_TAG_ID,
  payload
} );

export const setAsideTagMode = ( payload ) => ( {
  type: SET_ASIDE_TAG_MODE,
  payload
} );

export const setVisibleTagCategoriesIds = ( payload ) => ( {
  type: SET_VISIBLE_TAG_CATEGORIES_IDS,
  payload
} );
export const promptNewTagCategory = ( payload ) => ( {
  type: PROMPT_NEW_TAG_CATEGORY,
  payload
} );
export const unpromptNewTagCategory = ( payload ) => ( {
  type: UNPROMPT_NEW_TAG_CATEGORY,
  payload
} );
export const setEditedTagCategoryId = ( payload ) => ( {
  type: SET_EDITED_TAG_CATEGORY_ID,
  payload
} );
export const setEditedTagId = ( payload ) => ( {
  type: SET_EDITED_TAG_ID,
  payload
} );
export const setPromptedToDeleteTagCategoryId = ( payload ) => ( {
  type: SET_PROMPTED_TO_DELETE_TAG_CATEGORY_ID,
  payload
} );
export const setPromptedToDeleteTagId = ( payload ) => ( {
  type: SET_PROMPTED_TO_DELETE_TAG_ID,
  payload
} );

export const setImportModalVisible = ( payload ) => ( {
  type: SET_IMPORT_MODAL_VISIBLE,
  payload,
} );

export const setImportCorpusCandidate = ( payload ) => ( {
  type: SET_IMPORT_CORPUS_CANDIDATE,
  payload,
} );

export const setImportCollisionsList = ( payload ) => ( {
  type: SET_IMPORT_COLLISIONS_LIST,
  payload,
} );

export const forgetCorporaList = ( payload ) => ( {
  type: FORGET_CORPORA_LIST,
} )

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
 * Default/fallback state of the corpora ui state
 */
const UI_DEFAULT_STATE = {
  creationModalOpen: false,
  corpusMetadataModalOpen: false,
  newCompositionModalOpen: false,
  newMediaPrompted: false,
  newTagPrompted: false,
  previewModalOpen: false,
  promptedToDeleteCorpusId: undefined,
  promptedToDeleteMediaId: undefined,
  promptedToDeleteCompositionId: undefined,
  stateLoaded: false,
  mediaSearchString: '',
  compositionsSearchString: '',
  tagsSearchString: '',

  asideTagMode: 'unlink',

  activeSubview: 'medias',
  asideMediaId: undefined,
  asideCompositionId: undefined,
  asideTagId: undefined,
  visibleTagCategoriesIds: [],
  newTagCategoryPrompted: false,
  editedTagCategoryId: undefined,
  promptedToDeleteTagCategoryId: undefined,
  promptedToDeleteTagId: undefined,
  editedTagId: undefined,
  importModalVisible: false,
  loadingCorpora: false,
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 * @todo automate status messages management in all ui reducers
 */
function ui( state = UI_DEFAULT_STATE, action ) {
  switch ( action.type ) {
  case '@@redux-pouchdb/INIT':
    return {
      ...state,
      stateLoaded: true
    };
  case RESET_UI:
    return UI_DEFAULT_STATE;
  case GET_CORPUS:
    return {
      ...state,
      stateLoaded: false,
    };
  case `${GET_CORPUS}_SUCCESS`:
  case `${GET_CORPUS}_FAIL`:
    return {
      ...state,
      stateLoaded: true
    }
  case PROMPT_NEW_CORPUS:
    return {
      ...state,
      creationModalOpen: true
    };
  case UNPROMPT_NEW_CORPUS:
    return {
      ...state,
      creationModalOpen: false
    };

  case SET_ACTIVE_SUBVIEW:
    return {
      ...state,
      activeSubview: action.payload
    };

  case PROMPT_CORPUS_METADATA_EDITION:
    return {
      ...state,
      corpusMetadataModalOpen: true
    };
  case UNPROMPT_CORPUS_METADATA_EDITION:
    return {
      ...state,
      corpusMetadataModalOpen: false,
      newCompositionModalOpen: false
    };

  case PROMPT_NEW_COMPOSITION:
    return {
      ...state,
      newCompositionModalOpen: true
    };
  case UNPROMPT_NEW_COMPOSITION:
    return {
      ...state,
      newCompositionModalOpen: false,
      corpusMetadataModalOpen: false
    };
  case PROMPT_NEW_MEDIA:
    return {
      ...state,
      newMediaPrompted: true
    };
  case UNPROMPT_NEW_MEDIA:
    return {
      ...state,
      newMediaPrompted: false
    };
  case PROMPT_NEW_TAG:
    return {
      ...state,
      newTagPrompted: action.payload
    };
  case UNPROMPT_NEW_TAG:
    return {
      ...state,
      newTagPrompted: false
    };
  case PROMPT_NEW_TAG_CATEGORY:
    return {
      ...state,
      newTagCategoryPrompted: true,
    };
  case UNPROMPT_NEW_TAG_CATEGORY:
    return {
      ...state,
      newTagCategoryPrompted: false
    };
  case SET_EDITED_TAG_CATEGORY_ID:
    return {
      ...state,
      editedTagCategoryId: action.payload
    };
  case SET_EDITED_TAG_ID:
    return {
      ...state,
      editedTagId: action.payload
    };
  case OPEN_PREVIEW:
    return {
      ...state,
      previewModalOpen: true
    };

  case CLOSE_PREVIEW:
    return {
      ...state,
      previewModalOpen: false
    };
  case SET_PROMPTED_TO_DELETE_CORPUS_ID:
    return {
      ...state,
      promptedToDeleteCorpusId: action.payload
    };
  case SET_PROMPTED_TO_DELETE_MEDIA_ID:
    return {
      ...state,
      promptedToDeleteMediaId: action.payload
    };
  case SET_PROMPTED_TO_DELETE_COMPOSITION_ID:
    return {
      ...state,
      promptedToDeleteCompositionId: action.payload
    };
  case SET_PROMPTED_TO_DELETE_TAG_ID:
    return {
      ...state,
      promptedToDeleteTagId: action.payload
    };
  case SET_MEDIA_SEARCH_STRING:
    return {
      ...state,
      mediaSearchString: action.payload
    };
  case SET_COMPOSITIONS_SEARCH_STRING:
    return {
      ...state,
      compositionsSearchString: action.payload
    };
  case SET_TAGS_SEARCH_STRING:
    return {
      ...state,
      tagsSearchString: action.payload
    };
  case SET_ASIDE_MEDIA_ID:
    return {
      ...state,
      asideMediaId: action.payload,
      asideCompositionId: undefined,
      asideTagId: undefined,
    };
  case SET_ASIDE_COMPOSITION_ID:
    return {
      ...state,
      asideCompositionId: action.payload,
      asideTagId: undefined,
      asideMediaId: undefined,
    };
  case SET_ASIDE_TAG_ID:
    return {
      ...state,
      asideCompositionId: undefined,
      asideMediaId: undefined,
      asideTagId: action.payload,
    };
  case SET_VISIBLE_TAG_CATEGORIES_IDS:
    return {
      ...state,
      visibleTagCategoriesIds: action.payload
    };
  case SET_PROMPTED_TO_DELETE_TAG_CATEGORY_ID:
    return {
      ...state,
      promptedToDeleteTagCategoryId: action.payload
    };
  case SET_ASIDE_TAG_MODE:
    return {
      ...state,
      asideTagMode: action.payload,
    };
  case SET_IMPORT_MODAL_VISIBLE:
    return {
      ...state,
      importModalVisible: action.payload,
    };

  case GET_CORPORA:
    return {
      ...state,
      loadingCorpora: true
    };
  case `${GET_CORPORA}_SUCCESS`:
  case `${GET_CORPORA}_FAIL`:
    return {
      ...state,
      loadingCorpora: false
    };

  default:
    return state;
  }
}

const CORPORA_DEFAULT_STATE = {};

/**
 * Reducer for client view corpora state
 */
function corpora( state = CORPORA_DEFAULT_STATE, action ) {
  let newCorpus;
  switch ( action.type ) {
  case `${DELETE_CORPUS}_SUCCESS`:
  case `${GET_CORPORA}_SUCCESS`:
    const corpora = action.result.data.corpora;
    delete corpora._id;
    delete corpora._rev;
    return {
      ...corpora,
    };
  case FORGET_CORPORA_LIST:
  case FORGET_DATA:
    return {};
  case `${CREATE_CORPUS}_SUCCESS`:
    newCorpus = action.result.data.corpus;
    return {
      ...state,
      [newCorpus.metadata.id]: newCorpus
    };
  case `${UPDATE_CORPUS}_SUCCESS`:
    newCorpus = action.result.data.corpus;
    return {
      ...state,
      [newCorpus.metadata.id]: newCorpus
    };
  default:
    return state;
  }
}

const DATA_DEFAULT_STATE = {
  importCorpusCandidate: undefined,
  importCollisionsList: []
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data( state = DATA_DEFAULT_STATE, action ) {
  switch ( action.type ) {
  case SET_IMPORT_MODAL_VISIBLE:
    if ( action.payload === false ) {
      return {
        ...state,
        importCorpusCandidate: undefined,
        importCollisionsList: []
      };
    }
    return state;
  case SET_IMPORT_CORPUS_CANDIDATE:
    return {
      ...state,
      importCorpusCandidate: action.payload
    };
  case SET_IMPORT_COLLISIONS_LIST:
    return {
      ...state,
      importCollisionsList: action.payload
    };
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
  corpora,
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
const creationModalOpen = ( state ) => state.ui.creationModalOpen;
const corpusMetadataModalOpen = ( state ) => state.ui.corpusMetadataModalOpen;
const newCompositionModalOpen = ( state ) => state.ui.newCompositionModalOpen;
const promptedToDeleteCorpusId = ( state ) => state.ui.promptedToDeleteCorpusId;
const promptedToDeleteMediaId = ( state ) => state.ui.promptedToDeleteMediaId;
const promptedToDeleteCompositionId = ( state ) => state.ui.promptedToDeleteCompositionId;
const newMediaPrompted = ( state ) => state.ui.newMediaPrompted;
const newTagPrompted = ( state ) => state.ui.newTagPrompted;
const previewModalOpen = ( state ) => state.ui.previewModalOpen;
const stateLoaded = ( state ) => state.ui.stateLoaded;
const compositionsSearchString = ( state ) => state.ui.compositionsSearchString;
const mediaSearchString = ( state ) => state.ui.mediaSearchString;
const tagsSearchString = ( state ) => state.ui.tagsSearchString;
const activeSubview = ( state ) => state.ui.activeSubview;
const asideMediaId = ( state ) => state.ui.asideMediaId;
const asideCompositionId = ( state ) => state.ui.asideCompositionId;
const asideTagId = ( state ) => state.ui.asideTagId;
const visibleTagCategoriesIds = ( state ) => state.ui.visibleTagCategoriesIds;
const editedTagCategoryId = ( state ) => state.ui.editedTagCategoryId;
const newTagCategoryPrompted = ( state ) => state.ui.newTagCategoryPrompted;
const asideTagMode = ( state ) => state.ui.asideTagMode;
const importModalVisible = ( state ) => state.ui.importModalVisible;
const loadingCorpora = ( state ) => state.ui.loadingCorpora;

const promptedToDeleteTagCategoryId = ( state ) => state.ui.promptedToDeleteTagCategoryId;
const promptedToDeleteTagId = ( state ) => state.ui.promptedToDeleteTagId;
const editedTagId = ( state ) => state.ui.editedTagId;

const importCorpusCandidate = ( state ) => state.data.importCorpusCandidate;
const importCollisionsList = ( state ) => state.data.importCollisionsList;

const corporaList = ( state ) => state.corpora;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector( {
  creationModalOpen,
  corpusMetadataModalOpen,
  newCompositionModalOpen,
  newMediaPrompted,
  newTagPrompted,
  previewModalOpen,
  asideTagMode,
  promptedToDeleteCorpusId,
  promptedToDeleteMediaId,
  promptedToDeleteCompositionId,
  stateLoaded,
  compositionsSearchString,
  mediaSearchString,
  activeSubview,
  asideMediaId,
  asideCompositionId,
  asideTagId,
  tagsSearchString,
  visibleTagCategoriesIds,
  loadingCorpora,

  editedTagCategoryId,
  newTagCategoryPrompted,
  promptedToDeleteTagCategoryId,
  promptedToDeleteTagId,
  editedTagId,
  importModalVisible,

  importCorpusCandidate,
  importCollisionsList,
  corporaList,
} );
