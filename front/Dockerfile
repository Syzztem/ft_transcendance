FROM node:lts

WORKDIR /app

RUN apt-get update
RUN npm -g add @vue/cli

ENTRYPOINT ["/bin/sh", "-c", "npm i -g npm@latest && exec npm run prod"]