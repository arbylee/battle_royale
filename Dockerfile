FROM node:boron
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3001

COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

RUN npm run build

CMD ["npm", "run", "serve"]
