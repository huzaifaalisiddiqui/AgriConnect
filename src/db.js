const oracledb = require("oracledb");

async function connectToDatabase() {
  const connection = await oracledb.getConnection({
    user: "AGRICONNECTNEW",
    password: "1234",
    connectString: "localhost:1521/XE",
  });
  return connection;
}

module.exports = {
  connectToDatabase,
};
