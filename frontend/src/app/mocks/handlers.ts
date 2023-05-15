import { rest } from "msw";

export const handlers = [
  rest.post("api/chat/ask", (_, res, ctx) => {
    return res(ctx.status(200), ctx.json({ answer: "hoi" }));
  }),
];
