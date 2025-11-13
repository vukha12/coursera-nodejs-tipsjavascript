import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
import mongoose from "./dbs/init.mongodb.js";

// init routes
app.get("/", (req, res) => {
  const strCompress = "Hello Factipjs";
  return res.status(200).json({ msg: "Welcome Fantipsjs" });
});

// handling error

export default app;
