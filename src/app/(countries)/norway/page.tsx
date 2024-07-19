"use client";

import { useState, useMemo } from "react";
import { Input, Divider, Card } from "@nextui-org/react";
import { roundToDecimalPlace } from "@/utils";
import Calculator from "./Calculator";

const EstoniaTaxPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-2 p-4 md:p-24 md:max-w-[750px] md:mx-auto">
      <Calculator />
    </main>
  )
}

export default EstoniaTaxPage;