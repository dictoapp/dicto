/**
 * This module exports logic-related elements for the chunks edition feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module dicto/features/ChunksEdition
 */

import { combineReducers } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  requestChunkViewData,
} from '../../helpers/dataClient';

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
  GET_CHUNK_VIEW_DATA,
  SET_MEDIA_DURATION,
} from '../../redux/duck';

const PROMPT_NEW_MEDIA = '§dicto/ChunksEdition/PROMPT_NEW_MEDIA';
const UNPROMPT_NEW_MEDIA = '§dicto/ChunksEdition/UNPROMPT_NEW_MEDIA';
const PROMPT_MEDIA_EDITION = '§dicto/ChunksEdition/PROMPT_MEDIA_EDITION';
const UNPROMPT_MEDIA_EDITION = '§dicto/ChunksEdition/UNPROMPT_MEDIA_EDITION';
const PROMPT_MEDIA_DELETION = '§dicto/ChunksEdition/PROMPT_MEDIA_DELETION';
const UNPROMPT_MEDIA_DELETION = '§dicto/ChunksEdition/UNPROMPT_MEDIA_DELETION';
const PROMPT_IMPORT = '§dicto/ChunksEdition/PROMPT_IMPORT';
const UNPROMPT_IMPORT = '§dicto/ChunksEdition/UNPROMPT_IMPORT';
const PROMPT_EDITOR_MODAL = '§dicto/ChunksEdition/PROMPT_EDITOR_MODAL';
const UNPROMPT_EDITOR_MODAL = '§dicto/ChunksEdition/UNPROMPT_EDITOR_MODAL';
const SET_EDITED_TAG_ID = '§dicto/ChunksEdition/SET_EDITED_TAG_ID';
const UNSET_EDITED_TAG_ID = '§dicto/ChunksEdition/UNSET_EDITED_TAG_ID';
const SET_PROMPTED_TO_DELETE_FIELD_ID = '§dicto/ChunksEdition/SET_PROMPTED_TO_DELETE_FIELD_ID';
const SET_IS_DRAGGING = '§dicto/ChunksEdition/SET_IS_DRAGGING';
const SET_OPTIONS_DROPDOWN_OPEN = '§dicto/ChunksEdition/SET_OPTIONS_DROPDOWN_OPEN';
const SET_TAGS_DROPDOWN_OPEN = '§dicto/ChunksEdition/SET_TAGS_DROPDOWN_OPEN';
const SET_SHORTCUTS_HELP_VISIBILITY = '§dicto/ChunksEdition/SET_SHORTCUTS_HELP_VISIBILITY';
const SET_TEMP_NEW_FIELD_TITLE = '§dicto/ChunksEdition/SET_TEMP_NEW_FIELD_TITLE';
const SET_EDITED_FIELD_ID = '§dicto/ChunksEdition/SET_EDITED_FIELD_ID';
const SET_EDITED_FIELD_TEMP_NAME = '§dicto/ChunksEdition/SET_EDITED_FIELD_TEMP_NAME';
const SET_TAG_SEARCH_TERM = '§dicto/ChunksEdition/SET_TAG_SEARCH_TERM';
const SET_NEW_TAG_PROMPTED = '§dicto/ChunksEdition/SET_NEW_TAG_PROMPTED';
const SET_NEW_TAG_TEMP_DATA = '§dicto/ChunksEdition/SET_NEW_TAG_TEMP_DATA';
const SET_ALLOW_EXAMPLE_PROMPTED = '§dicto/ChunksEdition/SET_ALLOW_EXAMPLE_PROMPTED';
const SET_EXPORT_MEDIA_PROMPTED = '§dicto/ChunksEdition/SET_EXPORT_MEDIA_PROMPTED';

const SET_ACTIVE_MEDIA_ID = '§dicto/ChunksEdition/SET_ACTIVE_MEDIA_ID';
const SET_ACTIVE_FIELD_ID = '§dicto/ChunksEdition/SET_ACTIVE_FIELD_ID';

