FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Les migrations sont idempotentes. Elles s'exécutent au démarrage une fois que
# PostgreSQL est déclaré sain par Docker Compose.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
