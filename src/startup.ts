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

  let validProduct = false;
  let validTeam = false;
  let productType = "worldtemplate";
  let teamname = "Panascais";
  let productname = "Trained Pets";
  let team = marketplacetHandler.getTeam(teamname, productType);
  //marketplacetHandler.getProduct(productname, productType);
  //console.log(team[0]);
  //TODO chek if product or Team is valid

  /**
   * loop through all products
   *
   *  remove all product
   *    team is the same
   *    if no tag is in common
   *
   */
  //marketplacetHandler.getProductCompetition(team[0], productType);
  marketplacetHandler.getTeamCompetition(team,productType);
  process.exit();
}
