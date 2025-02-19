FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml* ./

COPY prisma-client/ ./prisma-client/

RUN pnpm install --frozen-lockfile --filter prisma-client

RUN pnpm --filter prisma-client run generate

CMD ["sh", "-c", "pnpm --filter prisma-client run push"]
