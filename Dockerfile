FROM node:20.11-alpine3.18 AS deps

WORKDIR /usr/src/ozone

RUN corepack enable

# Copy only package files for dependency installation
COPY package.json yarn.lock .yarnrc.yml ./

# Install all dependencies with cache mount
RUN --mount=type=cache,target=/root/.yarn,sharing=locked \
    --mount=type=cache,target=/usr/src/ozone/node_modules/.cache,sharing=locked \
    yarn install --frozen-lockfile

FROM node:20.11-alpine3.18 AS build

WORKDIR /usr/src/ozone

RUN corepack enable

# Accept build arguments for NEXT_PUBLIC environment variables
ARG NEXT_PUBLIC_PLC_DIRECTORY_URL=https://plc.directory
ARG NEXT_PUBLIC_HANDLE_RESOLVER_URL=https://api.bsky.app
ARG NEXT_PUBLIC_OZONE_SERVICE_DID
ARG NEXT_PUBLIC_OZONE_PUBLIC_URL

# Export as environment variables for Next.js build
ENV NEXT_PUBLIC_PLC_DIRECTORY_URL=${NEXT_PUBLIC_PLC_DIRECTORY_URL}
ENV NEXT_PUBLIC_HANDLE_RESOLVER_URL=${NEXT_PUBLIC_HANDLE_RESOLVER_URL}
ENV NEXT_PUBLIC_OZONE_SERVICE_DID=${NEXT_PUBLIC_OZONE_SERVICE_DID}
ENV NEXT_PUBLIC_OZONE_PUBLIC_URL=${NEXT_PUBLIC_OZONE_PUBLIC_URL}

# Copy dependencies from deps stage
COPY --from=deps /usr/src/ozone/node_modules ./node_modules
COPY --from=deps /usr/src/ozone/package.json ./package.json
COPY --from=deps /usr/src/ozone/yarn.lock ./yarn.lock
COPY --from=deps /usr/src/ozone/.yarnrc.yml ./.yarnrc.yml

# Copy source code
COPY . .

# Build the application
RUN --mount=type=cache,target=/usr/src/ozone/node_modules/.cache,sharing=locked \
    yarn build

# Clean up build artifacts and install production dependencies
RUN rm -rf node_modules .next/cache

# Install production dependencies for service
RUN mv service/package.json package.json && \
    mv service/yarn.lock yarn.lock

RUN --mount=type=cache,target=/root/.yarn,sharing=locked \
    yarn install --frozen-lockfile --production

# Final stage
FROM node:20.11-alpine3.18

RUN apk add --update dumb-init
ENV TZ=Etc/UTC

WORKDIR /usr/src/ozone

# Copy built application and production dependencies
COPY --from=build /usr/src/ozone /usr/src/ozone

RUN chown -R node:node .

ENTRYPOINT ["dumb-init", "--"]
EXPOSE 3000
ENV OZONE_PORT=3000
ENV NODE_ENV=production
USER node
CMD ["node", "./service"]

LABEL org.opencontainers.image.source=https://github.com/eurosky-social/ozone
LABEL org.opencontainers.image.description="Ozone Moderation Service Web UI (eurosky fork)"
LABEL org.opencontainers.image.licenses=MIT
