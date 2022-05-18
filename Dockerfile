FROM node:lts as deps

WORKDIR /app/contracts
ADD ./contracts/package.json ./
RUN yarn install

WORKDIR /app/backend
ADD ./backend/package.json ./
RUN yarn install

WORKDIR /app/frontend
ADD ./frontend/package.json ./
RUN yarn install

FROM deps as contracts

WORKDIR /app/contracts
ADD ./contracts/ .
# RUN yarn build

FROM contracts as backend

WORKDIR /app/backend

ADD ./backend/ .
RUN yarn build

FROM backend as frontend

WORKDIR /app/frontend

ADD ./frontend/ .
RUN yarn build

