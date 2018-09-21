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
import Ajv from 'ajv';
import { toastr } from 'react-redux-toastr';
import schema from 'dicto-schema';

import CorporaLayout from './CorporaLayout';
import * as duck from '../duck';
import * as data from '../../../redux/duck';

import Layout from '../../Layout/components/LayoutContainer.js';

import download from '../../../helpers/fileDownloader';
import { getFileAsText } from '../../../helpers/fileLoader';
import { inElectron } from '../../../helpers/electronUtils';

import exampleCorpus from '../assets/example.json';

const ajv = new Ajv();

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  ( state ) => ( {
    ...duck.selector( state.corpora ),
    ...data.selector( state.data )
  } ),
  ( dispatch ) => ( {
    actions: bindActionCreators( {
      ...duck,
      ...data,
      // ...toastrActions,
    }, dispatch )
  } )
)
class CorporaContainer extends Component {

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
  constructor( props, context ) {
    super( props, context );
  }

  getChildContext = () => ( {
    currentGuidedTourView: 'corpora'
  } )

  componentDidMount = () => {
    this.props.actions.getCorpora();
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmout = () => {
    this.props.actions.forgetCorporaList();
  }

  onSubmitNewCorpus = ( metadata ) => {
    const defaultFieldId = genId();
    const defaultCategoryId = genId();
    const newCorpus = {
      ...defaults( schema ),
      metadata: {
        ...metadata,
        id: genId()
      },
      fields: {
        [defaultFieldId]: {
          metadata: {
            createdAt: new Date().getTime(),
            lastModifiedId: new Date().getTime(),
            id: defaultFieldId,
          },
          name: 'default'
        }
      },
      tagCategories: {
        [defaultCategoryId]: {
          metadata: {
            createdAt: new Date().getTime(),
            lastModifiedId: new Date().getTime(),
            id: defaultCategoryId,
          },
          name: 'default'
        }
      }
    };
    this.props.actions.createCorpus( newCorpus );
    this.props.actions.unpromptNewCorpus();
    setTimeout( () => {
      this.props.history.push( { pathname: `/corpora/${newCorpus.metadata.id}` } );      
    }, 100 )
  }

  downloadCorpus = ( corpus ) => {
    const filename = corpus.metadata.title || 'untitled dicto corpus';
    download( JSON.stringify( corpus ), 'json', filename )
      .then( () => {
        toastr.success( this.context.t( 'Corpus was successfully downloaded' ) );
      } );
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
        const corpus = JSON.parse( str );
        const valid = ajv.validate( schema, corpus );
        if ( valid ) {
          const id = genId();
          corpus.metadata.id = id;
          this.props.actions.createCorpus( corpus );
        }
        else {
          // console.error(valid.errors);
          toastr.error( t( 'Import failed' ), t( 'File is not a valid dicto corpus' ) );
        }

      }
      catch ( e ) { /* eslint no-empty : 0 */
        // console.log(e);
        toastr.error( t( 'Import failed' ), t( 'File was badly formatted' ) );
      }
    } );
  }

  onLoadExample = () => {
    const { metadata } = exampleCorpus;
    const newCorpus = {
      ...exampleCorpus,
      metadata: {
        ...metadata,
        id: genId()
      },
    };
    this.props.actions.createCorpus( newCorpus );
    setTimeout( () => {
      this.props.history.push( { pathname: `/corpora/${newCorpus.metadata.id}` } );
    }, 500 )
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    return (
      <Layout>
        <CorporaLayout
          { ...this.props }
          schema={ schema }
          onLoadExample={ this.onLoadExample }
          onSubmitNewCorpus={ this.onSubmitNewCorpus }
          downloadCorpus={ this.downloadCorpus }
          onCorpusDrop={ this.onCorpusDrop }
        />
      </Layout>
    );
  }
}

export default CorporaContainer;
