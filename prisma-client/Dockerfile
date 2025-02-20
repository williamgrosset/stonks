FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./

COPY prisma-client/ ./prisma-client/

RUN pnpm install --frozen-lockfile --filter prisma-client \
    && pnpm --filter prisma-client run generate \
    && pnpm --filter prisma-client run build

CMD ["sh", "-c", "pnpm --filter prisma-client run push"]
