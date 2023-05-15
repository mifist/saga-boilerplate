/**
 *
 * Asynchronously loads the component for MediaPlayer
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
