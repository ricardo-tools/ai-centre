#!/bin/bash
# Ensure Docker is running and the database container is healthy.
# Called by predev before migrations.

set -e

# Skip if DATABASE_URL points to a remote DB (not localhost)
if [ -n "$DATABASE_URL" ]; then
  case "$DATABASE_URL" in
    *localhost*|*127.0.0.1*) ;; # local — proceed
    *) exit 0 ;; # remote — skip Docker check
  esac
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "[ensure-docker] Docker is not installed."
  echo "  Install it from https://docs.docker.com/get-docker/"
  echo "  Or set DATABASE_URL to a remote database to skip Docker."
  exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null 2>&1; then
  echo "[ensure-docker] Docker daemon is not running. Starting Docker..."

  # macOS: try to start Docker Desktop
  if [ "$(uname)" = "Darwin" ]; then
    open -a Docker
    echo "[ensure-docker] Waiting for Docker to start..."
    for i in $(seq 1 30); do
      if docker info &> /dev/null 2>&1; then
        echo "[ensure-docker] Docker is ready."
        break
      fi
      sleep 2
    done

    if ! docker info &> /dev/null 2>&1; then
      echo "[ensure-docker] Docker failed to start after 60 seconds."
      exit 1
    fi
  else
    echo "[ensure-docker] Please start Docker manually and retry."
    exit 1
  fi
fi

# Check if the container is running
CONTAINER_NAME="ai-centre-db"
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "[ensure-docker] ${CONTAINER_NAME} is already running."
else
  echo "[ensure-docker] Starting containers with docker compose..."
  docker compose up -d

  # Wait for Postgres to be healthy
  echo "[ensure-docker] Waiting for Postgres to be healthy..."
  for i in $(seq 1 20); do
    if docker exec "$CONTAINER_NAME" pg_isready -U aicentre &> /dev/null 2>&1; then
      echo "[ensure-docker] Postgres is ready."
      exit 0
    fi
    sleep 1
  done

  echo "[ensure-docker] Postgres not ready after 20 seconds. Check docker compose logs."
  exit 1
fi
