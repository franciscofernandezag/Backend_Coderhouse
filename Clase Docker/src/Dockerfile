FROM  node

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY . . 

EXPOSE 8080

CMD ["npm","start"]

# Comando para construir docker 
# docker build -t dockeroperationcoder .

# Comando para Arracar el condenedor
#docker run -p 8080:8080 dockeroperationcoder