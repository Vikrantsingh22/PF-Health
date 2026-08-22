# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:24-bookworm-slim@sha256:3638d9a6fe4030bd716be989438248074489337ba3275657f93595428be4fc03

FROM ${NODE_IMAGE} AS base
ENV NEXT_TELEMETRY_DISABLED=1 \
    NPM_CONFIG_CACHE=/home/node/.npm
WORKDIR /workspace
RUN mkdir -p /workspace/node_modules /workspace/.next \
    && chown -R node:node /workspace

FROM base AS development
USER node
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

FROM base AS dependencies
COPY --chown=node:node package.json package-lock.json ./
USER node
RUN npm ci

FROM base AS builder
COPY --from=dependencies --chown=node:node /workspace/node_modules ./node_modules
COPY --chown=node:node . .
USER node
RUN npm run build

FROM ${NODE_IMAGE} AS production
ENV HOME=/home/node \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN chown node:node /app
USER node
COPY --from=builder --chown=node:node /workspace/public ./public
COPY --from=builder --chown=node:node /workspace/.next/standalone ./
COPY --from=builder --chown=node:node /workspace/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
