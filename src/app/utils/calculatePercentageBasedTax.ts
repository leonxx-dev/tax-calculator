export default function calculatePercentageBasedTax(income: number = 0, rate: number) {
  return income * rate / 100;
}