# Prisma Backend Service

A backend service built with Prisma ORM and deployed to Google Kubernetes Engine (GKE).

## Overview

This repository contains a Node.js backend service that uses Prisma ORM for database operations. The service is containerized using Docker and deployed to Google Kubernetes Engine. It connects to a Cloud SQL PostgreSQL database.

## Architecture

- **Backend**: Node.js application with Prisma ORM
- **Database**: Google Cloud SQL (PostgreSQL)
- **Deployment**: Google Kubernetes Engine (GKE)
- **CI/CD**: GitHub Actions

## Prerequisites

- Google Cloud Platform account
- GKE cluster set up
- Cloud SQL PostgreSQL instance
- Service account with appropriate permissions

## Environment Variables

The following secrets need to be set in your GitHub repository:

- `GCP_SA_KEY`: Service account key JSON
- `GCP_PROJECT_ID`: Google Cloud Project ID
- `CLOUD_SQL_INSTANCE`: Cloud SQL instance connection name (format: `project:region:instance`)
- `DB_PASSWORD`: PostgreSQL database password

## Local Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/prisma-backend.git
cd prisma-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (create a `.env` file)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

## Deployment

The project is automatically deployed to GKE when changes are pushed to the `master` branch. The deployment process is handled by the GitHub Actions workflow defined in `.github/workflows/deploy.yml`.

### Manual Deployment

If you need to deploy manually:

1. Build and push the Docker image
```bash
docker build -t gcr.io/your-project-id/prisma-backend:latest .
docker push gcr.io/your-project-id/prisma-backend:latest
```

2. Apply Kubernetes configurations
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Kubernetes Configuration

The Kubernetes configuration files are located in the `k8s/` directory:
- `deployment.yaml`: Defines the deployment configuration
- `service.yaml`: Defines the service configuration

## Database Migrations

Database migrations are managed using Prisma Migrate:

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

## Troubleshooting

### Cloud SQL Proxy Issues

If you encounter issues with the Cloud SQL Auth Proxy:
- Verify that the proxy is running: `ps aux | grep cloud_sql_proxy`
- Test the database connection: `psql -h 127.0.0.1 -U postgres -d postgres -p 5432 -c "SELECT 1;"`

### GKE Authentication Issues

If you have problems authenticating with GKE:
- Make sure the `google-cloud-sdk-gke-gcloud-auth-plugin` is installed
- Ensure the service account has sufficient permissions

## License

[MIT](LICENSE)
