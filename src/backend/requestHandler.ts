import { MarketplaceData } from "./marketplaceProduct";
import fetch from "node-fetch";
const fs = require("fs");

export class RequestHandler {
  private async fetchURL(url: string): Promise<JSON> {
    let response = await fetch(url, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "de-DE,de;q=0.9",
        "cache-control": "max-age=0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "sec-gpc": "1",
        "upgrade-insecure-requests": "1",
        cookie:
          "AKA_A2=A; ak_bmsc=8F934296696D67B31A691718443FC0C8~000000000000000000000000000000~YAAQHoMQWfcJ69t8AQAAQt8SGQ1eDe1PTtiTeAB3hRQuCz642VgoDo7CD/ceTXTYZU2ZWW5JRyQKfP+maM6OInG5EqVziclB7CMtilW4DX01Id1i0xAqs2+7ZqnFj+WAaI1Cz32Xp4zXaVF9NORPqgUGjaDlaOxD26zAWomI/QBVoHLje/ANCemfFmHhhBv8pG8P5Njg/+SVnwDjoHmJcQIFNSjDU1PPzRqia6u+kXo/m0Dcmn2MGY3EXXFpFVD1Bmr6CvlmmC8RRrPeZipgAR8cttpxKhvUO24qohfR8Si4UF69UMgMMcT97joFpkYpJQoPu1GRTpEhzF0IjlYzVByw1PxYKQwHfyKlUO1aVmuPB0/ybG71Qvr1qu23GPtfgOMZGk5NcrdIowSL",
      },
      method: "GET",
    });
    return await response.json();
  }

  public async fetchType(
    object: Object,
    type: "skinpack" | "mashup" | "resourcepack" | "worldtemplate" | "bundle",
    limit: number = 1,
    skip: number = 0
  ): Promise<JSON> {
    let amount: number = limit;
    let count: number = 0;
    let foundAll: boolean = false;
    //console.log(`[FETCH]${amount}: ${type}`);
    (object as any)[type] = { lastfetched: new Date().toString(), content: [] };
    do {
      let url: string = `https://www.minecraft.net/bin/minecraft/productmanagement.productsinfobytype.json?limit=${limit}&skip=${skip}&type=${type}&locale=en-us`;
      let body = await this.fetchURL(url);
      for (let i = 0; i < limit - skip; i++) {
        //console.log(JSON.parse(JSON.stringify(body))[i] + " " + foundAll);
        if (JSON.parse(JSON.stringify(body))[i] == undefined) {
          foundAll = true;
          count += i;
          console.log(`[FETCHALL] found ${count} ${type}`);
          break;
        }
        (object as any)[type].content.push(JSON.parse(JSON.stringify(body))[i]);
        //console.log((object as any)[type][i].Title);
      }
      if (!foundAll) {
        count += limit;
        skip = limit;
        limit += amount;
      }
    } while (!foundAll);
    // fetch more products
    //let body = await this.fetchURL(url);
    return (object as any)[type];
    //TODO return JSON
    /*
    fs.writeFile(
      `out/${type}.json`,
      JSON.stringify(body),
      "utf8",
      (error: Error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`[fetchURL]: saved out/${type}.json`);
          let i = 0;
          //console.log(JSON.parse(JSON.stringify(body))[0]);
          while (true) {
            if (typeof JSON.parse(JSON.stringify(body))[i] == "undefined") {
              break;
            }
            i++;
            //console.log(JSON.parse(JSON.stringify(body))[i]);
            //console.log("\n---------------------------------------n" + i);
          }
          console.log(`[FETCH] found ${i} skinpacks`);
          //console.log(JSON.parse(JSON.stringify(body)));
        }
      }
    );*/
  }
}
