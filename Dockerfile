FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src/ ./src/
COPY bin.js ./

# Build the application
RUN npm run build

# Set environment variables (can be overridden at runtime)
ENV HOST=localhost
ENV PORT=8108
ENV PROTOCOL=http
ENV API_KEY=demo

# Expose port for health checks (though not needed for stdio communication)
EXPOSE 3333

# Run the MCP server
CMD ["node", "dist/index.js", "--host", "${HOST}", "--port", "${PORT}", "--protocol", "${PROTOCOL}", "--api-key", "${API_KEY}"] 