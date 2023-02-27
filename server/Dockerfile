FROM node:18
LABEL Por Jonatan Villela - jonatan.villela@gmail.com

RUN echo "Por Jonatan Villela - jonatan.villela@gmail.com"


WORKDIR /server
COPY package*.json ./

# Bundle app source
COPY . .
RUN rm -rf node_modules
RUN npm ci --only=production

RUN echo -e "Aguarde 20 segundos para a inicialização do Container APP"
RUN echo -e "Aguarde 20 segundos para a inicialização do Container APP"
RUN echo -e "Aguarde 20 segundos para a inicialização do Container APP"
RUN echo -e "Aguarde 20 segundos para a inicialização do Container APP"
RUN echo -e "Aguarde 20 segundos para a inicialização do Container APP"

EXPOSE 8000