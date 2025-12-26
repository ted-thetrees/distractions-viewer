# Deployment Guide

This document covers deploying the Distractions Viewer to DigitalOcean.

## Prerequisites

- SSH access to a DigitalOcean droplet
- Docker installed on the droplet
- Caddy configured for HTTPS reverse proxy
- Cloudflare DNS access

## Option 1: Docker Deployment (Recommended)

### Step 1: Clone the repository on the droplet

```bash
ssh root@142.93.25.24
cd /opt
git clone https://github.com/ted-thetrees/distractions-viewer.git
cd distractions-viewer
```

### Step 2: Create environment file

```bash
cp .env.example .env
nano .env
```

Add your actual tokens:
```
CODA_API_TOKEN=your-actual-coda-token
ANTHROPIC_API_KEY=your-actual-anthropic-key
```

### Step 3: Build and run with Docker

```bash
# Build the image
docker build \
  --build-arg CODA_API_TOKEN=$(grep CODA_API_TOKEN .env | cut -d '=' -f2) \
  --build-arg ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env | cut -d '=' -f2) \
  -t distractions-viewer .

# Run the container
docker run -d \
  --name distractions-viewer \
  --restart always \
  -p 3001:3000 \
  -e CODA_API_TOKEN=$(grep CODA_API_TOKEN .env | cut -d '=' -f2) \
  -e ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env | cut -d '=' -f2) \
  distractions-viewer
```

### Step 4: Configure Caddy

Add to `/etc/caddy/Caddyfile`:

```
distractions.listentothetrees.com {
    reverse_proxy localhost:3001
}
```

Reload Caddy:
```bash
sudo systemctl reload caddy
```

### Step 5: Add DNS Record

In Cloudflare, add an A record:
- Name: `distractions`
- Content: `142.93.25.24`
- Proxy status: Proxied (orange cloud)

## Option 2: Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  distractions-viewer:
    build:
      context: .
      args:
        - CODA_API_TOKEN=${CODA_API_TOKEN}
        - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    restart: always
    ports:
      - "3001:3000"
    environment:
      - CODA_API_TOKEN=${CODA_API_TOKEN}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
```

Then run:
```bash
docker compose up -d
```

## Updating the Deployment

```bash
cd /opt/distractions-viewer
git pull
docker build \
  --build-arg CODA_API_TOKEN=$(grep CODA_API_TOKEN .env | cut -d '=' -f2) \
  --build-arg ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env | cut -d '=' -f2) \
  -t distractions-viewer .
docker stop distractions-viewer
docker rm distractions-viewer
docker run -d \
  --name distractions-viewer \
  --restart always \
  -p 3001:3000 \
  -e CODA_API_TOKEN=$(grep CODA_API_TOKEN .env | cut -d '=' -f2) \
  -e ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env | cut -d '=' -f2) \
  distractions-viewer
```

## Logs and Debugging

```bash
# View logs
docker logs -f distractions-viewer

# Check if container is running
docker ps | grep distractions

# Restart container
docker restart distractions-viewer
```

## Expected URL

Once deployed: https://distractions.listentothetrees.com
