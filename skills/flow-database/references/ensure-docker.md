---
name: flow-database-ensure-docker
type: reference
companion_to: flow-database
description: Shell script that auto-starts Docker and the database container. Called by predev before migrations.
---

# Ensure Docker Script

Copy to `scripts/ensure-docker.sh` and make executable (`chmod +x scripts/ensure-docker.sh`).

```bash
#!/bin/bash
set -e

# Skip if DATABASE_URL is a remote Turso URL (not local)
if [ -n "$DATABASE_URL" ]; then
  case "$DATABASE_URL" in
    *localhost*|*127.0.0.1*|file:*) ;; # local — proceed
    libsql://*|https://*) exit 0 ;;     # remote — skip Docker
  esac
fi

# Check Docker is installed
if ! command -v docker &> /dev/null; then
  echo "[ensure-docker] Docker is not installed."
  echo "  Install: https://docs.docker.com/get-docker/"
  exit 1
fi

# Check Docker daemon is running
if ! docker info &> /dev/null 2>&1; then
  echo "[ensure-docker] Starting Docker..."
  if [ "$(uname)" = "Darwin" ]; then
    open -a Docker
    for i in $(seq 1 30); do
      docker info &> /dev/null 2>&1 && break
      sleep 2
    done
  fi
  if ! docker info &> /dev/null 2>&1; then
    echo "[ensure-docker] Docker failed to start after 60 seconds."
    exit 1
  fi
fi

# Start containers if DB is not running
CONTAINER=$(docker compose ps --format '{{.Names}}' 2>/dev/null | grep -m1 db || true)
if [ -z "$CONTAINER" ]; then
  echo "[ensure-docker] Starting containers..."
  docker compose up -d
  echo "[ensure-docker] Waiting for database..."
  sleep 3
fi

echo "[ensure-docker] Database ready."
```
