import EstoniaPersonalIncomeDeduction from "./taxes/estonia"

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <EstoniaPersonalIncomeDeduction />
      </main>
    </>
  );
}

// Income tax: 100,000 \times 0.20 = $20,000.
// Unemployment insurance: 100,000 \times 0.016 = $1,600.
// Pension: 100,000 \times 0.02 = $2,000.
// Total: 20,000 + 1,600 + 2,000 = $23,600.
