FROM node:22.15.1

WORKDIR /app

# Install deps first so this layer is cached unless package.json / lockfile changes.
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN corepack enable && yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "vite", "--host", "0.0.0.0"]
