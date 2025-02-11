# Use an official Node image as the base
FROM node:18-alpine

# Set the working directory to the monorepo root
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the monorepo configuration files
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml* ./

# Copy the prisma package into the image
COPY prisma ./prisma

# Install all dependencies for the workspace
RUN pnpm install --frozen-lockfile

# Generate client
RUN pnpm --filter prisma run generate

# The DATABASE_URL is not available at build time, so we run db push at runtime
CMD ["sh", "-c", "pnpm --filter prisma run push"]
