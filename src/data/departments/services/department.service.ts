import { DEPARTMENTS_DATA } from '../data/departments-data';
import type { Department } from '../types';

/**
 * Simulates an API call to fetch the department list.
 * Replace the body with a real fetch when the API is ready.
 */
export const departmentService = {
  async getAll(): Promise<Department[]> {
    // TODO: replace with real API call, e.g.:
    // const res = await fetch('/api/departments');
    // return res.json();
    return Promise.resolve(DEPARTMENTS_DATA);
  },
};
