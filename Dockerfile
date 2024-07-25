# Etapa 1: Construcción
FROM node:14 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación para producción
RUN npm run build --prod

# Etapa 2: Servir la aplicación
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa de construcción
COPY --from=build /app/dist/nombre-de-tu-app /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 8080

# Comando para iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
