FROM node:lts

WORKDIR /app

ADD ./backend/package.json ./
RUN yarn install
ADD ./backend/ .
RUN yarn build

CMD ["node", "dist/main"]