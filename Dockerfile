FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=prod
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
COPY --from=builder /app/build ./build
# ENTRYPOINT ["sh", "-c", "node", "/app/build/index.js"]
