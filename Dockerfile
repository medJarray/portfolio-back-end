FROM node:18-alpine AS base

# Install and configure dumb-init for signal handling
RUN apk add --no-cache dumb-init curl && \
  corepack enable && \
  addgroup --system --gid 1001 nestjs && \
  adduser --system --uid 1001 --ingroup nestjs nestjs

WORKDIR /app

# ==========================================
# Dependencies stage (cache Docker optimization)
# ==========================================
FROM base AS deps

# Copy only the necessary files for dependency installation
COPY package.json yarn.lock .yarnrc.yml* ./

# Copy Yarn Berry configuration
COPY .yarn ./.yarn

# Install ALL dependencies, including devDependencies with Yarn Berry
RUN yarn install --immutable --network-timeout 300000

# ==========================================
# Build stage
# ==========================================
FROM deps AS builder

# Copy source code
COPY . .

# Build and prepare production dependencies
RUN yarn build

# ===========================================
# Production dependencies stage
# ===========================================
FROM base AS prod-deps

# Copy only the necessary files for production dependency installation
COPY package.json yarn.lock .yarnrc.yml* ./
COPY .yarn ./.yarn

# Install ONLY production dependencies
RUN yarn workspaces focus --all --production && \
  yarn cache clean --all

# ==========================================
# Production (image finale)
# ==========================================
FROM base AS production

# Copy from prod-deps stage (only production node_modules)
COPY --from=prod-deps --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=prod-deps --chown=nestjs:nestjs /app/.yarn ./.yarn

# Copy built application from builder
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist

# Copy necessary config files
COPY --from=builder --chown=nestjs:nestjs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nestjs /app/.yarnrc.yml* ./

# Configuration
ENV NODE_ENV=production \
  NODE_OPTIONS="--enable-source-maps --max-old-space-size=1024"

USER nestjs
EXPOSE 3000

# Health check avec timeout plus court
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]