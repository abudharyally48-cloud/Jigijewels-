import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackVisit } from '../api';

export function useTrackVisit() {
  const location = useLocation();
  useEffect(() => {
    trackVisit(location.pathname).catch(() => {});
  }, [location.pathname]);
}
