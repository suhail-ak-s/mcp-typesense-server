# Typesense MCP Server
---
[![npm version](https://badge.fury.io/js/typesense-mcp-server.svg)](https://badge.fury.io/js/typesense-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/typesense-mcp-server)](https://nodejs.org/)

A [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/mcp) server implementation that provides AI models with access to [Typesense](https://typesense.org/) search capabilities. This server enables LLMs to discover, search, and analyze data stored in Typesense collections.

## Demo

[![Typesense MCP Server Demo | Claude Desktop](https://img.youtube.com/vi/your-video-id/0.jpg)](https://www.youtube.com/watch?v=your-video-id)

## Features

### Resources
- List and access collections via `typesense://` URIs
- Each collection has a name, description, and document count
- JSON mime type for schema access

### Tools
- **typesense_query**
  - Search for documents in Typesense collections with powerful filtering
  - Input: Query text, collection name, search fields, filters, sort options, limit
  - Returns matching documents with relevance scores

- **typesense_get_document**
  - Retrieve specific documents by ID from collections
  - Input: Collection name, document ID
  - Returns complete document data

- **typesense_collection_stats**
  - Get statistics about a Typesense collection
  - Input: Collection name
  - Returns collection metadata, document count, and schema information

### Prompts
- **analyze_collection**
  - Analyze collection structure and contents
  - Input: Collection name
  - Output: Insights about schema, data types, and statistics

- **search_suggestions**
  - Get suggestions for effective search queries for a collection
  - Input: Collection name
  - Output: Recommended search strategies based on collection schema

## Installation

### Via npm

```bash
# Global installation
npm install -g typesense-mcp-server

# Local installation
npm install typesense-mcp-server
```

### Via mcp-get

```bash
npx @michaellatman/mcp-get@latest install typesense-mcp-server
```

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation for Development

### Using Claude Desktop

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "typesense": {
      "command": "node",
      "args": [
        "~/typesense-mcp-server/dist/index.js",
        "--host", "your-typesense-host",
        "--port", "8108",
        "--protocol", "http",
        "--api-key", "your-api-key"
      ]
    },
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## Components

### Resources

The server provides information about Typesense collections:

- **Collection Schemas** (`typesense://collections/<collection>`)
  - JSON schema information for each collection
  - Includes field names and data types
  - Sample documents for understanding data structure

### Resource Templates

The server provides templates for:

- **typesense_search** - Template for constructing Typesense search queries
- **typesense_collection** - Template for viewing Typesense collection details

## Usage with Claude Desktop

To use this server with the Claude Desktop app, add the following configuration to the "mcpServers" section of your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "typesense": {
      "command": "npx",
      "args": [
        "-y",
        "typesense-mcp-server",
        "--host", "your-typesense-host",
        "--port", "8108",
        "--protocol", "http",
        "--api-key", "your-api-key"
      ]
    }
  }
}
```

## Logging

The server logs information to a file located at:
```
/tmp/typesense-mcp.log
```

This log contains detailed information about server operations, requests, and any errors that occur.

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository. 