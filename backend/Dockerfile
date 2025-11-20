# --- Stage 1: Build & Prune Dependencies ---
FROM node:20-slim AS builder

RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Generate Prisma client first, then build TypeScript
RUN npx prisma generate && pnpm run build

# --- Stage 2: Production Runtime Environment ---
FROM node:20-slim AS production

RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
# Install production dependencies
RUN pnpm install --prod

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client in production stage (this creates node_modules/.prisma)
RUN npx prisma generate

EXPOSE 8080

CMD [ "node", "dist/src/server.js" ]