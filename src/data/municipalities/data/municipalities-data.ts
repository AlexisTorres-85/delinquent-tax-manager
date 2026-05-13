import type { Municipality } from '../types';

/**
 * Static municipality reference data for Kenosha County.
 * These values come from the database but never change —
 * load once and reuse across the app.
 */
export const MUNICIPALITIES_DATA: Municipality[] = [
    { code: '002', description: 'Town of Brighton' },
    { code: '004', description: 'Town of Bristol' },
    { code: '006', description: 'Town of Paris' },
    { code: '010', description: 'Town of Randall' },
    { code: '012', description: 'Town of Salem' },
    { code: '014', description: 'Town of Somers' },
    { code: '016', description: 'Town of Wheatland' },
    { code: '104', description: 'Village of Bristol' },
    { code: '131', description: 'Village of Genoa City' },
    { code: '171', description: 'Village of Paddock Lake' },
    { code: '174', description: 'Village of Pleasant Prairie' },
    { code: '179', description: 'Village of Salem Lakes' },
    { code: '181', description: 'Village of Silver Lake' },
    { code: '182', description: 'Village of Somers' },
    { code: '186', description: 'Village of Twin Lakes' },
    { code: '241', description: 'City of Kenosha' },
];
