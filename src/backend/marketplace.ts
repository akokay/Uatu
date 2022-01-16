import { RequestHandler } from "./requestHandler";
const moment = require("moment");
const fs = require("fs");

export class MarketplacetHandler {
  private requesthandler: RequestHandler = new RequestHandler();
  public object: any = {}; //MarketplaceData
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
  public getProductCompetition(product: any, teamname: string, type: string) {
    console.log(`---------------------------`);
    product.info = this.setInfo(product);
    //console.log(competition);
    this.filter(this.object[type].content, type, product);
    //console.log(competition);
  }

  private filter(arr: any, type: string, filter: any) {
    let i = 0;
    let count = 0;
    let res = [];
    while (true) {
      if (arr[i] == undefined) break;
      arr[i].info = this.setInfo(arr[i]);
      if (arr[i].DisplayProperties.creatorName != filter.DisplayProperties.creatorName && arr[i].info.genre == filter.info.genre && (filter.info.subgenre == "" || arr[i].info.subgenre == filter.info.subgenre)) {
        res.push(arr[i]);
        count++;
        console.log(`found ${arr[i].Title.neutral} ${count}`);
      }
      i++;
      //if ((arr as any)[type].content[i] == undefined) break;
    }
    console.log(`filter products from ${i} to ${count} products`);
    return res;
  }

  private setInfo(product: any) {
    let info = product.Tags;
    info = info.splice(1, info.length - 1);
    for (let i = 0; (product as any).DisplayProperties.packIdentity[i] != undefined; i++) {
      info = info.splice(1);
    }
    //get genre
    let genre = "";
    let subgenre = "";
    let tags = [];
    let bools = [];
    let P = 0;
    for (let i = 0; i < info.length; i++) {
      if (info[i].startsWith("genre.", 0)) {
        genre = info[i].slice(6);
      } else if (info[i].startsWith("subgenre.", 0)) {
        subgenre = info[i].slice(9);
      } else if (info[i].startsWith("tag.", 0)) {
        tags.push(info[i].slice(4));
      } else if (info[i].endsWith("P") && info[i].length == 2) {
        P = Number(info[i].slice(0, 1));
      } else {
        bools.push(info[i]);
      }
    }
    return { tags: tags, genre: genre, subgenre: subgenre, bools: bools, P: P };
  }

  //public getTeamCompetition();
}
