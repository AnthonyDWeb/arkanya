# Context = racine du monorepo (Railway Root Directory = vide / ".")
FROM node:24-bookworm-slim

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/config ./packages/config
COPY packages/contracts ./packages/contracts
COPY services/worker ./services/worker
COPY templates ./templates
COPY features ./features

RUN pnpm install --frozen-lockfile --filter @arkanya/worker...
RUN pnpm --filter @arkanya/worker build

ENV NODE_ENV=production
ENV WORKER_MODE=remote

# Railway injecte PORT ; le process écoute 0.0.0.0 en mode remote
CMD ["node", "services/worker/dist/server.js"]
