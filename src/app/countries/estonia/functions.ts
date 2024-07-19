import constants from "./constants";
import { PeriodType } from "@/types";

function calculateTaxExemption(income: number = 0, period: PeriodType = "monthly") {
  /**
   * All constants are monthly based.
   * Period can be 1 for monthly income and 12 for annual.
   */
  const PERIOD_COEFFICIENT = period === "monthly" ? 1 : 12;
  const INCOME_TRESHOLD_1 = constants.INCOME_TRESHOLD_1 * PERIOD_COEFFICIENT;
  const INCOME_TRESHOLD_2 = constants.INCOME_TRESHOLD_2 * PERIOD_COEFFICIENT;
  const BASIC_EXEMPION_MAX = constants.BASIC_EXEMPION_MAX * PERIOD_COEFFICIENT;
  const MAGIC_NUMBER = constants.MAGIC_NUMBER * PERIOD_COEFFICIENT;
  
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
