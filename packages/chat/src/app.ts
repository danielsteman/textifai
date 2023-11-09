import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import fs from "fs";
import * as documentsController from "./controllers/documents";
import * as promptsController from "./controllers/prompts";

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
  "/api/chat/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: "/swagger.yaml",
    },
  })
);

app.post("/api/chat/ask", promptsController.postPrompt);
app.get("/api/chat/documents", documentsController.getDocuments);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
