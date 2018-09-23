/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the montages container
 * @module dicto/features/Corpora
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import defaults from 'json-schema-defaults';
import { v4 as genId } from 'uuid';
import { toastr } from 'react-redux-toastr';
import { uniq, flatten } from 'lodash';
import { tsvFormat } from 'd3-dsv';
import Ajv from 'ajv';
import schema from 'dicto-schema';

import { getFileAsText } from '../../../helpers/fileLoader';

import { withRouter } from 'react-router';

import Layout from '../../Layout/components/LayoutContainer.js';

import CorpusLayout from './CorpusLayout';
import * as duck from '../duck';
import * as data from '../../../redux/duck';

import download from '../../../helpers/fileDownloader';
import { buildCorpusRendering } from '../../../helpers/builders';
import {
  getCorpusCollisions,
  mergeCorpuses,
  mergeMedia,
  mergeTag,
  mergeTagCategory,
  forgetMedia,
  forgetTag,
  forgetTagCategory,
} from '../../../helpers/importCorpus';

import { inElectron, default as requestMain, corpusNeedsBundling, transformCorpusForExport } from '../../../helpers/electronUtils';

const ajv = new Ajv();

let showSaveDialog;
let shell;
if ( inElectron ) {
  const electron = require( 'electron' );
  showSaveDialog = electron.remote.dialog.showSaveDialog;
  shell = electron.shell;
}

@withRouter

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  ( state ) => ( {
    ...duck.selector( state.corpora ),
    ...data.selector( state.data ),
    language: state.i18nState.lang
  } ),
  ( dispatch ) => ( {
    actions: bindActionCreators( {
      ...data,
      ...duck,
    }, dispatch )
  } )
)
class CorpusContainer extends Component {

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
    store: PropTypes.object.isRequired,

