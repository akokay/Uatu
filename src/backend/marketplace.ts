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
    //get tags
    /* let tags = (product as any).Tags;
    tags = tags.splice(1, tags.length - 2);
    for (let i = 0; (product as any).DisplayProperties.packIdentity[i] != undefined; i++) {
      console.log(`${i}`);
      tags = tags.splice(1);
    }
    console.log(`teag: ${tags}`);
    console.log(`teag: ${tags}`);
    //get genre
    let genre = "";
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].startsWith("genre.", 0)) {
        genre = tags[i].slice(6);
        break;
      }
    }
    if (genre == "") {
      console.log(`no genre found`);
      return null;
    } */

    console.log(`---------------------------`);
    this.setInfo(product);
    //get all products with the same genre
    //filter by genre

    console.log(`---------------------------`);
    let competition = [{ test: 2 }, { test: 5 }, { test: 2222 }];
    //console.log(competition);
    this.filter(this.object[type].content, type, product.DisplayProperties.creatorName);
    //console.log(competition);
  }

  private filter(arr: any, type: string, teamname: string) {
    let i = 0;
    let res = [];
    while (true) {
      if (arr[i] == undefined) break;
      if (arr[i].DisplayProperties.creatorName != teamname) {
        res.push(arr[i]);
      } else {
        //console.log(arr[i].Title.neutral);
      }
      //if ((arr as any)[type].content[i] == undefined) break;
      i++;
    }
    return res;
  }

  private setInfo(product: any) {
    let info = product.Tags;
    info = info.splice(1, info.length - 1);
    for (let i = 0; (product as any).DisplayProperties.packIdentity[i] != undefined; i++) {
      console.log(`${i}`);
      info = info.splice(1);
    }
    console.log(`teag: ${info}`);
    //get genre
    let genre = "";
    let subgenre = "";
    let tags = [];
    let bools = [];
    let P = 0;

    console.log(`search`);
    for (let i = 0; i < info.length; i++) {
      if (info[i].startsWith("genre.", 0)) {
        genre = info[i].slice(6);
      } else if (info[i].startsWith("subgenre.", 0)) {
        subgenre = info[i].slice(9);
      } else if (info[i].startsWith("tag.", 0)) {
        tags.push(info[i].slice(4));
      } else if (info[i].endsWith("P") && info[i].length == 2) {
        console.log(`P sdsd  ${info[i].length} ${info[i].slice(-1)}`);
        P = Number(info[i].slice(0, 1));
      } else {
        bools.push(info[i]);
      }
    }
    console.log(`search`);
    if (genre == "") {
      console.log(`no genre found`);
      return null;
    }
    info = { tags: tags, genre: genre, subgenre: subgenre, bools: bools, P: P };
    console.log(info);
    return info;
  }

  //public getTeamCompetition();
}
