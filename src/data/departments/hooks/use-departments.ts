import { useState, useEffect } from 'react';
import { departmentService } from '../services/department.service';
import type { Department } from '../types';

let cache: Department[] | null = null;

/**
 * Returns the department list, loaded once and cached for the lifetime of the app.
 * When the real API is ready, update departmentService.getAll() — no changes needed here.
 */
export function useDepartments(): { departments: Department[]; isLoading: boolean } {
  const [departments, setDepartments] = useState<Department[]>(cache ?? []);
  const [isLoading, setIsLoading] = useState(cache === null);

  useEffect(() => {
    if (cache !== null) return;
    departmentService.getAll().then((data) => {
      cache = data;
      setDepartments(data);
      setIsLoading(false);
    });
  }, []);

  return { departments, isLoading };
}
