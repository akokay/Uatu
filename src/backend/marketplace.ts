import { RequestHandler } from "./requestHandler";
const fs = require("fs");

export class MarketplacetHandler {
  private skinpackURL =
    "https://www.minecraft.net/bin/minecraft/productmanagement.productsinfobytype.json?limit=1&skip=0&type=skinpack&locale=en-us";
  private requesthandler = new RequestHandler();

  public async fetchAll(): Promise<void> {
    let skinpacks: JSON = await this.requesthandler.fetchURL(
      this.skinpackURL,
      "skinpack"
    );
    let i = 0;
    while (true) {
      if (typeof JSON.parse(JSON.stringify(skinpacks))[i] == "undefined") break;
      i++;
    }
    console.log(`[FETCH] found ${i} skinpacks`);
    let out: String = JSON.parse(JSON.stringify(skinpacks))[0].Title.neutral;
    console.log(out);
  }
}
