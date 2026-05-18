import { EXPENSES_DUMMY_DATA } from '../data/expenses-dummy-data';
import type { Expense } from '../types';
import { fakeDelay } from '@/lib/api';

export const expensesService = {
  async getByParcelNumber(parcelNumber: string): Promise<Expense[]> {
    await fakeDelay();
    const entry = EXPENSES_DUMMY_DATA.find((p) => p.parcelNumber === parcelNumber);
    return entry?.expenses ?? [];
  },
};
