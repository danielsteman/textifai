FROM node:18 AS builder

ARG FIREBASE_APIKEY
ARG FIREBASE_AUTHDOMAIN
ARG FIREBASE_PROJECTID
ARG FIREBASE_STORAGEBUCKET
ARG FIREBASE_MESSAGINGSENDERID
ARG FIREBASE_APPID

ENV VITE_FIREBASE_APIKEY $FIREBASE_APIKEY
ENV VITE_FIREBASE_AUTHDOMAIN $FIREBASE_AUTHDOMAIN
ENV VITE_FIREBASE_PROJECTID $FIREBASE_PROJECTID
ENV VITE_FIREBASE_STORAGEBUCKET $FIREBASE_STORAGEBUCKET
ENV VITE_FIREBASE_MESSAGINGSENDERID $FIREBASE_MESSAGINGSENDERID
ENV VITE_FIREBASE_APPID $FIREBASE_APPID

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

COPY packages/web/package.json ./packages/web/
COPY packages/shared ./packages/shared

COPY packages/web/tsconfig.json ./packages/web/

RUN yarn install

COPY packages/web ./packages/web

RUN yarn workspace @textifai/web build

FROM nginx:1.23.2-alpine
COPY packages/web/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/packages/web/dist /usr/share/nginx/html
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER nginx
EXPOSE $PORT
CMD ["nginx", "-g", "daemon off;"]