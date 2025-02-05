# Use Node.js base image
FROM node:18

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Set working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Expose Fastify's default port
EXPOSE 3000

# Generate Prisma client
RUN pnpm prisma generate

# Run database migrations before starting the server
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm dev"]
