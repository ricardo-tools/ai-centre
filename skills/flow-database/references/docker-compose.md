---
name: flow-database-docker-compose
type: reference
companion_to: flow-database
description: Docker Compose service template for local libsql-server (SQLite). Add to project's docker-compose.yml.
---

# Docker Compose — libsql-server

Add this service to the project's `docker-compose.yml`. If the file doesn't exist, create it. If it already exists (e.g. for Mailpit), add the `libsql` service alongside.

```yaml
services:
  libsql:
    image: ghcr.io/tursodatabase/libsql-server:latest
    container_name: ${COMPOSE_PROJECT_NAME:-app}-db
    ports:
      - '8080:8080'
    volumes:
      - dbdata:/var/lib/sqld
    environment:
      SQLD_NODE: primary
    restart: unless-stopped

volumes:
  dbdata:
```

Port 8080 serves the HTTP API that `@libsql/client` connects to.

Add to `.gitignore`:

```
# Docker volumes are not committed — data is ephemeral in dev
```
