FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

COPY matching-engine-service/ ./matching-engine-service/

RUN pnpm install --frozen-lockfile --filter matching-engine-service \
    && pnpm --filter matching-engine-service run build \
    && pnpm prune --prod

EXPOSE 3003

CMD ["pnpm", "--filter", "matching-engine-service", "start"]
