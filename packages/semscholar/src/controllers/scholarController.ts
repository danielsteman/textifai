import { NextFunction, Request, Response } from "express";

export const scholarController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // The controller should handle all logic
  return res.status(200);
};
