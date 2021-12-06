import { RequestHandler } from "./requestHandler";
const fs = require("fs");

export class MarketplacetHandler {
  private skinpackURL =
    "https://www.minecraft.net/bin/minecraft/productmanagement.productsinfobytype.json?limit=1&skip=0&type=skinpack&locale=en-us";
  private requesthandler = new RequestHandler();
  private object = {};

  public async fetchAll(): Promise<void> {
    let skinpacks: JSON = await this.requesthandler.fetchType(
      this.object,
      "mashup",
      2,
      0
    );
    skinpacks = JSON.parse(JSON.stringify(skinpacks));
    let i = 0;
    while (true) {
      if (typeof JSON.parse(JSON.stringify(skinpacks))[i] == "undefined") break;
      i++;
    }
    console.log(`[END] found ${i} skinpacks`);
    console.log(typeof (this.object as any)["mashup"]);
    console.log((this.object as any)["mashup"]);
    console.log((this.object as any)["mashup"][0]);
    /**
     * @TODO
     * type für object mit key skinpack, bundels, worldtemplate, mashup
     * market type
     */
  }
}
