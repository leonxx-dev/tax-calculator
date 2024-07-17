import { PeriodType } from "@/types";

function calculateTaxExemption(income: number = 0, period: PeriodType) {
  /**
   * All constants are monthly based.
   */
  const INCOME_TRESHOLD_1 = 1200 * period; // Monthly gross income. Below this income is where maximum tax exemption is applied.
  const INCOME_TRESHOLD_2 = 2100 * period; // Monthly gross income. Income where regular income tax is applied.
  const BASIC_EXEMPION_MAX = 654 * period; // Maximum tax exemption amount.
  const MAGIC_NUMBER = 900 * period; // This is something tha I don't know.
  
  if (income <= INCOME_TRESHOLD_1) {
    return BASIC_EXEMPION_MAX;
  }

  if (income > INCOME_TRESHOLD_1 && income <= INCOME_TRESHOLD_2) {
    return BASIC_EXEMPION_MAX - BASIC_EXEMPION_MAX / MAGIC_NUMBER * (income - INCOME_TRESHOLD_1);
  }

  return 0;
}

function calculatePercentageBasedTax(income: number = 0, rate: number) {
  return income * rate / 100;
}

function calculateTaxableIncome(income: number = 0, taxExemption: number) {
  const taxableIncome = income - taxExemption;
  return taxableIncome > 0 ? taxableIncome : 0;
}

function sumAll(...args: number[]) {
  return args.reduce((acc, val) => acc + val, 0);
}

export {
  calculatePercentageBasedTax,
  calculateTaxExemption,
  calculateTaxableIncome,
  sumAll,
}
