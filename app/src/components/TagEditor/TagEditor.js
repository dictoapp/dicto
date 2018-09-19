import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DatesPicker from '../DatesPicker';
import LocationPicker from '../LocationPicker';
import MarkdownEditor from '../MarkdownEditor';

import './TagEditor.scss';

export default class TagEditor extends Component {
  static contextTypes = {
    t: PropTypes.func
  }

  constructor( props ) {
    super( props );
    this.state = {
      tag: props.tag
    };
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( this.props.tag !== nextProps.tag ) {
      this.setState( { tag: nextProps.tag } );
    }
  }

  onNameChange = ( e ) => {
    this.setState( {
      tag: {
        ...this.state.tag,
        name: e.target.value
      }
    } );
  }

  onDescriptionChange = ( description ) => {
    this.setState( {
      tag: {
        ...this.state.tag,
        description
      }
    } );
  }

  setDates = ( dates ) => {
    this.setState( {
      tag: {
        ...this.state.tag,
        dates
      }
    } );
  }

  setLocation = ( location ) => {
    this.setState( {
      tag: {
        ...this.state.tag,
        location
      }
    } );
  }

  onSubmit = ( e ) => {
    e.preventDefault();
    this.onSave();
  }

  onSave = () => {
    this.props.onSave( this.state.tag );
  }

  render = () => {
    const {
      state: {
        tag: {
          name,
          description,
          location,
          dates,
          metadata: { id }
        }
      },
      context: { t },
      onNameChange,
      onDescriptionChange,
      setDates,
      setLocation,
      onSubmit,
      onSave,
      props: {
        onCancel,
        onDelete,
      }
    } = this;
    return (
      <div className={ 'dicto-TagEditor' }>
        <form
          onSubmit={ onSubmit }
          className={ 'form' }
        >
          <div className={ 'main-contents columns' }>
            <div className={ 'column' }>
              <div className={ 'field' }>
                <label className={ 'label' }>{t( 'tag name' )}</label>
                <div className={ 'control' }>
                  <input
                    className={ 'input' }
                    type={ 'text' }
                    placeholder={ t( 'tag name' ) }
                    value={ name || '' }
                    onChange={ onNameChange }
                  />
                </div>
              </div>
              <div className={ 'field' }>
                <label className={ 'label' }>{t( 'tag description' )}</label>
                <div
                  id={ 'description-edition-container' }
                  className={ 'control' }
                >
                  <MarkdownEditor
                    placeholder={ t( 'tag description' ) }
                    value={ description || '' }
                    onChange={ onDescriptionChange }
                  />
                </div>
              </div>
              <div className={ 'field' }>
                <button
                  onClick={ onDelete }
                  className={ 'button is-danger is-fullwidth' }
                >
                  {t( 'delete tag' )}
                </button>
              </div>
            </div>
            <div className={ 'column' }>
              <div
                id={ 'date-edition-container' }
                className={ 'level' }
              >
                <div className={ 'column' }>
                  <h3 className={ 'title is-3' }>
                    {t( 'Tag dates' )}
                  </h3>
                  <DatesPicker
                    id={ id }
                    dates={ dates }
                    onChange={ setDates }
                  />
                </div>
              </div>
              <div
                id={ 'location-edition-container' }
                className={ 'level' }
              >
                <div className={ 'column' }>
                  <h3 className={ 'title is-3' }>
                    {t( 'Tag location' )}
                  </h3>
                  <LocationPicker
                    id={ id }
                    location={ location }
                    onChange={ setLocation }
                  />
                </div>
              </div>
            </div>
          </div>
          <ul className={ 'form-footer' }>
            <li>
              <button
                className={ 'button is-fullwidth is-primary' }
                onClick={ onSave }
              >{t( 'save' )}
              </button>
            </li>
            <li>
              <button
                className={ 'button is-fullwidth is-warning' }
                onClick={ onCancel }
              >{t( 'cancel' )}
              </button>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}
