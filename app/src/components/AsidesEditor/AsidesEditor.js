import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import MarkdownEditor from '../MarkdownEditor';

import './AsidesEditor.scss';

const AsideEditor = ( {
  aside,
  index,
  onChange
}, { t } ) => {
  const asideTypes = [
    {
      value: 'markdown',
      label: t( 'markdown content' )
    },
    {
      value: 'link',
      label: t( 'link' )
    },
    {
      value: 'images',
      label: t( 'image(s)' )
    }
  ];
  const asideType = aside.type;
  const onTypeChange = ( { value } ) => {
    onChange( {
      ...aside,
      type: value
    } );
  };

  const renderSpecificEditor = () => {
    switch ( asideType ) {
    case 'link':
      const onUrlChange = ( e ) => {
        onChange( {
          ...aside,
          url: e.target.value
        } );
      };
      const onTextChange = ( e ) => {
        onChange( {
          ...aside,
          text: e.target.value
        } );
      };
      const displayWebpage = () => {
        onChange( {
          ...aside,
          displayWebpage: true
        } );
      };
      const dontDisplayWebpage = () => {
        onChange( {
          ...aside,
          displayWebpage: false
        } );
      };
      return (
        <div className={ 'column' }>
          <div className={ 'field' }>
            <label className={ 'label' }>{t( 'link url' )}</label>
            <div className={ 'control' }>
              <input
                className={ 'input' }
                type={ 'text' }
                placeholder={ t( 'link url' ) }
                value={ aside.url || '' }
                onChange={ onUrlChange }
              />
            </div>
          </div>
          <div className={ 'field' }>
            <label className={ 'label' }>{t( 'link text' )}</label>
            <div className={ 'control' }>
              <input
                className={ 'input' }
                type={ 'text' }
                placeholder={ t( 'link text' ) }
                value={ aside.text || '' }
                onChange={ onTextChange }
              />
            </div>
          </div>
          <div className={ 'control' }>
            <label className={ 'radio' }>
              <input
                onClick={ displayWebpage }
                type={ 'radio' }
                name={ 'answer' }
                onChange={ displayWebpage }
                checked={ aside.displayWebpage }
              />
              {t( 'display webpage' )}
            </label>
            <label className={ 'radio' }>
              <input
                onClick={ dontDisplayWebpage }
                type={ 'radio' }
                name={ 'answer' }
                onChange={ dontDisplayWebpage }
                checked={ !aside.displayWebpage }
              />
              {t( 'do not display webpage' )}
            </label>
          </div>
        </div>
      );
    case 'markdown':
      const onMdChange = ( content ) => {
        onChange( {
          ...aside,
          content
        } );
      };
      return (
        <div className={ 'column' }>
          <MarkdownEditor
            value={ aside.content || '' }
            onChange={ onMdChange }
          />
        </div>
      );
    case 'images':
      const addImage = () => {
        onChange( {
          ...aside,
          images: aside.images ? [
            ...aside.images,
            {}
          ] : [ {} ]
        } );
      };
      const onTitleChange = ( e ) => {
        onChange( {
          ...aside,
          title: e.target.value
        } );
      };
      return (
        <div className={ 'column' }>
          <div className={ 'column' }>
            <div className={ 'field' }>
              <label className={ 'label' }>{t( 'title' )}</label>
              <div className={ 'control' }>
                <input
                  className={ 'input' }
                  type={ 'text' }
                  placeholder={ t( 'image gallery title' ) }
                  value={ aside.title || '' }
                  onChange={ onTitleChange }
                />
              </div>
            </div>
          </div>
          <ul>
            {
              ( aside.images || [] ).map( ( image, imageIndex ) => {
                const onRemoveImage = () => {
                  onChange( {
                    ...aside,
                    images: imageIndex === 0 ?
                      aside.images.slice( 1 ) :
                      [
                        ...aside.images.slice( 0, imageIndex ),
                        ...aside.images.slice( imageIndex + 1 ),
                      ]
                  } );
                };
                const onImageUrlChange = ( e ) => {
                  const updatedImage = {
                    ...aside.images[imageIndex],
                    url: e.target.value
                  };
                  const images = imageIndex === 0 ?
                    [
                      updatedImage,
                      ...aside.images.slice( 1 )
                    ] :
                    [
                      ...aside.images.slice( 0, imageIndex ),
                      updatedImage,
                      ...aside.images.slice( imageIndex + 1 ),
                    ];
                  onChange( {
                    ...aside,
                    images
                  } );
                };
                const onImageContentChange = ( content ) => {
                  const updatedImage = {
                    ...aside.images[imageIndex],
                    content
                  };
                  const images = imageIndex === 0 ?
                    [
                      updatedImage,
                      ...aside.images.slice( 1 )
                    ] :
                    [
                      ...aside.images.slice( 0, imageIndex ),
                      updatedImage,
                      ...aside.images.slice( imageIndex + 1 ),
                    ];
                  onChange( {
                    ...aside,
                    images
                  } );
                };
                return (
                  <li
                    key={ imageIndex }
                    className={ 'column columns specific-editor-container' }
                  >
                    <div className={ 'column' }>
                      <div className={ 'field' }>
                        <label className={ 'label' }>{t( 'image url' )}</label>
                        <div className={ 'control' }>
                          <input
                            className={ 'input' }
                            type={ 'text' }
                            placeholder={ t( 'image url' ) }
                            value={ image.url || '' }
                            onChange={ onImageUrlChange }
                          />
                        </div>
                      </div>
                      <div className={ 'field' }>
                        <label className={ 'label' }>{t( 'image legend' )}</label>
                        <div className={ 'control' }>
                          <MarkdownEditor
                            value={ image.content || '' }
                            onChange={ onImageContentChange }
                          />
                        </div>
                      </div>
                      <div>
                        <button
                          className={ 'button is-danger' }
                          onClick={ onRemoveImage }
                        >
                          {t( 'remove image' )}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              } )
            }
            <li className={ 'column' }>
              <button
                className={ 'button is-info' }
                onClick={ addImage }
              >
                {t( 'add image' )}
              </button>
            </li>
          </ul>
        </div>
      );
    default:
      return null;
    }
  };
  return (
    <div>
      <div className={ 'level  aside-header' }>
        <div className={ 'column' }>
          <Select
            name={ index }
            value={ asideType }
            onChange={ onTypeChange }
            clearable={ false }
            searchable={ false }
            options={ asideTypes }
          />
        </div>
      </div>
      <div className={ 'level specific-editor-container' }>
        {renderSpecificEditor()}
      </div>
    </div>
  );
};

AsideEditor.contextTypes = {
  t: PropTypes.func
};

export default class AsidesEditor extends Component {
  static contextTypes = {
    t: PropTypes.func
  }
  constructor( props ) {
    super( props );
    this.state = {
      asides: props.asides || [],
      isOpen: false
    };
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( this.props.asides !== nextProps.asides ) {
      this.setState( {
        asides: nextProps.asides
      } );
    }
  }

  addAside = () => {
    this.setState( {
      asides: [
        ...this.state.asides,
        {}
      ],
      isOpen: this.state.asides.length === 0 ? true : this.state.isOpen
    } );
  }

  deleteAside = ( index ) => {
    const asides = index === 0 ?
      this.state.asides.slice( 1 )
      : [
        ...this.state.asides.slice( 0, index ),
        ...this.state.asides.slice( index + 1 ),
      ];
    this.setState( {
      asides
    } );
    this.transmitChanges( asides );
  }

  updateAside = ( index, aside ) => {
    const asides = index === 0 ?
      [
        aside,
        ...this.state.asides.slice( index + 1 ),
      ]
      : [
        ...this.state.asides.slice( 0, index ),
        aside,
        ...this.state.asides.slice( index + 1 ),
      ];
    this.setState( {
      asides
    } );
    this.transmitChanges( asides );
  }

  transmitChanges = ( asides ) => {
    const toUpdate = asides || this.state.asides;
    this.props.onChange( toUpdate );
  }

  toggleOpen = () => {
    this.setState( {
      isOpen: !this.state.isOpen
    } );
  }

  render = () => {
    const {
      context: { t },
      state: {
        asides,
        // isOpen
      },
      // toggleOpen,
      addAside,
      deleteAside,
      updateAside,
    } = this;
    return (
      <div className={ 'dicto-AsidesEditor column' }>
        <ul className={ 'column asides-contents' }>
          {
            ( asides || [] ).map( ( aside, index ) => {
              const onDelete = () => {
                deleteAside( index );
              };
              const onAsideEditorChange = ( updatedAside ) => {
                updateAside( index, updatedAside );
              };
              return (
                <li
                  className={ 'level' }
                  key={ index }
                >
                  <div className={ 'column' }>
                    <AsideEditor
                      aside={ aside }
                      onChange={ onAsideEditorChange }
                    />
                    <div className={ 'column' }>
                      <button
                        className={ 'button is-danger is-fullwidth' }
                        onClick={ onDelete }
                      >
                        <span className={ 'icon' }>
                          <i className={ 'fas fa-trash' } />
                        </span>
                        <span>{t( 'delete additional content' )}</span>
                      </button>
                    </div>
                  </div>
                </li>
              );
            } )
          }
          <li className={ 'level' }>
            <div className={ 'is-flex-1 is-fullwidth' }>
              <button
                className={ 'button is-primary is-fullwidth' }
                onClick={ addAside }
              >
                <span className={ 'icon' }>
                  <i className={ 'fas fa-plus-circle' } />
                </span>
                <span>{t( 'add additional contents to this excerpt' )}</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
