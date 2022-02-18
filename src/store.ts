import { parse } from 'csv-parse';
import fs from 'fs';
import { BankDto, ConvenantDto, FacilityDto, LoanDto } from './types';

interface FacilityRow {
  id: string;
  bank_id: string;
  interest_rate: string;
  amount: string;
}
interface BankRow {
  id: string;
  name: string;
}
interface ConvenantRow {
  bank_id: string;
  facility_id?: string;
  max_default_likelihood?: string;
  banned_state?: string;
}
interface LoanRow {
  id: string;
  amount: string;
  interest_rate: string;
  default_likelihood: string;
  state: string;
}

export interface AssignmentRow {
  loan_id: number;
  facility_id: number;
}

export interface YieldRow {
  facility_id: number;
  expected_yield: number;
}

export interface StreamCallback {
  (loan: LoanDto): void;
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

  streamLoans(cb: StreamCallback) {
    const parser = parse({
      columns: true,
      delimiter: ','
    });
    const stream = fs.createReadStream(`${this.domainPath}/loans.csv`);
    const promise = new Promise<void>((resolve, reject) => {
      parser.on('error', (err) => {
        console.error(err.message);
        reject(err);
      });
      parser.on('end', () => {
        resolve();
      });
      stream.on('error', (err) => {
        console.error(err.message);
        reject(err);
      });
      stream.on('end', () => {
        resolve();
      });
    });
    parser.on('readable', () => {
      let row: LoanRow;
      while ((row = parser.read()) !== null) {
        const dto: LoanDto = {
          loanId: Number(row.id),
          amount: Number(row.amount),
          interestRate: Number(row.interest_rate),
          defaultLikelihood: Number(row.default_likelihood),
          state: row.state,
        };
        cb(dto);
      }
    });
    stream.on('data', chunk => {
      parser.write(chunk);
    });
    return promise;
  }
}
