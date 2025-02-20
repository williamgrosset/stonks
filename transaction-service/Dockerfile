FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

COPY prisma-client/ ./prisma-client/
COPY transaction-service/ ./transaction-service/

RUN pnpm install --frozen-lockfile --filter transaction-service... \
    && pnpm --filter prisma-client run generate \
    && pnpm --filter prisma-client run build \
    && pnpm --filter transaction-service run build \
    && pnpm prune --prod

EXPOSE 3001

CMD ["pnpm", "--filter", "transaction-service", "start"]
