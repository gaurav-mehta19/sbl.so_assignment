FROM node:20-alpine

# Install Chromium and dependencies for Playwright
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Playwright and its browsers
RUN npx playwright install --with-deps chromium || true

# Tell Playwright to use the system Chromium as fallback
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy application files
COPY . .

# Expose port
EXPOSE 3001

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "dev"]