const SET_MEDIA_PLAYING = '§dicto/ChunksEdition/SET_MEDIA_PLAYING';
const SET_MEDIA_CURRENT_TIME = '§dicto/ChunksEdition/SET_MEDIA_CURRENT_TIME';
const SEEK_TO_MEDIA_TIME = '§dicto/ChunksEdition/SEEK_TO_MEDIA_TIME';
const SET_CHUNK_SPACE_RATIO = '§dicto/ChunksEdition/SET_CHUNK_SPACE_RATIO';
const SET_CHUNK_SPACE_TIME_SCROLL = '§dicto/ChunksEdition/SET_CHUNK_SPACE_TIME_SCROLL';
const SET_SCROLL_TARGET_IN_SECONDS = '§dicto/ChunksEdition/SET_SCROLL_TARGET_IN_SECONDS';
const SELECT_CHUNK = '§dicto/ChunksEdition/SELECT_CHUNK';
const SET_SCROLL_LOCKED = '§dicto/ChunksEdition/SET_SCROLL_LOCKED';

const SET_MEDIA_CHOICE_VISIBILITY = '§dicto/ChunksEdition/SET_MEDIA_CHOICE_VISIBILITY';
const SET_EDITION_MODE = '§dicto/ChunksEdition/SET_EDITION_MODE';
const SET_ACTIVE_TAG_CATEGORY_ID = '§dicto/ChunksEdition/SET_ACTIVE_TAG_CATEGORY_ID';
const TOGGLE_CHUNK_EDITOR_EXPANDED = '§dicto/ChunksEdition/TOGGLE_CHUNK_EDITOR_EXPANDED';
const SET_LEFT_COLUMN_WIDTH = '§dicto/ChunksEdition/SET_LEFT_COLUMN_WIDTH';
const SET_NEW_TAG_CATEGORY_PROMPTED = '§dicto/ChunksEdition/SET_NEW_TAG_CATEGORY_PROMPTED';

const SET_IMPORTED_CHUNK_CANDIDATES = '§dicto/ChunksEdition/SET_IMPORTED_CHUNK_CANDIDATES';

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
export const promptNewMedia = () => ( {
  type: PROMPT_NEW_MEDIA
} );

export const unpromptNewMedia = () => ( {
  type: UNPROMPT_NEW_MEDIA
} );

export const promptMediaEdition = ( corpusId, mediaId, media ) => ( {
  type: PROMPT_MEDIA_EDITION,
  payload: {
    corpusId,
    mediaId,
    media
  }
} );

export const unpromptMediaEdition = () => ( {
  type: UNPROMPT_MEDIA_EDITION
} );

export const promptMediaDeletion = ( corpusId, mediaId ) => ( {
  type: PROMPT_MEDIA_DELETION,
  payload: {
    corpusId,
    mediaId
  }
} );

export const setIsDragging = ( isDragging ) => ( {
  type: SET_IS_DRAGGING,
  payload: {
    isDragging
  }
} );

export const unpromptMediaDeletion = () => ( {
  type: UNPROMPT_MEDIA_DELETION
} );

export const setActiveMediaId = ( mediaId ) => ( {
  type: SET_ACTIVE_MEDIA_ID,
  payload: mediaId
} );

export const setActiveFieldId = ( fieldId ) => ( {
  type: SET_ACTIVE_FIELD_ID,
  payload: fieldId
} );

export const setMediaPlaying = ( playing ) => ( {
  type: SET_MEDIA_PLAYING,
  payload: playing
} );

export const setMediaCurrentTime = ( currentTime ) => ( {
  type: SET_MEDIA_CURRENT_TIME,
  payload: currentTime
} );

export const seekToMediaTime = ( time ) => ( {
  type: SEEK_TO_MEDIA_TIME,
  payload: time
} );

export const setChunkSpaceRatio = ( ratio ) => ( {
  type: SET_CHUNK_SPACE_RATIO,
  payload: ratio
} );

export const setChunkSpaceTimeScroll = ( values ) => ( {
  type: SET_CHUNK_SPACE_TIME_SCROLL,
  payload: values
} );

export const setScrollTargetInSeconds = ( seconds ) => ( {
  type: SET_SCROLL_TARGET_IN_SECONDS,
  payload: seconds
} );

