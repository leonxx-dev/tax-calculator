import EstoniaPersonalIncomeDeduction from "./taxes/estonia";
import NorwayPersonalIncomeCard from "./taxes/norway";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-2 p-24">
        <EstoniaPersonalIncomeDeduction />
        <NorwayPersonalIncomeCard />
      </main>
    </>
  );
}

// Income tax: 100,000 \times 0.20 = $20,000.
// Unemployment insurance: 100,000 \times 0.016 = $1,600.
// Pension: 100,000 \times 0.02 = $2,000.
// Total: 20,000 + 1,600 + 2,000 = $23,600.
