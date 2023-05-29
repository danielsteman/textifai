import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Configuration, OpenAIApi } from "openai";

const router = express.Router();

const envPath = path.resolve(__dirname, "../../../.env.local");

dotenv.config({ path: envPath });

router.post(
  "/ask",
  async (
    req: Request<{ prompt: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.body.prompt,
      });
      res.json({ answer: completion.data.choices[0].text });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
