import { NextFunction, Request, Response } from "express";
import { getDocumentContent } from "../services/documents";

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

  const uploadedDocumentsContents = await getDocumentContent(userId);
  return res.status(200).json({ uploadedDocumentsContents });
};
