FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --ci --quiet
COPY . ./
CMD npm run dev