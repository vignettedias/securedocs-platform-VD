# SecureDocs Platform

A fully self-hosted secure document management platform designed with security-first principles and modular service architecture.

## Current Progress

### Phase 1 – Infrastructure & Architecture
- Repository Initialization
- TypeScript Backend Setup
- Express.js Server
- Health Check Endpoint
- Docker Containerization
- NGINX Reverse Proxy
- Docker Compose Orchestration

### Phase 2 – Identity & Authentication (In Progress)
- PostgreSQL Deployment
- Prisma ORM Integration
- Redis Deployment
- Authentik Identity Provider Deployment
- OIDC Provider Configuration
- SecureDocs Application Registration
- User Group Management
- Test User Provisioning

## Architecture

Android Client
↓
NGINX
↓
Backend (Node.js + Express)
↓
PostgreSQL

Identity Layer:
Authentik + Redis

Planned Services:
- Fernet Encryption Service
- MinIO Object Storage
- Prometheus Monitoring
- Grafana Dashboards

## Status

Current Phase:
Phase 2.3 – Identity Integration