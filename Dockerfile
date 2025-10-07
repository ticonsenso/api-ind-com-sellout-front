# Etapa 1: Compilar el frontend con Node
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:1.28-alpine
WORKDIR /usr/share/nginx/html

# Copia el resultado de la compilación
COPY --from=build /app/dist .

# Reemplaza la configuración por defecto de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 5176 como lo espera tu service en Kubernetes
EXPOSE 5176

CMD ["nginx", "-g", "daemon off;"]