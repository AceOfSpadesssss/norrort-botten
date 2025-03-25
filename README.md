# Guilda Bot (Free Version)

A Discord bot built with Oceanic.js and Prisma.

## Features:
* Bot Customizer
* Advanced Logs
* Welcome Module
* Application Modules
* Self Role Module
* Role Request Module
* Birthdays Module
* Sigestions Module
* Giveaway Module
* Polls Module
  
## Prerequisites

- Node.js v16.x (this project uses older dependencies that work best with Node 16)
- MySQL database
- Docker (optional, for containerized deployment)

## Traditional Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/slothybot-free.git
cd slothybot-free
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
TOKEN="your-discord-bot-token"
ACTIVITY_NAME="Testing"
ACTIVITY_TYPE=0
PRODUCTION=0
BOT_DATABASE_URL="mysql://username:password@localhost:3306/your_database"
TEST_GUILD_ID=""
```

4. Set up the database:
```bash
npm run ready
```

5. Start the bot:
```bash
# Development mode
npm start

# Production mode
npm run build
npm run start:prod
```

## Docker Setup

1. Clone the repository and navigate to its directory.

2. Create a `.env` file as described above.

3. Build and run using Docker:
```bash
# Build the image
docker build -t slothybot .

# Run the container
docker run -d --env-file .env slothybot
```

## Environment Variables

- `TOKEN`: Your Discord bot token
- `ACTIVITY_NAME`: Bot's activity status text
- `ACTIVITY_TYPE`: Activity type (0 = Playing, 1 = Streaming, etc.)
- `PRODUCTION`: Production mode flag (0 = development, 1 = production)
- `BOT_DATABASE_URL`: MySQL database connection URL
- `TEST_GUILD_ID`: Discord server ID for testing commands in development mode

## Important Notes

- This project uses older dependencies and is specifically tested with Node.js v16.x
- Required system dependencies for image processing:
  - build-base
  - g++
  - cairo-dev
  - jpeg-dev
  - pango-dev
  - imagemagick
  - giflib-dev
  - librsvg-dev

## Database Migrations

To update the database schema:
```bash
npm run prisma-migrate
```

To regenerate the Prisma client:
```bash
npm run prisma-generate
```

