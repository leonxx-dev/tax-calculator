"use client";

/**
 * Tax exemption calculation taken from:
 * https://taxsummaries.pwc.com/norway/individual/taxes-on-personal-income
 * https://taxsummaries.pwc.com/norway/individual/other-taxes
 */

import { useState, useMemo } from "react"; 
import { Input, Divider, Card, Select, SelectItem, CardHeader } from "@nextui-org/react";
import { roundToDecimalPlace, calculatePercentageBasedTax, sumAll } from "@/utils";
import constants from "./constants";
import { calculateNationalIncomeTax } from "./functions";

const NorwayPersonalIncomeCard = () => {
  const [income, setIncome] = useState(0);
  const [nationalInsuranceRate, setNationalInsuranceRate] = useState(0);

  const MUNICIPALITY_COUNTRY_TAX_RATE = constants.MUNICIPALITY_COUNTRY_TAX_RATE;
  const SOCIAL_SECURITY_CONTRIBUTION_RATE = constants.SOCIAL_SECURITY_CONTRIBUTION_RATE;
  const NATIONAL_INSURANCE_CONTRIBUTION_RATES = constants.NATIONAL_INSURANCE_CONTRIBUTION_RATES;
  const NATIONAL_INSURANCE_CONTRIBUTION_BONUS_RATE = constants.NATIONAL_INSURANCE_CONTRIBUTION_BONUS_RATE;
  const NATIONAL_INSURANCE_CONTRIBUTION_BONUS_LIMIT = constants.NATIONAL_INSURANCE_CONTRIBUTION_BONUS_LIMIT;

  const isBonusTaxApplied = useMemo(() => {
    return income > NATIONAL_INSURANCE_CONTRIBUTION_BONUS_LIMIT;
  }, [income, NATIONAL_INSURANCE_CONTRIBUTION_BONUS_LIMIT]);

  const totalNationalInsuranceRate = useMemo(() => {
    return isBonusTaxApplied ? nationalInsuranceRate + NATIONAL_INSURANCE_CONTRIBUTION_BONUS_RATE : nationalInsuranceRate
  }, [nationalInsuranceRate, isBonusTaxApplied, NATIONAL_INSURANCE_CONTRIBUTION_BONUS_RATE]);

  const nationalInsurance = useMemo(() => {
   return calculatePercentageBasedTax(income, totalNationalInsuranceRate);
  }, [income, totalNationalInsuranceRate]);

  const totalTaxPaidByCompany = useMemo(() => {
    return sumAll(nationalInsurance);
  }, [nationalInsurance]);

  const totalCostForCompany = useMemo(() => {
    return income + totalTaxPaidByCompany;
  }, [income, totalTaxPaidByCompany]);

  const municipalityTax = useMemo(() => {
    return calculatePercentageBasedTax(income, MUNICIPALITY_COUNTRY_TAX_RATE);
  }, [income, MUNICIPALITY_COUNTRY_TAX_RATE]);

  const nationalIncomeTax = useMemo(() => {
    return calculateNationalIncomeTax(income)
  }, [income]);

  const nationalIncomeTaxRate = useMemo(() => {
    // This is dynamic tax by brackets, so we need to calaculate percent from deduction.
    return (nationalIncomeTax / income * 100) || 0;
  }, [income, nationalIncomeTax]);

  const socialSecurityContribution = useMemo(() => {
    return calculatePercentageBasedTax(income, SOCIAL_SECURITY_CONTRIBUTION_RATE);
  }, [income, SOCIAL_SECURITY_CONTRIBUTION_RATE]);

  const totalTaxPaidOnIncome = useMemo(() => {
    return sumAll(municipalityTax, nationalIncomeTax, socialSecurityContribution);
  },[municipalityTax, nationalIncomeTax, socialSecurityContribution]);

  const netIncome = useMemo(() => {
    return income - totalTaxPaidOnIncome;
  }, [income, totalTaxPaidOnIncome]);

  const totalPaidTax = useMemo(() => {
    return sumAll(totalTaxPaidByCompany, totalTaxPaidOnIncome);
  }, [totalTaxPaidByCompany, totalTaxPaidOnIncome]);

  const totalPaidTaxPercent = useMemo(() => {
    return ((totalPaidTax / totalCostForCompany) * 100) || 0;
  }, [totalPaidTax, totalCostForCompany]);

  return (
    <Card className="w-full gap-2 px-0 py-4 sm:p-4">
      <CardHeader className="px-4">
        <h1 className="text-2xl bg-clip-text text-transparent bg-gradient-to-r to-blue-500 from-red-500">Norwegian Tax Calculator</h1>
      </CardHeader>
      <Input
        className="px-4"
        size="lg"
        type="number"
        label="Gross salary"
        min="0"
        defaultValue="0"
        placeholder="0"
        labelPlacement="outside"
        value={income.toString()}
        onChange={({ target }) => setIncome(parseInt(target.value || "0"))}
        endContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-500">NOK</span>
          </div>
        }
      />
      <Select 
        label="National Insurance Rate"
        labelPlacement="outside"
        placeholder="0"
        className="px-4"
        size="lg"
        value={nationalInsuranceRate.toString()}
        onChange={({ target }) => setNationalInsuranceRate(parseFloat(target.value || "0"))}
        endContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-500">%</span>
          </div>
        }
      >
        {NATIONAL_INSURANCE_CONTRIBUTION_RATES.map((rate) => (
          <SelectItem key={rate} textValue={rate.toString()}>
            {rate}
          </SelectItem>
        ))}
      </Select>
      <div className="w-full flex justify-around py-2">
        <div className="justify-items-center">
          <div className="text-default-400">Person gets</div>
          <div className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">{ roundToDecimalPlace(netIncome, 0) }</div>
        </div>

        <div className="justify-items-center">
          <div className="text-default-400">Company spend</div>
          <div className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">{ roundToDecimalPlace(totalCostForCompany, 0) }</div>
        </div>
      </div>
      <div className="w-full flex flex-col px-4">
        <div className="p-1">
          <h2 className="text-default-700 text-2xl">Tax Breakdown</h2>
        </div>
        <div className="p-1">
          <h2 className="text-default-400">Company pay</h2>
          <div className="w-full flex justify-between text-default-600">
            <div>National Insurance <span className="italic text-danger">{ totalNationalInsuranceRate }%</span></div>
            <div>{ roundToDecimalPlace(nationalInsurance, 0) }</div>
          </div>
          {isBonusTaxApplied && <div className="italic text-warning">Extra { NATIONAL_INSURANCE_CONTRIBUTION_BONUS_RATE }% applied on salaries 850k+</div>}
          <Divider className="my-1" />
        </div>

        <div  className="p-1">
          <h2 className="text-default-400">Person pay</h2>
          <div className="w-full flex justify-between text-default-600">
            <div>Municipality Tax <span className="italic text-danger">{ MUNICIPALITY_COUNTRY_TAX_RATE }%</span></div>
            <div>{ roundToDecimalPlace(municipalityTax, 0) }</div>
          </div>
          <div className="w-full flex justify-between text-default-600">
            <div>National Tax <span className="italic text-danger">{ roundToDecimalPlace(nationalIncomeTaxRate, 2) }%</span></div>
            <div>{ roundToDecimalPlace(nationalIncomeTax, 0) }</div>
          </div>
          <div className="w-full flex justify-between text-default-600">
            <div>Social Security <span className="italic text-danger">{ SOCIAL_SECURITY_CONTRIBUTION_RATE }%</span></div>
            <div>{ roundToDecimalPlace(socialSecurityContribution, 0) }</div>
          </div>
          <Divider className="my-2" />
          <div className="p-1">
            <h2 className="text-default-400">Government get</h2>
            <div className="w-full flex justify-between text-default-600">
              <div>Tax Summary <span className="italic text-danger">{ roundToDecimalPlace(totalPaidTaxPercent, 2) }%</span></div>
              <div>{ roundToDecimalPlace(totalPaidTax, 0) }</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default NorwayPersonalIncomeCard;
