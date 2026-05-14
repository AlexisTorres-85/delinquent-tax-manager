import type { TaxYearBalance } from '../types';

export const TAX_YEAR_BALANCES_DUMMY_DATA: TaxYearBalance[] = [
  // ── 01-122-01-101-001 ────────────────────────────────────────────────────
  { id: 'tyb-0001', parcelNumber: '01-122-01-101-001', taxYear: 2024, isDelinquent: false, baseTax: 3820.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 3820.00, totalPaid: 3820.00, currentDue: 0, lastPaymentAmount: 3820.00, lastPaymentDate: '2025-02-10', assessedValue: 214306 },
  { id: 'tyb-0002', parcelNumber: '01-122-01-101-001', taxYear: 2023, isDelinquent: false, baseTax: 3640.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 3640.00, totalPaid: 3640.00, currentDue: 0, lastPaymentAmount: 3640.00, lastPaymentDate: '2024-03-01', assessedValue: 208000 },
  { id: 'tyb-0003', parcelNumber: '01-122-01-101-001', taxYear: 2022, isDelinquent: false, baseTax: 3450.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 3450.00, totalPaid: 3450.00, currentDue: 0, lastPaymentAmount: 3450.00, lastPaymentDate: '2023-02-28', assessedValue: 200000 },

  // ── 01-122-01-101-004 ────────────────────────────────────────────────────
  { id: 'tyb-0004', parcelNumber: '01-122-01-101-004', taxYear: 2024, isDelinquent: true,  baseTax: 3200.00, interest: 310.00, penalty: 160.00, otherCharges: 60.00, specialAssessments: 0, totalDue: 3730.00, totalPaid: 3991.29, currentDue: 0, lastPaymentAmount: 3991.29, lastPaymentDate: '2025-12-08', assessedValue: 142500 },
  { id: 'tyb-0005', parcelNumber: '01-122-01-101-004', taxYear: 2023, isDelinquent: true,  baseTax: 2980.00, interest: 248.00, penalty: 118.00, otherCharges: 0, specialAssessments: 0, totalDue: 3346.00, totalPaid: 1200.00, currentDue: 2146.00, lastPaymentAmount: 1200.00, lastPaymentDate: '2024-06-15', assessedValue: 138000 },
  { id: 'tyb-0006', parcelNumber: '01-122-01-101-004', taxYear: 2022, isDelinquent: false, baseTax: 2750.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 2750.00, totalPaid: 2750.00, currentDue: 0, lastPaymentAmount: 2750.00, lastPaymentDate: '2023-01-20', assessedValue: 130000 },

  // ── 01-122-01-101-005 ────────────────────────────────────────────────────
  { id: 'tyb-0007', parcelNumber: '01-122-01-101-005', taxYear: 2024, isDelinquent: true,  baseTax: 2800.00, interest: 245.00, penalty: 100.00, otherCharges: 100.00, specialAssessments: 0, totalDue: 3245.00, totalPaid: 2259.32, currentDue: 985.68, lastPaymentAmount: 2259.32, lastPaymentDate: '2025-09-15', assessedValue: 127932 },
  { id: 'tyb-0008', parcelNumber: '01-122-01-101-005', taxYear: 2023, isDelinquent: true,  baseTax: 2650.00, interest: 195.00, penalty: 88.00, otherCharges: 0, specialAssessments: 0, totalDue: 2933.00, totalPaid: 800.00, currentDue: 2133.00, lastPaymentAmount: 800.00, lastPaymentDate: '2024-04-22', assessedValue: 122000 },
  { id: 'tyb-0009', parcelNumber: '01-122-01-101-005', taxYear: 2022, isDelinquent: false, baseTax: 2480.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 2480.00, totalPaid: 2480.00, currentDue: 0, lastPaymentAmount: 2480.00, lastPaymentDate: '2023-03-12', assessedValue: 115000 },

  // ── 01-122-01-101-006 ────────────────────────────────────────────────────
  { id: 'tyb-0010', parcelNumber: '01-122-01-101-006', taxYear: 2024, isDelinquent: true,  baseTax: 1950.00, interest: 106.00, penalty: 30.00, otherCharges: 0, specialAssessments: 0, totalDue: 2086.00, totalPaid: 1208.64, currentDue: 877.36, lastPaymentAmount: 1208.64, lastPaymentDate: '2025-12-01', assessedValue: 98400 },
  { id: 'tyb-0011', parcelNumber: '01-122-01-101-006', taxYear: 2023, isDelinquent: true,  baseTax: 1820.00, interest: 84.00, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 1904.00, totalPaid: 2202.84, currentDue: 0, lastPaymentAmount: 2202.84, lastPaymentDate: '2025-03-06', assessedValue: 94500 },
  { id: 'tyb-0012', parcelNumber: '01-122-01-101-006', taxYear: 2022, isDelinquent: false, baseTax: 1700.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 1700.00, totalPaid: 1700.00, currentDue: 0, lastPaymentAmount: 1700.00, lastPaymentDate: '2023-02-08', assessedValue: 88000 },

  // ── 01-122-01-101-007 ────────────────────────────────────────────────────
  { id: 'tyb-0013', parcelNumber: '01-122-01-101-007', taxYear: 2024, isDelinquent: true,  baseTax: 2650.00, interest: 265.00, penalty: 74.00, otherCharges: 52.00, specialAssessments: 0, totalDue: 3041.00, totalPaid: 3302.92, currentDue: 0, lastPaymentAmount: 3302.92, lastPaymentDate: '2025-07-12', assessedValue: 138200 },
  { id: 'tyb-0014', parcelNumber: '01-122-01-101-007', taxYear: 2023, isDelinquent: true,  baseTax: 2420.00, interest: 188.00, penalty: 56.00, otherCharges: 0, specialAssessments: 0, totalDue: 2664.00, totalPaid: 1100.00, currentDue: 1564.00, lastPaymentAmount: 1100.00, lastPaymentDate: '2024-08-30', assessedValue: 132000 },
  { id: 'tyb-0015', parcelNumber: '01-122-01-101-007', taxYear: 2022, isDelinquent: false, baseTax: 2290.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 2290.00, totalPaid: 2290.00, currentDue: 0, lastPaymentAmount: 2290.00, lastPaymentDate: '2023-01-30', assessedValue: 124000 },

  // ── 01-122-01-101-008 ────────────────────────────────────────────────────
  { id: 'tyb-0016', parcelNumber: '01-122-01-101-008', taxYear: 2024, isDelinquent: false, baseTax: 2560.00, interest: 123.00, penalty: 93.00, otherCharges: 0, specialAssessments: 0, totalDue: 2776.00, totalPaid: 2698.14, currentDue: 77.86, lastPaymentAmount: 2698.14, lastPaymentDate: '2025-04-04', assessedValue: 131000 },
  { id: 'tyb-0017', parcelNumber: '01-122-01-101-008', taxYear: 2023, isDelinquent: false, baseTax: 2380.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 2380.00, totalPaid: 5435.46, currentDue: 0, lastPaymentAmount: 2444.83, lastPaymentDate: '2025-04-26', assessedValue: 125000 },
  { id: 'tyb-0018', parcelNumber: '01-122-01-101-008', taxYear: 2022, isDelinquent: false, baseTax: 2200.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 2200.00, totalPaid: 2200.00, currentDue: 0, lastPaymentAmount: 2200.00, lastPaymentDate: '2023-03-20', assessedValue: 118000 },

  // ── 01-122-01-101-011 ────────────────────────────────────────────────────
  { id: 'tyb-0019', parcelNumber: '01-122-01-101-011', taxYear: 2024, isDelinquent: false, baseTax: 2050.00, interest: 25.00, penalty: 44.00, otherCharges: 0, specialAssessments: 0, totalDue: 2119.00, totalPaid: 2199.68, currentDue: 0, lastPaymentAmount: 2199.68, lastPaymentDate: '2025-07-25', assessedValue: 107500 },
  { id: 'tyb-0020', parcelNumber: '01-122-01-101-011', taxYear: 2023, isDelinquent: false, baseTax: 1940.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 1940.00, totalPaid: 5307.45, currentDue: 0, lastPaymentAmount: 4058.08, lastPaymentDate: '2024-07-26', assessedValue: 103000 },
  { id: 'tyb-0021', parcelNumber: '01-122-01-101-011', taxYear: 2022, isDelinquent: false, baseTax: 1810.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 1810.00, totalPaid: 1810.00, currentDue: 0, lastPaymentAmount: 1810.00, lastPaymentDate: '2023-01-18', assessedValue: 96000 },

  // ── 01-122-01-102-004 ────────────────────────────────────────────────────
  { id: 'tyb-0022', parcelNumber: '01-122-01-102-004', taxYear: 2024, isDelinquent: true,  baseTax: 2200.00, interest: 161.00, penalty: 66.00, otherCharges: 104.00, specialAssessments: 0, totalDue: 2531.00, totalPaid: 2720.33, currentDue: 0, lastPaymentAmount: 2720.33, lastPaymentDate: '2025-05-08', assessedValue: 115500 },
  { id: 'tyb-0023', parcelNumber: '01-122-01-102-004', taxYear: 2023, isDelinquent: false, baseTax: 2060.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 2060.00, totalPaid: 1826.16, currentDue: 233.84, lastPaymentAmount: 1826.16, lastPaymentDate: '2024-12-05', assessedValue: 110000 },
  { id: 'tyb-0024', parcelNumber: '01-122-01-102-004', taxYear: 2022, isDelinquent: false, baseTax: 1930.00, interest: 0, penalty: 0, otherCharges: 0, specialAssessments: 0, totalDue: 1930.00, totalPaid: 1930.00, currentDue: 0, lastPaymentAmount: 1930.00, lastPaymentDate: '2023-02-14', assessedValue: 104000 },
];
