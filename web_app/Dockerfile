# node image
FROM node:21-alpine3.18
# Effectively is mkdir and cd
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
EXPOSE 8000
# CMD ["node", "index.js"]

