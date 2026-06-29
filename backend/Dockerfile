FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install SEMUA dependency termasuk devDependencies
RUN npm ci

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]