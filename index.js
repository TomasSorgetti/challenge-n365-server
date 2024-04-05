require("dotenv").config();
const server = require("./src/app");
const { conn } = require("./src/db");

const { PORT } = process.env;

server.listen(PORT, () => {
  conn.sync({ force: false });
  console.log(`listening on port ${PORT}`);
});
