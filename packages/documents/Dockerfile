FROM node:18

ARG PINECONE_API_KEY
ARG PINECONE_ENV
ARG PINECONE_INDEX
ARG OPENAI_API_KEY

ENV PINECONE_API_KEY $PINECONE_API_KEY
ENV PINECONE_ENV $PINECONE_ENV
ENV PINECONE_INDEX $PINECONE_INDEX
ENV OPENAI_API_KEY=$OPENAI_API_KEY

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

COPY packages/documents/package.json ./packages/documents/
COPY packages/shared ./packages/shared

RUN yarn install

COPY packages/documents ./packages/documents

RUN yarn workspace @textifai/documents add typescript tsc ts-node

RUN yarn workspace @textifai/documents build

EXPOSE $PORT

CMD yarn workspace @textifai/documents start