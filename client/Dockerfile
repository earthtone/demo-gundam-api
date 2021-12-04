FROM node:latest

WORKDIR /app

# USER node

# RUN mkdir /home/node/code

# WORKDIR /home/node/code

# COPY --chown=node:node yarn.lock package.json ./

COPY  . .
RUN yarn install --frozen-lockfile && yarn build

# COPY --chown=node:node . .

FROM nginx:latest
COPY --from=0 /app/dist /usr/share/nginx/html
