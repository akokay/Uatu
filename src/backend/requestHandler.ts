import fetch from "node-fetch";
const fs = require("fs");

export class RequestHandler {
  public async fetchURL(url: string, filename: String): Promise<JSON> {
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
    let body = await response.json();
    console.log(`[fetchURL]: fetched ${url}`);
    return body;
    //TODO return JSON
    fs.writeFile(
      `out/${filename}.json`,
      JSON.stringify(body),
      "utf8",
      (error: Error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`[fetchURL]: saved out/${filename}.json`);
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
    );
  }
}
