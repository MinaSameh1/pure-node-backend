FROM node:18-alpine3.14

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn --production

COPY . .

EXPOSE 8000

CMD [ "node", "src/index.js" ]


