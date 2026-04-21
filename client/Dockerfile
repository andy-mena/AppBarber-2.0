FROM node:20

WORKDIR app

# Copiamos archivos de dependencias
COPY package*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Comando para desarrollo
CMD ["npm", "run", "dev"]