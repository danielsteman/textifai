FROM node:16 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16

ENV NODE_ENV production

USER node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/index.js" ]