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

// export interface AssignmentDto {
//   loan_id: number;
//   facility_id: number;
// }

// export interface YieldDto {
//   facility_id: number;
//   expected_yield: number;
// }
