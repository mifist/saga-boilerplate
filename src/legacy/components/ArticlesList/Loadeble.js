/**
 *
 * Asynchronously loads the component for ArticlesList
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
