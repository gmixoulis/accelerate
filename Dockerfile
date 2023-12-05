# ---- Build Stage ----
FROM node:slim AS build

WORKDIR /app

# Copies everything over to Docker environment
COPY . /app

# Install all node packages 
RUN npm install -g pnpm 

RUN pnpm install

RUN pnpm build

# Expose port 8080 to the Docker host, so we can access it from the outside.
EXPOSE 8080

CMD ["pnpm", "start"]
