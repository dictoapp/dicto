import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { abbrev } from '../../helpers/utils';

import './CorpusCard.scss';

import CorpusPreview from './CorpusPreview';

// const DELAY = 6000;

class CorpusCard extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  constructor( props ) {
    super( props );
    this.state = {
      activePreviewType: 'medias',
      previewTypes: [ 'medias', 'chunks', 'tags', 'compositions' ]
    };
  }

  componentDidMount = () => {
    this.setInterval();
  }

  componentWillUnmount = () => {
    this.unsetInterval();
  }

  setInterval = () => {

    /*
     * if (!this.state.interval) {
     *   const interval = setInterval(this.updatePreview, DELAY);
     *   this.setState({interval})
     * }
     */
  }

  unsetInterval = () => {
    clearInterval( this.state.interval );
    // this.interval = null;
  }

  updatePreview = () => {
    const {
      previewTypes,
      activePreviewType: inputActivePreviewType,
    } = this.state;
    const index = previewTypes.indexOf( inputActivePreviewType );
    let tryCounts = 0;
    let activePreviewType;
    while ( tryCounts < previewTypes.length && !activePreviewType ) {
      const maybeIndex = index < previewTypes.length - 1 ? index + 1 : 0;
      const maybeKey = previewTypes[maybeIndex];
      if ( Object.keys( this.props.corpus[maybeKey] || {} ).length ) {
        activePreviewType = maybeKey;
      }
      else tryCounts ++;
    }
    this.setState( {
      activePreviewType
    } );
  }

  selectPreview = ( activePreviewType ) => {
    this.setState( { activePreviewType } );
    this.unsetInterval();
  }
  render = () => {
    const {
      props: {
        corpus: {
          metadata: {
            title,
          },
          chunks,
          tags,
          medias,
          compositions
        },
        onDelete,
        onDuplicate,
        onDownload,
        openHref = '#'
      },
      context: { t },
      state: {
        activePreviewType
      },
      selectPreview,
      setInterval
    } = this;

    const silent = ( e ) => {
      e.stopPropagation();
      return true;
    };

    const onClickMedias = ( e ) => silent( e ) && selectPreview( 'medias' );
    const onHoverMedias = () => selectPreview( 'medias' );
    const onClickChunks = ( e ) => silent( e ) && selectPreview( 'chunks' );
    const onHoverChunks = () => selectPreview( 'chunks' );
    const onClickTags = ( e ) => silent( e ) && selectPreview( 'tags' );
    const onHoverTags = () => selectPreview( 'tags' );
    const onClickCompositions = ( e ) => silent( e ) && selectPreview( 'compositions' );
    const onHoverCompositions = () => selectPreview( 'compositions' );
    
    return (
      <div className={ 'card dicto-CorpusCard' }>
        <div className={ 'columns' }>
          <div className={ 'column is-8 main-contents' }>
            <div className={ 'column' }>
              <h2 className={ 'card-header-title title is-3' }>
                <Link to={ openHref }>{abbrev( title, 30 ) || t( 'Untitled corpus' )}</Link>
              </h2>
              <ul className={ 'column' }>
                <li
                  onMouseOut={ setInterval }
                  onClick={ onClickMedias }
                  onMouseOver={ onHoverMedias }
                  className={ `preview-item ${activePreviewType === 'medias' ? 'active' : ''}` }
                >
                  <i className={ 'fas fa-video' } />{' '}{t( [ 'one media', '{n} medias', 'n' ], { n: Object.keys( medias || {} ).length } )}
                </li>
                <li
                  onMouseOut={ setInterval }
                  onClick={ onClickChunks }
                  onMouseOver={ onHoverChunks }
                  className={ `preview-item ${activePreviewType === 'chunks' ? 'active' : ''}` }
                >
                  <i className={ 'fas fa-film' } />{'  '}{t( [ 'one excerpt', '{n} excerpts', 'n' ], { n: Object.keys( chunks || {} ).length } )}
                </li>
                <li
                  onMouseOut={ setInterval }
                  onClick={ onClickTags }
                  onMouseOver={ onHoverTags }
                  className={ `preview-item ${activePreviewType === 'tags' ? 'active' : ''}` }
                >
                  <i className={ 'fas fa-tag' } />{' '}{t( [ 'one tag', '{n} tags', 'n' ], { n: Object.keys( tags || {} ).length } )}
                </li>
                <li
                  onMouseOut={ setInterval }
                  onClick={ onClickCompositions }
                  onMouseOver={ onHoverCompositions }
                  className={ `preview-item ${activePreviewType === 'compositions' ? 'active' : ''}` }
                >
                  <i className={ 'fas fa-list' } />{' '}{t( [ 'one composition', '{n} compositions', 'n' ], { n: Object.keys( compositions || {} ).length } )}
                </li>
              </ul>
            </div>
          </div>
          <div className={ 'column is-4' }>
            <CorpusPreview
              corpus={ this.props.corpus }
              previewType={ activePreviewType }
            />
          </div>
        </div>
        <footer className={ 'card-footer' }>
          <Link
            to={ openHref }
            className={ 'card-footer-item' }
          >
            {t( 'open' )}
          </Link>
          <button
            onClick={ onDownload }
            href={ '#' }
            className={ 'card-footer-item' }
          >
            {t( 'download corpus' )}
          </button>
          <button
            onClick={ onDuplicate }
            href={ '#' }
            className={ 'card-footer-item' }
          >
            {t( 'duplicate corpus' )}
          </button>
          <button
            onClick={ onDelete }
            href={ '#' }
            className={ 'card-footer-item' }
          >
            {t( 'delete corpus' )}
          </button>
        </footer>

      </div>
    );
  }
}

export default CorpusCard;
