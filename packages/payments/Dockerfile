FROM node:18

ARG STRIPE_PUBLISHABLE_KEY
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET

ENV STRIPE_PUBLISHABLE_KEY $STRIPE_PUBLISHABLE_KEY
ENV STRIPE_SECRET_KEY $STRIPE_SECRET_KEY
ENV STRIPE_WEBHOOK_SECRET $STRIPE_WEBHOOK_SECRET

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

COPY packages/payments/package.json ./packages/payments/
COPY packages/shared ./packages/shared

RUN yarn install

COPY packages/payments ./packages/payments

RUN yarn workspace @textifai/payments add typescript tsc ts-node

RUN yarn workspace @textifai/payments build

EXPOSE $PORT

CMD yarn workspace @textifai/payments start