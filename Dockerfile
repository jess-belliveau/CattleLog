FROM node:12-buster As builder
RUN yarn global add gatsby-cli
WORKDIR /app
ADD . ./
RUN yarn
RUN gatsby build

FROM nginxinc/nginx-unprivileged
COPY --from=builder /app/public /usr/share/nginx/html
