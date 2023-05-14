import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import router from "./routes";

dotenv.config();

const port = process.env.PORT || 3000;

const app: Express = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("files"));

app.use(router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