export const selectChunk = ( chunkId ) => ( {
  type: SELECT_CHUNK,
  payload: chunkId
} );

export const setMediaChoiceVisibility = ( visible ) => ( {
  type: SET_MEDIA_CHOICE_VISIBILITY,
  payload: visible
} );

export const setScrollLocked = ( locked ) => ( {
  type: SET_SCROLL_LOCKED,
  payload: locked
} );

export const setEditionMode = ( mode ) => ( {
  type: SET_EDITION_MODE,
  payload: mode
} );

export const setActiveTagCategoryId = ( id ) => ( {
  type: SET_ACTIVE_TAG_CATEGORY_ID,
  payload: id
} );

export const toggleChunkEditorExpanded = () => ( {
  type: TOGGLE_CHUNK_EDITOR_EXPANDED,
} );

export const promptImport = () => ( {
  type: PROMPT_IMPORT
} );

export const unpromptImport = () => ( {
  type: UNPROMPT_IMPORT
} );

export const setImportedChunkCandidates = ( chunks ) => ( {
  type: SET_IMPORTED_CHUNK_CANDIDATES,
  payload: chunks
} );

export const setLeftColumnWidth = ( width ) => ( {
  type: SET_LEFT_COLUMN_WIDTH,
  payload: width
} );

export const promptEditorModal = () => ( {
  type: PROMPT_EDITOR_MODAL
} );

export const unpromptEditorModal = () => ( {
  type: UNPROMPT_EDITOR_MODAL
} );

export const setEditedTagId = ( id ) => ( {
  type: SET_EDITED_TAG_ID,
  payload: id
} );

export const unsetEditedTagId = () => ( {
  type: UNSET_EDITED_TAG_ID
} );

export const setPromptedToDeleteFieldId = ( payload ) => ( {
  type: SET_PROMPTED_TO_DELETE_FIELD_ID,
  payload
} );

export const setOptionsDropdownOpen = ( payload ) => ( {
  type: SET_OPTIONS_DROPDOWN_OPEN,
  payload
} );

export const setTagsDropdownOpen = ( payload ) => ( {
  type: SET_TAGS_DROPDOWN_OPEN,
  payload
} );

export const setShortcutsHelpVisibility = ( payload ) => ( {
  type: SET_SHORTCUTS_HELP_VISIBILITY,
  payload
} );

export const setTempNewFieldTitle = ( payload ) => ( {
  type: SET_TEMP_NEW_FIELD_TITLE,
  payload,
} );

export const setEditedFieldId = ( payload ) => ( {
  type: SET_EDITED_FIELD_ID,
  payload,
} );

export const setEditedFieldTempName = ( payload ) => ( {
  type: SET_EDITED_FIELD_TEMP_NAME,
  payload,
} );

export const setTagSearchTerm = ( payload ) => ( {
  type: SET_TAG_SEARCH_TERM,
  payload,
} );

export const setNewTagPrompted = ( payload ) => ( {
  type: SET_NEW_TAG_PROMPTED,
  payload,
} );

export const setNewTagTempData = ( payload ) => ( {
  type: SET_NEW_TAG_TEMP_DATA,
  payload,
} );

export const setNewTagCategoryPrompted = ( payload ) => ( {
  type: SET_NEW_TAG_CATEGORY_PROMPTED,
  payload,
} )

export const setAllowExamplePrompted = ( payload ) => ( {
  type: SET_ALLOW_EXAMPLE_PROMPTED,
  payload,
} );

