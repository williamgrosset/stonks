FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

COPY app/ ./app/

RUN pnpm install --frozen-lockfile --filter app \
    && pnpm --filter app run build \
    && pnpm prune --prod

EXPOSE 8080

CMD ["pnpm", "--filter", "app", "start"]
