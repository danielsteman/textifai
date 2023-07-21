FROM node:18.12.1-buster-slim AS builder

WORKDIR /app
COPY index.html ./
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY public/ public/
COPY src/ src/
RUN yarn install
RUN yarn build

FROM nginx:1.23.2-alpine
COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]