FROM node:lts-alpine3.16 as base

WORKDIR /app

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 3333

CMD ["sh", "-c", "yarn build && yarn start"]