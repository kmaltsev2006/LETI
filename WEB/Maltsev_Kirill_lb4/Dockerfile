FROM node:18-slim

WORKDIR /home

COPY ./lab4.com ./

RUN npm install

WORKDIR /home/client
RUN npm install
RUN ./node_modules/.bin/ng build

WORKDIR /home
CMD ["node", "server.js"]