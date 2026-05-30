FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Set working directory inside the container
WORKDIR /app

# Copy package configurations and lockfiles
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Copy configuration, testing suites, and POM files
COPY . .

# Run playwright tests by default
CMD ["npx", "playwright", "test"]
