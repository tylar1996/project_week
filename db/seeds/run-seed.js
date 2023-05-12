const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();

// seed({devData}).then(()=>{
//   console.log(`Database ${process.env.PGDATABASE || process.env.DATABSE_URL} seeded`);
//   return db.end();
// })
