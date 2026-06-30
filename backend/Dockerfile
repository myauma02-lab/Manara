FROM node:20-bookworm

WORKDIR /app

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8080

CMD ["npm","start"]