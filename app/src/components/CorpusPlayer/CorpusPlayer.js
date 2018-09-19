import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip';

import MontagePlayer from '../MontagePlayer/MontagePlayer';

import Markdown from '../MarkdownPlayer/MarkdownPlayer';

import HomeView from './HomeView';
import MediaView from './MediaView';
import SpaceView from './SpaceView';
import TagsView from './TagsView';
import TimeView from './TimeView';

import { buildMontageData } from './utils';

import NavContent from './NavContent';
import PlaylistManager from './PlaylistManager';

Modal.setAppElement( '#mount' );

import './CorpusPlayer.scss';

export default class CorpusPlayer extends Component {

  constructor( props ) {
    super( props );

    const hasTaggedChunks = Object.keys( props.corpus.tags )
      .find( ( tagId ) => {
        return Object.keys( props.corpus.chunks )
          .find( ( chunkId ) => {
            const chunk = props.corpus.chunks[chunkId];
            return chunk.tags.includes( tagId );
          } );
      } ) !== undefined;

    this.state = {
      location: hasTaggedChunks ? 'tags-view' : 'medias-view',
      activeMontageData: {
        summary: [],
        duration: 0
      },
      montageVisible: false,
      playlistBuilders: [],
      infoVisible: true,
    };
  }

  setActivePlaylist = ( activePlaylist ) => {
    this.setState( { activePlaylist } );
  }

  setLocation = ( location ) => {
    this.setState( { location } );
  }

  setMontageVisible = ( montageVisible ) => {
    this.setState( { montageVisible } );
  }
  toggleMontageVisible = () => {
    this.setMontageVisible( !this.state.montageVisible );
  }

  addPlaylistBuilder = ( type, data ) => {
    const playlistBuilders = [
      ...this.state.playlistBuilders,
      {
        type,
        data: { ...data }
      }
    ];
    this.setState( {
      playlistBuilders,
      activeMontageData: buildMontageData( this.props.corpus, playlistBuilders )
    } );
  }

  updatePlaylistBuilders = ( playlistBuilders ) => {
    this.setState( {
      playlistBuilders,
      activeMontageData: buildMontageData( this.props.corpus, playlistBuilders )
    } );
  }

  renderMainView = () => {
    const {
      state: {
        location,
      },
      addPlaylistBuilder
    } = this;
    const additionnalProps = { addPlaylistBuilder };
    switch ( location ) {
    case 'tags-view':
      return ( <TagsView
        { ...this.props }
        { ...additionnalProps }
               /> );
    case 'space-view':
      return ( <SpaceView
        { ...this.props }
        { ...additionnalProps }
               /> );
    case 'time-view':
      return ( <TimeView
        { ...this.props }
        { ...additionnalProps }
               /> );
    case 'medias-view':
      return ( <MediaView
        { ...this.props }
        { ...additionnalProps }
               /> );
    case 'home':
    default:
      return ( <HomeView
        { ...this.props }
        { ...additionnalProps }
               /> );
    }
  }

  render = () => {
    const {
      props: {
        corpus,
        translate
      },
      state: {
        montageVisible,
        activeMontageData,
        playlistBuilders = [],
        location,
        infoVisible,
      },
      toggleMontageVisible,
      renderMainView,
      setLocation,
      updatePlaylistBuilders
    } = this;

    const {
      metadata: {
        title,
        description,
        creators
      }
    } = corpus;

    const toggleInfoVisibility = () => {
      this.setState( {
        infoVisible: !infoVisible
      } );
    };

    return (
      <div className={ 'dicto-CorpusPlayer hero  is-light' }>
        <div className={ 'hero-body columns' }>
          <nav className={ 'column nav-container' }>
            <NavContent
              corpus={ corpus }
              locationId={ location }
              setLocation={ setLocation }
              toggleInfoVisibility={ toggleInfoVisibility }
              translate={ translate }
            />
          </nav>

          <section className={ 'column main-container' }>
            {renderMainView()}
          </section>
          <section
            style={ {
              pointerEvents: playlistBuilders.length ? 'all' : 'none',
              background: playlistBuilders.length ? '#f8f5f0' : 'transparent',
            } }
            className={ 'column aside-container' }
          >
            <PlaylistManager
              { ...corpus }
              translate={ translate }
              activeMontageData={ activeMontageData }
              playlistBuilders={ playlistBuilders }
              onChange={ updatePlaylistBuilders }
              onPlay={ toggleMontageVisible }
            />
          </section>
        </div>

        <div
          onClick={ toggleInfoVisibility }
          className={ `corpus-info-wrapper ${infoVisible ? 'is-active' : ''}` }
        >
          <div className={ 'corpus-info-container' }>
            <div className={ 'column' }>
              <h2 className={ 'title is-1' }>
                <span>{title}</span>
              </h2>
            </div>
            <div className={ 'level' } />
            <div className={ 'column' }>
              <button className={ 'button is-fullwidth' }>
                {translate( 'explore' )}
              </button>
            </div>
            <div className={ 'level' } />
            {
              description && description.length > 0 &&
              <div className={ 'corpus-description content column' }>
                <Markdown src={ description } />
              </div>
            }
            {
              creators && creators.length > 0 &&
              <div className={ 'corpus-creators' }>
                  {
                  creators.map( ( creator, index ) => (
                    <div
                      key={ index }
                      className={ 'corpus-creator column' }
                    >
                      <h3 className={ 'title is-5' }>
                        {creator.given}{' '}{creator.family}{' '}{creator.role && creator.role.length ? `(${creator.role})` : ''}
                      </h3>
                      {
                        creator.presentation && creator.presentation.length > 0 &&
                        <div className={ 'creator-presentation' }>
                          <Markdown src={ creator.presentation } />
                        </div>
                      }
                    </div>
                  ) )
                }
              </div>
            }

          </div>
        </div>

        <Modal
          className={ 'composition-player-modal' }
          isOpen={ montageVisible }
          style={ {
                  content: {
                    height: '80%',
                    maxHeight: '80%',
                    minHeight: '80%',
                  }
                } }
          onRequestClose={ toggleMontageVisible }
        >
          <MontagePlayer
            summary={ activeMontageData.summary }
            translate={ translate }
            { ...corpus }
          />
          <div className={ 'close-modal-icon-container' }>
            <span
              className={ 'icon' }
              onClick={ toggleMontageVisible }
            >
              <i className={ 'fas fa-times-circle' } />
            </span>
          </div>
        </Modal>
        <ReactTooltip
          id={ 'tooltip' }
          delayShow={ 500 }
        />
      </div>
    );
  }
}
