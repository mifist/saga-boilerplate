/**
 *
 * Asynchronously loads the component for SideBarMenu
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
