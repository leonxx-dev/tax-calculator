"use client";

import { useState, useMemo } from "react";
import { Input, Divider, Tabs, Tab } from "@nextui-org/react";
import { PeriodType } from "@/types";
import {
  calculateTaxExemption,
  calculateTaxableIncome,
  calculateIncomeTax,
  calculateUnemploymentInsuranceContribution,
  calculatePensionContribution
} from "./functions";

const Calculator = () => {
  const [income, setIncome] = useState(0);
  const [period, setPeriod] = useState<PeriodType>("month");

  const periods = [
    {
      key: "month",
      label: "Monthly"
    },
    {
      key: "year",
      label: "Annually"
    }
  ];

  const periodRate = useMemo(() => {
    return period === 'month' ? 1 : 12;
  }, [period]);

  const incomeTax = useMemo(() => {
    const taxExemption = calculateTaxExemption(income, periodRate);
    const taxableIncome = calculateTaxableIncome(income, taxExemption);
    return calculateIncomeTax(taxableIncome);
  }, [income, periodRate]);

  const unemploymentInsuranceContribution = useMemo(() => {
    return calculateUnemploymentInsuranceContribution(income);
  }, [income]);

  const pensionContribution = useMemo(() => {
    return calculatePensionContribution(income);
  }, [income]);

  const totalTax = useMemo(() => {
    return incomeTax + unemploymentInsuranceContribution + pensionContribution;
  }, [incomeTax, unemploymentInsuranceContribution, pensionContribution]);

  const netIncome = useMemo(() => {
    return income - totalTax;
  }, [income, totalTax]);

  return (
    <>
      <Tabs color="primary" aria-label="Tabs colors" radius="full" selectedKey={period} onSelectionChange={(key) => setPeriod(key as PeriodType)}>
        { periods.map(({ key, label }) => <Tab key={key} title={label} />) }
      </Tabs>
      <Input
        size="lg"
        type="number"
        label="Income"
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

      <h2 className="text-default-500">Employer Costs</h2>
      <div className="w-full flex justify-between text-default-400">
        <div>Social Tax</div>
        <div>{ incomeTax }</div>
      </div>
      <div className="w-full flex justify-between text-default-400">
        <div>The Unemployment Insurance Premium</div>
        <div>{ unemploymentInsuranceContribution }</div>
      </div>
      <Divider />
      <div className="w-full flex justify-between text-default-400">
        <div>Total</div>
        <div>{ totalTax }</div>
      </div>

      <h2 className="text-default-500">Gross Income</h2>
      <div className="w-full flex justify-between text-default-400">
        <div>The Income Tax</div>
        <div>{ incomeTax }</div>
      </div>
      <div className="w-full flex justify-between text-default-400">
        <div>The Unemployment Insurance Premium</div>
        <div>{ unemploymentInsuranceContribution }</div>
      </div>
      <div className="w-full flex justify-between text-default-400">
        <div>The Funded Pension Contribution</div>
        <div>{ pensionContribution }</div>
      </div>
      <Divider />
      <div className="w-full flex justify-between text-default-400">
        <div>Total</div>
        <div>{ totalTax }</div>
      </div>

      <h2 className="text-default-500">Net Income</h2>
      <div className="text-5xl">€ { netIncome }</div>
    </>
  )
}

export default Calculator;