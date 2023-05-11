import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.static("files"));

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post(
  "/stats",
  upload.single("uploaded_file"),
  function (req: Request, res: Response, next: NextFunction) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.file, req.body);
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
