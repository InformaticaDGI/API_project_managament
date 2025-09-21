

FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN yarn --frozen-lockfile

COPY --chown=node:node . .

USER node


FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV=production

RUN yarn --frozen-lockfile --only=production

USER node

FROM node:18-alpine AS production

RUN apk --no-cache add curl

HEALTHCHECK --interval=5s --timeout=10s --start-period=45s CMD curl -f --retry 6 --max-time 5 --retry-delay 10 --retry-max-time 60 "http://localhost:4200/api/healthcheck" || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
