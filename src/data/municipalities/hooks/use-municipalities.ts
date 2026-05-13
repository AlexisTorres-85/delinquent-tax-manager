import { useMemo } from 'react';
import { MUNICIPALITIES_DATA } from '../data/municipalities-data';
import type { Municipality } from '../types';

/**
 * Returns the static municipality list.
 * The array reference is stable — safe to use as a dependency.
 * When the real API is ready, replace MUNICIPALITIES_DATA with a fetch call
 * and add loading/error states here.
 */
export function useMunicipalities(): Municipality[] {
  return useMemo(() => MUNICIPALITIES_DATA, []);
}
