const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./routes/mainRouter");

const app = express();

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-Width, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, Post, OPTIONS, PUT, DELETE");
//   next();
// });
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
    cors(
//         {
//     origin: "http://localhost:5173",
//     credentials: true,
//   }
  )
);

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

module.exports = app;
