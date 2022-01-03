import { MarketplacetHandler } from "./backend/marketplace";
const moment = require("moment");
import * as readline from "readline";

//let date = moment(moment(new Date())).format("DD-MMM-YYYY");
let newFetch: boolean = false;

console.log(`start`);
let marketplacetHandler = new MarketplacetHandler();
if (newFetch) {
  marketplacetHandler.fetchAll();
} else {
  marketplacetHandler.loadAll();
}
console.log(`end`);

/* let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Is this example useful? [y/n] ", (answer) => {
  console.log(`Invalid answer! ${answer.toLocaleLowerCase()}`);
  rl.close();
}); */

/**
 * options:
 *  fetch new Data - bool
 *  search for product | team
 *  name of product or team
 *
 * competition of team = competition of last 5 products
 *
 * competition of product
 *  loop through same productype[] -> array
 *
 *
 *
 */
