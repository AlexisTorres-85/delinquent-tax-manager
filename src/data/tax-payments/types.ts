export type TaxYearBalance = {
  taxYear: number;
  isDelinquent: boolean;
  hasBalanceDue: boolean;
  paymentStatus: string;
  baseTax: number;
  interest: number;
  penalty: number;
  otherCharges: number;
  specialAssessments: number;
  totalDue: number;
  totalPaid: number;
  currentDue: number;
  lastPaymentAmount: number | null;
  lastPaymentDate: string | null; // ISO date e.g. '2025-03-15'
};

export type TaxPayment = {
  parcelNumber: string;
  taxYear: number;
  paymentType: string;            // code: "R"=Redemption, "T"=Tax, "L"=Lottery Credit
  paymentSource: string;          // code: "C"=County, "M"=Municipality
  paymentDate: string | null;     // ISO YYYY-MM-DD or null (invalid dates → null)
  receiptNumber: number;          // 0 = no receipt
  amount: number;
  generalPropertyTax: number;
  specialAssessment: number;
  specialCharge: number;
  delinquentUtilityCharge: number;
  interest: number;
  penalty: number;
  generalPropertyTaxInterest: number;
  specialTaxesInterest: number;
  generalPropertyTaxPenalty: number;
  specialTaxesPenalty: number;
  otherCharge: number;
  paymentTypeDescription: string; // "Redemption", "Tax", "Lottery Credit"
  paymentSourceDescription: string;
  totalTaxes: number;
  totalInterestAndPenalties: number;
};
