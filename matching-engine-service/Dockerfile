FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the monorepo configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy matching-engine-service into the image
COPY matching-engine-service/ ./matching-engine-service/

# Install all dependencies for the workspace
RUN pnpm install --frozen-lockfile

EXPOSE 3003

# Run the Fastify server
CMD ["sh", "-c", "pnpm --filter matching-engine-service run dev"]
