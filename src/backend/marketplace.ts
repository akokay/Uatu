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
    //TODO test if 'writeFileSync' is necessary
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
    //console.log(competition);

    product.info = this.setInfo(product);
    //console.log(product);
    let res = this.filter(this.object[type].content, type, product);
    //console.log(JSON.stringify(res));
    fs.writeFileSync(`${this.outpath}${product.Title.neutral.split(" ").join("_")}_competition.json`, JSON.stringify(res), function (err: any) {
      if (err) {
        console.log(err);
      }
    });
    fs.writeFileSync(`${this.outpath}${product.Title.neutral.split(" ").join("_")}_info.json`, JSON.stringify(product), function (err: any) {
      if (err) {
        console.log(err);
      }
    });
    //console.log(competition);
  }

  private filter(arr: any, type: string, filter: any) {
    let i = 0;
    let count = 0;
    let res = [];
    let tagMatches = [];
    let tagStats = {};
    for (let index = 0; index < filter.info.tags.length; index++) {
      console.log(filter.info.tags[index]);
      (tagStats as any)[filter.info.tags[index]] = 0;
    }
    console.log(tagStats);
    while (true) {
      if (arr[i] == undefined) break;
      arr[i].info = this.setInfo(arr[i]);
      if (arr[i].DisplayProperties.creatorName != filter.DisplayProperties.creatorName && arr[i].info.genre == filter.info.genre && (filter.info.subgenre == "" || arr[i].info.subgenre == filter.info.subgenre)) {
        tagMatches = this.getTagmatches(filter.info.tags, arr[i].info.tags);
        if (tagMatches.length >= 1) {
          for (let index = 0; index < tagMatches.length; index++) {
            (tagStats as any)[tagMatches[index]]++;
          }
          res.push(arr[i]);
          count++;
          console.log(`found ${arr[i].Title.neutral}-${arr[i].DisplayProperties.creatorName} ${count} ${tagMatches.length} ${tagMatches}`);
        }
      }
      i++;
      //if ((arr as any)[type].content[i] == undefined) break;
    }
    //sort by tag(tagquantity),
    console.log(`filter products from ${i} to ${count} products`);
    console.log(tagStats);
    return res;
  }

  private getTagmatches(tag: string[], tag2: string[]) {
    let matches = [];
    for (let i = 0; i < tag.length; i++) {
      for (let j = 0; j < tag2.length; j++) {
        if (tag[i] == tag2[j]) {
          matches.push(tag[i]);
        }
      }
    }
    return matches;
  }

  private setInfo(product: any) {
    let info = [];
    for (let i = 0; i < product.Tags.length; i++) {
      info.push(product.Tags[i]);
    }
    info = info.splice(1, info.length - 1);
    for (let i = 0; (product as any).DisplayProperties.packIdentity[i] != undefined; i++) {
      info = info.splice(1);
    }
    //get genre,subgenre,tags
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
