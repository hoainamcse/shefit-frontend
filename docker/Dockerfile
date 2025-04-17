# syntax=docker/dockerfile:1.4
FROM alpine:3.18 as certificates
ARG TAG
ARG BOT_PRIVATE_TOKEN
RUN apk --no-cache add curl
RUN curl --header "PRIVATE-TOKEN: ${BOT_PRIVATE_TOKEN}" "https://gitlab.rockship.co/api/v4/projects/16/repository/files/frontend%2Fshefit%2F${TAG}%2F.env/raw?ref=master" > .env

FROM node:18-alpine AS build
WORKDIR /app

ENV NODE_ENV production

COPY ./public ./public
COPY ./.next/standalone ./
COPY ./.next/static ./.next/static
COPY --from=certificates ./.env .

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
