import constants from "./constants";

function calculateNationalIncomeTax(income: number) {
  let tax = 0;

    for (const bracket of constants.NATIONAL_INCOME_TAX_BRACKETS) {
        if (income > bracket.limit) {
            tax += (income - bracket.limit) * bracket.rate;
            income = bracket.limit;
        }
    }

    return tax;
}

export {
  calculateNationalIncomeTax,
}