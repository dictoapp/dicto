import React from 'react';

import Markdown from '../MarkdownPlayer';

const HomeView = ( {
  corpus: {
    metadata: {
      title,
      description
    },
  },
} ) => {
  return (
    <div>
      <h1 className={ 'title is-1' }>
        {title}
      </h1>
      <div className={ 'corpus-description' }>
        <Markdown src={ description } />
      </div>
    </div>
  );
};
export default HomeView;
