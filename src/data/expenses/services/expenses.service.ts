import { EXPENSES_DUMMY_DATA } from '../data/expenses-dummy-data';
import type { Expense } from '../types';
import { FAKE_API_DELAY_MS } from '@/config/general.config';

export const expensesService = {
  async getByParcelNumber(parcelNumber: string): Promise<Expense[]> {
    await new Promise<void>((resolve) => setTimeout(resolve, FAKE_API_DELAY_MS));
    const entry = EXPENSES_DUMMY_DATA.find((p) => p.parcelNumber === parcelNumber);
    return entry?.expenses ?? [];
  },
};
