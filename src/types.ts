export interface FacilityDto {
  facilityId: number;
  bankId: number;
  interestRate: number;
  amount: number;
}
export interface BankDto {
  bankId: number;
  name: string;
}
export interface ConvenantDto {
  bankId: number;
  facilityId?: number;
  maxDefaultLikelihood?: number;
  bannedState?: string;
}
export interface LoanDto {
  loanId: number;
  amount: number;
  interestRate: number;
  defaultLikelihood: number;
  state: string;
}

export interface AssignmentDto {
  loanId: number;
  facilityId: number;
}
export interface YieldDto {
  facilityId: number;
  expectedYield: number;
}
export interface AssignerSummary {
  assignments: AssignmentDto[];
  yields: YieldDto[];
}
