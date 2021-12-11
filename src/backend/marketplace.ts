import { RequestHandler } from "./requestHandler";
const moment = require("moment");
const fs = require("fs");

export class MarketplacetHandler {
  private requesthandler: RequestHandler = new RequestHandler();
  public object = {}; //MarketplaceData

  public async fetchAll(): Promise<void> {
    let Producttype: string = "mashup";
    let mashups: JSON = await this.requesthandler.fetchType(
      this.object,
      "mashup",
      1000,
      0
    ); //fetch marketplace
    let i = 0;
    while (true) {
      // count product
      if ((this.object as any)[Producttype].content[i] == undefined) break;
      //console.log((this.object as any)["mashup"][i].Title);
      i++;
    }
    console.log(`[END] found ${i} ${Producttype}`);
    //console.log((this.object as any)[Producttype].lastfetched);

    Producttype = "bundle";
    let bundle: JSON = await this.requesthandler.fetchType(
      this.object,
      "bundle",
      1000,
      0
    ); //fetch marketplace
    i = 0;
    while (true) {
      // count product
      if ((this.object as any)[Producttype].content[i] == undefined) break;
      //console.log((this.object as any)["mashup"][i].Title);
      i++;
    }
    console.log(`[END] found ${i} ${Producttype}`);
    //console.log((this.object as any)[Producttype].lastfetched);
    //console.log((this.object as any)[Producttype].content[0].Title);
    fs.writeFile(
      `out/Catalog.json`,
      JSON.stringify(this.object),
      function (err: any) {
        if (err) {
          console.log(err);
        }
      }
    );
    /**
     * @TODO
     * type für object mit key skinpack, bundels, worldtemplate, mashup
     * market type
     */
  }
}
