const maxTaxExemptionIncome = 1200; // Monthly gross income. Below this income is where maximum tax exemption is applied.
const zeroTaxExemptionIncome = 2100; // Monthly gross income. Income where regular income tax is applied.
const maxTaxExemption = 654; // Maximum tax exemption amount.

function calculateTaxExemption(income: number = 0, period: number) {
  if (income <= maxTaxExemptionIncome * period) {
    return maxTaxExemption * period;
  }

  if (income >= (maxTaxExemptionIncome * period) && income < (zeroTaxExemptionIncome * period)) {
    return (maxTaxExemption * period) - (maxTaxExemption * period) / (900 * period) * (income - (maxTaxExemptionIncome * period));
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
