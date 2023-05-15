/**
 *
 * Asynchronously loads the component for PostTabs
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
