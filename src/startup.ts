import { MarketplacetHandler } from "./backend/marketplace";
const moment = require("moment");

let worldtemplate = "worldtemplate";

export async function Startup(): Promise<void> {
  let newFetch: boolean = false;
  console.log(`[FETCH] Catalog`);
  let marketplacetHandler = new MarketplacetHandler();
  if (newFetch) {
    await marketplacetHandler.fetchAll();
  } else {
    await marketplacetHandler.loadAll();
  }
  console.log(`[UATU] Begin search for Competition`);
  let teamname = "Panascais";
  let productname = "Trained Pets";
  Testcases(marketplacetHandler);

  process.exit();
}

function Testcases(marketplacetHandler: MarketplacetHandler) {
  console.log(`[UATU] execute Testcases\n\n`);

  let teamname = "Panascais";
  let productname = "Trained Pets";
  let team = marketplacetHandler.getTeam(teamname, worldtemplate);
  marketplacetHandler.getTeamCompetition(team, worldtemplate);
  //marketplacetHandler.getProductCompetition(team[0], worldtemplate);
}
