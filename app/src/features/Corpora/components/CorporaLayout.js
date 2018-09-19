/* eslint react/jsx-no-bind : 0 */
/* eslint no-alert : 0 */
/**
 * This module exports a stateless component rendering the layout of the montages view
 * @module dicto/features/Corpora
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { v4 as genId } from 'uuid';

import { mapToArray } from '../../../helpers/utils';
import DropZone from '../../../components/DropZone';
import SchemaForm from '../../../components/SchemaForm';
import CorpusCard from '../../../components/CorpusCard';
import Nav from '../../../components/Nav';
import PaginatedList from '../../../components/PaginatedList';

import './CorporaLayout.scss';

Modal.setAppElement( '#mount' );

const CorporaLayout = ( {
  corporaList: corpora = {},
  creationModalOpen,
  promptedToDeleteCorpusId,
  loadingCorpora,
  actions: {
    promptNewCorpus,
    unpromptNewCorpus,
    deleteCorpus,
    setPromptedToDeleteCorpusId,
    createCorpus,
  },
  schema,
  onSubmitNewCorpus,
  downloadCorpus,
  onCorpusDrop,
  onLoadExample
}, { t: translate } ) => {

  const duplicateCorpus = ( corpus ) => {
    const newId = genId();
    createCorpus( {
      ...corpus,
      metadata: {
        ...corpus.metadata,
        id: newId
      }
    } );
  };

  return (
    <section className={ 'dicto-Corpora rows' }>
      <Nav
        localizationCrumbs={ [
                {
                  href: '/corpora/',
                  name: translate( 'my corpora' ),
                  active: true
                }
              ] }
      />
      <div className={ 'container is-fluid hero-body is-flex-1' }>
        <div className={ 'columns' }>
          <div className={ 'column is-half is-scrollable' }>
            <div className={ 'level column is-full' }>
              <h2 className={ 'title is-2' }>
                {translate( 'your-corpora' )}
              </h2>
            </div>
            <div
              id={ 'corpora-landing' }
              className={ 'content column level is-full' }
            >
              {translate( 'corpora-description' )}
            </div>
            <ul>
              <li
                id={ 'new-corpus' }
                className={ 'level column' }
              >
                <button
                  onClick={ promptNewCorpus }
                  className={ 'button is-fullwidth is-dark' }
                >
                  {translate( 'create-corpus' )}
                </button>
              </li>
              <li
                id={ 'drop-corpus' }
                className={ 'level column' }
              >
                <DropZone
                  onDrop={ onCorpusDrop }
                >
                  {translate( 'import-corpus' )}
                </DropZone>
              </li>
              <li
                id={ 'example-corpus' }
                className={ 'level column' }
              >
                <button
                  onClick={ onLoadExample }
                  className={ 'button is-fullwidth' }
                >
                  {translate( 'load-example-corpus' )}
                </button>
              </li>
            </ul>
          </div>
          <div className={ 'column is-half corpora-wrapper' }>
            <PaginatedList
              items={ mapToArray( corpora ).sort( ( a, b ) => {
                            if ( a.metadata.title > b.metadata.title ) {
                              return 1;
                            }
                            return -1;
                          } ) }
              id={ 'corpora-list' }
              className={ 'is-flex-1' }
              renderNoItem={ () => ( 
                <div>
                  {
                                    loadingCorpora ? 
                                      translate( 'Loading corpora list ...' )
                                      : translate( 'You have no corpora yet' )
                                  }
                </div> 
                          ) }
              renderItem={ ( corpus, index ) => {
                            const onDelete = () => setPromptedToDeleteCorpusId( corpus.metadata.id );
                            const onDuplicate = () => duplicateCorpus( corpus );
                            const onDownload = () => downloadCorpus( corpus );
                            return (
                              <li
                                className={ 'level is-full column' }
                                key={ index }
                              >
                                <CorpusCard
                                  corpus={ corpus }
                                  openHref={ `/corpora/${corpus.metadata.id}` }
                                  onDelete={ onDelete }
                                  onDuplicate={ onDuplicate }
                                  onDownload={ onDownload }
                                />
                              </li>
                            );
                          } }
            />

          </div>
        </div>
      </div>
      <Modal
        isOpen={ creationModalOpen }
        onRequestClose={ unpromptNewCorpus }
      >
        <div className={ 'modal-content' }>
          <div className={ 'modal-header' }>
            <h1 className={ 'title is-1' }>
              {translate( 'create a new corpus' )}
            </h1>
            <div className={ 'close-modal-icon-container' }>
              <span
                className={ 'icon' }
                onClick={ unpromptNewCorpus }
              >
                <i className={ 'fas fa-times-circle' } />
              </span>
            </div>
          </div>
          <SchemaForm
            schema={ schema.properties.metadata }
            document={ undefined }
            onCancel={ unpromptNewCorpus }
            onSubmit={ onSubmitNewCorpus }
          />
        </div>
      </Modal>
      <Modal
        isOpen={ promptedToDeleteCorpusId !== undefined }
        onRequestClose={ () => setPromptedToDeleteCorpusId( undefined ) }
      >
        <div className={ 'modal-content' }>
          <div className={ 'modal-header' }>
            <h1 className={ 'title is-1' }>
              {translate( 'delete a corpus' )}
            </h1>
            <div className={ 'close-modal-icon-container' }>
              <span
                className={ 'icon' }
                onClick={ () => setPromptedToDeleteCorpusId( undefined ) }
              >
                <i className={ 'fas fa-times-circle' } />
              </span>
            </div>
          </div>
          <div className={ 'modal-body' }>
            <div
              style={ { paddingLeft: '1rem' } }
              className={ 'column content is-large' }
            >
              {translate( 'Are you sure you want to delete the corpus {c} ?', { c: corpora[promptedToDeleteCorpusId] && corpora[promptedToDeleteCorpusId].metadata.title } )}
            </div>
          </div>

          <div className={ 'modal-footer' }>
            <button
              onClick={ () => {
                            deleteCorpus( promptedToDeleteCorpusId );
                            setPromptedToDeleteCorpusId( undefined );
                          } }
              className={ 'button is-danger is-fullwidth' }
            >
              {translate( 'delete the corpus' )}
            </button>
            <button
              onClick={ () => setPromptedToDeleteCorpusId( undefined ) }
              className={ 'button is-warning is-fullwidth' }
            >
              {translate( 'cancel' )}
            </button>
          </div>

        </div>
      </Modal>
    </section>
  );
};

/**
 * Context data used by the component
 */
CorporaLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};

export default CorporaLayout;
