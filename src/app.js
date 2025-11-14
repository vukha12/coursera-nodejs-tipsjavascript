import "dotenv/config";

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import router from "./routes/index.js";

const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
import mongoose from "./dbs/init.mongodb.js";

// init routes
app.use("/", router);

// handling error

export default app;
