import { NextFunction, Request, Response } from "express";
import { textExtractor } from "../services/textExtractors";

interface QueryParamProps {
  userId: string;
  selectedDocuments: string[];
}

export const getDocuments = async (
  req: Request<{}, {}, {}, QueryParamProps>,
  res: Response,
  next: NextFunction
) => {
  const userId: string = req.query.userId;
  const selectedDocuments: string[] = req.query.selectedDocuments;

  if (!userId) {
    return res.status(422).json({ error: "The userId has not been received" });
  }

  const uploadedDocumentsContents = await textExtractor(
    userId,
    selectedDocuments
  );
  return res.status(200).json({ uploadedDocumentsContents });
};
