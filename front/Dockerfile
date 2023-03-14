FROM node:lts

WORKDIR app

RUN apt-get update && apt-get upgrade -y
RUN yarn global add @vue/cli

ENTRYPOINT ["/bin/sh", "-c", "yarn install --non-interactive && exec yarn serve"]