import React, { Component } from 'react';

import { abbrev } from '../../helpers/utils';

const genGradient = ( start, end, direction = '210deg' ) => `linear-gradient( ${direction}, ${start} 0%, #FFFFFF 40%)`;

const palette = [
  '#a8edea',
  '#fed6e3',
  '#f5f7fa',
  '#c3cfe2',
  '#e0c3fc',
  '#f093fb',
  '#f5576c',
  '#fdfbfb',
  '#ebedee',
  '#d299c2',
  '#fef9d7',
  '#ebc0fd',
  '#d9ded8',
  '#f6d365',
  '#fda085',
  '#96fbc4',
  '#f9f586'
];

const backgrounds = {
  medias: genGradient( palette[0], palette[1] ),
  compositions: genGradient( palette[2], palette[3] ),
  chunks: genGradient( palette[4], palette[5] ),
  tags: genGradient( palette[6], palette[7] )
};

const numberOfWords = {
  medias: 10,
  compositions: 5,
  chunks: 3,
  tags: 20
};

export default class CorpusPreview extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      items: []
    };
  }

  componentDidMount = () => {
    this.updateItems( this.props );
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( this.props.previewType !== nextProps.previewType ) {
      this.updateItems( nextProps );
    }
  }

  componentWillUnmount = () => {
    clearInterval( this.interval );
    this.interval = null;
  }

  updateItems = ( props ) => {
    clearInterval( this.interval );
    this.interval = null;
    const {
      corpus,
      previewType
    } = props;
    const choosen = this.chooseItems( corpus, previewType, numberOfWords[previewType] );
    const items = this.prepareItems( choosen );
    this.setState( { items } );
    this.interval = setInterval( () => {
      this.setState( {
        items: this.state.items.map( ( item ) => {
          let fontRaw = item.state.upward ?
            item.state.fontRaw + 0.5 : item.state.fontRaw - 0.5;
          fontRaw = fontRaw > 1 ? fontRaw : 1;
          fontRaw = fontRaw < 10 ? fontRaw : 10;
          return {
            ...item,
            style: {
              ...item.style,
              fontSize: `${fontRaw}px`,
              blur: `blur(${5 / fontRaw}px`,
              opacity: fontRaw / 10
            },
            state: {
              ...item.state,
              fontRaw
            }
          };
        } )
      } );        
    }, 300 );
  }

  chooseItems = ( corpus, type, numberOfItems = 5 ) => {
    let accessor;
    const fields = Object.keys( corpus.fields );
    const fieldId = fields[parseInt( Math.random() * fields.length, 10 )];

    switch ( type ) {
    case 'medias':
      accessor = ( media ) => media.metadata.title;
      break;
    case 'chunks':
      accessor = ( chunk ) => chunk.fields[fieldId];
      break;
    case 'tags':
      accessor = ( tag ) => tag.name;
      break;
    case 'compositions':
      accessor = ( composition ) => composition.metadata.title;
      break;
    default:
      break;
    }
    let pool = corpus[type] ? Object.keys( corpus[type] ) : [];
    const choosen = [];
    let count = 0;
    while ( count < numberOfItems && pool.length ) {
      const choosenIndex = parseInt( Math.random() * pool.length, 10 );
      const item = corpus[type][pool[choosenIndex]];
      let content = accessor( item );
      if ( content && content.trim().length ) {
        content = abbrev( content.trim(), 50 );
        choosen.push( content );
      }
      pool = pool.filter( ( p, i ) => i !== choosenIndex );
      count ++;
    }
    return choosen;
  }

  prepareItems = ( items = [] ) =>
    items.map( ( message ) => {
      const fontRaw = parseInt( Math.random() * 10, 10 );
      const state = {
        fontRaw,
        upward: Math.random() >= 0.7
      };
      const style = {
        fontSize: `${fontRaw}px`,
        left: `${parseInt( 0.2 + Math.random() * 0.5 * 100, 10 )}%`,
        top: `${parseInt( 0.3 + Math.random() * 0.8 * 100, 10 )}%`,
        textAlign: 'center',
        blur: `blur(${5 / fontRaw}px`,
        opacity: fontRaw / 10,
        transition: 'all .3s linear',
        position: 'absolute',
      };
      return { message, style, state };
    } )

  render = () => {
    const {
      props: {
        previewType,
      },
      state: {
        items = [],
      }
    } = this;
    return (
      <div
        style={ { background: backgrounds[previewType] } }
        className={ 'corpus-preview' }
      >
        {
          items.map( ( { message, style }, index ) => (
            <div
              style={ style }
              key={ index }
            >
              {message}
            </div>
          ) )
        }
      </div>
    );
  }
}
