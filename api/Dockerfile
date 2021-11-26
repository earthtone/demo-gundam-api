FROM node:latest

RUN yarn add global nodemon

USER node

RUN mkdir /home/node/code

WORKDIR /home/node/code

COPY --chown=node:node yarn.lock package.json ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

CMD ["node", "./index.js"]

