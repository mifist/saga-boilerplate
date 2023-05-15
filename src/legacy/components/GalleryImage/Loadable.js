/**
 *
 * Asynchronously loads the component for GalleryImage
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
