FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the monorepo configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy the prisma-client package and order-service into the image
COPY prisma-client/ ./prisma-client/
COPY order-service/ ./order-service/

# Install all dependencies
RUN pnpm install --frozen-lockfile \
    && pnpm --filter prisma-client run generate \
    && pnpm --filter order-service run build \
    && pnpm prune --prod

EXPOSE 3002

# Run the Fastify server
CMD ["pnpm", "--filter", "order-service", "start"]
