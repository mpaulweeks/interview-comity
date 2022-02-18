import { Facility } from "./facility";
import { AssignerSummary, AssignmentDto, LoanDto } from "./types";
import { mapReduce, sortArrayOfObjects } from "./util";


export class Assigner {
  private readonly sortedFacilities: Facility[];
  private processedLoanIds: number[] = [];
  constructor(facilities: Facility[]) {
    this.sortedFacilities = sortArrayOfObjects(facilities, [
      f => f.interestRate,
      f => f.facilityId, // tie breaker for consistent sorting
    ]);
  }

  processLoan(loan: LoanDto): Facility | undefined {
    this.processedLoanIds.push(loan.loanId);
    for (const facility of this.sortedFacilities) {
      if (facility.canApprove(loan)) {
        facility.claim(loan);
        return facility;
      }
    }
  }

  getSummary(): AssignerSummary {
    const successfulAssignments = this.sortedFacilities.map(f => f.claims.map(c => ({
      loanId: c.loanId,
      facilityId: f.facilityId,
    }))).flat();
    const assignmentByLoanId = mapReduce(successfulAssignments, a => a.loanId);
    const assignments: AssignmentDto[] = this.processedLoanIds.map(loanId => ({
      loanId,
      facilityId: assignmentByLoanId.get(loanId)?.facilityId,
    }));
    const yields = this.sortedFacilities.map(f => ({
      facilityId: f.facilityId,
      expectedYield: Math.floor(f.totalYield),
    }));
    return { assignments, yields };
  }
}
