# Local Kubernetes Testing with k3d

This guide shows you how to test your Kubernetes deployments locally using k3d (Kubernetes in Docker).

## What is k3d?

k3d is a lightweight wrapper around k3s that runs Kubernetes clusters in Docker. It's perfect for:
- Local development and testing
- CI/CD pipelines
- Learning Kubernetes
- Testing before deploying to production

## Prerequisites

1. **Docker Desktop** (or Docker Engine)
   - Download: https://www.docker.com/products/docker-desktop
   - Ensure Docker is running

2. **k3d** (Installed via Homebrew)
   ```bash
   brew install k3d
   ```

3. **kubectl** (Installed via Homebrew)
   ```bash
   brew install kubectl
   ```

## Quick Start

### 1. Set Up k3d Cluster

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Create cluster
./scripts/setup-k3d.sh
```

This script will:
- Create a k3d cluster named `loan-admin-cluster`
- Configure port mappings (3000, 5432, 8080)
- Set up 2 agent nodes
- Configure kubectl context

### 2. Build and Load Docker Image

```bash
# Build your application image
docker build -t loan-admin:latest .

# Load image into k3d cluster
./scripts/load-image.sh loan-admin:latest

# Or manually:
k3d image import loan-admin:latest -c loan-admin-cluster
```

### 3. Update Kubernetes Manifests

Update `k8s/app-deployment.yaml`:

```yaml
image: loan-admin:latest  # Use the image you loaded
```

### 4. Deploy to Cluster

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/
```

### 5. Verify Deployment

```bash
# Check all resources
kubectl get all -n loan-admin

# Check pods
kubectl get pods -n loan-admin

# Watch pod status
kubectl get pods -n loan-admin -w

# Check logs
kubectl logs -n loan-admin -l app=loan-admin -f
```

### 6. Access the Application

```bash
# Port forward to access application
kubectl port-forward -n loan-admin service/loan-admin-service 3000:80

# Then open: http://localhost:3000
```

Or use the loadbalancer ports configured in k3d:
- Application: http://localhost:3000
- PostgreSQL: localhost:5432
- PgAdmin (if deployed): http://localhost:8080

## Common Commands

### Cluster Management

```bash
# List clusters
k3d cluster list

# Get cluster info
k3d cluster get loan-admin-cluster

# Start cluster (if stopped)
k3d cluster start loan-admin-cluster

# Stop cluster
k3d cluster stop loan-admin-cluster

# Delete cluster
./scripts/teardown-k3d.sh
# Or manually:
k3d cluster delete loan-admin-cluster
```

### Application Management

```bash
# Get all resources
kubectl get all -n loan-admin

# Describe resource
kubectl describe deployment/loan-admin-app -n loan-admin

# View logs
kubectl logs -n loan-admin -l app=loan-admin

# Execute command in pod
kubectl exec -it -n loan-admin deployment/loan-admin-app -- sh

# Delete deployment
kubectl delete -f k8s/
```

### Database Operations

```bash
# Connect to PostgreSQL
kubectl exec -it -n loan-admin deployment/postgres -- \
  psql -U postgres -d loan_admin

# Run migrations
kubectl exec -it -n loan-admin deployment/loan-admin-app -- \
  npx prisma migrate deploy

# Seed database
kubectl exec -it -n loan-admin deployment/loan-admin-app -- \
  npm run prisma:seed
```

## Development Workflow

### 1. Build and Test Locally

```bash
# Build image
docker build -t loan-admin:dev .

# Load into cluster
./scripts/load-image.sh loan-admin:dev

# Update deployment
kubectl set image deployment/loan-admin-app \
  app=loan-admin:dev -n loan-admin

# Watch rollout
kubectl rollout status deployment/loan-admin-app -n loan-admin
```

### 2. Debug Issues

```bash
# Check pod events
kubectl describe pod <pod-name> -n loan-admin

# View pod logs
kubectl logs <pod-name> -n loan-admin

# Execute into container
kubectl exec -it <pod-name> -n loan-admin -- sh

# Check resource usage
kubectl top pods -n loan-admin
```

### 3. Clean Up

```bash
# Delete all resources
kubectl delete namespace loan-admin

# Or delete cluster entirely
./scripts/teardown-k3d.sh
```

## Troubleshooting

### Docker Not Running

```bash
# Start Docker Desktop, then verify
docker ps
```

### Cluster Not Starting

```bash
# Check Docker resources
docker system df

# Prune unused resources
docker system prune -a

# Recreate cluster
./scripts/teardown-k3d.sh
./scripts/setup-k3d.sh
```

### Image Not Found

```bash
# Verify image exists locally
docker images | grep loan-admin

# Build image
docker build -t loan-admin:latest .

# Load into cluster
./scripts/load-image.sh loan-admin:latest
```

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n loan-admin

# Describe pod for details
kubectl describe pod <pod-name> -n loan-admin

# Check events
kubectl get events -n loan-admin --sort-by='.lastTimestamp'
```

### Database Connection Issues

```bash
# Verify postgres is running
kubectl get pods -n loan-admin -l app=postgres

# Check postgres logs
kubectl logs -n loan-admin -l app=postgres

# Test connection
kubectl exec -it -n loan-admin deployment/loan-admin-app -- \
  sh -c 'PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres-service -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT 1"'
```

### Port Already in Use

If ports 3000, 5432, or 8080 are already in use:

1. Stop conflicting services
2. Or modify k3d cluster creation with different ports:
   ```bash
   k3d cluster create loan-admin-cluster \
     --port "31000:3000@loadbalancer" \
     --port "35432:5432@loadbalancer" \
     --port "31080:80@loadbalancer"
   ```

## Advanced Configuration

### Custom Cluster Configuration

Create a custom cluster with more resources:

```bash
k3d cluster create loan-admin-cluster \
  --port "3000:3000@loadbalancer" \
  --agents 3 \
  --k3s-arg "--disable=traefik@server:0" \
  --wait
```

### Using Different K8s Versions

```bash
k3d cluster create loan-admin-cluster \
  --image rancher/k3s:v1.28.0-k3s1 \
  --port "3000:3000@loadbalancer"
```

### Registry Integration

If you're using a container registry:

```bash
# Create registry
k3d registry create myregistry.localhost --port 5000

# Connect cluster to registry
k3d cluster create loan-admin-cluster \
  --registry-use k3d-myregistry.localhost:5000

# Push and pull images normally
docker push myregistry.localhost:5000/loan-admin:latest
```

## Tips

1. **Resource Limits**: k3d runs on your machine, so resource limits in manifests are respected
2. **Fast Iteration**: Use image import for quick testing without pushing to registry
3. **Debugging**: k3d makes it easy to exec into containers and debug
4. **Clean Slate**: Easy to tear down and recreate clusters for testing
5. **Multi-Cluster**: Can run multiple clusters for testing different scenarios

## Next Steps

- Test your deployment locally
- Debug any issues
- Iterate on configuration
- When ready, deploy to production Kubernetes cluster

For production deployment, see:
- [K8S_DEPLOYMENT.md](./K8S_DEPLOYMENT.md) - Kubernetes deployment guide
- [terraform/README.md](./terraform/README.md) - Terraform deployment

