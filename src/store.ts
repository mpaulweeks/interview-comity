import { parse } from 'csv-parse';
import fs from 'fs';
import { BankDto, ConvenantDto, FacilityDto } from './types';

export interface FacilityRow {
  id: string;
  bank_id: string;
  interest_rate: string;
  amount: string;
}
export interface BankRow {
  id: string;
  name: string;
}
export interface ConvenantRow {
  bank_id: string;
  facility_id?: string;
  max_default_likelihood?: string;
  banned_state?: string;
}
export interface LoanRow {
  id: string;
  amount: string;
  interest_rate: string;
  default_likelihood: string;
  state: string;
}

export class Store {
  constructor(private readonly domainPath: string) { }

  private async loadFile<T>(filepath: string): Promise<T[]> {
    const input = (await fs.promises.readFile(filepath)).toString();
    return new Promise(resolve => {
      parse(input, {
        columns: true,
        delimiter: ',',
      }, (err, records) => {
        resolve(records);
      });
    });
  }
  async loadBanks(): Promise<BankDto[]> {
    const rows = await this.loadFile<BankRow>(`${this.domainPath}/banks.csv`);
    return rows.map(r => ({
      bankId: Number(r.id),
      name: r.name,
    }));
  }
  async loadFacilities(): Promise<FacilityDto[]> {
    const rows = await this.loadFile<FacilityRow>(`${this.domainPath}/facilities.csv`);
    return rows.map(r => ({
      facilityId: Number(r.id),
      bankId: Number(r.bank_id),
      interestRate: Number(r.interest_rate),
      amount: Number(r.amount),
    }));
  }
  async loadCovenants(): Promise<ConvenantDto[]> {
    const rows = await this.loadFile<ConvenantRow>(`${this.domainPath}/covenants.csv`);
    return rows.map(r => ({
      bankId: Number(r.bank_id),
      facilityId: r.facility_id.length > 0 ? Number(r.facility_id) : undefined,
      maxDefaultLikelihood: r.max_default_likelihood.length > 0 ? Number(r.max_default_likelihood) : undefined,
      bannedState: r.banned_state.length > 0 ? r.banned_state : undefined,
    }));
  }
}
