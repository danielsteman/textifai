FROM node:18.12.1-buster-slim AS builder

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

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY index.html ./

COPY tsconfig.json ./

COPY tsconfig.node.json ./

COPY public/ public/

COPY src/ src/

RUN yarn build

FROM nginx:1.23.2-alpine
COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]