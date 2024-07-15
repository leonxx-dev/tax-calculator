"use client";

/**
 * Tax exemption calculation taken from:
 * https://taxsummaries.pwc.com/norway/individual/taxes-on-personal-income
 * https://taxsummaries.pwc.com/norway/individual/other-taxes
 */

import { useState, useMemo } from "react"; 
import { Input, Divider, Card } from "@nextui-org/react";
import { roundToDecimalPlace } from "@/utils";

interface NationalIncomeTaxBracket {
  limit: number
  rate: number
}

const municipalCountyTaxRate = 22;
// Define the tax brackets and rates
const nationalIncomeTaxBrackets: NationalIncomeTaxBracket[] = [
  { limit: 208050, rate: 0 },
  { limit: 292850, rate: 1.7 },
  { limit: 670000, rate: 4.0 },
  { limit: 937900, rate: 13.6 },
  { limit: Infinity, rate: 16.6 }
];
const socialSecurityContributionRate = 7.8;

function calculateNationalIncomeTax(income: number, brackets: NationalIncomeTaxBracket[]) {
  let tax = 0;
  let prevLimit = 0;

  for (const bracket of brackets) {
    if (income > prevLimit) {
      const taxableIncome = Math.min(income, bracket.limit) - prevLimit;
      tax += taxableIncome * bracket.rate / 100;

      prevLimit = bracket.limit;
    } else {
      break;
    }
  }

  return tax;
}

function calculateMunicipalCountyTax(income: number, rate: number) {
  return income * rate / 100;
}

function calculateSocialSecurityContribution(income: number, rate: number) {
  return income * rate / 100;
}

function calculateTotalDeduction(income: number) {
  const nationalIncomeTax = calculateNationalIncomeTax(income, nationalIncomeTaxBrackets);
  const municipalCountyTax = calculateMunicipalCountyTax(income, municipalCountyTaxRate);
  const socialSecurityContribution = calculateSocialSecurityContribution(income, socialSecurityContributionRate);

  return nationalIncomeTax + municipalCountyTax + socialSecurityContribution;
}

function calculateNetIncome(income: number, totalDeduction: number) {
  return income - totalDeduction
}

function calculateTaxSummary(income: number) {
  return {
    nationalIncomeTax: calculateNationalIncomeTax(income, nationalIncomeTaxBrackets),
    municipalCountyTax: calculateMunicipalCountyTax(income, municipalCountyTaxRate),
    socialSecurityContribution: calculateSocialSecurityContribution(income, socialSecurityContributionRate),
    totalDeduction: roundToDecimalPlace(calculateTotalDeduction(income) || 0, 2),
    netIncome: roundToDecimalPlace(calculateNetIncome(income, calculateTotalDeduction(income)) || 0, 2)
  }
}

const NorwayPersonalIncomeCard = () => {
  const [income, setIncome] = useState("0")

  const taxSummary = useMemo(() => {
    return calculateTaxSummary(parseInt(income));
  }, [income])

  return (
    <Card className="w-[500px] p-4">
      <h3 className="text-xl mb-4">Personal income breakdown</h3>
      <Input size="lg" type="number" label="Gross yearly income" min="0" defaultValue="0" value={income} onChange={({ target }) => setIncome(target.value)} />
          
      <h4 className="text-lg my-4 text-xl">Taxes and Social Security Contributions</h4>

      <div className="w-full flex justify-between text-default-400">
        <div>National income tax</div>
        <div>- { taxSummary.nationalIncomeTax }</div>
      </div>
      <div className="w-full flex justify-between text-default-400">
        <div>Municipal and county tax</div>
        <div>- { taxSummary.municipalCountyTax }</div>
      </div>
      <div className="w-full flex justify-between text-default-400">
        <div>Social security contribution</div>
        <div>- { taxSummary.socialSecurityContribution }</div>
      </div>
      <div className="w-full flex justify-between">
        <div>Total</div>
        <div>- { taxSummary.totalDeduction }</div>
      </div>
      <Divider className="my-4" />
      <div className="w-full flex justify-between  text-lg">
          <div>Net income</div>
          <div>{ taxSummary.netIncome }</div>
        </div>
    </Card>
  )
}

export default NorwayPersonalIncomeCard;