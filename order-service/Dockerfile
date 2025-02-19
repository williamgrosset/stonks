FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

COPY prisma-client/ ./prisma-client/
COPY order-service/ ./order-service/

RUN pnpm install --frozen-lockfile --filter order-service... \
    && pnpm --filter prisma-client run generate \
    && pnpm --filter order-service run build \
    && pnpm prune --prod

EXPOSE 3002

CMD ["pnpm", "--filter", "order-service", "start"]
