# k3d Quick Start Guide

## ✅ Installation Complete!

You have successfully installed:

- ✅ **k3d** v5.8.3
- ✅ **kubectl** v1.34.1

## ⚠️ Next Step: Start Docker

k3d requires Docker to run. You need to:

1. **Install Docker Desktop** (if not installed):
    - Download: https://www.docker.com/products/docker-desktop
    - Install and start Docker Desktop

2. **Verify Docker is running**:
    ```bash
    docker ps
    ```
    If this works, Docker is ready!

## 🚀 Quick Start Commands

Once Docker is running:

### 1. Verify Setup

```bash
./scripts/verify-k3d.sh
```

### 2. Create k3d Cluster

```bash
./scripts/setup-k3d.sh
```

This creates a local Kubernetes cluster with:

- 2 agent nodes
- Port mappings: 3000, 5432, 8080
- Auto-configured kubectl context

### 3. Build and Load Image

```bash
# Build your application
docker build -t loan-admin:latest .

# Load into k3d cluster
./scripts/load-image.sh loan-admin:latest
```

### 4. Deploy to Kubernetes

```bash
# Update image in deployment (if needed)
# Edit k8s/app-deployment.yaml to use: image: loan-admin:latest

# Deploy
kubectl apply -f k8s/

# Check status
kubectl get all -n loan-admin
```

### 5. Access Application

```bash
# Port forward
kubectl port-forward -n loan-admin service/loan-admin-service 3000:80

# Or use the loadbalancer (if configured)
# Open: http://localhost:3000
```

## 📚 Full Documentation

- **Detailed Guide**: [K3D_LOCAL_TESTING.md](./K3D_LOCAL_TESTING.md)
- **All Options**: [DEPLOYMENT_OVERVIEW.md](./DEPLOYMENT_OVERVIEW.md)

## 🛠️ Useful Scripts

| Script                            | Purpose                        |
| --------------------------------- | ------------------------------ |
| `./scripts/verify-k3d.sh`         | Verify installation and setup  |
| `./scripts/setup-k3d.sh`          | Create k3d cluster             |
| `./scripts/load-image.sh <image>` | Load Docker image into cluster |
| `./scripts/teardown-k3d.sh`       | Delete k3d cluster             |

## 🎯 Workflow

```
1. Start Docker Desktop
2. ./scripts/setup-k3d.sh
3. docker build -t loan-admin:latest .
4. ./scripts/load-image.sh loan-admin:latest
5. kubectl apply -f k8s/
6. kubectl get all -n loan-admin
```

## 🔧 Troubleshooting

**Docker not running?**

- Start Docker Desktop
- Verify: `docker ps`

**Cluster not starting?**

- Check Docker: `docker info`
- Recreate: `./scripts/teardown-k3d.sh && ./scripts/setup-k3d.sh`

**Image not found?**

- Build first: `docker build -t loan-admin:latest .`
- Load: `./scripts/load-image.sh loan-admin:latest`

For more help, see [K3D_LOCAL_TESTING.md](./K3D_LOCAL_TESTING.md)
