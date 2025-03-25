FROM node:16.18-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    imagemagick \
    giflib-dev \
    librsvg-dev

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run prisma-generate && npm run build

#  Defines your runtime(define default command)
# These commands unlike RUN (they are carried out in the construction of the container) are run when the container
CMD ["npm", "run", "start:prod"]
