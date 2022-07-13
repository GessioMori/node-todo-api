FROM node:lts-alpine3.16 as base

WORKDIR /app

FROM base AS development
COPY package.json yarn.lock ./

# first set aside prod dependencies so we can copy in to the prod image
RUN yarn install --pure-lockfile --production
RUN cp -R node_modules /tmp/node_modules

# install all dependencies and add source code
RUN yarn install --pure-lockfile
COPY . .

# builder runs unit tests and linter, then builds production code 
FROM development as builder
RUN yarn build

# release includes bare minimum required to run the app, copied from builder
FROM base AS release
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
CMD ["yarn", "start"]