# Typesense MCP Server

A Model Context Protocol (MCP) server for integrating Typesense with Claude Desktop.

## Overview

This server allows Claude Desktop to connect to Typesense search engine instances, enabling Claude to access and search through your Typesense collections.

## Features

- Connects to any Typesense instance (local or remote)
- Lists all collections as resources in Claude
- Strict error handling - fails explicitly when no collections are found or connection issues occur
- Detailed logging for troubleshooting

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/typesense-mcp-server.git
   cd typesense-mcp-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

## Usage

### Launching Claude with Typesense

The easiest way to use this server is with the included launch script:

```bash
./launch-claude-with-typesense.sh [options]
```

Options:
- `--api-key KEY`: Set Typesense API key (default: demo)
- `--host HOST`: Set Typesense host (default: localhost)
- `--port PORT`: Set Typesense port (default: 8108)
- `--protocol PROTO`: Set Typesense protocol (http/https) (default: http)
- `--view-logs`: View MCP server logs after launching Claude
- `--help`: Display help message

Example:
```bash
./launch-claude-with-typesense.sh --api-key your_api_key --host typesense.example.com --port 443 --protocol https
```

### Manual Configuration

If you prefer to configure Claude manually:

1. Build the project:
   ```
   npm run build
   ```

2. Add the server to Claude's configuration:
   ```bash
   node -e "
   const fs = require('fs');
   const path = require('path');
   const configPath = path.join(process.env.HOME, 'Library/Application Support/Claude/claude_desktop_config.json');
   const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
   
   if (!config.mcpServers) config.mcpServers = {};
   
   config.mcpServers['typesense-mcp'] = {
     command: 'node',
     args: [
       '$(pwd)/dist/index.js',
       '--api-key', '\${TYPESENSE_API_KEY:-demo}',
       '--host', '\${TYPESENSE_HOST:-localhost}',
       '--port', '\${TYPESENSE_PORT:-8108}',
       '--protocol', '\${TYPESENSE_PROTOCOL:-http}'
     ]
   };
   
   fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
   console.log('Configuration updated successfully!');
   "
   ```

3. Launch Claude Desktop and select "typesense-mcp" from the MCP server dropdown.

## Typesense Configuration

### Setting Up Typesense

If you don't have a Typesense instance yet, you can:

1. Install Typesense locally: [Typesense Installation Guide](https://typesense.org/docs/guide/install-typesense.html)
2. Use Typesense Cloud: [Typesense Cloud](https://cloud.typesense.org/)
3. Run Typesense with Docker:
   ```bash
   docker run -p 8108:8108 -v /tmp/typesense-data:/data typesense/typesense:0.24.1 --data-dir /data --api-key=your-api-key
   ```

### Creating Collections

To create a collection in Typesense:

```bash
curl -X POST "http://localhost:8108/collections" \
     -H "X-TYPESENSE-API-KEY: your-api-key" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "products",
       "fields": [
         {"name": "name", "type": "string"},
         {"name": "description", "type": "string"},
         {"name": "price", "type": "float"}
       ]
     }'
```

## Troubleshooting

If you encounter issues with the MCP server:

1. Check the logs:
   ```bash
   cat /tmp/typesense-mcp.log
   ```

2. Make sure your Typesense instance is accessible from your machine:
   ```bash
   curl http://your-typesense-host:port/health -H "X-TYPESENSE-API-KEY: your-api-key"
   ```

3. Verify that the API key has appropriate permissions.

4. Ensure you have at least one collection in your Typesense instance:
   ```bash
   curl http://your-typesense-host:port/collections -H "X-TYPESENSE-API-KEY: your-api-key"
   ```

5. If you see "not valid JSON" errors in Claude logs, make sure you're using the latest version of this server which properly redirects logs to a file.

6. Common error messages:
   - "No collections found in Typesense": Create at least one collection in your Typesense instance
   - "Typesense error: Connection refused": Check that Typesense is running and accessible
   - "Typesense error: Invalid API key": Verify your API key is correct

## Development

To modify the server:

1. Edit the source files in the `src` directory.
2. Rebuild the project:
   ```
   npm run build
   ```
3. Test your changes by launching Claude with the updated server.

## License

MIT 