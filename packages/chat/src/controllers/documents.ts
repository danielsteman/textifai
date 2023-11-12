import { NextFunction, Request, Response } from "express";
import { textExtractor } from "../services/textExtractors";

interface QueryParamProps {
  userId: string;
}

export const getDocuments = async (
  req: Request<{}, {}, {}, QueryParamProps>,
  res: Response,
  next: NextFunction
) => {
  const userId: string = req.query.userId;

  if (!userId) {
    return res.status(422).json({ error: "The userId has not been received" });
  }

  const uploadedDocumentsContents = await textExtractor(userId);
  return res.status(200).json({ uploadedDocumentsContents });
};
