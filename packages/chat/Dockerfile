FROM node:18

ARG OPENAI_API_KEY

ENV OPENAI_API_KEY $OPENAI_API_KEY

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

COPY packages/chat/package.json ./packages/chat/
COPY packages/shared ./packages/shared

RUN yarn install

COPY packages/chat ./packages/chat

RUN yarn workspace @textifai/chat add typescript tsc ts-node

RUN yarn workspace @textifai/chat build

EXPOSE $PORT

CMD yarn workspace @textifai/chat start