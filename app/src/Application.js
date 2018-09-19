/**
 * Dicto backoffice Application
 * =======================================
 * Root component of the application.
 * @module dicto
 */
import React from 'react';

import { Route } from 'react-router';

import { ConnectedRouter } from 'connected-react-router';

import { AnimatedSwitch } from 'react-router-transition';

import './Application.scss';

import Landing from './features/Landing/components/LandingContainer.js';
import Corpora from './features/Corpora/components/CorporaContainer.js';
import Corpus from './features/Corpora/components/CorpusContainer.js';
import ChunksEditionContainer from './features/ChunksEdition/components/ChunksEditionContainer.js';
import CompositionEditionContainer from './features/CompositionEdition/components/CompositionEditionContainer.js';
import Layout from './features/Layout/components/LayoutContainer.js';
import About from './features/About/components/AboutContainer.js';
import NotFound from './components/NotFound/NotFound.js';
import Tour from './features/Tour/components/TourContainer.js';

const EditionRoutes = ( { match } ) => {
  return (
    <div>
      <Route
        exact
        path={ `${match.path}` }
        component={ Corpora }
      />
      <Route
        exact
        path={ `${match.path}:id` }
        component={ Corpus }
      />
      <Route
        exact
        path={ `${match.path}:id/chunks` }
        component={ ChunksEditionContainer }
      />
      <Route
        exact
        path={ `${match.path}:corpusId/composition/:compositionId` }
        component={ CompositionEditionContainer }
      />
    </div>
  );
};

const routes = [
  (
    <Route
      exact
      key={ 1 }
      path={ '/' }
      component={ Landing }
    />
  ),
  (
    <Route
      key={ 2 }
      path={ '/corpora/' }
      component={ EditionRoutes }
    />
  ),
  (
    <Route
      key={ 3 }
      path={ '/de/' }
      component={ () => (
        <Layout>
          <About />
        </Layout>
      ) }
    />
  ),
  (
    <Route
      key={ 4 }
      component={ NotFound }
    />
  ),
];

/**
 * Renders the whole dicto application
 * @return {ReactComponent} component
 */
const Application = ( { history } ) => (
  <ConnectedRouter
    history={ history }
  >
    <Tour>
      <AnimatedSwitch
        atEnter={ { opacity: 0 } }
        atLeave={ { opacity: 0 } }
        atActive={ { opacity: 1 } }
        className={ 'switch-wrapper' }
      >
        {routes}
      </AnimatedSwitch>
    </Tour>
  </ConnectedRouter>
);

export default Application;
