#!/bin/bash

# Hangman Local Development Script
# This script runs both the API and frontend for local testing

# Get the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting Hangman local development environment..."
echo ""

# Check if API dependencies are installed
if [ ! -d "$SCRIPT_DIR/api/.venv" ]; then
	echo "Installing API dependencies..."
	cd "$SCRIPT_DIR/api" && uv sync
fi

# Check if NLTK data is downloaded
if [ ! -d "$SCRIPT_DIR/api/nltk_data" ]; then
	echo "Downloading NLTK data..."
	cd "$SCRIPT_DIR/api" && uv run python download_nltk_data.py
fi

# Check if frontend dependencies are installed
if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
	echo "Installing frontend dependencies..."
	cd "$SCRIPT_DIR/frontend" && npm install
fi

# Start API server in background
echo ""
echo "Starting API server on http://localhost:8000..."
cd "$SCRIPT_DIR/api" && uv run python local_server.py &
API_PID=$!

# Wait a moment for API to start
sleep 2

# Start frontend dev server
echo ""
echo "Starting frontend dev server on http://localhost:5173..."
echo ""
echo "================================================"
echo "  API:      http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo "  Press Ctrl+C to stop both servers"
echo "================================================"
echo ""

cd "$SCRIPT_DIR/frontend" && npm run dev

# When frontend stops (Ctrl+C), kill the API server
kill $API_PID 2>/dev/null
echo ""
echo "Stopped both servers."
