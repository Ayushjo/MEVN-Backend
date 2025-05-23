import express from "express";
import logger from "./logger.js";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});
const app = express();


app.use(
  cors({
    origin: ["https://mevn-frontend-xi.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
//importing routes
import userRouter from "./routes/user.routes.js"
app.use("/users",userRouter)

import postRouter from "./routes/post.routes.js"
app.use("/users",postRouter)
const PORT = process.env.PORT || 3075
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.warn("HUHUHU");
      logger.info(`Port ${PORT} running`);
    });
  })
  .catch(() => {
    logger.error("Error connecting DB", err);
  });

