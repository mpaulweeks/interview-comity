import { Assigner } from "./assigner";
import { Repository } from "./repo";
import { Store } from "./store";

console.log("Hello world");

// debugging
(async () => {
  const store = new Store('data/small');
  const repo = new Repository(store);
  const facilities = await repo.loadBankData();
  const assigner = new Assigner(facilities);
  await store.streamLoans(loan => assigner.processLoan(loan));
  await repo.recordAssignments(assigner.summary);
})();
