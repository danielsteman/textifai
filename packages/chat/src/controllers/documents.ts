import { NextFunction, Request, Response } from "express";
import { getDatabaseReference } from "../db/getDatabaseReference";

export const getDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body.currentUserId);

  const currentUserId = req.body.currentUserId;

  const db = getDatabaseReference();
  const users = db.bucket("textifai-g5njdml004.appspot.com");
  const uploads = await users.getFiles({
    prefix: `users/${currentUserId}/uploads`,
  });

  uploads[0].forEach((file) => {
    console.log(file.name);
  });

  const fileNames = uploads[0].map((doc) => doc.name);

  res.status(200).send({ fileNames });
};
