FROM node:14.4-alpine3.11 AS development

WORKDIR /usr/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

COPY . .

RUN npm run build

FROM node:14.4-alpine3.11 as production

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /usr/app/dist ./dist

CMD ["node", "dist/main.js"]