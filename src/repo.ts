import { Store } from "./store";

export class Repository {
  constructor(private readonly store: Store) { }

  async loadBankData() {
    const banks = await this.store.loadBanks();
    const facilities = await this.store.loadFacilities();
    const covenants = await this.store.loadCovenants();
    console.log(banks, facilities, covenants);
  }
}
