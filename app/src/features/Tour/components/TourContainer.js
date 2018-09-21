/* eslint react/no-danger : 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';
import { ACTIONS, EVENTS } from 'react-joyride/es/constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { v4 as genId } from 'uuid';
import exampleCorpus from '../../Corpora/assets/example.json';

import * as corporaDuck from '../../Corpora/duck';
import * as chunksDuck from '../../ChunksEdition/duck';
import * as compositionDuck from '../../CompositionEdition/duck';

import * as dataDuck from '../../../redux/duck';

import { inElectron } from '../../../helpers/electronUtils';

@withRouter
@connect( ( state ) => ( {
  lang: state.i18nState.lang,
  ...corporaDuck.selector( state.corpora ),
  ...chunksDuck.selector( state.chunks ),
  ...dataDuck.selector( state.data ),
  ...compositionDuck.selector( state.compositionEdition ),
} ),
( dispatch ) => ( {
  actions: bindActionCreators( {
    // setLanguage
    ...corporaDuck,
    ...chunksDuck,
    ...compositionDuck,
    ...dataDuck,
  }, dispatch )
} ) )
export default class TourContainer extends Component {

  static childContextTypes = {
    startTour: PropTypes.func
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor( props ) {
    super( props );
    this.state = {
      steps: [],
      run: false,
      stepIndex: 0
    };
  }

  getChildContext = () => ( {
    startTour: this.startTour
  } )

  componentWillMount = () => {
    setTimeout( () => this.updateSteps( this.context ) );
  }

  componentDidUpdate = ( prevProps ) => {
    if ( this.props.lang !== prevProps.lang ) {
      this.setState( {
        running: false,
        stepIndex: 0
      } );
      setTimeout( () => {
        this.updateSteps( this.context );
      } );
    }
  }

  updateSteps = ( context ) => {
    const { t } = context;
    const stepsViews = [
      {
        view: 'landing',
        steps: [
          {
            target: '#start-guided-tour',
            content: (
              <div className={ 'content' }>
                <h1 className={ 'title is-3' }>{t( 'Welcome to Dicto !' )}</h1>
                <p>
                  {t( 'Dicto is a hybrid analysis and editing tool aimed at enabling you to make sense of existing video and audio content.' )}
                </p>
                <p>
                  {t( 'This tour will walk through the major features of the tool.' )}
                </p>
                <p>
                  {t( 'Click on "next" button to let the tool present itself step by step !' )}
                </p>
              </div>
            ),
            disableBeacon: true,
            placement: 'bottom',
            timeBefore: 600,
            beforeStep: () => {
              setTimeout( () => {
                this.props.history.push( { pathname: '/' } );
              }, 500 );
            }
          },

          /*
           * {
           *   target: '#begin-creating',
           *   content: (
           *       <div className={ 'content' }>
           *           <p>{t( 'Let us start !' )}</p>
           *       </div>
           *   ),
           *   placement: 'bottom',
           * },
           */
        ]
      },
      {
        view: 'corpora',
        steps: [
          {
            target: '#corpora-landing',
            content: (
              <div className={ 'content' }>
                <h1 className={ 'title is-3' }>
                  {t( 'This is the corpora page' )}
                </h1>
                <p>
                  {t( 'corpora-description' )}
                </p>
              </div>
            ),
            placement: 'bottom',
            timeBefore: 1000,
            beforeStep: () => {
              setTimeout( () => {
                this.props.history.push( { pathname: '/corpora' } );
              }, 500 );
            }
          },
          {
            target: '#new-corpus',
            content: t( 'You can create a new corpus from scratch...' ),
            placement: 'bottom',
          },
          {
            target: '#drop-corpus',
            content: t( '...or drop a corpus file that you would have saved before as a work file.' ),
            placement: 'bottom',
          },
          {
            target: '#example-corpus',
            content: t( 'Let us load an example corpus for the need of this guided tour.' ),
            placement: 'bottom',
          },
          {
            target: '#corpora-list',
            content: inElectron ?
              <div className={ 'content' }>
                <p>
                  {t( 'You will find here all your ongoing corpora in the tool.' )}
                </p>
                <p>
                  {t( 'All your data (except online media of course) is stored in your hard drive.' )}
                </p>
              </div>
              :
              <div className={ 'content' }>
                <p>
                  {t( 'You will find here all your ongoing corpora in the tool.' )}
                </p>
                <p>
                  {t( 'Except the videos you are working with which have to be online (but can be protected through the related hosting services), all your data is stored in your browser local storage - nothing goes to the clouds !' )}
                </p>
                <p>
                  {t( 'Beware: the counterpart of this choice is that you will loose your data if you clean the local storage of your browser. Save your corpuses before doing so !' )}
                </p>
                <p>
                  {t( 'For maximum data safety, please use the desktop version of Dicto' )}
                </p>
              </div>,
            placement: 'left',
            beforeStep: () => {
              this.ensureExample();
            }
          },
          {
            target: '#corpora-list .dicto-CorpusCard',
            content: (
              <div className={ 'content' }>
                <h1 className={ 'title is-3' }>
                  {t( 'This is a corpus.' )}
                </h1>
                <p>
                  {t( 'A corpus corresponds to a specific project that you have: research question, journalistic investigation, educational work, you name it !' )}
                </p>
                <p>
                  {t( 'A corpus is made of:' )}
                </p>
                <ul>
                  <li>
                    {t( 'Medias: video or audio content that you want to work with.' )}
                  </li>
                  <li>
                    {t( 'Excerpts: bits of media that are of particular interest for you. You will be allowed to transcribe, comment, and tag them.' )}
                  </li>
                  <li>
                    {t( 'Tags: following a categorization that you define, they can be reused accross medias to group and organize your excerpts.' )}
                  </li>
                  <li>
                    {t( 'Compositions: these are linear montages that you will be able to make out of your annotation work, in order to gather an argument or a specific perspective on your corpus.' )}
                  </li>
                </ul>
              </div>
            ),
            placement: 'left',
          },
          {
            target: '#corpora-list .card',
            content: t( 'Let us open a corpus.' ),
            placement: 'left',
          },
        ]
      },
      {
        view: 'corpus',
        steps: [
          {
            target: '#corpus-nav',
            content: t( 'This is the corpus summary.' ),
            placement: 'right',
            timeBefore: 1500,
            beforeStep: () => {
              const exampleId = this.ensureExample();
              setTimeout( () => {
                this.props.actions.getCorpus( exampleId );
                this.props.history.push( { pathname: `/corpora/${exampleId}` } );
              }, 1000 )
            }
          },

          {
            target: '#list-medias',
            content: t( 'Through a corpus page, you can access all the media annotated in your corpus.' ),
            placement: 'right',
            beforeStep: () => {
              this.props.actions.closePreview();
              this.props.actions.setActiveSubview( 'medias' );
            }
          },
          {
            target: '.dicto-MediaCard',
            content: t( 'This is a media annotation card. It regroups all your annotations for this specific media. We will come back to this later in this walkthrough.' ),
            placement: 'right'
          },
          
          {
            target: '#list-tags',
            content: t( 'You can manage the tags of your corpus. Let us take a look.' ),
            placement: 'left'
          },
          {
            target: '.accordion-header',
            content: t( 'This is one of the tag categories attached to the corpus. Tag categories host list of tags that can be attached to specific excerpts.' ),
            placement: 'left',
            timeBefore: 500,
            beforeStep: () => {
              this.props.actions.setActiveSubview( 'tags' );
              const categoriesIds = Object.keys( exampleCorpus.tagCategories );
              this.props.actions.setVisibleTagCategoriesIds( categoriesIds );
            }
          },

          {
            target: '.tag-card',
            content: t( 'This is a tag. Clicking on the pencil icon will allow you to manage a description for it, but also possibly to attach a place and/or a date to this tag, so you can attach these informations to specific media excerpts.' ),
            placement: 'bottom'
          },
          {
            target: '.link-tag-button',
            content: t( 'This button will also provide you with an advanced view of all excerpts annotated with this tag, and allow you to add new ones. You can take a look at it after this walkthrough.' ),
            placement: 'bottom'
          },
          {
            target: '#list-compositions',
            content: t( 'By clicking here you can edit the compositions built on top of your media annotations. We will come back to this later in this walkthrough.' ),
            placement: 'left'
          },
          {
            target: '#edit-metadata',
            content: t( 'By clicking here you can edit the global information about a corpus with this button. Let us open it.' ),
            placement: 'bottom'
          },
          {
            target: '.dicto-SchemaForm',
            content: t( 'In this window, you will be able to specify a title, a description text, and one or several authors for the corpus.' ),
            placement: 'bottom',
            beforeStep: () => {
              this.props.actions.promptCorpusMetadataEdition();
            }
          },

          {
            target: '#export-corpus',
            content: t( 'At any moment, you can export your corpus as a data file or a standalone website. Let us open the preview.' ),
            placement: 'bottom',
            beforeStep: () => {
              this.props.actions.unpromptCorpusMetadataEdition();
            }
          },
          {
            target: '.ReactModal__Content.ReactModal__Content--after-open .dicto-CorpusPlayer',
            content: (
              <div className={ 'content' }>
                <p className={ 'title is-3' }>
                  {t( 'This is a preview of your corpus as a standalone page.' )}
                </p>
                <p>
                  {t( 'It allows to navigate the corpus through several entrypoints: medias, tags, places, dates.' )}
                </p>
                <p>
                  {t( 'You can play with it and then come back to this walkthrough.' )}
                </p>
              </div>
            ),
            placement: 'left',
            beforeStep: () => {
              this.props.actions.openPreview();
            }
          },
          {
            target: '#download-as-html',
            content: t( 'You can download this website as an html page that can be then exported wherever you want on the web.' ),
            placement: 'right',
          },
          {
            target: '#download-as-json',
            content: t( 'You can also download the corpus as a data file, for backup or to develop a more sophisticated website for instance.' ),
            placement: 'right',
          },
          {
            target: '#download-tags',
            content: t( 'Finally, in order to have quantitative insights into your corpus, you can also download it as a table representing tags, medias, or excerpts.' ),
            placement: 'right',
          },
          {
            target: '#import-corpus',
            content: t( 'At any moment, you can also import the data of another corpus into the current one. This will allow you for instance to work collectively on several corpora and merge them into one single corpus later on.' ),
            placement: 'bottom',
            beforeStep: () => {
              this.props.actions.closePreview();
              this.props.actions.setActiveSubview( 'medias' );
            }
          },
          {
            target: '.dicto-MediaCard',
            content: t( 'Let us now open a media to see how to annotate it with dicto.' ),
            placement: 'left',
            beforeStep: () => {
              this.props.actions.closePreview();
              this.props.actions.setActiveSubview( 'medias' );
            }
          },
        ]
      },
      {
        view: 'chunks',
        steps: [
          {
            target: '.chunks-space-wrapper',
            content: t( 'This is the media page. It allows you to annotate media from the web with transcriptions, comments, and tags.' ),
            placement: 'right',
            beforeStep: () => {
              const exampleId = this.ensureExample();
              // const firstMediaId = Object.keys(this.props.corpora[exampleId].medias)[0];
              setTimeout( () => {
                const mediaId = Object.keys( exampleCorpus.medias )[0];
                this.props.history.push( { 
                  pathname: `/corpora/${exampleId}/chunks`,
                  search: `?mediaId=${mediaId}`
                } );
              }, 500 );
              this.props.actions.setEditedTagId( undefined );
              this.props.actions.selectChunk( undefined );
              this.props.actions.unpromptImport();
            },
            timeBefore: 1500
          },
          {
            target: '.media-wrapper',
            placement: 'left',
            content: t( 'This column contains a preview of the media you are currently annotating.' )
          },
          
          {
            target: '.chunks-space-wrapper',
            content: t( 'This is the annotation space attached to this media. In this you can edit existing excerpts and create new ones.' ),
            placement: 'right',
            beforeStep: () => {
              this.props.actions.unpromptImport();
            }
          },
          {
            target: '.dicto-TimelineChunk',
            content: t( 'This element represents an annotated excerpt. Its position and height correspond to the portion of time it is covering in the media. You can create new ones by dragging into the annotation space. Let us edit this one.' ),
            placement: 'right'
          },
          {
            target: '.dicto-ChunkContentEditor',
            content: t( 'In this pannel you can edit the annotations attached to an excerpt of the media.' ),
            beforeStep: () => {
              const firstChunkId = this.getFirstChunkId();
              if ( firstChunkId ) {
                this.props.actions.selectChunk( firstChunkId );
                this.props.actions.setEditionMode( 'fields' );
              }
            },
          },
          {
            target: '.dicto-ChunkContentEditor .main-time-input-column .input',
            content: t( 'Here you can edit the timecodes of your annotation to fit a particular time portion in the media (you can also do that by dragging an excerpt extremities in the annotation space).' ),
            placement: 'top',
          },
          {
            target: '.dicto-ChunkContentEditor .main-editor-container .textarea',
            content: t( 'Here you can attach some text to your excerpt. For the connoisseurs, it supports markdown language !' ),
            placement: 'top',
          },
          {
            target: '.trash-button',
            content: t( 'You can delete this excerpt by clicking here.' ),
            placement: 'top',
          },
          {
            target: '.tags-toggle',
            content: t( 'You can manage tags attached to this excerpt through this button.' ),
            placement: 'right',
          },

          {
            target: '.options-toggle',
            content: t( 'Finally, you can access advanced features with this button.' ),
            placement: 'right',
          },
          {
            target: '.railway-wrapper',
            placement: 'left',
            content: t( 'Let us come back to our principal view. This is the railway of the media. You can preview here all your annotations and jump to specific time in the media.' ),
            beforeStep: () => {
              this.props.actions.setEditedTagId( undefined );
              if ( this.props.isChunkEditorExpanded ) {
                this.props.actions.toggleChunkEditorExpanded();
                this.props.actions.selectChunk( undefined );
              }
            }
          },
          {
            target: '.ratio-ui',
            content: t( 'You can zoom in and out in your annotation space and search for a specific excerpt here.' ),
            placement: 'bottom',
          },
          {
            target: '#resizer',
            content: t( 'You can change the size of your annotation space through these buttons.' )
          },
          {
            target: '#change-media',
            content: t( 'Within the media space, you can change the media to work with or add another one by clicking on this button.' )
          },
          {
            target: '.dicto-MediaCard',
            content: t( 'You can edit your media information by clicking on this card.' )
          },
          {
            target: '.import-transcriptions',
            content: t( 'You can also import existing transcriptions in Dicto. Let us look at what can be done.' )
          },
          {
            target: '.ReactModal__Content.ReactModal__Content--after-open',
            placement: 'bottom',
            content: (
              <div className={ 'content' }>
                <p>
                  {t( 'Dicto allows you to import existing transcriptions in the tool, coming from other tools or automatic transcription services for instance.' )}
                </p>
              </div>
            ),
            beforeStep: () => {
              this.props.actions.promptImport();
            }
          },
          {
            target: '.ReactModal__Content.ReactModal__Content--after-open .dicto-DropZone',
            placement: 'bottom',
            content: (
              <div className={ 'content' }>
                <p>
                  {t( 'Dicto accepts .srt files. .srt is the standard subtitle file format.' )}
                </p>
              </div>
            ),
            beforeStep: () => {
              this.props.actions.promptImport();
            }
          },
          {
            target: '.ReactModal__Content.ReactModal__Content--after-open .import-instructions',
            placement: 'bottom',
            content: (
              <div className={ 'content' }>
                <p
                  dangerouslySetInnerHTML={ {
                    __html: t( 'Dicto also accepts .otr files, which are built with the <a target="blank" href="http://otranscribe.com/">oTranscribe</a> tool, a fantastic and simple interface specialized for manual media transcription.' )
                  } }
                />
                <p>
                  {t( 'Besides, you can bootstrap your transcription work by downloading the subtitles attached to a media on their native platform. For that matter you can try to retrieve subtitles from your media with ' )}
                  <a
                    target={ 'blank' }
                    href={ 'https://downsub.com/' }
                  >
                    {'downsub'}
                  </a>.
                </p>
              </div>
            ),
            beforeStep: () => {
              this.props.actions.promptImport();
            }
          },
          {
            target: '.export-media',
            content: t( 'Symmetrically, you will be able to export your media annotations at any time, in the form of HTML page, subtitle files, or tables. Take a look at this feature after the visit.' ),
            placement: 'right',
            beforeStep: () => {
              this.props.actions.unpromptImport();
            }
          },
          {
            target: '#help-btn',
            content: t( 'That is it for the media page ! click on next to explore the "composition" feature of dicto.' )
          },
        ]
      },
      {
        view: 'composition',
        steps: [
          {
            target: '.dicto-CompositionCard',
            content: t( 'This is the composition page. It allows you to remix your annotations in order to publish linear montages possibly enriched with additionnal content.' ),
            placement: 'left',
            beforeStep: () => {
              const exampleId = this.ensureExample();
              const firstCompositionId = Object.keys( exampleCorpus.compositions )[0];
              setTimeout( () => {
                this.props.history.push( { pathname: `/corpora/${exampleId}/composition/${firstCompositionId}` } );
              }, 500 );
            },
            timeBefore: 1500
          },
          {
            target: '#corpus-excerpts-container',
            placement: 'right',
            content: t( 'In this column you will access all the annotation excerpts of your corpus. You can filter them for specific media, tags, or contents.' )
          },
          {
            target: '#corpus-excerpts-container .chunks-wrapper .fa-link',
            placement: 'right',
            content: t( 'You can add annotations to your composition by clicking on this button or by dragging them to the right column.' )
          },
          {
            target: '#corpus-excerpts-container #filters-header',
            placement: 'top',
            content: t( 'It is possible to filter excerpts shown from your corpus through various filters (by media, tag or tag category).' )
          },
          {
            target: '#corpus-excerpts-container #add-all-chunks',
            placement: 'top',
            content: t( 'Or you can add all the chunks fitting your research criteria.' )
          },

          {
            target: '#composition-summary-container',
            placement: 'left',
            content: t( 'This column contains the summary of your composition.' )
          },
          {
            target: '#composition-summary-container .dicto-ChunkCard',
            placement: 'left',
            content: t( 'Each block is a mention to one of your excerpts. However, deleting it from the composition will not delete it from your corpus !' )
          },
          {
            target: '#composition-summary-container .droppable-container',
            placement: 'left',
            content: t( 'You can change the blocks order by dragging them on clicking on their arrow buttons.' )
          },
          {
            target: '.card-content #edit-composition-block',
            placement: 'bottom',
            content: t( 'You can attach additional contents to a block in your composition, like links, images, or text. Try this after this guided tour.' )
          },
          {
            target: '#preview-and-export',
            placement: 'top',
            content: t( 'To finish with, clicking on this button will allow you to export your composition.' )
          },
          {
            target: '.ReactModal__Content.ReactModal__Content--after-open ',
            placement: 'top',
            content: t( 'This is the preview of your composition.' ),
            beforeStep: () => {
              this.props.actions.setPreviewVisibility( true );
            }
          },
          {
            target: '.ReactModal__Content.ReactModal__Content--after-open #download-html',
            placement: 'top',
            content: t( 'You can download your composition as an html file and upload it as a website wherever you want on the web.' )
          },
          {
            target: '.ReactModal__Content.ReactModal__Content--after-open #copy-clipboard',
            placement: 'top',
            content: t( 'You can also copy its contents as simplified html code to integrate it in a blog post or other html page.' )
          },
          {
            target: '#help-btn',
            placement: 'bottom',
            content: t( 'This the end of the Dicto walkthrough ! click here if you need to see this guided tour again.' ),
            beforeStep: () => {
              this.props.actions.setPreviewVisibility( false );
            }
          },

        ]
      },
    ];
    const steps = stepsViews
      .reduce( ( result, view ) => [ ...result, ...view.steps.map( ( step ) => ( { ...step, view: view.view } ) ) ], [] );
    this.setState( {
      stepIndex: 0,
      loading: false,
      run: false,
      steps,
      stepsViews,
    } );
  }

  getActiveCorpusIdInChunkView = () => {
    const activeCorpusId = this.props.location.pathname.match( /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/ );
    if ( activeCorpusId ) {
      return activeCorpusId[0];
    }
  }

  getFirstChunkId = () => {
    const activeCorpusId = this.getActiveCorpusIdInChunkView();
    if ( activeCorpusId ) {
      const activeCorpus = this.props.corpora[activeCorpusId];
      const activeMediaId = this.props.activeMediaId;
      const relatedChunks = Object.keys( activeCorpus.chunks )
        .filter( ( chunkId ) => activeCorpus.chunks[chunkId].metadata.mediaId === activeMediaId )
        .sort( ( a, b ) => {
          if ( activeCorpus.chunks[a].start < activeCorpus.chunks[b].start ) {
            return -1;
          }
          return 1;
        } );
      return relatedChunks[0];
    }
  }

  ensureExample = () => {
    const { metadata } = exampleCorpus;
    const newCorpus = {
      ...exampleCorpus,
      metadata: {
        ...metadata,
        // id: genId()
      },
    };
    const exampleCorpusTitle = metadata.title;
    // console.log('ensure example');
    const exists = Object.keys( this.props.corpora ).find( ( corpusId ) => {
      if ( this.props.corpora[corpusId].metadata.title === exampleCorpusTitle ) {
        return true;
      }
    } );
    if ( !exists ) {
      this.props.actions.createCorpus( newCorpus );
    }
    return exists ? exists : newCorpus.metadata.id;
  }

  startTour = ( at = {} ) => {
    const {
      view,
      stepIndex = 0,
    } = at;
    let beginingIndex;
    if ( view ) {
      this.state.steps.some( ( step, index ) => {
        if ( step.view === view ) {
          beginingIndex = index;
          return true;
        }
      } );
    }
    else {
      beginingIndex = stepIndex;
    }

    this.setState( {
      run: false,
      stepIndex: 0
    } );

    const timeOut = this.state.steps[beginingIndex].timeBefore;
    if ( this.state.steps[beginingIndex].beforeStep ) {
      this.state.steps[beginingIndex].beforeStep();
    }
    setTimeout( () => {
      this.setState( {
        run: true,
        stepIndex: beginingIndex
      } );
    }, timeOut );

  }

  callback = ( data ) => {

    const { action, index, type } = data;

    switch ( action ) {
    // case 'close':
    case 'stop':
      return this.setState( {
        run: false,
        stepIndex: 0
      } );
    default:
      break;
    }
    if ( type === EVENTS.STEP_AFTER && index < this.state.steps.length - 1 ) {
      const next = this.state.steps[index + 1];
      if ( typeof next.beforeStep === 'function' ) {
        next.beforeStep();
      }
    }

    if ( type === EVENTS.TOUR_END && this.state.run ) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState( { run: false, stepIndex: 0 } );
    }
    else if ( type === EVENTS.STEP_AFTER && index === 0 ) {
      this.setState( { run: false, loading: true } );
      setTimeout( () => {
        this.setState( {
          loading: false,
          run: true,
          stepIndex: index + ( action === ACTIONS.PREV ? -1 : 1 )
        } );
      }, 1000 );
    }
    else if ( type === EVENTS.STEP_AFTER /* || type === EVENTS.TOOLTIP */ ) {
      /*
       * Update state to advance the tour
       * console.log(EVENTS.STEP_AFTER, index);
       */
      const stepIndex = index + ( action === ACTIONS.PREV ? -1 : 1 );
      const timeOut = this.state.steps[stepIndex] && this.state.steps[stepIndex].beforeStep ? this.state.steps[stepIndex].timeBefore || 500 : 1;
      setTimeout( () => {
        this.setState( { stepIndex } );
      }, timeOut );
    }

    /*
     * // commented because not working yet
     * else if (type === EVENTS.TARGET_NOT_FOUND) {
     *   const step = this.state.steps[index];
     *   const previousOperations = this.state.steps
     *     .filter((thatStep, thatIndex) =>
     *       thatIndex < index && thatStep.view == step.view && thatStep.beforeStep);
     */

    /*
     *   console.warn('oups, target not found, will replay previous operations in tutorial', previousOperations);
     *   previousOperations.forEach(step => {
     *     step.beforeStep();
     *   })
     * }
     */
    else if ( type === EVENTS.TOOLTIP_CLOSE ) {
      const stepIndex = index + ( action === ACTIONS.PREV ? -1 : 1 );
      const timeOut = this.state.steps[index + 1].beforeStep ? this.state.steps[stepIndex].timeBefore || 500 : 1;
      setTimeout( () => {
        this.setState( { stepIndex: index + 1 } );
      }, timeOut );
    }

    /*
     * if (typeof joyride.callback === "function") {
     *   joyride.callback(data);
     * } else {
     *   console.group(type);
     *   console.log(data); //eslint-disable-line no-console
     *   console.groupEnd();
     * }
     */
  };

  render = () => {
    const { steps, run, stepIndex } = this.state;
    const { children } = this.props;
    const { t } = this.context;

    return (
      <div className={ 'tour-container' }>
        <Joyride
          steps={ steps }
          run={ run }
          callback={ this.callback }
          showSkipButton
          showProgress
          stepIndex={ stepIndex }
          continuous
          locale={ {
                  back: t( 'back' ),
                  close: t( 'close' ),
                  last: t( 'last' ),
                  next: t( 'next' ),
                  skip: t( 'skip' )
                } }
        />
        {children}
      </div>
    );
  }
}
