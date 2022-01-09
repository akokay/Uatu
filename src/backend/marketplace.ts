import { RequestHandler } from "./requestHandler";
const moment = require("moment");
const fs = require("fs");

export class MarketplacetHandler {
  private requesthandler: RequestHandler = new RequestHandler();
  public object = {}; //MarketplaceData
  private outpath = "out/";

  public async fetchAll(): Promise<void> {
    let Producttype: string = "mashup";
    let mashups: JSON = await this.requesthandler.fetchType(this.object, "mashup", 1000, 0); //fetch marketplace
    let i = 0;
    while (true) {
      // count product
      if ((this.object as any)[Producttype].content[i] == undefined) break;
      i++;
    }
    console.log(`[END] found ${i} ${Producttype}`);

    Producttype = "worldtemplate";
    let worldtemplates: JSON = await this.requesthandler.fetchType(this.object, "worldtemplate", 1000, 0); //fetch marketplace
    i = 0;
    while (true) {
      // count product
      if ((this.object as any)[Producttype].content[i] == undefined) break;
      i++;
    }
    console.log(`[END] found ${i} ${Producttype}`);

    Producttype = "bundle";
    let bundle: JSON = await this.requesthandler.fetchType(this.object, "bundle", 1000, 0); //fetch marketplace
    i = 0;
    while (true) {
      // count product
      if ((this.object as any)[Producttype].content[i] == undefined) break;
      i++;
    }
    console.log(`[END] found ${i} ${Producttype}`);

    fs.writeFile(`${this.outpath}Catalog.json`, JSON.stringify(this.object), function (err: any) {
      if (err) {
        console.log(err);
      }
    });
  }

  public async loadAll(): Promise<object> {
    this.object = JSON.parse(fs.readFileSync(`${this.outpath}Catalog.json`, "utf8"));
    console.log(`loaded Catalog from file`);
    return this.object;
  }

  public getProduct(name: string, type: string) {
    let i = 0;
    console.log(`search for ${name}`);
    while (true) {
      // count product
      if ((this.object as any)[type].content[i] == undefined) break;
      if ((this.object as any)[type].content[i].Title.neutral.toLowerCase() == name.toLowerCase()) {
        console.log((this.object as any)[type].content[i].Title);
        return (this.object as any)[type].content[i];
      }
      i++;
    }
    console.log(`end search for ${name}`);
    return {};
  }

  public getTeam(name: string, type: string) {
    let info = [];
    let i = 0;
    console.log(`search for ${name}`);
    while (true) {
      // count product
      if ((this.object as any)[type].content[i] == undefined) break;
      if ((this.object as any)[type].content[i].DisplayProperties.creatorName.toLowerCase() == name.toLowerCase()) {
        info.push((this.object as any)[type].content[i]);
        console.log((this.object as any)[type].content[i].Title);
      }
      i++;
    }
    console.log(`end search for ${name}`);
    return info;
  }

  /**
   *
   * @param object
   * get Product and compare tags with others
   * if atleast 1|2|3 tag are the same -> remember product
   * return percent of coverage of the found product - similarity count
   */
  //public getProductCompetition();

  //public getTeamCompetition();
}
