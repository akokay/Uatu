import { MarketplacetHandler } from "./backend/marketplace";
const moment = require("moment");

//let date = moment(moment(new Date())).format("DD-MMM-YYYY");
console.log(`start`);
let marketplacetHandler = new MarketplacetHandler();
marketplacetHandler.fetchAll();
console.log(`end`);
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
  con.query(tsc
  tsc
    "SELECT * FROM product",
    function (err: any, result: JSON, fields: any) {
      if (err) throw err;
      console.log(result);
    }
  );
});
*/
