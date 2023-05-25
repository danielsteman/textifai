import express, { Express } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import router from "./routes";
import YAML from "yaml";
import fs from "fs";
import fileupload from "express-fileupload";
import bodyParser from "body-parser";

dotenv.config();

const port = process.env.PORT || 3000;

const app: Express = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(fileupload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerFile: any = process.cwd() + "/swagger.yaml";
const swaggerData: any = fs.readFileSync(swaggerFile, "utf8");
const swaggerDocument = YAML.parse(swaggerData);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: "/swagger.yaml",
    },
  })
);

// TODO: refactor such that prefix is equal to "api" + {service root folder name}
app.use("/api/documents", router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
