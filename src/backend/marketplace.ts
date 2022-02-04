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
    //TODO test if 'writeFileSync' is necessary
    fs.writeFile(`${this.inpath}Catalog.json`, JSON.stringify(this.object), function (err: any) {
      if (err) {
        console.log(err);
      }
    });
  }

  public async loadAll(): Promise<object> {
    this.object = JSON.parse(fs.readFileSync(`${this.inpath}Catalog.json`, "utf8"));
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
  public getTeamCompetition(team:any,type:string){
    let comps = {};
    for(let i=0;i<team.length;i++){
      (comps as any)[team[i].Title.neutral] = this.getProductCompetition(team[i],type,false);
    }
    /**
     * merge teams, products
     * merge stats
     */
    let mergeStats = {};
    let mergeTeams = {};
    for(var prod in comps){
      console.log(`prod: ${prod}, (comps as any)[prod] ${JSON.stringify((comps as any)[prod][1])}`);
      //this.mergeTeams(mergeTeams,(comps as any)[prod][0]);
      this.mergeStats(mergeStats,(comps as any)[prod][1]);
      console.log(mergeStats);
    }   

    fs.writeFileSync(`${this.outpath}${team[0].DisplayProperties.creatorName.split(" ").join("_")}_competition.json`, JSON.stringify(comps), function (err: any) {
      if (err) {
        console.log(err);
      }
    });
  }

  private mergeStats(stats1:any,stats2:any){
    if(stats1!={}){
      let found:boolean=false;
      for(var elem1 in stats2){
        found=false;
        //check for stats in stats1
        for(var elem2 in stats1){
          if(elem1 == elem2){
            console.log(`match ${elem2} = ${stats1[elem2]} + ${stats2[elem2]}`);
            stats1[elem2]+=stats2[elem2];
            found=true;
            break;
          }
        }
        if(!found)
          stats1[elem1]=stats2[elem1];
      }
    }else{
      for(var elem in stats1){
        stats1[elem]=stats2[elem];
      }
    }
      
      return stats1;
  }

  public getProductCompetition(product: any, type: string, print:boolean=true) {
    //console.log(competition);

    product.info = this.setInfo(product);
    //console.log(product);
    let res = this.filterSimilarity(this.object[type].content, type, product);

    let teams = this.sortOutput(res[0], type, product);
    //console.log(JSON.stringify(res));
    let final=this.createOutput(product,teams,res[1]);
    if(print){
      fs.writeFileSync(`${this.outpath}${product.Title.neutral.split(" ").join("_")}_competition.json`, JSON.stringify(res), function (err: any) {
        if (err) {
          console.log(err);
        }
      });
      fs.writeFileSync(`${this.outpath}${product.Title.neutral.split(" ").join("_")}_team_overview.json`, JSON.stringify(teams), function (err: any) {
        if (err) {
          console.log(err);
        }
      });
      fs.writeFileSync(`${this.outpath}${product.Title.neutral.split(" ").join("_")}_info.json`, JSON.stringify(product), function (err: any) {
        if (err) {
          console.log(err);
        }
      });
      fs.writeFileSync(`${this.outpath}${product.Title.neutral.split(" ").join("_")}_finalcompetition.md`, final, function (err: any) {
        if (err) {
          console.log(err);
        }
      });
    }
    return [teams,res[1]];
    //console.log(competition);
  }

  private filterSimilarity(arr: any, type: string, filter: any) {
    let i = 0;
    let count = 0;
    let res = [];
    let tagMatches = [];
    let tagStats = {};
    for (let index = 0; index < filter.info.tags.length; index++) {
      //console.log(filter.info.tags[index]);
      (tagStats as any)[filter.info.tags[index]] = 0;
    }
    //console.log(tagStats);
    while (true) {
      if (arr[i] == undefined) break;
      arr[i].info = this.setInfo(arr[i]);
      //TODOD if subgenre then no tag needed
      if (arr[i].DisplayProperties.creatorName != filter.DisplayProperties.creatorName && arr[i].info.genre == filter.info.genre && (filter.info.subgenre == "" || arr[i].info.subgenre == filter.info.subgenre)) {
        tagMatches = this.getTagmatches(filter.info.tags, arr[i].info.tags);
        if (tagMatches.length >= 1 || filter.info.subgenre!="") {
          for (let index = 0; index < tagMatches.length; index++) {
            (tagStats as any)[tagMatches[index]]++;
          }
          res.push(arr[i]);
          count++;
          //console.log(`found ${arr[i].Title.neutral}-${arr[i].DisplayProperties.creatorName} ${count} ${tagMatches.length} ${tagMatches}`);
        }
      }
      i++;
      //if ((arr as any)[type].content[i] == undefined) break;
    }
    //sort by tag(tagquantity),
    console.log(`filter for ${filter.Title.neutral} products from ${i} to ${count} products`);
    //console.log(tagStats);
    return [res,tagStats];
  }
  
  private sortOutput(arr: any, type: string, filter: any) {
    let teams={};
    let res=[];
    let highest=""
    let match=-1;
    for (let index = 0; index < arr.length; index++) {
      //console.log(arr[index].DisplayProperties.creatorName);
      if((teams as any)[arr[index].DisplayProperties.creatorName]==undefined){
        (teams as any)[arr[index].DisplayProperties.creatorName]={count:0,products:[]}
      }
      (teams as any)[arr[index].DisplayProperties.creatorName].count++;
      (teams as any)[arr[index].DisplayProperties.creatorName]["products"].push(arr[index]);
      //console.log((teams as any)[arr[index].DisplayProperties.creatorName]);
    }
    for(var propt in teams){
      let obj = {creatorName:propt,count: (teams as any)[propt].count,products:(teams as any)[propt].products};
      res.push(obj);
       //console.log(`${propt}: ${(teams as any)[propt].count}`);
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
  private createOutput(product:any,teams:object[],tagstats:any) { 
    let text=
    `# Competition based on Product ${product.Title.neutral}\n# `+ this.product_overview(product);
    text+=`\n${JSON.stringify(tagstats)}\n\n`
    for (let i = 0; i < teams.length; i++) {
      text+=`\n\n\n\n${this.team_overview(teams[i])}`;
      
    }
    return text;
    //TODO competion output
    // TODO module for team outpur and product info
    
    fs.writeFileSync(`${product.Title.neutral.split(" ").join("_")}_competition.md`, text, function (err: any) {
      if (err) {
        console.log(err);
      }
    });
  }

  private product_overview(product:any){
    return `${product.Title.neutral}\n\n`+`![Alt text](${product.Images[0].url} \"${product.Images[0].Type}\")\n`+
    `AverageRating: ${product.AverageRating}\n\n`+
    `TotalRatingsCount: ${product.TotalRatingsCount}\n\n`+
    `Genre: ${product.info.genre}\n\n`+
    `${product.info.subgenre!=""?`Subenre: ${product.info.subgenre}\n\n`:""}`+
    `Tags: ${product.info.tags}\n\n`+
    `Price: ${product.DisplayProperties.price} minecoins (~${Number(product.info.priceEUR.toFixed(2))} EUR)\n\n`+
    `Popularity: ${product.info.popularity}\n`;
  }

  private team_overview(team:any){
    /**
     * matched tags, popularity, top tags of that team, top 3 products
     * TODO get team image
     */
    let matchedTags ={}
    let popularity =0;
    for(let i=0;i<team.products.length; i++){
      for(let j=0;j<team.products[i].info.tags.length;j++){
        if((matchedTags as any)[team.products[i].info.tags[j]]==undefined){
          (matchedTags as any)[team.products[i].info.tags[j]]=0;
        }
        (matchedTags as any)[team.products[i].info.tags[j]]++;
      }
      popularity+=team.products[i].info.popularity;
        //console.log(team.products[i].info.tags);
    }
    //TODO sort matchedTags
    //TODO sort products by popularity
    let top = "";
    for(let i=0;i<(3&&team.products.length);i++){
      //console.log(team.products[i]);
      //TODO sort by popularity
      top+= `### ${this.product_overview(team.products[i])}\n`;
    }
    return `## ${team.creatorName}\n\n`+`popularity: ${popularity}\n\n`+`${JSON.stringify(matchedTags)+ top}`;
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
    let income = Number(((product.TotalRatingsCount) * product.DisplayProperties.price).toFixed());
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
    return { tags: tags, genre: genre, subgenre: subgenre, bools: bools, P: P, popularity: Number((product.TotalRatingsCount * product.AverageRating).toFixed()), income: income, priceEUR:this.priceConversion(product.DisplayProperties.price)};
  }
  
  private priceConversion(coins:number){
    /*
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
