FROM node:19

WORKDIR /usr/src/app/front
COPY ./vue .
RUN npm install; npm run build
CMD npm run start
