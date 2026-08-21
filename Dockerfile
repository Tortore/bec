FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Les variables NEXT_PUBLIC_* sont intégrées dans le JavaScript navigateur à la
# compilation. Docker Compose les fournit donc aussi comme arguments de build.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Les migrations sont idempotentes. Elles s'exécutent au démarrage une fois que
# PostgreSQL est déclaré sain par Docker Compose.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
