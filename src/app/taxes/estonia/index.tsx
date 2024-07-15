"use client";

/**
 * Tax exemption calculation taklen from: https://www.sotsiaalkindlustusamet.ee/en/pension-and-benefits/pension-amount/benefits-and-pension-taxed-income-tax
 */

import { useState, useMemo } from "react"; 
import { Input, Divider, Card } from "@nextui-org/react";
import { roundToDecimalPlace } from "@/utils";

class EstoniaPersonalIncome {
  _incomeTaxPercent: number;
  _unemploymentInsurancePercent: number;
  _pensionPercent: number;
  _taxExemptionYearIncomeBottom: number;
  _taxExemptionYearIncomeTop: number;
  _taxExemptionYearMax: number;

  constructor() {
    this._incomeTaxPercent = 0.2; // 20% income tax
    this._unemploymentInsurancePercent = 0.016; // 1.6% unemployment insurance contribution
    this._pensionPercent = 0.02; // 2% pension contribution
    this._taxExemptionYearIncomeBottom = 14400; // Below this income is where maximum tax exemption is applied
    this._taxExemptionYearIncomeTop = 25200; // Income where regular incom tax is applied
    this._taxExemptionYearMax = 7848; // Maximum tax exeption amount
  }

  get incomeTaxPercent() {
    return this._incomeTaxPercent * 100;
  }

  get unemploymentInsurancePercent() {
    return this._unemploymentInsurancePercent * 100;
  }

  get pensionPercent() {
    return this._pensionPercent * 100;
  }

  getTaxExemption(income: number) {
    if (income <= this._taxExemptionYearIncomeBottom) {
      return this._taxExemptionYearMax;
    }

    if (income >= this._taxExemptionYearIncomeBottom && income < this._taxExemptionYearIncomeTop) {
      return 7848 - 7848 / 10800 * (income - 14400);
    }

    return 0;
  }

  getTaxableIncome(income: number) {
    const taxExemption = this.getTaxExemption(income);
    const taxableIncome = income - taxExemption;
    
    return taxableIncome > 0 ? taxableIncome : 0;
  }

  getIncomeTax(income: number) {
    const taxableIncome = this.getTaxableIncome(income);

    return taxableIncome * this._incomeTaxPercent;
  }

  getUnemploymentInsurance(income: number) {
    return income * this._unemploymentInsurancePercent;
  }

  getPension(income: number) {
    return income * this._pensionPercent;
  }

  getTotalDeducted(income: number) {
    const incomeTax = this.getIncomeTax(income);
    const unemploymentInsurance = this.getUnemploymentInsurance(income);
    const pension = this.getPension(income);

    return incomeTax + unemploymentInsurance + pension
  }

  getNetIncome(income: number) {
    const totalDeduction = this.getTotalDeducted(income)

    return income - totalDeduction
  }

  calculate(income: number) {
    return {
      incomeTax: roundToDecimalPlace(this.getIncomeTax(income) || 0, 2),
      unemploymentInsurance: roundToDecimalPlace(this.getUnemploymentInsurance(income) || 0, 2),
      pension: roundToDecimalPlace(this.getPension(income) || 0, 2),
      totalDeduction: roundToDecimalPlace(this.getTotalDeducted(income) || 0, 2),
      netIncome: roundToDecimalPlace(this.getNetIncome(income) || 0, 2)
    }
  }
}

const estoniaPersonalIncomeDeduction = new EstoniaPersonalIncome()

const EstoniaPersonalIncomeDeduction = () => {
  const [income, setIncome] = useState("0")

  const calculatedDeduction = useMemo(() => {
    return estoniaPersonalIncomeDeduction.calculate(parseInt(income))
  }, [income])

  return (
    <Card className="w-[500px] p-4">
      <h3 className="text-xl mb-4">Personal income breakdown</h3>
      <Input size="lg" type="number" label="Gross yearly income" min="0" defaultValue="0" value={income} onChange={({ target }) => setIncome(target.value)} />
      <div className="mt-4">
        
      </div>
      
      
      <h4 className="text-lg mb-2">Taxes and Social Security Contributions</h4>
      <div className="w-full flex justify-between">
        <div>Income tax <span>{estoniaPersonalIncomeDeduction.incomeTaxPercent}%</span></div>
        <div>- { calculatedDeduction.incomeTax }</div>
      </div>
      <div className="w-full flex justify-between">
        <div>Unemployment insurance <span>{estoniaPersonalIncomeDeduction.unemploymentInsurancePercent}%</span></div>
        <div>- { calculatedDeduction.unemploymentInsurance }</div>
      </div>
      <div className="w-full flex justify-between">
        <div>Pension <span>{estoniaPersonalIncomeDeduction.pensionPercent}%</span></div>
        <div>- { calculatedDeduction.pension }</div>
      </div>
      <div className="w-full flex justify-between text-xl my-2">
        <div>Total</div>
        <div>- { calculatedDeduction.totalDeduction }</div>
      </div>
      <Divider className="my-4" />
      <div className="w-full flex justify-between text-xl">
          <div>Net income</div>
          <div>{ calculatedDeduction.netIncome }</div>
        </div>
    </Card>
  )
}

export default EstoniaPersonalIncomeDeduction