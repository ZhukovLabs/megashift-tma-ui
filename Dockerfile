FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache nginx

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD sh -c "nginx && npm run start"