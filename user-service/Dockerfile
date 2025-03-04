FROM node:18-alpine

WORKDIR /app

# Install build tools needed for bcrypt module
RUN apk add --no-cache python3 make g++

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

COPY prisma-client/ ./prisma-client/
COPY user-service/ ./user-service/

RUN pnpm install --frozen-lockfile --filter user-service... \
    && pnpm --filter prisma-client run generate \
    && pnpm --filter prisma-client run build \
    && pnpm --filter user-service run build \
    && pnpm prune --prod

EXPOSE 3000

CMD ["pnpm", "--filter", "user-service", "start"]
