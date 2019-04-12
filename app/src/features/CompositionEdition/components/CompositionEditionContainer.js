/* eslint react/no-set-state : 0 */
/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the layout container
 * @module dicto/features/Chunks
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { uniq } from 'lodash';
import { toastr } from 'react-redux-toastr';

import schema from 'dicto-schema';

import Layout from '../../Layout/components/LayoutContainer.js';
import Loading from '../../../components/Loading';

import * as duck from '../duck';
import * as data from '../../../redux/duck';

import {
  buildMontage,
  buildCompositionAsStaticHtml
} from '../../../helpers/builders';

import downloadFile from '../../../helpers/fileDownloader';
import NotFound from '../../../components/NotFound';

import { copyToClipboard } from '../../../helpers/utils';

import CompositionEditionLayout from './CompositionEditionLayout';

import { inElectron, default as requestMain, corpusNeedsBundling, transformCorpusForExport } from '../../../helpers/electronUtils';

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
    ...duck.selector( state.compositionEdition ),
    ...data.selector( state.data ),
  } ),
  ( dispatch ) => ( {
    actions: bindActionCreators( {
      ...data,
      ...duck,
    }, dispatch )
  } )
)
class CompositionEditionContainer extends Component {

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
    store: PropTypes.object.isRequired
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
    currentGuidedTourView: 'composition'
  } )

  componentWillMount = () => {

  }

  componentDidMount = () => {
    this.props.actions.forgetData();
    const corpusId = this.props.match.params.corpusId;
    this.props.actions.getCorpus( corpusId );
  }

  shouldComponentUpdate() {
    return true;
  }

  downloadComposition = () => {
    const {
      props: {
        match: {
          params: {
            corpusId,
            compositionId
          },
        },
        corpora = {}
      },
      context: { t }
    } = this;
    const corpus = corpora[corpusId];
    if ( corpus ) {
      const lang = this.props.language;
      const composition = corpus.compositions[compositionId];

      /**
       * Filtering from corpus only the data which is needed for composition
       */
      const chunkIds = composition.summary.filter( ( c ) => c.blockType === 'chunk' ).map( ( c ) => c.content ).filter( ( chunkId ) => corpus.chunks[chunkId] )
      const chunks = chunkIds.reduce( ( res, chunkId ) => ( {
        ...res,
        [chunkId]: corpus.chunks[chunkId]
      } ), {} );

      const mediaIds = uniq(
        chunkIds.map( ( chunkId ) => corpus.chunks[chunkId].metadata.mediaId )
      );
      const medias = mediaIds.reduce( ( res, mediaId ) => ( {
        ...res,
        [mediaId]: corpus.medias[mediaId]
      } ), {} );

      const tagIds = uniq(
        chunkIds.reduce( ( res, chunkId ) => [ ...res, ...corpus.chunks[chunkId].tags ], [] )
      );
      const tags = tagIds.reduce( ( res, tagId ) => ( {
        ...res,
        [tagId]: corpus.tags[tagId]
      } ), {} );

      const tagCategoryIds = uniq(
        tagIds.map( ( tagId ) => corpus.tags[tagId].tagCategoryId )
      );
      const tagCategories = tagCategoryIds.reduce( ( res, theseTagCategories ) => ( {
        ...res,
        [theseTagCategories]: corpus.tagCategories[theseTagCategories]
      } ), {} );

      const compositionData = {
        metadata: composition.metadata,
        summary: composition.summary,
        // todo filter with just used medias
        medias,
        chunks,
        tags,
        fields: corpus.fields,
        tagCategories,
      };
      // check whether local medias are involved
      const needsBundling = corpusNeedsBundling( compositionData );
      if ( inElectron && needsBundling ) {
        const title = composition.metadata.title || t( 'untitled dicto composition' );
        showSaveDialog( {
          title: t( 'Save composition in HTML' ),
          defaultPath: `${title}.zip`,
          buttonLabel: t( 'Save composition' ),
          message: t( 'Choose where to save the composition' ),
          filters: [ {
            name: 'ext',
            extensions: 'zip'
          } ]
        }, ( filename ) => {
          if ( filename ) {
            const { mediasToSave, transformedCorpus } = transformCorpusForExport( compositionData );
            this.props.actions.setPreviewVisibility( false );
            toastr.info( this.context.t( 'Bundling your composition into a web publication' ), this.context.t( 'You will be notified when the web publication is ready' ) );
            buildMontage( transformedCorpus, lang )
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
                toastr.success( this.context.t( 'Composition successfully downloaded in HTML as {n}', { n: name } ), 'You can publish it right away', {
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
              .catch( ( e ) => {
                console.error( e );/* eslint no-console: 0 */
                toastr.error( this.context.t( 'Oups' ), this.context.t( 'An error occured during bundling' ) );
              } );
          }
        } );
      }
      else {
        buildMontage( compositionData, lang )
          .then( ( html ) => {
            const filename = composition.metadata.title || this.context.t( 'untitled dicto composition' );
            downloadFile( html, 'html', filename )
              .then( () => {
                toastr.success( this.context.t( 'Composition successfully downloaded in HTML' ) );
              } );
          } )
          .catch( ( e ) => {
            console.error( e );/* eslint no-console: 0 */
            toastr.error( this.context.t( 'An error occured during bundling' ) );
            // todo do something to notice user of failure
          } );
      }
    }
  }

  copyCompositionAsHtml = () => {
    const {
      props: {
        match: {
          params: {
            corpusId,
            compositionId
          },
        },

        corpora = {}
      }
    } = this;
    const corpus = corpora[corpusId];
    const composition = corpus.compositions[compositionId];
    const html = buildCompositionAsStaticHtml( composition, corpus );
    copyToClipboard( html );
    toastr.success( this.context.t( 'HTML code copied to clipboard !' ) )
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
            corpusId,
            compositionId
          },
        },
        stateLoaded = false,

        corpora = {}
      },
      downloadComposition,
      copyCompositionAsHtml,
    } = this;
    const corpus = corpora[corpusId];
    if ( stateLoaded ) {
      if ( corpus ) {
        const composition = corpus.compositions &&  corpus.compositions[compositionId];
        if ( composition ) {
          return (
            <Layout>
              <CompositionEditionLayout
                { ...this.props }
                corpus={ corpus }
                composition={ composition }
                downloadComposition={ downloadComposition }
                copyCompositionAsHtml={ copyCompositionAsHtml }
                schema={ schema }
              />
            </Layout>
          );
        }
        return <NotFound />;
      }
      return <NotFound />;
    }
    else {
      return null;
    }
  }
}

export default CompositionEditionContainer;
