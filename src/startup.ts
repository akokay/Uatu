import { MarketplacetHandler } from "./backend/marketplace";
const moment = require("moment");

let worldtemplate = "worldtemplate";
let newFetch: boolean = false;

export async function Startup(): Promise<void> {
  console.log(`[FETCH] Catalog`);
  const start = new Date().getTime();
  let marketplacetHandler = new MarketplacetHandler();
  if (newFetch) {
    await marketplacetHandler.fetchAll();
  } else {
    await marketplacetHandler.loadAll();
  }
  console.log(`[UATU] Begin search for Competition`);
  Testcases(marketplacetHandler);

  console.log(`[UATU] Uatu terminated in ${new Date().getTime() - start}ms`);
  process.exit();
}

function Testcases(marketplacetHandler: MarketplacetHandler) {
  console.log(`[UATU] execute Testcases\n\n`);
  //#1
  let pos = -1;
  let teamname = "Panascais";
  console.log(`[Testcase#1] ${teamname}\n`);
  let team = marketplacetHandler.getTeam(teamname, worldtemplate);
  for (let i = 0; i < team.length; i++) {
    if (team[i].Title.neutral == "Trained Pets") {
      pos = i;
      break;
    }
  }
  if (pos == -1) {
    console.log(`[ERROR] Testcase not found`);
    process.exit(-1);
  }
  marketplacetHandler.getTeamCompetition(team, worldtemplate);
  marketplacetHandler.getProductCompetition(team[pos], worldtemplate);

  //#2
  pos = -1;
  teamname = "Spark Universe";
  console.log(`\n\n[Testcase#2] ${teamname}\n`);
  team = marketplacetHandler.getTeam(teamname, worldtemplate);
  for (let i = 0; i < team.length; i++) {
    if (team[i].Title.neutral == "Furniture") {
      pos = i;
      break;
    }
  }
  if (pos == -1) {
    console.log(`[ERROR] Testcase not found`);
    process.exit(-1);
  }
  marketplacetHandler.getTeamCompetition(team, worldtemplate);
  marketplacetHandler.getProductCompetition(team[pos], worldtemplate);

  //#3
  pos = -1;
  teamname = "Pathway Studios";
  console.log(`\n\n[Testcase#3] ${teamname}\n`);
  team = marketplacetHandler.getTeam(teamname, worldtemplate);
  for (let i = 0; i < team.length; i++) {
    if (team[i].Title.neutral == "Tiki Paradise") {
      pos = i;
      break;
    }
  }
  if (pos == -1) {
    console.log(`[ERROR] Testcase not found`);
    process.exit(-1);
  }
  marketplacetHandler.getTeamCompetition(team, worldtemplate);
  marketplacetHandler.getProductCompetition(team[pos], worldtemplate);

  //#4
  pos = -1;
  teamname = "Pixelbiester";
  console.log(`\n\n[Testcase#4] ${teamname}\n`);
  team = marketplacetHandler.getTeam(teamname, worldtemplate);
  for (let i = 0; i < team.length; i++) {
    if (team[i].Title.neutral == "Wizard World") {
      pos = i;
      break;
    }
  }
  if (pos == -1) {
    console.log(`[ERROR] Testcase not found`);
    process.exit(-1);
  }
  marketplacetHandler.getTeamCompetition(team, worldtemplate);
  marketplacetHandler.getProductCompetition(team[pos], worldtemplate);

  //#5
  pos = -1;
  teamname = "Norvale";
  console.log(`\n\n[Testcase#5] ${teamname}\n`);
  team = marketplacetHandler.getTeam(teamname, worldtemplate);
  for (let i = 0; i < team.length; i++) {
    if (team[i].Title.neutral == "Pirate Adventures") {
      pos = i;
      break;
    }
  }
  if (pos == -1) {
    console.log(`[ERROR] Testcase not found`);
    process.exit(-1);
  }
  marketplacetHandler.getTeamCompetition(team, worldtemplate);
  marketplacetHandler.getProductCompetition(team[pos], worldtemplate);
}
