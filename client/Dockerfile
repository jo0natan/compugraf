FROM node:18
LABEL Por Jonatan Villela - jonatan.villela@gmail.com
RUN echo "Por Jonatan Villela - jonatan.villela@gmail.com"
WORKDIR /client

COPY package.json ./
COPY . .

RUN rm -rf node_modules && rm -rf dist
RUN npm install

RUN npm run build

EXPOSE 8000

CMD ["npx", "serve", "./dist -l 8080"]