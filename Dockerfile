FROM node:lts-alpine3.16 as base

WORKDIR /app

COPY package.json ./

RUN yarn

COPY . .

RUN yarn build

COPY . .

EXPOSE 3333

CMD ["yarn", "start"]