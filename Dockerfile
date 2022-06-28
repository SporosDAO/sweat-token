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

WORKDIR /app/e2e-tests
# Install chrome dependencies in order to be able to run puppeteer
ADD ./e2e-tests/package.json ./
RUN apt-get update --fix-missing && \
    apt-get -y install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils && \
    yarn install

FROM deps as contracts

WORKDIR /app/contracts
ADD ./contracts/ .
RUN yarn build

FROM contracts as backend

WORKDIR /app/backend

ADD ./backend/ .
RUN yarn build

FROM backend as frontend

WORKDIR /app/frontend

ADD ./frontend/ .
RUN yarn build
