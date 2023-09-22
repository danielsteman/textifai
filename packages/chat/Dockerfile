FROM node:18

ARG OPENAI_API_KEY

ENV OPENAI_API_KEY $OPENAI_API_KEY

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3001

CMD yarn start