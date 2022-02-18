import { LoanDto } from "./types";

export class CovenantSummary {
  private bannedStates = new Set<string>();
  private maxDefault: number | undefined;

  addBannedState(state: string) {
    this.bannedStates.add(state);
  }
  addMaxDefault(newMaxDefault: number) {
    if (this.maxDefault === undefined || this.maxDefault > newMaxDefault) {
      this.maxDefault = newMaxDefault;
    }
  }

  canApprove(loan: LoanDto) {
    if (this.bannedStates.has(loan.state)) {
      return false;
    }
    if (this.maxDefault !== undefined && this.maxDefault < loan.defaultLikelihood) {
      return false;
    }
    return true;
  }

  concat(other?: CovenantSummary) {
    if (!other) { return this; }
    const merged = new CovenantSummary();
    [this, other].forEach(summary => {
      Array.from(summary.bannedStates).forEach(state => merged.addBannedState(state));
      if (summary.maxDefault !== undefined) {
        merged.addMaxDefault(summary.maxDefault);
      }
    });
    return merged;
  }
}
