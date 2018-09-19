/**
 * This module exports a function providing the proper configuration object
 * regarding process mode (production or development)
 * @module dicto/utils/config
 */

import devConfig from '../../config.dev';
import prodConfig from '../../config.prod';

/**
 * @return {object} config - prod or dev config
 */
export default function getConfig() {
  return process.env.NODE_ENV === 'production' ?
    prodConfig : devConfig;
}
