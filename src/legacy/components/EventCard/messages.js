/*
 * EventCard Messages
 *
 * This contains all the text for the EventCard component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.EventCard';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the EventCard component!',
  },
});
