FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache nginx

WORKDIR /app

COPY --from=builder /app ./

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD sh -c "nginx && npm run start"
