FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

ENV PORT=8080

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY server.mjs ./server.mjs

EXPOSE 8080

CMD ["node", "server.mjs"]
