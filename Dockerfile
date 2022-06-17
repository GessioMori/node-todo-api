FROM node:16

WORKDIR /usr/src/app

COPY package.json ./

# For development:
RUN npm install

# For production:
# RUN npm ci --only=production

COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]