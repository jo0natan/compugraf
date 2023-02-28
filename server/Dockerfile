FROM node:18
LABEL Por Jonatan Villela - jonatan.villela@gmail.com

RUN echo "Por Jonatan Villela - jonatan.villela@gmail.com"

RUN npm install pm2 -g

WORKDIR /server
COPY package*.json ./

# Bundle app source
COPY . .
RUN rm -rf node_modules

RUN npm install

RUN echo -e "Aguarde 30 segundos para a inicialização do Container APP"
RUN echo -e "Aguarde 30 segundos para a inicialização do Container APP"
RUN echo -e "Aguarde 30 segundos para a inicialização do Container APP"
RUN echo -e "Aguarde 30 segundos para a inicialização do Container APP"
RUN echo -e "Aguarde 30 segundos para a inicialização do Container APP"

EXPOSE 8000