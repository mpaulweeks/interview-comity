import { Assigner } from "./assigner";
import { Repository } from "./repo";
import { Store } from "./store";

(async () => {
  const path = process.argv[2] ?? 'data/small';
  console.log(`Using the csv files in ${path}`);
  const store = new Store(path);
  const repo = new Repository(store);
  const facilities = await repo.loadBankData();
  const assigner = new Assigner(facilities);
  await store.streamLoans(loan => assigner.processLoan(loan));
  await repo.recordAssignments(assigner.getSummary());
})();
