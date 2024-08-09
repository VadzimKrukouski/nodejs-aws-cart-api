FROM node:18-alpine as base
WORKDIR /app

FROM base AS dependencies
COPY package*.json ./
RUN npm install && npm cache clean --force

FROM dependencies AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM node:18-alpine as final
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
RUN npm prune --production && npm cache clean --force

CMD ["node", "dist/main.js"]

EXPOSE 3000