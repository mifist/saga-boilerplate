/**
 *
 * Asynchronously loads the component for CaseCard
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
