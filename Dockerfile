FROM mcr.microsoft.com/playwright:v1.54.2-jammy

# Set working dir
WORKDIR /app

# Copy package files & install deps
COPY package*.json ./

RUN npm install

# Copy tests
COPY . .

# Run tests by default
CMD ["npx", "playwright", "test"]