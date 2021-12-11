import { RequestHandler } from "./requestHandler";
const fs = require("fs");

export class MarketplacetHandler {
  private requesthandler: RequestHandler = new RequestHandler();
  public object = {}; //MarketplaceData

  public async fetchAll(): Promise<void> {
    let Producttype: string = "mashup";
    let skinpacks: JSON = await this.requesthandler.fetchType(
      this.object,
      "mashup",
      1,
      0
    );
    let i = 0;
    while (true) {
      if (typeof (this.object as any)[Producttype][i] == "undefined") break;
      //console.log((this.object as any)["mashup"][i].Title);
      i++;
    }
    console.log(`[END] found ${i} ${Producttype}`);
    //console.log((this.object as any)["mashup"]);
    console.log((this.object as any)[Producttype][0].Title);
    /**
     * @TODO
     * type für object mit key skinpack, bundels, worldtemplate, mashup
     * market type
     */
  }
}
