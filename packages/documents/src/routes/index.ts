import express, { Request, Response } from "express";

const router = express.Router();

router.post("/upload", (req: Request, res: Response) => {
  console.log(req.body);

  res.send("Got a POST request");
});

export default router;
