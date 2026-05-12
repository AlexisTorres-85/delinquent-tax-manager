export type ExpenseDepartment =
  | 'Treasurer'
  | 'Legal'
  | 'Finance'
  | 'Assessment'
  | 'Compliance'
  | 'Environmental'
  | 'Enforcement';

export type ExpenseType =
  | 'Legal Fee'
  | 'Filing Fee'
  | 'Inspection Fee'
  | 'Publication Fee'
  | 'Mailing Cost'
  | 'Appraisal Fee'
  | 'Title Search'
  | 'Court Cost'
  | 'Demolition'
  | 'Environmental Remediation'
  | 'Administrative Fee';

export type Expense = {
  id: string;
  parcelNumber: string;
  createdDate: string; // MM/DD/YYYY
  department: ExpenseDepartment;
  type: ExpenseType;
  invoiceNumber: string;
  invoiceDate: string; // MM/DD/YYYY
  invoiceAmount: number;
};

export type ExpenseRecord = {
  parcelNumber: string;
  expenses: Expense[];
};
