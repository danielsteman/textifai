import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import router from "./routes/upload";
import YAML from "yaml";
import fs from "fs";
import bodyParser from "body-parser";

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "*", // Replace with your React app's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app: Express = express();
app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerFile: any = process.cwd() + "/swagger.yaml";
const swaggerData: any = fs.readFileSync(swaggerFile, "utf8");
const swaggerDocument = YAML.parse(swaggerData);

app.use(
  "/api/documents/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: "/swagger.yaml",
    },
  })
);

app.use("/api/documents", router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