export const setExportMediaPrompted = ( payload ) => ( {
  type: SET_EXPORT_MEDIA_PROMPTED,
  payload,
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
  newMediaPrompted: false,
  mediaPromptedToDelete: undefined,
  activeMediaId: undefined,
  mediaPlaying: false,
  mediaCurrentTime: 0,
  mediaDuration: undefined,
  seekedTime: undefined,
  chunkSpaceRatio: 10,
  chunkSpaceTimeScroll: {},
  scrollTargetInSeconds: undefined,
  selectedChunkId: undefined,
  activeFieldId: undefined,
  mediaChoiceVisible: false,
  scrollLocked: false,
  editionMode: 'fields',
  activeTagCategoryId: undefined,
  isChunkEditorExpanded: false,
  importPrompted: false,
  editorModalOpen: false,
  leftColumnWidth: 6,
  editedTagId: undefined,
  promptedToDeleteFieldId: undefined,
  isDragging: false,
  optionsDropdownOpen: false,
  tagsDropdownOpen: false,
  shortcutsHelpVisibility: false,
  setTempNewFieldTitle: undefined,
  editedFieldId: undefined,
  editedFieldTempName: undefined,
  tagSearchTerm: '',
  newTagPrompted: false,
  newTagTempData: {},
  allowExamplePrompted: false,
  exportMediaPrompted: false,
  stateLoaded: false,
  newTagCategoryPrompted: false,
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
  case SET_IS_DRAGGING:
    return {
      ...state,
      isDragging: payload.isDragging,
    };
  case PROMPT_NEW_MEDIA:
    return {
      ...state,
      newMediaPrompted: true,
      mediaPlaying: false,
    };
  case UNPROMPT_NEW_MEDIA:
    return {
      ...state,
      newMediaPrompted: false
    };
  case PROMPT_MEDIA_DELETION:
    return {
      ...state,
      mediaPromptedToDelete: payload,
      mediaPlaying: false,
    };
  case UNPROMPT_MEDIA_DELETION:
    return {
      ...state,
      mediaPromptedToDelete: undefined
    };
  case SET_ACTIVE_MEDIA_ID:
    return {
      ...state,
      activeMediaId: payload,
      mediaPlaying: false,
      mediaCurrentTime: UI_DEFAULT_STATE.mediaCurrentTime,
      mediaDuration: UI_DEFAULT_STATE.mediaDuration,
      seekedTime: UI_DEFAULT_STATE.seekedTime,
      chunkSpaceRatio: UI_DEFAULT_STATE.chunkSpaceRatio,
      chunkSpaceTimeScroll: UI_DEFAULT_STATE.chunkSpaceTimeScroll,
      scrollTargetInSeconds: UI_DEFAULT_STATE.scrollTargetInSeconds,
      scrollLocked: UI_DEFAULT_STATE.scrollLocked,
      importPrompted: UI_DEFAULT_STATE.importPrompted,
      mediaPlaying: false,
    };
  case SET_MEDIA_PLAYING:
    return {
      ...state,
      mediaPlaying: payload
    };
  case SET_MEDIA_CURRENT_TIME:
    return {
      ...state,
      mediaCurrentTime: payload,
      seekedTime: undefined,
    };
  case SET_MEDIA_DURATION:
    return {
      ...state,
      mediaDuration: payload.duration
    };
  case SEEK_TO_MEDIA_TIME:
    return {
      ...state,
      seekedTime: payload
    };
  case SET_NEW_TAG_CATEGORY_PROMPTED:
    return {
      ...state,
      newTagCategoryPrompted: payload
    };
  case SET_CHUNK_SPACE_RATIO:
    return {
      ...state,
      chunkSpaceRatio: payload
    };
  case SET_CHUNK_SPACE_TIME_SCROLL:
    return {
      ...state,
      chunkSpaceTimeScroll: payload
    };
  case SET_SCROLL_TARGET_IN_SECONDS:
    return {
      ...state,
      scrollTargetInSeconds: payload
    };

  case SELECT_CHUNK:
    return {
      ...state,
      selectedChunkId: payload
    };
  case SET_ACTIVE_FIELD_ID:
    return {
      ...state,
      activeFieldId: payload
    };
  case SET_MEDIA_CHOICE_VISIBILITY:
    return {
      ...state,
      mediaChoiceVisible: payload,
      mediaPlaying: false,
    };
  case SET_SCROLL_LOCKED:
    return {
      ...state,
      scrollLocked: payload
    };
  case SET_EDITION_MODE:
    return {
      ...state,
      editionMode: payload
    };
  case SET_ACTIVE_TAG_CATEGORY_ID:
    return {
      ...state,
      activeTagCategoryId: payload
    };

  case TOGGLE_CHUNK_EDITOR_EXPANDED:
    return {
      ...state,
      isChunkEditorExpanded: !state.isChunkEditorExpanded
    };
  case PROMPT_IMPORT:
    return {
      ...state,
      importPrompted: true,
      mediaPlaying: false,
    };
  case UNPROMPT_IMPORT:
    return {
      ...state,
      importPrompted: false
    };
  case SET_LEFT_COLUMN_WIDTH:
    return {
      ...state,
      leftColumnWidth: payload
    };
  case PROMPT_EDITOR_MODAL:
    return {
      ...state,
      editorModalOpen: true
    };
  case UNPROMPT_EDITOR_MODAL:
    return {
      ...state,
      editorModalOpen: false
    };
  case SET_EDITED_TAG_ID:
    return {
      ...state,
      editedTagId: payload,
      mediaPlaying: false,
    };
  case UNSET_EDITED_TAG_ID:
    return {
      ...state,
      editedTagId: undefined,
    };
  case SET_PROMPTED_TO_DELETE_FIELD_ID:
    return {
      ...state,
      promptedToDeleteFieldId: action.payload
    };
  case SET_OPTIONS_DROPDOWN_OPEN:
    return {
      ...state,
      optionsDropdownOpen: action.payload,
      tempNewFieldTitle: undefined,
    };
  case SET_TAGS_DROPDOWN_OPEN:
    return {
      ...state,
      tagsDropdownOpen: action.payload,
      tempNewFieldTitle: undefined,
      tagSearchTerm: ''
    };
  case SET_SHORTCUTS_HELP_VISIBILITY:
    return {
      ...state,
      shortcutsHelpVisibility: action.payload,
      tempNewFieldTitle: undefined,
      mediaPlaying: false,
    };
  case SET_TEMP_NEW_FIELD_TITLE:
    return {
      ...state,
      tempNewFieldTitle: action.payload,
    };
  case SET_EDITED_FIELD_ID:
    return {
      ...state,
      editedFieldId: action.payload,
    };
  case SET_EDITED_FIELD_TEMP_NAME:
    return {
      ...state,
      editedFieldTempName: action.payload,
    };
  case SET_TAG_SEARCH_TERM:
    return {
      ...state,
      tagSearchTerm: action.payload,
    };
  case SET_NEW_TAG_PROMPTED:
    return {
      ...state,
      newTagPrompted: action.payload,
      newTagTempData: {},
      mediaPlaying: false,
    };
  case SET_NEW_TAG_TEMP_DATA:
    return {
      ...state,
      newTagTempData: action.payload,
    };
  case SET_ALLOW_EXAMPLE_PROMPTED:
    return {
      ...state,
      allowExamplePrompted: action.payload,
      mediaPlaying: false,
    };
  case SET_EXPORT_MEDIA_PROMPTED:
    return {
      ...state,
      exportMediaPrompted: action.payload,
      mediaPlaying: false,
    };
  case GET_CHUNK_VIEW_DATA:
    return {
      ...state,
      stateLoaded: false,
    };
  case `${GET_CHUNK_VIEW_DATA}_SUCCESS`:
  case `${GET_CHUNK_VIEW_DATA}_FAIL`:
    return {
      ...state,
      stateLoaded: true,
    };
  default:
    return state;
  }
}

