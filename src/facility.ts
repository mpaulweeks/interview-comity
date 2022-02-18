import { LoanDto } from "./types";
import { sum } from "./util";

export class Facility {
  readonly facilityId: number;
  readonly bankId: number;
  readonly interestRate: number;
  readonly startingAmount: number;
  private claims: LoanDto[] = [];
  readonly covenants: {
    readonly maxDefaults: number[],
    readonly bannedStates: string[],
  };

  constructor(args: {
    // use named args so you can tell numbers apart more easily
    readonly bankId: number;
    readonly interestRate: number;
    readonly amount: number;
    readonly covenants: {
      readonly maxDefaults: number[],
      readonly bannedStates: string[],
    }
  }) {
    this.bankId = args.bankId;
    this.interestRate = args.interestRate;
    this.startingAmount = args.amount;
    this.covenants = args.covenants;
  }

  get amount() {
    return this.startingAmount - sum(this.claims.map(loan => loan.amount));
  }

  predictYield(loan: LoanDto) {
    return (
      (1 - loan.defaultLikelihood) *
      loan.interestRate *
      loan.amount -
      loan.defaultLikelihood * loan.amount -
      this.interestRate * loan.amount
    );
  }
}
