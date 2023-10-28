import { rest } from "msw";
import { config } from "../config/config";

export const handlers = [
  rest.post(`http://${config.chat.url}/api/chat/ask`, (_, res, ctx) => {
    return res(ctx.delay(500), ctx.status(200), ctx.json({ answer: "hoi" }));
  }),
];
