export default function sumAll(...args: number[]) {
  return args.reduce((acc, val) => acc + val, 0);
}