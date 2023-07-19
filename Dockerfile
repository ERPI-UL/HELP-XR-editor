# build du site
FROM node:lts-alpine as build-site-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL $VITE_API_URL
RUN npm run build

# build de la doc
FROM squidfunk/mkdocs-material as build-doc-stage
WORKDIR /app
COPY docs/mkdocs.yml .
COPY docs/requirements.txt .
COPY docs/src src
RUN pip install -r requirements.txt
RUN mkdocs build

# étape de production
FROM nginx:stable-alpine as production-stage
COPY --from=build-site-stage /app/dist /usr/share/nginx/html
COPY --from=build-doc-stage /app/site /usr/share/nginx/html/doc
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
