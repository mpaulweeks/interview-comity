import { Repository } from "./repo";
import { Store } from "./store";

console.log("Hello world");

// debugging
(async () => {
  const store = new Store('data/small');
  const repo = new Repository(store);
  await repo.loadBankData();
})();
