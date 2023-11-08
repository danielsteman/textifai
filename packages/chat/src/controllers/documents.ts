import { NextFunction, Request, Response } from "express";
import { getDatabaseReference } from "../db/getFirebaseReference";

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

  const fileNames = uploads[0].map((doc) => doc.name);

  res.status(200).send({ fileNames });
};
