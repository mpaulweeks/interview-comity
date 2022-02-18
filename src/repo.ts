import { CovenantSummary } from "./convenant";
import { Facility } from "./facility";
import { Store } from "./store";
import { AssignerSummary } from "./types";
import { mapReduce } from "./util";

type CovenantLookup = Map<number, CovenantSummary>;

export class Repository {
  constructor(private readonly store: Store) { }

  async loadBankData() {
    const bankDtos = await this.store.loadBanks();
    const facilitiyDtos = await this.store.loadFacilities();
    const covenantDtos = await this.store.loadCovenants();

    const bankNameById = mapReduce(bankDtos, b => b.bankId);
    const bankCovenants: CovenantLookup = new Map();
    const facilityCovenants: CovenantLookup = new Map();
    covenantDtos.forEach(cov => {
      const id = cov.facilityId !== undefined ? cov.facilityId : cov.bankId;
      const lookup = cov.facilityId !== undefined ? facilityCovenants : bankCovenants;
      const summary = lookup.get(id) ?? new CovenantSummary();

      if (cov.bannedState !== undefined) {
        summary.addBannedState(cov.bannedState);
      }
      if (cov.maxDefaultLikelihood !== undefined) {
        summary.addMaxDefault(cov.maxDefaultLikelihood);
      }

      lookup.set(id, summary);
    });

    const facilities = facilitiyDtos.map(f => new Facility({
      facilityId: f.facilityId,
      bankId: f.bankId,
      bankName: bankNameById.get(f.bankId)?.name ?? 'Unknown', // if bank is missing, should we error?
      interestRate: f.interestRate,
      amount: f.amount,
      covenants: new CovenantSummary()
        .concat(facilityCovenants.get(f.facilityId))
        .concat(bankCovenants.get(f.bankId)),
    }));

    return facilities;
  }

  async recordAssignments(summary: AssignerSummary): Promise<void> {
    await this.store.writeAssignments(summary.assignments);
    await this.store.writeYields(summary.yields);
  }
}