const DATA_DEFAULT_STATE = {
  editedMedia: undefined,
  importedChunkCandidates: [],
  chunkViewData: undefined,
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data( state = DATA_DEFAULT_STATE, action ) {
  const payload = action.payload;
  switch ( action.type ) {

  case PROMPT_MEDIA_EDITION:
    return {
      ...state,
      editedMedia: payload.media
    };
  case UNPROMPT_MEDIA_EDITION:
    return {
      ...state,
      editedMedia: undefined
    };
  case UNPROMPT_IMPORT:
    return {
      ...state,
      importedChunkCandidates: []
    };
  case SET_IMPORTED_CHUNK_CANDIDATES:
    return {
      ...state,
      importedChunkCandidates: payload
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
const newMediaPrompted = ( state ) => state.ui.newMediaPrompted;
const newTagCategoryPrompted = ( state ) => state.ui.newTagCategoryPrompted;
const mediaPromptedToDelete = ( state ) => state.ui.mediaPromptedToDelete;
const editedMedia = ( state ) => state.data.editedMedia;
const activeMediaId = ( state ) => state.ui.activeMediaId;
const mediaPlaying = ( state ) => state.ui.mediaPlaying;
const mediaCurrentTime = ( state ) => state.ui.mediaCurrentTime;
const mediaDuration = ( state ) => state.ui.mediaDuration;
const seekedTime = ( state ) => state.ui.seekedTime;
const chunkSpaceRatio = ( state ) => state.ui.chunkSpaceRatio;
const chunkSpaceTimeScroll = ( state ) => state.ui.chunkSpaceTimeScroll;
const scrollTargetInSeconds = ( state ) => state.ui.scrollTargetInSeconds;
const selectedChunkId = ( state ) => state.ui.selectedChunkId;
const activeFieldId = ( state ) => state.ui.activeFieldId;
const mediaChoiceVisible = ( state ) => state.ui.mediaChoiceVisible;
const scrollLocked = ( state ) => state.ui.scrollLocked;
const editionMode = ( state ) => state.ui.editionMode;
const activeTagCategoryId = ( state ) => state.ui.activeTagCategoryId;
const isChunkEditorExpanded = ( state ) => state.ui.isChunkEditorExpanded;
const importPrompted = ( state ) => state.ui.importPrompted;
const leftColumnWidth = ( state ) => state.ui.leftColumnWidth;
const editorModalOpen = ( state ) => state.ui.editorModalOpen;
const importedChunkCandidates = ( state ) => state.data.importedChunkCandidates;
const editedTagId = ( state ) => state.ui.editedTagId;
const promptedToDeleteFieldId = ( state ) => state.ui.promptedToDeleteFieldId;
const isDragging = ( state ) => state.ui.isDragging;
const optionsDropdownOpen = ( state ) => state.ui.optionsDropdownOpen;
const tagsDropdownOpen = ( state ) => state.ui.tagsDropdownOpen;
const shortcutsHelpVisibility = ( state ) => state.ui.shortcutsHelpVisibility;
const tempNewFieldTitle = ( state ) => state.ui.tempNewFieldTitle;
const editedFieldId = ( state ) => state.ui.editedFieldId;
const editedFieldTempName = ( state ) => state.ui.editedFieldTempName;
const tagSearchTerm = ( state ) => state.ui.tagSearchTerm;
const newTagPrompted = ( state ) => state.ui.newTagPrompted;
const newTagTempData = ( state ) => state.ui.newTagTempData;
const allowExamplePrompted = ( state ) => state.ui.allowExamplePrompted;
const exportMediaPrompted = ( state ) => state.ui.exportMediaPrompted;
const stateLoaded = ( state ) => state.ui.stateLoaded;

const chunkViewData = ( state ) => state.data.chunkViewData;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector( {
  newMediaPrompted,
  editedMedia,
  mediaPromptedToDelete,
  newTagCategoryPrompted,
  activeMediaId,
  mediaPlaying,
  mediaCurrentTime,
  mediaDuration,
  seekedTime,
  chunkSpaceRatio,
  chunkSpaceTimeScroll,
  scrollTargetInSeconds,
  selectedChunkId,
  activeFieldId,
  mediaChoiceVisible,
  scrollLocked,
  editionMode,
  activeTagCategoryId,
  isChunkEditorExpanded,
  importPrompted,
  importedChunkCandidates,
  leftColumnWidth,
  editorModalOpen,
  editedTagId,
  stateLoaded,
  promptedToDeleteFieldId,
  isDragging,
  optionsDropdownOpen,
  tagsDropdownOpen,
  shortcutsHelpVisibility,
  tempNewFieldTitle,
  editedFieldId,
  editedFieldTempName,
  tagSearchTerm,
  newTagPrompted,
  newTagTempData,
  allowExamplePrompted,
  exportMediaPrompted,
  stateLoaded,

  chunkViewData,
} );
