import { RequestHandler } from "./backend/requestHandler";
const fs = require("fs");
var mysql = require("mysql");

console.log("start");
let requesthandler = new RequestHandler();
let url =
  "https://www.minecraft.net/bin/minecraft/productmanagement.productsinfobytype.json?limit=1000&skip=0&type=skinpack&locale=en-us";
requesthandler.fetchURL(url, "skinpack");
console.log("database");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "marketplace",
});
/*
con.connect(function (err: any) {
  if (err) throw err;
  console.log("Connected!");
});*/

con.connect(function (err: any) {
  if (err) throw err;
  con.query(
    "SELECT * FROM product",
    function (err: any, result: JSON, fields: any) {
      if (err) throw err;
      console.log(result);
    }
  );
});
/**
 * fetch alle links
 * fetch alle dateien
 * Datenbank!!!
 */
//process.exit(0);
