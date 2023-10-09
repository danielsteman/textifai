import { rest } from "msw";
import { baseUrl } from "../config";

export const handlers = [
  rest.post(`http://${baseUrl}:3001/api/chat/ask`, (_, res, ctx) => {
    return res(ctx.delay(500), ctx.status(200), ctx.json({ answer: "hoi" }));
  }),
];
