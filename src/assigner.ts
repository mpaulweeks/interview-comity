import { Facility } from "./facility";
import { AssignerSummary, LoanDto } from "./types";
import { sortArrayOfObjects } from "./util";


export class Assigner {
  private readonly sortedFacilities: Facility[];
  constructor(facilities: Facility[]) {
    this.sortedFacilities = sortArrayOfObjects(facilities, f => f.interestRate);
  }

  get summary(): AssignerSummary {
    const assignments = this.sortedFacilities.map(f => f.claims.map(c => ({
      loanId: c.loanId,
      facilityId: f.facilityId,
    }))).flat();
    const yields = this.sortedFacilities.map(f => ({
      facilityId: f.facilityId,
      expectedYield: Math.floor(f.totalYield),
    }));
    return { assignments, yields };
  }

  processLoan(loan: LoanDto): Facility | undefined {
    for (const facility of this.sortedFacilities) {
      if (facility.canApprove(loan)) {
        facility.claim(loan);
        return facility;
      }
    }
  }
}
