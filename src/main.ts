import { MarketplacetHandler } from "./backend/marketplace";

console.log("start");
let marketplacetHandler = new MarketplacetHandler();
marketplacetHandler.fetchAll();
console.log("end");
//process.exit(0);

/*

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "marketplace",
});

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
*/
