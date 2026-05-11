import type { ParcelContactPlan } from '../types';

export const CONTACTS_DUMMY_DATA: ParcelContactPlan[] = [
  {
    parcelNumber: '01-122-01-101-001',
    contacts: [
      { id: 'con-001', fullName: 'Margaret L. Thompson', status: 'Current Owner', phone: '(262) 555-0101', email: 'margaret.thompson@email.com' },
      { id: 'con-002', fullName: 'Robert J. Thompson', status: 'Co-Owner', phone: '(262) 555-0102', email: 'rjthompson@email.com' },
      { id: 'con-003', fullName: 'Dennis A. Kowalski', status: 'Former Owner', phone: '(414) 555-0201', email: 'dkowalski@gmail.com' },
      { id: 'con-004', fullName: 'Sarah M. Patel', status: 'Attorney', phone: '(414) 555-0310', email: 'sarah.patel@patellawgroup.com' },
      { id: 'con-005', fullName: 'First National Bank', status: 'Lien Holder', phone: '(800) 555-1234', email: 'liens@fnbank.com' },
      { id: 'con-006', fullName: 'Carlos R. Mendez', status: 'Tenant', phone: '(262) 555-0445', email: 'cmendez88@email.com' },
      { id: 'con-007', fullName: 'Estate of Dorothy K. Hansen', status: 'Estate Representative', phone: '(262) 555-0567', email: 'dhansen.estate@legalrep.com' },
      { id: 'con-008', fullName: 'Timothy B. Wolfe', status: 'Authorized Agent', phone: '(414) 555-0678', email: 'twolfe@propertymgmt.com' },
      { id: 'con-009', fullName: 'James C. Fitzgerald', status: 'Bankruptcy Trustee', phone: '(414) 555-0789', email: 'jfitz@trustee.gov' },
      { id: 'con-010', fullName: 'Lakewood HOA', status: 'Interest Party', phone: '(262) 555-0890', email: 'admin@lakewoodhoa.org' },
      { id: 'con-011', fullName: 'Patricia N. Nguyen', status: 'Former Owner', phone: '(262) 555-0912', email: 'pnguyen@yahoo.com' },
      { id: 'con-012', fullName: 'Michael S. Brennan', status: 'Attorney', phone: '(414) 555-1001', email: 'm.brennan@brennanlegal.com' },
    ],
  },
  {
    parcelNumber: '01-122-01-101-004',
    contacts: [
      { id: 'con-101', fullName: 'Howard L. Griffin', status: 'Current Owner', phone: '(262) 555-1101', email: 'hgriffin@email.com' },
      { id: 'con-102', fullName: 'Kenosha Credit Union', status: 'Lien Holder', phone: '(262) 555-1200', email: 'loans@kenoshacreditunion.com' },
      { id: 'con-103', fullName: 'Angela D. Torres', status: 'Attorney', phone: '(414) 555-1310', email: 'atorres@torreslaw.com' },
      { id: 'con-104', fullName: 'Victor M. Reyes', status: 'Tenant', phone: '(262) 555-1445', email: 'vreyes@email.com' },
    ],
  },
  {
    parcelNumber: '01-122-01-101-007',
    contacts: [
      { id: 'con-201', fullName: 'Donna R. Schultz', status: 'Current Owner', phone: '(262) 555-2101', email: 'donna.schultz@email.com' },
      { id: 'con-202', fullName: 'Frank B. Schultz', status: 'Co-Owner', phone: '(262) 555-2102', email: 'fschultz@email.com' },
      { id: 'con-203', fullName: 'Heartland Mortgage LLC', status: 'Lien Holder', phone: '(800) 555-2300', email: 'servicing@heartlandmtg.com' },
    ],
  },
];
