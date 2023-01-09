FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src src
RUN npm run build

FROM node:18-alpine
RUN npm install --global bunyan
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
COPY --from=builder /app/dist dist
CMD [ "node", "dist/main.js" ]