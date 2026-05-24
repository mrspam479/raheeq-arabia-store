# Multi-stage build for Next.js 15 standalone output

FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args — all NEXT_PUBLIC_ vars must be declared here to be baked into the bundle
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_ENABLE_PIXELS
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID
ARG NEXT_PUBLIC_SNAP_PIXEL_ID

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_ENABLE_PIXELS=${NEXT_PUBLIC_ENABLE_PIXELS}
ENV NEXT_PUBLIC_META_PIXEL_ID=${NEXT_PUBLIC_META_PIXEL_ID}
ENV NEXT_PUBLIC_TIKTOK_PIXEL_ID=${NEXT_PUBLIC_TIKTOK_PIXEL_ID}
ENV NEXT_PUBLIC_SNAP_PIXEL_ID=${NEXT_PUBLIC_SNAP_PIXEL_ID}

RUN npm run build

# Production image — copy only the necessary files
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Leverage output traces to reduce image size
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
