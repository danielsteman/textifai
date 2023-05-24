import express, { Request, Response } from "express";

const router = express.Router();

// in node.js with express.js using Typescript, the following piece of code is not valid because req.files might be null or undefined. What is an idiomatic way to solve this?

router.post("/upload", (req: Request, res: Response) => {
  const newpath = __dirname + "/files/";
  const file = req.files?.file;
  let filename: string | undefined;

  if (Array.isArray(file)) {
    filename = file[0].name;
  } else {
    filename = file?.name;
    file?.mv(`${newpath}${filename}`, (err) => {
      if (err) {
        res.status(500).send({ message: "File upload failed", code: 200 });
      }
      res.status(200).send({ message: "File Uploaded", code: 200 });
    });
  }
});

export default router;
