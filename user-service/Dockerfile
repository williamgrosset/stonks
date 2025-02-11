FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the monorepo configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy the prisma-client package and user-service into the image
COPY prisma-client/ ./prisma-client/
COPY user-service/ ./user-service/

# Install all dependencies for the workspace
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter prisma-client run generate

EXPOSE 3000

# Run the Fastify server
CMD ["sh", "-c", "pnpm --filter user-service run dev"]
