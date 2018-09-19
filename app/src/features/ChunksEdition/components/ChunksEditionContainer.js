/* eslint react/no-set-state : 0 */
/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the layout container
 * @module dicto/features/Chunks
 */
import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import defaults from 'json-schema-defaults';
import { v4 as genId } from 'uuid';
import parseSRT from 'parse-srt';
import { fromString as htmlToText } from 'html-to-text';
import { uniq, flatten } from 'lodash';
import { tsvFormat } from 'd3-dsv';
import { toastr } from 'react-redux-toastr';

import schema from 'dicto-schema';

import { inElectron, default as requestMain, corpusNeedsBundling, transformCorpusForExport } from '../../../helpers/electronUtils';

import download from '../../../helpers/fileDownloader';

import Layout from '../../Layout/components/LayoutContainer.js';
import Loading from '../../../components/Loading';
import NotFound from '../../../components/NotFound';
import MarkdownPlayer from '../../../components/MarkdownPlayer';

import * as duck from '../duck';
import * as data from '../../../redux/duck';

import ChunksEditionLayout from './ChunksEditionLayout';

import { getFileAsText } from '../../../helpers/fileLoader';
import { secsToSrt } from '../../../helpers/utils';

import {
  buildMontage,
} from '../../../helpers/builders';

let showSaveDialog;
let shell;
if ( inElectron ) {
  const electron = require( 'electron' );
  showSaveDialog = electron.remote.dialog.showSaveDialog;
  shell = electron.shell;
}

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  ( state ) => ( {
    ...data.selector( state.data ),
    ...duck.selector( state.chunks ),
  } ),
  ( dispatch ) => ( {
    actions: bindActionCreators( {
      ...data,
      ...duck,
    }, dispatch )
  } )
)
class ChunksContainer extends Component {

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
    currentGuidedTourView: 'chunks'
  } )

  componentDidMount = () => {
    this.props.actions.forgetData();
    const {
      match: {
        params: {
          id: corpusId
        },
      },
      corpora = {},
      activeMediaId,
      location
    } = this.props;
    const realMediaId = ( location && location.search.split( 'activeMedia=' ).pop() ) || activeMediaId;
    if ( realMediaId ) {
      this.props.actions.setActiveMediaId( realMediaId );
      this.props.actions.getChunkViewData( { corpusId, mediaId: realMediaId } );
    }
      
  }

  componentWillReceiveProps = ( nextProps ) => {
    const {
      match: {
        params: {
          id: corpusId
        },
      },
      activeMediaId,
    } = nextProps;
    if (
      ( !this.props.stateLoaded && nextProps.stateLoaded ) ||
      ( this.props.mediaDuration !== nextProps.mediaDuration )
    ) {
      // wait for duration
      this.updateChunksSpaceScroll( nextProps );
      this.props.actions.selectChunk( undefined );
    }
    if (
      this.props.activeMediaId !== nextProps.activeMediaId
    ) {
      this.props.actions.getChunkViewData( { corpusId, mediaId: nextProps.activeMediaId } );
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmout = () => {
    this.props.actions.setActiveMediaId( undefined );
  }

  updateChunksSpaceScroll = ( props ) => {
    const {
      match: {
        params: {
          id: corpusId
        },
      },
      corpora = {},
      activeMediaId
    } = props;
    const corpus = corpora[corpusId];
    if ( corpus ) {
      const defaultFieldId = Object.keys( corpus.fields ).find( ( fieldId ) => corpus.fields[fieldId].name === 'default' );
      this.props.actions.setActiveFieldId( defaultFieldId );
      const media = corpus.medias[activeMediaId];
      if ( media ) {
        const duration = media.duration;
        if ( duration ) {
          const viewTo = duration > 120 ? 120 : duration;
          this.props.actions.setChunkSpaceTimeScroll( { viewFrom: 0, viewTo } );
        }
      }
    }
  }

  addChunk = ( {
    startTime,
    endTime,
    x,
    // width
  } ) => {
    const {
      activeMediaId,
      chunkSpaceTimeScroll,
      match: {
        params: {
          id: corpusId
        },
      },
    } = this.props;
    // do not accept very small chunk adding (they are probably errors)
    const span = chunkSpaceTimeScroll.viewTo - chunkSpaceTimeScroll.viewFrom;
    if ( startTime < endTime && endTime - startTime > span / 100 ) {
      const finalX = x > 0.7 ? 0.7 : x;
      const chunkSchema = schema.definitions.chunk;
      let chunk = defaults( chunkSchema );
      const id = genId();
      chunk = {
        ...chunk,
        metadata: {
          mediaId: activeMediaId,
          id
        },
        x: finalX,
        start: startTime,
        end: endTime
      };
      this.props.actions.createChunk( corpusId, chunk );
      this.props.actions.selectChunk( chunk.metadata.id );
    }
  }

  createChunk = ( initialData ) => {
    const {
      activeMediaId,
      match: {
        params: {
          id: corpusId
        },
      },
    } = this.props;
    const chunkSchema = schema.definitions.chunk;
    let chunk = defaults( chunkSchema );
    const id = genId();
    chunk = {
      ...chunk,
      metadata: {
        mediaId: activeMediaId,
        id
      },
      ...initialData,
    };
    this.props.actions.createChunk( corpusId, chunk );
  }

  addField = ( name, setToActive ) => {
    if ( !name || !name.length ) {
      return;
    }
    const {
      match: {
        params: {
          id: corpusId
        },
      },
    } = this.props;
    const fieldSchema = schema.definitions.field;
    let field = defaults( fieldSchema );
    const id = genId();
    field = {
      ...field,
      metadata: {
        id
      },
      name
    };
    this.props.actions.createField( corpusId, field );
    if ( setToActive ) {
      this.props.actions.setActiveFieldId( id );
    }
  }

  addTag = ( tagCategoryId, chunk ) => {
    const {
      match: {
        params: {
          id: corpusId
        },
      },
    } = this.props;
    const tagSchema = schema.definitions.tag;
    let tag = defaults( tagSchema );
    const id = genId();
    tag = {
      ...tag,
      metadata: {
        id
      },
      name: undefined,
      tagCategoryId,
    };
    this.props.actions.createTag( corpusId, tag );
    this.props.actions.updateChunk(
      corpusId,
      chunk.metadata.id,
      {
        ...chunk,
        tags: [ ...chunk.tags, tag.metadata.id ]
      }
    );
  }

  addTagCategory = () => {
    const {
      match: {
        params: {
          id: corpusId
        },
      },
    } = this.props;
    const tagCategorySchema = schema.definitions.tagCategory;
    let tagCategory = defaults( tagCategorySchema );
    const id = genId();
    tagCategory = {
      ...tagCategory,
      metadata: {
        id
      },
      name: undefined
    };
    this.props.actions.createTagCategory( corpusId, tagCategory );
    this.props.actions.setActiveTagCategoryId( id );
  }

  onTranscriptionFileDrop = ( files ) => {
    const {
      corpora,
      activeMediaId,
      activeFieldId,
      match: {
        params: {
          id: corpusId
        },
      },
      actions: {
        setImportedChunkCandidates
      }
    } = this.props;
    const corpus = corpora[corpusId];
    const activeMedia = corpus.medias[activeMediaId];
    const fieldId = activeFieldId ||
      Object.keys( corpus.fields )
        .find( ( id ) => corpus.fields[id].name === 'default' );

    files.forEach( ( file ) => {
      const ext = file.name.split( '.' ).pop();
      getFileAsText( file, ( err, str ) => {
        if ( ext === 'srt' ) {
          const rawChunks = parseSRT( str )
            .filter( ( chunk ) => {
              if ( chunk.start < activeMedia.duration ) {
                return true;
              }
            } );

          const chunkCandidates = rawChunks.map( ( { start, end, text } ) => {
            const id = genId();
            const x = 0.7; // Math.random() * 0.7;
            const chunk = {
              metadata: {
                mediaId: activeMediaId,
                id,
                createdAt: new Date().getTime(),
                lastModifiedAt: new Date().getTime(),
              },
              x,
              start,
              end: end < activeMedia.duration ? end : activeMedia.duration,
              tags: [],
              fields: {
                [fieldId]: htmlToText( text )
              }
            };
            return chunk;
          } );
          setImportedChunkCandidates( chunkCandidates );
        }
        else if ( ext === 'otr' ) {
          try {
            const thatData = JSON.parse( str );
            let txt = thatData.text;
            const regex = /<span class="timestamp" data-timestamp="([^"]+)">[\d]+:[\d]+<\/span>/gi;
            let match;
            let prevMarker = 0;
            const rawChunks = [];
            while ( (  match = regex.exec( txt ) ) !== null ) {
              const index = match.index;
              const length = match[0].length;
              const markerS = parseFloat( match[1] );
              const content = txt.substring( 0, index );
              rawChunks.push( {
                start: prevMarker,
                end: markerS,
                content
              } );
              if ( !isNaN( markerS ) ) {
                prevMarker = markerS;
              }
              txt = txt.substr( index + length );
              regex.lastIndex = -1;
            }
            // adding the last piece
            rawChunks.push( {
              content: txt,
              start: prevMarker,
              end: activeMedia.duration,
            } );
            const chunkCandidates = rawChunks
              .map( ( raw ) => {
                const id = genId();
                const x = 0.7; // Math.random() * 0.7;
                const chunk = {
                  metadata: {
                    mediaId: activeMediaId,
                    id,
                    createdAt: new Date().getTime(),
                    lastModifiedAt: new Date().getTime(),
                  },
                  x,
                  start: raw.start,
                  end: raw.end,
                  tags: [],
                  fields: {
                    [fieldId]: htmlToText( raw.content )
                  }
                };
                return chunk;
              } )
              .filter( ( c ) => c.fields[fieldId].trim().length )
            setImportedChunkCandidates( chunkCandidates );
          }
          catch ( e ) { /* eslint no-empty : 0 */
          }
        }
      } );
    } );
  }

  regroupImportCandidates = ( minimum ) => {
    const {
      corpora,
      activeFieldId,
      match: {
        params: {
          id: corpusId
        },
      },

      actions: {
        setImportedChunkCandidates
      },
      importedChunkCandidates
    } = this.props;
    const corpus = corpora[corpusId];

    let durationCounter = 0;
    const fieldId = activeFieldId ||
      Object.keys( corpus.fields )
        .find( ( id ) => corpus.fields[id].name === 'default' );
    const newCandidates = [];
    let index = 0;
    while ( index < importedChunkCandidates.length ) {
      const chunk = importedChunkCandidates[index];
      let text = chunk.fields[fieldId];
      const chunkDuration = Math.abs( chunk.end - chunk.start );
      durationCounter = chunkDuration;
      while (
        durationCounter < minimum
        && index + 1 < importedChunkCandidates.length
        // regroup only adjacent chunks (diff < 1 second)
        && ( importedChunkCandidates[index + 1].start - importedChunkCandidates[index].end ) < 1
      ) {
        index++;
        durationCounter = Math.abs( importedChunkCandidates[index].end - chunk.start );
        text += ` ${ importedChunkCandidates[index].fields[fieldId]}`;
      }
      const newEnd = chunk.start + durationCounter;
      const newChunk = {
        ...chunk,
        end: newEnd,
        fields: {
          [fieldId]: text
        }
      };
      index++;
      newCandidates.push( newChunk );
    }
    setImportedChunkCandidates( newCandidates );
  }

  importChunkCandidates = () => {
    const {
      importedChunkCandidates,
      match: {
        params: {
          id: corpusId
        },
      },
      actions: {
        createChunks
      }
    } = this.props;
    createChunks( corpusId, importedChunkCandidates );
  }

  onDownloadCompositionAsHTML = ( composition ) => {
    const {
      props: {
        match: {
          params: {
            id: corpusId,
          },
        },
        corpora = {}
      },
      context: { t }
    } = this;
    const corpus = corpora[corpusId];
    if ( corpus ) {
      const lang = this.props.language;

      /**
       * Filtering from corpus only the data which is needed for composition
       */
      const chunkIds = composition.summary.filter( ( c ) => c.blockType === 'chunk' ).map( ( c ) => c.content );
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
            toastr.info( this.context.t( 'Bundling your media composition into a web publication' ), this.context.t( 'You will be notified when the web publication is ready' ) );
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
            download( html, 'html', filename )
              .then( () => {
                toastr.success( this.context.t( 'Composition successfully downloaded in HTML' ) );
              } );
          } )
          .catch( ( e ) => {
            console.error( e );/* eslint no-console: 0 */
            // todo do something better to notice user of failure
            toastr.error( this.context.t( 'An error occured during bundling' ) );
          } );
      }
    }
  }

  onDownloadExcerptsTable = () => {
    const {
      activeMediaId,
      activeFieldId,
      match: {
        params: {
          id: corpusId
        },
      },

      corpora = {}

    } = this.props;
    const { t } = this.context;
    const corpus = corpora[corpusId];
    if ( corpus ) {
      const chunks = Object.keys( corpus.chunks )
        .map( ( chunkId ) => corpus.chunks[chunkId] )
        .filter( ( chunk ) => chunk.metadata.mediaId === activeMediaId );
      const chunksData = chunks.map( ( chunk ) => {
        return {
          [t( 'start' )]: chunk.start,
          [t( 'end' )]: chunk.end,
          [t( 'content' )]: chunk.fields[activeFieldId],
          [t( 'number of tags' )]: chunk.tags.length,
          [t( 'related tags' )]: chunk.tags.map( ( tagId ) => corpus.tags[tagId].name ).join( ', ' )
        };
      } );
      const str = tsvFormat( chunksData );
      const filename = corpus.medias[activeMediaId].metadata.title || 'untitled dicto media';
      download( str, 'tsv', `${filename} - ${t( 'excerpts' )}` )
        .then( () => {
          toastr.success( this.context.t( 'Media excerpts successfully downloaded as a table' ) );
        } );
    }
  }

  onDownloadExcerptsSrt = () => {
    const {
      activeMediaId,
      activeFieldId,
      match: {
        params: {
          id: corpusId
        },
      },
      corpora = {}
    } = this.props;
    const { t } = this.context;
    const corpus = corpora[corpusId];
    if ( corpus ) {
      const chunks = Object.keys( corpus.chunks )
        .map( ( chunkId ) => corpus.chunks[chunkId] )
        .filter( ( chunk ) => chunk.metadata.mediaId === activeMediaId );
      const chunksData = chunks.reduce( ( str, chunk, index ) => {
        return `${str}
${index + 1}
${secsToSrt( chunk.start )} --> ${secsToSrt( chunk.end )}
${chunk.fields[activeFieldId]}

        `;
      }, '' );
      const filename = corpus.medias[activeMediaId].metadata.title || 'untitled dicto media';
      download( chunksData, 'srt', `${filename} - ${t( 'transcription' )}` )
        .then( () => {
          toastr.success( this.context.t( 'Media excerpts successfully downloaded as a subtitles file' ) );
        } );
    }
  }

  onDownloadExcerptsOtr = () => {
    const {
      activeMediaId,
      activeFieldId,
      match: {
        params: {
          id: corpusId
        },
      },
      corpora = {}
    } = this.props;
    const { t } = this.context;
    const corpus = corpora[corpusId];

    const genSpanForTime = ( secs ) => {
      let displaySecs = secsToSrt( secs ).split( ',' )[0]
      displaySecs = displaySecs.split( ':' ).reverse().slice( 0, 2 ).reverse().join( ':' );
      return `<span class="timestamp" data-timestamp="${secs}">${displaySecs}</span>`
    }
    if ( corpus ) {
      const chunks = Object.keys( corpus.chunks )
        .map( ( chunkId ) => corpus.chunks[chunkId] )
        .filter( ( chunk ) => chunk.metadata.mediaId === activeMediaId );
      const chunksData = chunks.reduce( ( str, chunk, index ) => {
        return `${genSpanForTime( chunk.start )}
${renderToStaticMarkup( <MarkdownPlayer src={ chunk.fields[activeFieldId] } /> )}
${genSpanForTime( chunk.end )}
        `;
      }, '' );
      const data = JSON.stringify( { text: chunksData } );
      const filename = corpus.medias[activeMediaId].metadata.title || 'untitled dicto media';
      download( data, 'otr', `${filename} - ${t( 'transcription' )}` )
        .then( () => {
          toastr.success( this.context.t( 'Media excerpts successfully downloaded as a oTranscribe file' ) );
        } );
    }
  }

  onDownloadTagsTable = () => {
    const {
      activeMediaId,
      match: {
        params: {
          id: corpusId
        },
      },

      corpora = {}

    } = this.props;
    const { t } = this.context;

    const corpus = corpora[corpusId];

    if ( corpus ) {
      const chunks = Object.keys( corpus.chunks )
        .map( ( chunkId ) => corpus.chunks[chunkId] )
        .filter( ( chunk ) => chunk.metadata.mediaId === activeMediaId );
      const tagsIds = uniq(
        flatten( chunks.map( ( c ) => c.tags ) )
      );
      const tags = tagsIds.map( ( tagId ) => corpus.tags[tagId] );
      const tagsData = tags.map( ( tag ) => {
        const tagCategory = corpus.tagCategories[tag.tagCategoryId];
        const relatedChunksIds = chunks.filter( ( chunk ) => corpus.chunks[chunk.metadata.id].tags.includes( tag.metadata.id ) );
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
          [t( 'number of tagged excerpts' )]: relatedChunksIds.length
        };
      } );
      const str = tsvFormat( tagsData );
      const filename = corpus.medias[activeMediaId].metadata.title || 'untitled dicto media';
      download( str, 'tsv', `${filename} - ${t( 'tags' )}` )
        .then( () => {
          toastr.success( this.context.t( 'Media tags successfully downloaded as a table' ) );
        } );
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

        stateLoaded,
        corpora = {},
      },
      createChunk
    } = this;
    const corpus = corpora[corpusId];
    if ( stateLoaded ) {
      if ( corpus ) {
        return (
          <Layout>
            <ChunksEditionLayout
              { ...this.props }
              corpus={ corpus }
              schema={ schema }
              addChunk={ this.addChunk }
              addField={ this.addField }
              addTag={ this.addTag }
              createChunk={ createChunk }
              onTranscriptionFileDrop={ this.onTranscriptionFileDrop }
              regroupImportCandidates={ this.regroupImportCandidates }
              onDownloadExcerptsSrt={ this.onDownloadExcerptsSrt }
              onDownloadExcerptsOtr={ this.onDownloadExcerptsOtr }
              onDownloadTagsTable={ this.onDownloadTagsTable }
              onDownloadExcerptsTable={ this.onDownloadExcerptsTable }
              onDownloadCompositionAsHTML={ this.onDownloadCompositionAsHTML }
              addTagCategory={ this.addTagCategory }
              importChunkCandidates={ this.importChunkCandidates }
            />
          </Layout>
        );
      }
      return <NotFound />;
    }
    return null;
        
  }
}

export default ChunksContainer;
