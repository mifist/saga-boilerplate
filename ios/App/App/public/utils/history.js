import { createBrowserHistory } from 'history';
import { useLocation } from 'react-router-dom';
const history = createBrowserHistory();

// For searching query into url
export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default history;