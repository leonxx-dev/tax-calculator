"use client";

import { useState, useMemo } from "react";
import { Input, Divider, Tabs, Tab, Card } from "@nextui-org/react";
import { PeriodType } from "@/types";
import {
  calculatePercentageBasedTax,
  calculateTaxExemption,
  calculateTaxableIncome,
  sumAll
} from "./functions";
import { roundToDecimalPlace } from "@/utils";
import constants from "./constants";

const Calculator = () => {
  const [income, setIncome] = useState(0);
  const [period, setPeriod] = useState<PeriodType>(1);

  const SOCIAL_TAX_RATE = constants.SOCIAL_TAX_RATE;
  const EMPLOYER_UNEMPLOYMENT_INSURANCE_PREMIUM_RATE = constants.EMPLOYER_UNEMPLOYMENT_INSURANCE_PREMIUM_RATE;
  const INCOME_TAX_RATE = constants.INCOME_TAX_RATE;
  const UNEMPLOYMENT_INSURANCE_PREMIUM_RATE = constants.UNEMPLOYMENT_INSURANCE_PREMIUM_RATE;
  const PENSION_CONTRIBUTION_RATE = constants.PENSION_CONTRIBUTION_RATE;

  const periods = [
    {
      key: 1,
      label: "Monthly"
    },
    {
      key: 12,
      label: "Annually"
    },
  ];

  const socialTax = useMemo(() => {
    return calculatePercentageBasedTax(income, SOCIAL_TAX_RATE);
  }, [income]);

  const employerUnemploymentInsurancePremium = useMemo(() => {
    return calculatePercentageBasedTax(income, EMPLOYER_UNEMPLOYMENT_INSURANCE_PREMIUM_RATE);
  }, [income]);

  const tatalPaidByEmployer = useMemo(() => {
    return sumAll(income, socialTax, employerUnemploymentInsurancePremium);
  }, [income, socialTax, employerUnemploymentInsurancePremium]);

  const incomeTax = useMemo(() => {
    const taxExemption = calculateTaxExemption(income, period);
    const taxableIncome = calculateTaxableIncome(income, taxExemption);
    return calculatePercentageBasedTax(taxableIncome, INCOME_TAX_RATE);
  }, [income, period]);

  const employeeUnemploymentInsurancePremium = useMemo(() => {
    return calculatePercentageBasedTax(income, UNEMPLOYMENT_INSURANCE_PREMIUM_RATE);
  }, [income]);

  const pensionContribution = useMemo(() => {
    return calculatePercentageBasedTax(income, PENSION_CONTRIBUTION_RATE);
  }, [income]);

  const totalTaxPaidOnIncome = useMemo(() => {
    return sumAll(incomeTax, employeeUnemploymentInsurancePremium, pensionContribution);
  }, [incomeTax, employeeUnemploymentInsurancePremium, pensionContribution]);

  const netIncome = useMemo(() => {
    return income - totalTaxPaidOnIncome;
  }, [income, totalTaxPaidOnIncome]);

  return (
    <Card className="w-full items-center gap-2 px-0 py-4 sm:p-4">
      <Tabs color="primary" aria-label="Tabs colors" radius="full" selectedKey={period} onSelectionChange={(key) => setPeriod(key as PeriodType)}>
        { periods.map(({ key, label }) => <Tab key={key} title={label} />) }
      </Tabs>
      <Input
        className="px-4"
        size="lg"
        type="number"
        label="Gross Income"
        min="0"
        defaultValue="0"
        placeholder="0"
        labelPlacement="outside"
        value={income.toString()}
        onChange={({ target }) => setIncome(parseInt(target.value || "0"))}
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-500">€</span>
          </div>
        }
      />

      <div className="w-full flex flex-col">
        <div className="p-4">
          <h2 className="text-default-400">Employer Costs</h2>
          <div className="w-full flex justify-between text-default-600">
            <div>Salary</div>
            <div>{ income } €</div>
          </div>
          <div className="w-full flex justify-between text-default-600">
            <div>Social Tax <span className="italic text-danger">{ SOCIAL_TAX_RATE }%</span></div>
            <div>{ roundToDecimalPlace(socialTax, 2) } €</div>
          </div>
          <div className="w-full flex justify-between text-default-600">
            <div>Unemployment Insurance <span className="italic text-danger">{ EMPLOYER_UNEMPLOYMENT_INSURANCE_PREMIUM_RATE }%</span></div>
            <div>{ roundToDecimalPlace(employerUnemploymentInsurancePremium, 2) } €</div>
          </div>
          <Divider className="my-2" />
          <div className="w-full flex justify-between items-center text-default-600">
            <div>Total</div>
            <div className="text-2xl">{ roundToDecimalPlace(tatalPaidByEmployer, 2) } €</div>
          </div>
        </div>

        <div  className="p-4">
          <h2 className="text-default-400">Gross Income</h2>
          <div className="w-full flex justify-between text-default-600">
            <div>Income Tax <span className="italic text-danger">{ INCOME_TAX_RATE }%</span></div>
            <div>{ roundToDecimalPlace(incomeTax, 2) } €</div>
          </div>
          <div className="w-full flex justify-between text-default-600">
            <div>Unemployment Insurance <span className="italic text-danger">{ UNEMPLOYMENT_INSURANCE_PREMIUM_RATE }%</span></div>
            <div>{ roundToDecimalPlace(employeeUnemploymentInsurancePremium, 2) } €</div>
          </div>
          <div className="w-full flex justify-between text-default-600">
            <div>Pension Contribution <span className="italic text-danger">{ PENSION_CONTRIBUTION_RATE }%</span></div>
            <div>{ roundToDecimalPlace(pensionContribution, 2) } €</div>
          </div>
          <Divider className="my-2" />
          <div className="w-full flex justify-between items-center text-default-600">
            <div>Total</div>
            <div className="text-2xl">{ roundToDecimalPlace(totalTaxPaidOnIncome, 2) } €</div>
          </div>
        </div>
      </div>
      

      <h2 className="text-default-400">Net Income</h2>
      <div className="text-5xl">{ roundToDecimalPlace(netIncome, 2) } €</div>
    </Card>
  )
}

export default Calculator;
