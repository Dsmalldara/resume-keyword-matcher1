# --- Stage 1: Build & Prune Dependencies ---
FROM node:20-slim AS builder

RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Generate Prisma client first (doesn't need env vars), then build TypeScript
RUN npx prisma generate && pnpm run build

# --- Stage 2: Production Runtime Environment ---
FROM node:20-slim AS production

RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 8080

CMD [ "node", "dist/src/server.js" ]