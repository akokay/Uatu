import { RequestHandler } from "./requestHandler";
const fs = require("fs");

export class MarketplacetHandler {
  private skinpackURL =
    "https://www.minecraft.net/bin/minecraft/productmanagement.productsinfobytype.json?limit=1&skip=0&type=skinpack&locale=en-us";
  private requesthandler: RequestHandler = new RequestHandler();
  private object = {}; //MarketplaceData

  public async fetchAll(): Promise<void> {
    let skinpacks: JSON = await this.requesthandler.fetchType(
      this.object,
      "mashup",
      1,
      0
    );
    let i = 0;
    while (true) {
      if (typeof (this.object as any)["mashup"][i] == "undefined") break;
      //console.log((this.object as any)["mashup"][i].Title);
      i++;
    }
    console.log(`[END] found ${i} skinpacks`);
    console.log(typeof (this.object as any)["mashup"]);
    //console.log((this.object as any)["mashup"]);
    console.log((this.object as any)["mashup"][0].Title);
    /**
     * @TODO
     * type für object mit key skinpack, bundels, worldtemplate, mashup
     * market type
     */
  }
}
