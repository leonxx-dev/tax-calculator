const incomeTaxRate = 20; // 20% income tax
const unemploymentInsuranceContributionRate = 1.6; // 1.6% unemployment insurance contribution
const pensionContributionRate = 2; // 2% pension contribution
const maxTaxExemptionIncome = 1200; // Below this income is where maximum tax exemption is applied
const zeroTaxExemptionIncome = 2100; // Income where regular income tax is applied
const maxTaxExemption = 654; // Maximum tax exemption amount

function calculateTaxExemption(income: number = 0, period: number) {
  if (income <= maxTaxExemptionIncome * period) {
    return maxTaxExemption * period;
  }

  if (income >= (maxTaxExemptionIncome * period) && income < (zeroTaxExemptionIncome * period)) {
    return (maxTaxExemption * period) - (maxTaxExemption * period) / (900 * period) * (income - (maxTaxExemptionIncome * period));
  }

  return 0;
}

function calculateTaxableIncome(income: number = 0, taxExemption: number) {
  const taxableIncome = income - taxExemption;
  return taxableIncome > 0 ? taxableIncome : 0;
}

function calculateIncomeTax(taxableIncome: number = 0) {
  return taxableIncome * incomeTaxRate / 100;
}

function calculateUnemploymentInsuranceContribution(income: number = 0) {
  return income * unemploymentInsuranceContributionRate / 100;
}

function calculatePensionContribution(income: number = 0) {
  return income * pensionContributionRate / 100;
}

export {
  calculateIncomeTax,
  calculatePensionContribution,
  calculateTaxExemption,
  calculateTaxableIncome,
  calculateUnemploymentInsuranceContribution
}
