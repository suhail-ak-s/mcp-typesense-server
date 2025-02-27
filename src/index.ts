/**
 * Typesense MCP Server
 * A low-level server implementation using Model Context Protocol
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as TypesenseModule from 'typesense';

interface TypesenseCollection {
  name: string;
  num_documents?: number;
  [key: string]: any;
}

const logFile = path.join(os.tmpdir(), 'typesense-mcp.log');

fs.writeFileSync(logFile, `[INFO] ${new Date().toISOString()} - Starting Typesense MCP Server...\n`);


console.log = (...args) => {
  const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
  fs.appendFileSync(logFile, `[INFO] ${new Date().toISOString()} - ${message}\n`);
};

console.error = (...args) => {
  const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
  fs.appendFileSync(logFile, `[ERROR] ${new Date().toISOString()} - ${message}\n`);
};

const logger = {
  log: (message: string) => {
    fs.appendFileSync(logFile, `[INFO] ${new Date().toISOString()} - ${message}\n`);
  },
  error: (message: string, error?: any) => {
    fs.appendFileSync(logFile, `[ERROR] ${new Date().toISOString()} - ${message}\n`);
    if (error) {
      fs.appendFileSync(logFile, `${error.stack || error}\n`);
    }
  }
};

type TypesenseConfig = {
  host: string;
  port: number;
  protocol: 'http' | 'https';
  apiKey: string;
};

let typesenseConfig: TypesenseConfig;
let typesenseClient: TypesenseModule.Client;

function initTypesenseClient(config: TypesenseConfig): TypesenseModule.Client {
  return new TypesenseModule.Client({
    nodes: [
      {
        host: config.host,
        port: config.port,
        protocol: config.protocol
      }
    ],
    apiKey: config.apiKey,
    connectionTimeoutSeconds: 5
  });
}

function parseArgs(): TypesenseConfig {
  const args = process.argv.slice(2);
  const config: Partial<TypesenseConfig> = {
    host: 'localhost',
    port: 8108,
    protocol: 'http',
    apiKey: ''
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--host' && i + 1 < args.length) {
      config.host = args[++i];
    } else if (arg === '--port' && i + 1 < args.length) {
      config.port = parseInt(args[++i], 10);
    } else if (arg === '--protocol' && i + 1 < args.length) {
      const protocol = args[++i];
      if (protocol === 'http' || protocol === 'https') {
        config.protocol = protocol;
      }
    } else if (arg === '--api-key' && i + 1 < args.length) {
      config.apiKey = args[++i];
    }
  }

  if (!config.apiKey) {
    throw new Error('Typesense API key is required. Use --api-key argument.');
  }

  return config as TypesenseConfig;
}

const server = new Server(
  {
    name: "typesense-mcp-server",
    version: "1.0.0"
  },
  {
    capabilities: {
      resources: {}
    }
  }
);

async function fetchTypesenseCollections(): Promise<TypesenseCollection[]> {
  try {
    logger.log('Fetching collections from Typesense...');
    const collections = await typesenseClient.collections().retrieve();
    logger.log(`Found ${collections.length} collections`);
    return collections as TypesenseCollection[];
  } catch (error) {
    logger.error('Error fetching collections from Typesense:', error);
    throw error;
  }
}

// Set up the resource listing request handler
server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
  logger.log('Received list resources request: ' + JSON.stringify(request));
  
  logger.log(`Connecting to Typesense at ${typesenseConfig.protocol}://${typesenseConfig.host}:${typesenseConfig.port}`);
  
  try {
    const collections = await fetchTypesenseCollections();
    
    if (collections.length === 0) {
      logger.log('No collections found in Typesense');
      throw new Error('No collections found in Typesense');
    }
    
    const resources = collections.map((collection: TypesenseCollection) => ({
      uri: new URL(`typesense://collections/${collection.name}`),
      name: collection.name,
      description: `Collection with ${collection.num_documents || 0} documents`
    }));
    
    logger.log(`Returning ${resources.length} collections as resources`);
    return { resources };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error handling list resources request:', error);
    throw new Error(`Typesense error: ${errorMessage}`);
  }
});

/**
 * Main function to initialize and run the MCP server
 */
async function main() {
  try {
    typesenseConfig = parseArgs();
    logger.log('Typesense configuration: ' + JSON.stringify(typesenseConfig));
    
    typesenseClient = initTypesenseClient(typesenseConfig);
    logger.log('Typesense client initialized');
    
    try {
      const health = await typesenseClient.health.retrieve();
      logger.log('Typesense connection test successful: ' + JSON.stringify(health));
    } catch (error) {
      logger.error('Typesense connection test failed:', error);
    }

    logger.log('Connecting to stdio transport...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    logger.log('MCP server connected and ready');
    
  } catch (error) {
    logger.error('Error running MCP server:', error);
    process.exit(1);
  }
}

main().catch(err => logger.error('Unhandled error:', err)); 