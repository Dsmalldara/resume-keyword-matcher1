FROM node:20-alpine

WORKDIR /app/backend

COPY package.json pnpm-lock.yaml ./
COPY ../package.json ../pnpm-lock.yaml ../

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma:generate:prod && pnpm build

EXPOSE 4000

CMD ["pnpm", "start:prod"]
