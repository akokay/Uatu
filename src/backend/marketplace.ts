import { RequestHandler } from "./requestHandler";
const moment = require("moment");
const fs = require("fs");

export class MarketplacetHandler {
  private requesthandler: RequestHandler = new RequestHandler();
  public object: any = {}; //MarketplaceData
  private outpath = "out/";
  private inpath = "in/";
  private conversion = 0.00576819973603;

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

    fs.writeFileSync(`${this.inpath}Catalog.json`, JSON.stringify(this.object), function (err: any) {
      if (err) {
        console.log(err);
      }
    });
  }

  public async loadAll(): Promise<object> {
    this.object = JSON.parse(fs.readFileSync(`${this.inpath}Catalog.json`, "utf8"));
    console.log(`  loaded Catalog from file\n`);
    return this.object;
  }

  public getProduct(name: string, type: string) {
    let i = 0;
    console.log(`  [PRODUCT]: search for ${name}`);
    while (true) {
      // count product
      if ((this.object as any)[type].content[i] == undefined) break;
      if ((this.object as any)[type].content[i].Title.neutral.toLowerCase() == name.toLowerCase()) {
        console.log(`  [PRODUCT]: search for ${name} ended`);
        return (this.object as any)[type].content[i];
      }
      i++;
    }
    console.log(`  [PRODUCT]: search for ${name} failed`);
    return {};
  }

  public getTeam(name: string, type: string) {
    let info = [];
    let i = 0;
    console.log(`  [TEAM]: search for ${name}`);
    while (true) {
      // count product
      if ((this.object as any)[type].content[i] == undefined) break;
      if ((this.object as any)[type].content[i].DisplayProperties.creatorName.toLowerCase() == name.toLowerCase()) {
        info.push((this.object as any)[type].content[i]);
      }
      i++;
    }
    console.log(`  [TEAM]: search for ${name} ended`);
    return info;
  }
  public getTeamCompetition(team: any, type: string) {
    let comps = {};
    for (let i = 0; i < team.length; i++) {
      (comps as any)[team[i].Title.neutral] = this.getProductCompetition(team[i], type, false);
    }
    let mergeStats = {};
    let mergeTeams = null;
    for (var prod in comps) {
      mergeTeams = this.mergeTeams(mergeTeams, (comps as any)[prod][0]);
      this.mergeStats(mergeStats, (comps as any)[prod][1]);
    }

    let final = this.createOutputTeam(team, mergeTeams, mergeStats);
    fs.writeFileSync(`${this.outpath}${team[0].DisplayProperties.creatorName.split(" ").join("_")}_competition.md`, final, function (err: any) {
      if (err) {
        console.log(err);
      }
    });
  }

  private createOutputTeam(team: any, teams: any, tagstats: any) {
    let text = `# Competition based on Team ${team[0].DisplayProperties.creatorName}\n`;
    text += `\n${JSON.stringify(tagstats)}<br><br>\n`;
    text += this.team_overview({ creatorName: team[0].DisplayProperties.creatorName, count: -1, products: team });
    text += `<br><br>\n\n`;
    for (let i = 0; i < teams.length; i++) {
      text += `${this.team_overview(teams[i])}<br><br>\n\n`;
    }
    return text;
  }

  private mergeTeams(team1: any[] | null, team2: any[]) {
    if (team1 != null) {
      for (let i = 0; i < team2.length; i++) {
        //get pos in team1
        let pos1;
        for (pos1 = 0; pos1 < team1.length; pos1++) {
          if (team1[pos1].creatorName == team2[i].creatorName) {
            break;
          }
        }
        if (pos1 == team1.length) {
          team1.push(team2[i]);
        } else {
          //check for doubles
          for (let j = 0; j < team2[i].products.length; j++) {
            let found = false;
            for (let k = 0; k < team1[pos1].products.length; k++) {
              if (team1[pos1].products[k].Title.neutral == team2[i].products[j].Title.neutral) {
                team1[pos1].products[k].info.matches++;
                found = true;
                break;
              }
            }
            if (!found) {
              team1[pos1].products.push(team2[i].products[j]);
              team1[pos1].count++;
            }
          }
        }
      }
    } else {
      team1 = team2;
    }

    return team1.sort((a, b) => 0 - ((a as any).count > (b as any).count ? 1 : -1));
  }

  private mergeStats(stats1: any, stats2: any) {
    if (stats1 != {}) {
      let found: boolean = false;
      for (var elem1 in stats2) {
        found = false;
        //check for stats in stats1
        for (var elem2 in stats1) {
          if (elem1 == elem2) {
            stats1[elem2] += stats2[elem2];
            found = true;
            break;
          }
        }
        if (!found) stats1[elem1] = stats2[elem1];
      }
    } else {
      for (var elem in stats1) {
        stats1[elem] = stats2[elem];
      }
    }

    return stats1;
  }

  public getProductCompetition(product: any, type: string, print: boolean = true) {
    product.info = this.setInfo(product);
    let res = this.filterSimilarity(this.object[type].content, type, product);

    let teams = this.sortOutputProduct(res[0], type, product);
    let final = this.createOutputProduct(product, teams, res[1]);
    if (print) {
      fs.writeFileSync(`${this.outpath}${product.Title.neutral.split(" ").join("_")}_competition.md`, final, function (err: any) {
        if (err) {
          console.log(err);
        }
      });
    }
    return [teams, res[1]];
  }

  private filterSimilarity(arr: any, type: string, filter: any) {
    let i = 0;
    let count = 0;
    let res = [];
    let tagMatches = [];
    let tagStats = {};
    for (let index = 0; index < filter.info.tags.length; index++) {
      (tagStats as any)[filter.info.tags[index]] = 0;
    }
    while (true) {
      if (arr[i] == undefined) break;
      arr[i].info = this.setInfo(arr[i]);
      if (arr[i].DisplayProperties.creatorName != filter.DisplayProperties.creatorName && arr[i].info.genre == filter.info.genre && (filter.info.subgenre == "" || arr[i].info.subgenre == filter.info.subgenre)) {
        tagMatches = this.getTagmatches(filter.info.tags, arr[i].info.tags);
        if (tagMatches.length >= 1 || filter.info.subgenre != "") {
          for (let index = 0; index < tagMatches.length; index++) {
            (tagStats as any)[tagMatches[index]]++;
          }
          res.push(arr[i]);
          count++;
        }
      }
      i++;
    }
    console.log(`[UAUTU] filter for ${filter.Title.neutral} from ${i} products to ${count} products`);
    return [res, tagStats];
  }

  private sortOutputProduct(arr: any, type: string, filter: any) {
    let teams = {};
    let res = [];
    let highest = "";
    let match = -1;
    for (let index = 0; index < arr.length; index++) {
      if ((teams as any)[arr[index].DisplayProperties.creatorName] == undefined) {
        (teams as any)[arr[index].DisplayProperties.creatorName] = { count: 0, products: [] };
      }
      (teams as any)[arr[index].DisplayProperties.creatorName].count++;
      (teams as any)[arr[index].DisplayProperties.creatorName]["products"].push(arr[index]);
    }
    for (var propt in teams) {
      let obj = { creatorName: propt, count: (teams as any)[propt].count, products: (teams as any)[propt].products };
      res.push(obj);
    }
    return res.sort((a, b) => 0 - ((a as any).count > (b as any).count ? 1 : -1));
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
  private createOutputProduct(product: any, teams: object[], tagstats: any) {
    let text = `# Competition based on Product ${product.Title.neutral}\n# ` + this.product_overview(product);
    text += `\n${JSON.stringify(tagstats)}\n\n`;
    for (let i = 0; i < teams.length; i++) {
      text += `\n\n\n\n${this.team_overview(teams[i])}`;
    }
    return text;
  }

  private product_overview(product: any) {
    return (
      `\n\n![Alt text](${product.Images[0].url} \"${product.Images[0].Type}\")\n\n` +
      `\`\`\`\n${product.Description.neutral}\n\`\`\`\n\n` +
      `AverageRating: ${product.AverageRating}\n\n` +
      `TotalRatingsCount: ${product.TotalRatingsCount}\n\n` +
      `Genre: ${product.info.genre}\n\n` +
      `${product.info.subgenre != "" ? `Subenre: ${product.info.subgenre}\n\n` : ""}` +
      `Tags: ${product.info.tags}\n\n` +
      `Price: ${product.DisplayProperties.price} minecoins (~${Number(product.info.priceEUR.toFixed(2))} EUR)\n\n` +
      `Popularity: ${product.info.popularity}\n`
    );
  }

  private team_overview(team: any) {
    let matchedTags = {};
    let popularity = 0;
    for (let i = 0; i < team.products.length; i++) {
      for (let j = 0; j < team.products[i].info.tags.length; j++) {
        if ((matchedTags as any)[team.products[i].info.tags[j]] == undefined) {
          (matchedTags as any)[team.products[i].info.tags[j]] = 0;
        }
        (matchedTags as any)[team.products[i].info.tags[j]]++;
      }
      popularity += team.products[i].info.popularity;
    }
    let top = "<details open>\n<summary></summary>";
    for (let i = 0; i < (3 && team.products.length); i++) {
      top += `\n\n<details>\n<summary>${team.products[i].Title.neutral}</summary>\n<br>\n${this.product_overview(team.products[i])}\n</details>\n\n`;
    }
    return `## **${team.creatorName}**\n\n` + `popularity: ${popularity}\n\n` + `${top}</details>`;
    //return `## **${team.creatorName}**\n\n` + `popularity: ${popularity}\n\n` + `${JSON.stringify(matchedTags)}\n\n ${top}</details>`;
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
    let income = Number((product.TotalRatingsCount * product.DisplayProperties.price).toFixed());
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
    return {
      tags: tags,
      genre: genre,
      subgenre: subgenre,
      bools: bools,
      P: P,
      popularity: Number((product.TotalRatingsCount * product.AverageRating).toFixed()),
      income: income,
      priceEUR: this.priceConversion(product.DisplayProperties.price),
      matches: 1,
    };
  }

  private priceConversion(coins: number) {
    /*
    Conversion from minecoins to euros
    320 coins - 1.99
      1 coins - 0,00621875
    1020 coins - 5.99
      1 coins - 0,0058725490196078
    1720 coins - 9.99
      1 coins - 0,0058081395348837
    3500 coins - 19.99
      1 coins - 0,0057114285714286
    8800 coins - 49.99
      1 coins - 0,0056806818181818
    
    avg
      1 - 0.00576819973603
    
    0,0058725490196078+ 0,0058081395348837+ 0,0057114285714286+ 0,0056806818181818 = 0.0230727989441 
    0.0230727989441/4 = 0.00576819973603
     */
    return coins * this.conversion;
  }
}
