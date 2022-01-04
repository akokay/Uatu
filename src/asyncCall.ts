import { MarketplacetHandler } from "./backend/marketplace";
const moment = require("moment");
import * as readline from "readline";

export async function Startup(): Promise<void> {
  let newFetch: boolean = false;
  console.log(`startup`);
  let marketplacetHandler = new MarketplacetHandler();
  if (newFetch) {
    await marketplacetHandler.fetchAll();
  } else {
    await marketplacetHandler.loadAll();
  }
  console.log(`search for competition`);

  let rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question("search ", (answer) => {
    // TODO: Log the answer in a database
    console.log(`result ${answer}`);

    rl.close();
  });
}