    router: PropTypes.object
  }

  static childContextTypes = {
    currentGuidedTourView: PropTypes.string,
  }

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor( props ) {
    super( props );
  }

  getChildContext = () => ( {
    currentGuidedTourView: 'corpus'
  } )

  componentDidMount = () => {
    this.props.actions.forgetData();
    this.props.actions.resetUi();
    const corpusId = this.props.match.params.id;
    this.props.actions.getCorpus( corpusId );
  }

  shouldComponentUpdate() {
    return true;
  }

  onDownloadJSON = () => {
    const corpus = this.props.corpora[this.props.match.params.id];
    if ( corpus ) {
      const filename = corpus.metadata.title || 'untitled dicto corpus';
      download( JSON.stringify( corpus ), 'json', filename )
        .then( () => {
          toastr.success( this.context.t( 'Corpus successfully downloaded in JSON' ) );
        } );
    }
  }

  onDownloadTags = () => {
    const { t } = this.context;
    const corpus = this.props.corpora[this.props.match.params.id];
    if ( corpus ) {
      const tags = Object.keys( corpus.tags ).map( ( tagId ) => corpus.tags[tagId] );
      const tagsData = tags.map( ( tag ) => {
        const tagCategory = corpus.tagCategories[tag.tagCategoryId];
        const relatedChunksIds = Object.keys( corpus.chunks ).filter( ( chunkId ) => corpus.chunks[chunkId].tags.includes( tag.metadata.id ) );
        const relatedMediasIds = uniq(
          relatedChunksIds.map( ( chunkId ) => corpus.chunks[chunkId].metadata.mediaId )
        );
        return {
          [t( 'name' )]: tag.name,
          [t( 'description' )]: tag.description,
          [t( 'start date' )]: tag.dates && new Date( tag.dates.start ).toLocaleString(),
          [t( 'end date' )]: tag.dates && new Date( tag.dates.end ).toLocaleString(),
          [t( 'address' )]: tag.location && tag.location.address,
          [t( 'latitude' )]: tag.location && tag.location.latitude,
          [t( 'longitude' )]: tag.location && tag.location.longitude,
          [t( 'category' )]: tagCategory.name,
          [t( 'color' )]: tagCategory.color,
          [t( 'number of tagged excerpts' )]: relatedChunksIds.length,
          [t( 'cumulated duration of annotated excerpts' )]: relatedChunksIds.reduce( ( sum, chunkId ) => {
            const chunk = corpus.chunks[chunkId];
            const duration = Math.abs( chunk.end - chunk.start );
            return sum + duration;
          }, 0 ),
          [t( 'number of tagged medias' )]: relatedMediasIds.length,
          [t( 'related medias' )]: relatedMediasIds.map( ( mediaId ) => `"${corpus.medias[mediaId].metadata.title || t( 'Untitled media' )}"` ).join( ', ' ),
        };
      } );
      const str = tsvFormat( tagsData );
      const filename = corpus.metadata.title || 'untitled dicto corpus';
      download( str, 'tsv', `${filename} - ${t( 'tags' )}` )
        .then( () => {
          toastr.success( this.context.t( 'Corpus tags successfully downloaded as a table' ) );
        } );
    }
  }
  onDownloadMedias = () => {
    const { t } = this.context;
    const corpus = this.props.corpora[this.props.match.params.id];
    if ( corpus ) {
      const medias = Object.keys( corpus.medias ).map( ( mediaId ) => corpus.medias[mediaId] );
      const mediasData = medias.map( ( media ) => {
        const relatedChunksIds = Object.keys( corpus.chunks ).filter( ( chunkId ) => corpus.chunks[chunkId].metadata.mediaId === media.metadata.id );
        const relatedTagsIds = uniq(
          flatten(
            relatedChunksIds.map( ( chunkId ) => corpus.chunks[chunkId].tags )
          )
        );
        return {
          [t( 'title' )]: media.metadata.title,
          [t( 'duration' )]: media.duration,
          [t( 'media url' )]: media.metadata.mediaUrl,
          [t( 'media thumbnail url' )]: media.metadata.mediaThumbnailUrl,
          [t( 'description' )]: media.metadata.description,
          [t( 'number of excerpts' )]: relatedChunksIds.length,
          [t( 'number of tags' )]: relatedTagsIds.length,
          [t( 'related tags' )]: relatedTagsIds.map( ( tagId ) => corpus.tags[tagId].name ).join( ', ' )

        };
      } );
      const str = tsvFormat( mediasData );
      const filename = corpus.metadata.title || 'untitled dicto corpus';
      download( str, 'tsv', `${filename} - ${t( 'medias' )}` )
        .then( () => {
          toastr.success( this.context.t( 'Corpus medias successfully downloaded as a table' ) );
        } );
    }
  }
  onDownloadExcerpts = () => {
    const { t } = this.context;
    const corpus = this.props.corpora[this.props.match.params.id];
    if ( corpus ) {
      const chunks = Object.keys( corpus.chunks ).map( ( chunkId ) => corpus.chunks[chunkId] );
      const chunksData = chunks.map( ( chunk ) => {
        const media = corpus.medias[chunk.metadata.mediaId];
        return {
          [t( 'media title' )]: media.metadata.title,
          [t( 'media url' )]: media.metadata.mediaUrl,
          [t( 'media duration' )]: media.duration,
          [t( 'start' )]: chunk.start,
          [t( 'end' )]: chunk.end,
          [t( 'content' )]: Object.keys( chunk.fields ).map( ( fieldId ) => chunk.fields[fieldId] ).join( '\n\n' ),
          [t( 'number of tags' )]: chunk.tags.length,
          [t( 'related tags' )]: chunk.tags.map( ( tagId ) => corpus.tags[tagId].name ).join( ', ' )
        };
      } );
      const str = tsvFormat( chunksData );
      const filename = corpus.metadata.title || 'untitled dicto corpus';
      download( str, 'tsv', `${filename} - ${t( 'excerpts' )}` )
        .then( () => {
          toastr.success( this.context.t( 'Corpus excerpts successfully downloaded as a table' ) );
        } );
    }
  }

  onDownloadHTML = () => {
    const corpus = this.props.corpora[this.props.match.params.id];
    const { t } = this.context;
    if ( corpus ) {
      const lang = this.props.language;
      const needsBundling = corpusNeedsBundling( corpus );
      if ( inElectron && needsBundling ) {
        const title = corpus.metadata.title || t( 'untitled dicto corpus' );
        showSaveDialog( {
          title: t( 'Save corpus in HTML' ),
          defaultPath: `${title}.zip`,
          buttonLabel: t( 'Save corpus' ),
          message: t( 'Choose where to save the corpus' ),
          filters: [ {
            name: 'ext',
            extensions: 'zip'
          } ]
        }, ( filename ) => {
          if ( filename ) {
            const { mediasToSave, transformedCorpus } = transformCorpusForExport( corpus );
            this.props.actions.closePreview();
            toastr.info( this.context.t( 'Bundling your corpus into a web publication' ), this.context.t( 'You will be notified when the web publication is ready' ) );
            buildCorpusRendering( transformedCorpus, lang )
              .then( ( html ) => {
                requestMain( 'pack-corpus', {
                  html,
                  filename,
                  mediasToSave
                } );
              } )
              .then( () => {
                const name = filename.split( '/' ).pop();
                const onOpen = () => {
                  shell.openItem( filename );
                };
                const onOpenFolder = () => {
                  shell.showItemInFolder( filename );
                };
                toastr.success( this.context.t( 'Corpus successfully downloaded in HTML as {n}', { n: name } ), 'You can publish it right away', {
                  component: () => (
                    <div className={ 'columns' }>
                      <div className={ 'column' }>
                        <button
                          className={ 'button' }
                          onClick={ onOpenFolder }
                        >
                          {this.context.t( 'Open archive folder' )}
                        </button>
                      </div>
                      <div className={ 'column' }>
                        <button
                          className={ 'button' }
                          onClick={ onOpen }
                        >
                          {this.context.t( 'Open archive' )}
                        </button>
                      </div>
                    </div>
                  )
                } );
              } )
              .catch( () => {
                toastr.error( this.context.t( 'Oups' ), this.context.t( 'An error occured during bundling' ) );
              } );
          }
        } );
      }
      else {
        buildCorpusRendering( corpus, lang )
          .then( ( html ) => {
            const filename = corpus.metadata.title || this.context.t( 'untitled dicto corpus' );
            download( html, 'html', filename )
              .then( () => {
                toastr.success( this.context.t( 'Corpus successfully downloaded in HTML' ) );
              } );
          } )
          .catch( () => {
            // todo do something to notice user of failure
          } );
      }
    }
  }

  onSubmitNewComposition = ( metadata ) => {
    const newComposition = {
      ...defaults( schema.definitions.composition ),
      metadata: {
        ...metadata,
        id: genId()
      }
    };
    this.props.actions.createComposition( this.props.match.params.id, newComposition );
    this.props.actions.unpromptNewComposition();
    setTimeout( () => {
      this.props.history.replace( { pathname: `/corpora/${this.props.match.params.id}/composition/${newComposition.metadata.id}` } );
    }, 500 );
  }

  downloadComposition = ( composition ) => {
    const filename = composition.metadata.title || 'untitled dicto composition';
    download( JSON.stringify( composition ), 'json', filename );
  }

  /**
   * callbacks when story files are dropped
   * to the import zone.
   * @param {array<File>} files - the files being dropped
   */
  onCorpusDrop = ( files ) => {
    const { t } = this.context;
    if ( !files || !files.length ) {
      return;
    }
    getFileAsText( files[0], ( err, str ) => {
      try {
        const importedCorpus = JSON.parse( str );
        const valid = ajv.validate( schema, importedCorpus );
        if ( valid ) {
          const id = genId();
          importedCorpus.metadata.id = id;
          const corpus = this.props.corpora[this.props.match.params.id];
          const collisions = getCorpusCollisions( corpus, importedCorpus );
          if ( collisions.length ) {
            this.props.actions.setImportCorpusCandidate( importedCorpus );
            this.props.actions.setImportCollisionsList( collisions );
          }
          else {
            const newCorpus = mergeCorpuses( corpus, importedCorpus );
            this.props.actions.updateCorpus(
              corpus.metadata.id,
              newCorpus,
            );
            this.props.actions.setImportModalVisible( false );
          }
        }
        else {
          this.props.actions.setImportModalVisible( false );
          // console.error(valid.errors);
          toastr.error( t( 'Import failed' ), t( 'File is not a valid dicto corpus' ) );
        }

      }
      catch ( e ) { /* eslint no-empty : 0 */
        console.error( e );/* eslint no-console : 0 */
        this.props.actions.setImportModalVisible( false );
        toastr.error( t( 'Import failed' ), t( 'File was badly formatted' ) );
      }
    } );
  }

  onMergeAllImportCollisions = () => {
    const collisions = this.props.importCollisionsList;
    const importedCorpus = this.props.importCorpusCandidate;
    const corpus = this.props.corpora[this.props.match.params.id];

    let newCandidate = importedCorpus;
    collisions.forEach( ( collision ) => {
      switch ( collision.type ) {
      case 'medias':
        newCandidate = mergeMedia( importedCorpus, corpus.medias[collision.prevId], newCandidate.medias[collision.nextId] );
        break;
      case 'tags':
        newCandidate = mergeTag( importedCorpus, corpus.tags[collision.prevId], newCandidate.tags[collision.nextId] );
        break;
      case 'tagCategories':
        newCandidate = mergeTagCategory( importedCorpus, corpus.tagCategories[collision.prevId], newCandidate.tagCategories[collision.nextId] );
        break;
      default:
        break;
      }
    } );

    const newCorpus = mergeCorpuses( corpus, newCandidate );
    this.props.actions.updateCorpus(
      corpus.metadata.id,
      newCorpus,
    );
    this.props.actions.setImportModalVisible( false );
  }

  onDuplicateAllImportCollisions = () => {
    // const importCollisionsList = this.props;
    const corpus = this.props.corpora[this.props.match.params.id];
    const importedCorpus = this.props.importCorpusCandidate;
    const newCorpus = mergeCorpuses( corpus, importedCorpus );
    this.props.actions.updateCorpus(
      corpus.metadata.id,
      newCorpus,
    );
    this.props.actions.setImportModalVisible( false );
  }

  onForgetActiveCollision = () => {
    const collisions = this.props.importCollisionsList;
    const collision = collisions[0];
    const importedCorpus = this.props.importCorpusCandidate;
    const corpus = this.props.corpora[this.props.match.params.id];

    let newCandidate;
    switch ( collision.type ) {
    case 'medias':
      newCandidate = forgetMedia( importedCorpus, collision.nextId );
      break;
    case 'tags':
      newCandidate = forgetTag( importedCorpus, collision.nextId );
      break;
    case 'tagCategories':
      newCandidate = forgetTagCategory( importedCorpus, collision.nextId );
      break;
    default:
      break;
    }
    if ( collisions.length > 1 ) {
      this.props.actions.setImportCorpusCandidate( newCandidate );
      this.props.actions.setImportCollisionsList( collisions.slice( 1 ) );
    }
    else {
      const newCorpus = mergeCorpuses( corpus, newCandidate );
      this.props.actions.updateCorpus(
        corpus.metadata.id,
        newCorpus,
      );
      this.props.actions.setImportModalVisible( false );
    }
  }

  onMergeActiveCollision = () => {
    const collisions = this.props.importCollisionsList;
    const collision = collisions[0];
    const importedCorpus = this.props.importCorpusCandidate;
    const corpus = this.props.corpora[this.props.match.params.id];

    let newCandidate;
    switch ( collision.type ) {
    case 'medias':
      newCandidate = mergeMedia( importedCorpus, corpus.medias[collision.prevId], importedCorpus.medias[collision.nextId] );
      break;
    case 'tags':
      newCandidate = mergeTag( importedCorpus, corpus.tags[collision.prevId], importedCorpus.tags[collision.nextId] );
      break;
    case 'tagCategories':
      newCandidate = mergeTagCategory( importedCorpus, corpus.tagCategories[collision.prevId], importedCorpus.tagCategories[collision.nextId] );
      break;
    default:
      break;
    }
    if ( collisions.length > 1 ) {
      this.props.actions.setImportCorpusCandidate( newCandidate );
      this.props.actions.setImportCollisionsList( collisions.slice( 1 ) );
    }
    else {
      const newCorpus = mergeCorpuses( corpus, newCandidate );
      this.props.actions.updateCorpus(
        corpus.metadata.id,
        newCorpus,
      );
      this.props.actions.setImportModalVisible( false );
    }
  }

  onDuplicateActiveCollision = () => {
    const collisions = this.props.importCollisionsList;
    if ( collisions.length > 1 ) {
      this.props.actions.setImportCollisionsList( collisions.slice( 1 ) );
    }
    else {
      const importedCorpus = this.props.importCorpusCandidate;
      const corpus = this.props.corpora[this.props.match.params.id];
      const newCorpus = mergeCorpuses( corpus, importedCorpus );
      this.props.actions.updateCorpus(
        corpus.metadata.id,
        newCorpus,
      );
      this.props.actions.setImportModalVisible( false );
    }
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      props: {
        match: {
          params: {
            id: corpusId
          },
        },
        corpora = {}
      }
    } = this;
    const corpus = corpora[corpusId];
    if ( corpus ) {
      console.log( corpus );
      return (
        <Layout>
          <CorpusLayout
            { ...this.props }
            corpusId={ corpusId }
            corpus={ corpus }
            schema={ schema }
            onCorpusDrop={ this.onCorpusDrop }
            onMergeAllImportCollisions={ this.onMergeAllImportCollisions }
            onDuplicateAllImportCollisions={ this.onDuplicateAllImportCollisions }
            onMergeActiveCollision={ this.onMergeActiveCollision }
            onForgetActiveCollision={ this.onForgetActiveCollision }
            onDuplicateActiveCollision={ this.onDuplicateActiveCollision }
            onDownloadJSON={ this.onDownloadJSON }
            onDownloadHTML={ this.onDownloadHTML }
            onDownloadTags={ this.onDownloadTags }
            onDownloadMedias={ this.onDownloadMedias }
            onDownloadExcerpts={ this.onDownloadExcerpts }
            onSubmitNewComposition={ this.onSubmitNewComposition }
            downloadComposition={ this.downloadComposition }
          />
        </Layout>
      );
    }
    return null;
  }
}

export default CorpusContainer;
