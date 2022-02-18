import { CovenantSummary } from "./convenant";
import { LoanDto } from "./types";
import { sum } from "./util";

export class Facility {
  readonly facilityId: number;
  readonly bankId: number;
  readonly bankName: string;
  private readonly interestRate: number;
  private readonly startingAmount: number;
  private readonly covenants: CovenantSummary;
  private claims: LoanDto[] = [];

  constructor(args: {
    // use named args so you can tell numbers apart more easily
    readonly facilityId: number;
    readonly bankId: number;
    readonly bankName: string;
    readonly interestRate: number;
    readonly amount: number;
    readonly covenants: CovenantSummary;
  }) {
    this.facilityId = args.facilityId;
    this.bankId = args.bankId;
    this.bankName = args.bankName;
    this.interestRate = args.interestRate;
    this.startingAmount = args.amount;
    this.covenants = args.covenants;
  }

  get amount() {
    return this.startingAmount - sum(this.claims.map(loan => loan.amount));
  }

  canApprove(loan: LoanDto) {
    return loan.amount <= this.amount && this.covenants.canApprove(loan);
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
