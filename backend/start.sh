#!/bin/bash

echo "Starting THOR Backend..."
echo "PORT: $PORT"
echo "MONGODB_URI: ${MONGODB_URI:0:20}..."

# Wait a moment for any network initialization
sleep 2

# Start the application
exec python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --log-level debug
