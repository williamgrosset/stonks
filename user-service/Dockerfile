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
EXPOSE 3001

# Start the Fastify server
CMD ["pnpm", "dev"]
