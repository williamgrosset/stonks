FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the monorepo configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy the prisma package and transaction-service into the image
COPY prisma/ ./prisma/
COPY transaction-service/ ./transaction-service/

# Install all dependencies for the workspace
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter prisma run generate

EXPOSE 3001

# Run the Fastify server
CMD ["sh", "-c", "pnpm --filter transaction-service run dev"]
