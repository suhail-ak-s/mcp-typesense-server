#!/bin/bash

# Default values
TYPESENSE_API_KEY=${TYPESENSE_API_KEY:-demo}
TYPESENSE_HOST=${TYPESENSE_HOST:-localhost}
TYPESENSE_PORT=${TYPESENSE_PORT:-8108}
TYPESENSE_PROTOCOL=${TYPESENSE_PROTOCOL:-http}
VIEW_LOGS=false

# Function to display usage information
show_usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  --api-key KEY      Set Typesense API key (default: demo)"
  echo "  --host HOST        Set Typesense host (default: localhost)"
  echo "  --port PORT        Set Typesense port (default: 8108)"
  echo "  --protocol PROTO   Set Typesense protocol (http/https) (default: http)"
  echo "  --view-logs        View MCP server logs after launching Claude"
  echo "  --help             Display this help message"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --api-key)
      TYPESENSE_API_KEY="$2"
      shift 2
      ;;
    --host)
      TYPESENSE_HOST="$2"
      shift 2
      ;;
    --port)
      TYPESENSE_PORT="$2"
      shift 2
      ;;
    --protocol)
      TYPESENSE_PROTOCOL="$2"
      shift 2
      ;;
    --view-logs)
      VIEW_LOGS=true
      shift
      ;;
    --help)
      show_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_usage
      exit 1
      ;;
  esac
done

# Clear any existing log file to start fresh
LOG_FILE="/tmp/typesense-mcp.log"
if [ -f "$LOG_FILE" ]; then
  rm "$LOG_FILE"
fi

# Export environment variables
export TYPESENSE_API_KEY
export TYPESENSE_HOST
export TYPESENSE_PORT
export TYPESENSE_PROTOCOL

echo "Launching Claude with Typesense settings:"
echo "API Key: $TYPESENSE_API_KEY"
echo "Host: $TYPESENSE_HOST"
echo "Port: $TYPESENSE_PORT"
echo "Protocol: $TYPESENSE_PROTOCOL"

# Launch Claude (adjust the path if needed)
open -a "Claude"

# If --view-logs option was specified, tail the log file
if [ "$VIEW_LOGS" = true ]; then
  echo "Waiting for log file to be created..."
  
  # Wait for log file to be created (up to 10 seconds)
  for i in {1..20}; do
    if [ -f "$LOG_FILE" ]; then
      break
    fi
    sleep 0.5
    echo -n "."
  done
  
  if [ -f "$LOG_FILE" ]; then
    echo -e "\nViewing logs (press Ctrl+C to stop):"
    tail -f "$LOG_FILE"
  else
    echo -e "\nLog file not found at $LOG_FILE after waiting"
    echo "The MCP server may not have started yet."
  fi
fi 