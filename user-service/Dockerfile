FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the monorepo configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy the shared prisma package and user-service into the image
COPY shared/prisma/ ./shared/prisma/
COPY user-service/ ./user-service/

# Install all dependencies for the workspace
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter @shared/prisma run generate

EXPOSE 3000

# Run the Fastify server
CMD ["sh", "-c", "pnpm --filter user-service run dev"]
