import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import router from "./routes";
import YAML from "yaml";
import fs from "fs";

const port = process.env.PORT || 3001;

const app: Express = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static("public"));

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

app.use("/api/chat", router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
