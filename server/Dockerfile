FROM node:20

WORKDIR /app

RUN npm install -g typescript ts-node

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]