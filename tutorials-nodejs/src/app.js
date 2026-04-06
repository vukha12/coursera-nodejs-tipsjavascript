import "dotenv/config";

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import router from "./routes/index.js";
import { v4 as uuidv4 } from 'uuid';
import myLogger from "./loggers/mylogger.log.js";

const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'];
  req.requestId = requestId ? requestId : uuidv4();
  myLogger.log(`inpurt params::${req.method}::`, [
    req.path,
    { requestId: requestId },
    req.method === 'POST' ? req.body : req.query
  ])

  next();
})


// test pub/sub redis
// productTest.purchaseProduct('product:001', 10);

// init db
import mongoose from "./dbs/init.mongodb.js";
import { initRedis } from "./dbs/init.redis.js";

initRedis();
// init routes
app.use("/", router);

// handling error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;

  const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`

  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestOd },
    {
      message: error.message
    }
  ])
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    // stack: error.stack,
    message: error.message || "Interal Server Error",
  });
});

export default app;
