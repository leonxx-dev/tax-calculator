"use client";

/**
 * Tax exemption calculation taklen from:
 * https://www.sotsiaalkindlustusamet.ee/en/pension-and-benefits/pension-amount/benefits-and-pension-taxed-income-tax
 */

import { useState, useMemo } from "react";
import { Input, Divider, Card } from "@nextui-org/react";
import { roundToDecimalPlace } from "@/utils";
import Calculator from "./calculator";

const EstoniaTaxPage = () => {
  return (
    <>
      <h1>Estonia Personal Income Tax Calculator</h1>
      <Calculator />
    </>
  )
}

export default EstoniaTaxPage