"use client";

/**
 * Tax exemption calculation taken from:
 * https://taxsummaries.pwc.com/norway/individual/taxes-on-personal-income
 * https://taxsummaries.pwc.com/norway/individual/other-taxes
 */

import { useState, useMemo } from "react"; 
import { Input, Divider, Card, Tabs, Tab, Select, SelectItem } from "@nextui-org/react";
import { roundToDecimalPlace, calculatePercentageBasedTax, sumAll } from "@/utils";
import constants from "./constants";
import { PeriodType, SalaryViewType } from "@/types";
import { calculateNationalIncomeTax } from "./functions";

const NorwayPersonalIncomeCard = () => {
  const [income, setIncome] = useState(0);
  const [period, setPeriod] = useState<PeriodType>("monthly");
  const [salaryView, setSalaryView] = useState<SalaryViewType>("employee");
  const [nationalInsuranceRate, setNationalInsuranceRate] = useState(0);

  const MUNICIPALITY_COUNTRY_TAX_RATE = constants.MUNICIPALITY_COUNTRY_TAX_RATE;
  const SOCIAL_SECURITY_CONTRIBUTION_RATE = constants.SOCIAL_SECURITY_CONTRIBUTION_RATE;
  const NATIONAL_INSURANCE_CONTRIBUTION_RATES = constants.NATIONAL_INSURANCE_CONTRIBUTION_RATES;
  const NATIONAL_INSURANCE_CONTRIBUTION_BONUS_RATE = constants.NATIONAL_INSURANCE_CONTRIBUTION_BONUS_RATE;
  const NATIONAL_INSURANCE_CONTRIBUTION_BONUS_LIMIT = constants.NATIONAL_INSURANCE_CONTRIBUTION_BONUS_LIMIT;

  const periods = [
    {
      key: "monthly",
      label: "Monthly"
    },
    {
      key: "annually",
      label: "Annually"
    },
  ];

  const salaryViews = [
    {
      key: "employee",
      label: "Employee"
    },
    {
      key: "employer",
      label: "Employer"
    },
  ]

  const isBonusTaxApplied = useMemo(() => {
    return income > NATIONAL_INSURANCE_CONTRIBUTION_BONUS_LIMIT;
  }, [income]);

  const totalNationalInsuranceRate = useMemo(() => {
    return isBonusTaxApplied ? nationalInsuranceRate + NATIONAL_INSURANCE_CONTRIBUTION_BONUS_RATE : nationalInsuranceRate
  }, [income, nationalInsuranceRate, isBonusTaxApplied]);

  const nationalInsurance = useMemo(() => {
   return calculatePercentageBasedTax(income, totalNationalInsuranceRate);
  }, [income, totalNationalInsuranceRate]);

  const totalTaxPaidByEmployer = useMemo(() => {
    return sumAll(nationalInsurance);
  }, [nationalInsurance]);

  const totalCostForEmployer = useMemo(() => {
    return salaryView === "employee" ? income + totalTaxPaidByEmployer : income;
  }, [income, salaryView, totalTaxPaidByEmployer]);

  const grossIncome = useMemo(() => {
    return salaryView === "employee" ? income : income - totalTaxPaidByEmployer;
  }, [income, totalTaxPaidByEmployer, salaryView]);

  const municipalityTax = useMemo(() => {
    return calculatePercentageBasedTax(grossIncome, MUNICIPALITY_COUNTRY_TAX_RATE);
  }, [grossIncome]);

  const nationalIncomeTax = useMemo(() => {
    return calculateNationalIncomeTax(income)
  }, [income]);

  const nationalIncomeTaxRate = useMemo(() => {
    // This is dynamic tax by brackets, so we need to calaculate percent from deduction.
    return (nationalIncomeTax / income * 100) || 0;
  }, [income, nationalIncomeTax]);

  const socialSecurityContribution = useMemo(() => {
    return calculatePercentageBasedTax(grossIncome, SOCIAL_SECURITY_CONTRIBUTION_RATE);
  }, [income]);

  const totalTaxPaidOnIncome = useMemo(() => {
    return sumAll(municipalityTax, nationalIncomeTax, socialSecurityContribution);
  },[municipalityTax, nationalIncomeTax, socialSecurityContribution]);

  const netIncome = useMemo(() => {
    return income - totalTaxPaidOnIncome;
  }, [income, totalTaxPaidOnIncome]);

  return (
    <Card className="w-full items-center gap-2 px-0 py-4 sm:p-4">
      <Tabs color="primary" aria-label="Salary view" radius="full" selectedKey={salaryView} onSelectionChange={(key) => setSalaryView(key as SalaryViewType)}>
        { salaryViews.map(({ key, label }) => <Tab key={key} title={label} />) }
      </Tabs>
      <Tabs color="primary" aria-label="Period" radius="full" selectedKey={period} onSelectionChange={(key) => setPeriod(key as PeriodType)}>
        { periods.map(({ key, label }) => <Tab key={key} title={label} />) }
      </Tabs>
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
      <Input
        className="px-4"
        size="lg"
        type="number"
        label={ salaryView === "employee" ? "Gross salary" : "Employee cost" }
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

      <div className="w-full flex flex-col">
        <div className="p-4">
          <h2 className="text-default-400">Employer Costs</h2>
          <div className="w-full flex justify-between text-default-600">
            <div>National Insurance <span className="italic text-danger">{ totalNationalInsuranceRate }%</span></div>
            <div>{ roundToDecimalPlace(nationalInsurance, 2) } NOK</div>
          </div>
          {isBonusTaxApplied && <div className="italic text-warning">Extra { NATIONAL_INSURANCE_CONTRIBUTION_BONUS_RATE }% applied on salaries 850k+</div>}
          <Divider className="my-2" />
          <div className="w-full flex justify-between items-center text-default-600">
            <div>Total</div>
            <div className="text-2xl">{ roundToDecimalPlace(totalCostForEmployer, 2) } NOK</div>
          </div>
        </div>

        <div  className="p-4">
          <h2 className="text-default-400">Employee Tax Breakdown</h2>
          <div className="w-full flex justify-between text-default-600">
            <div>Municipality Tax <span className="italic text-danger">{ MUNICIPALITY_COUNTRY_TAX_RATE }%</span></div>
            <div>{ roundToDecimalPlace(municipalityTax, 2) } NOK</div>
          </div>
          <div className="w-full flex justify-between text-default-600">
            <div>National Tax <span className="italic text-danger">{ roundToDecimalPlace(nationalIncomeTaxRate, 2) }%</span></div>
            <div>{ roundToDecimalPlace(nationalIncomeTax, 2) } NOK</div>
          </div>
          <div className="w-full flex justify-between text-default-600">
            <div>Social Security <span className="italic text-danger">{ SOCIAL_SECURITY_CONTRIBUTION_RATE }%</span></div>
            <div>{ roundToDecimalPlace(socialSecurityContribution, 2) } NOK</div>
          </div>
          <Divider className="my-2" />
          <div className="w-full flex justify-between items-center text-default-600">
            <div>Total</div>
            <div className="text-2xl">{ roundToDecimalPlace(totalTaxPaidOnIncome, 2) } NOK</div>
          </div>
        </div>
      </div>
      
      <h2 className="text-default-400">Net Income</h2>
      <div className="text-3xl">{ roundToDecimalPlace(netIncome, 2) } NOK</div>
    </Card>
  )
}

export default NorwayPersonalIncomeCard;
