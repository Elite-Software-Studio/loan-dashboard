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

### Option A: Using NPM Scripts (Recommended)

```bash
# 1. Verify setup
npm run k3d:verify

# 2. Create cluster
npm run k3d:setup

# 3. Build, load, and deploy (all-in-one)
npm run k3d:full

# 4. Access application (in another terminal)
npm run k3d:port-forward
# Then open: http://localhost:3000
```

### Option B: Using Scripts Directly

```bash
# 1. Verify setup
./scripts/verify-k3d.sh
# Or: npm run k3d:verify

# 2. Create k3d cluster
./scripts/setup-k3d.sh
# Or: npm run k3d:setup

# 3. Build your application
docker build -t loan-admin:latest .
# Or: npm run k3d:build

# 4. Load into k3d cluster
./scripts/load-image.sh loan-admin:latest
# Or: npm run k3d:load

# 5. Deploy to Kubernetes
kubectl apply -f k8s/
# Or: npm run k3d:deploy

# 6. Check status
kubectl get all -n loan-admin
# Or: npm run k3d:status

# 7. Access application
kubectl port-forward -n loan-admin service/loan-admin-service 3000:80
# Or: npm run k3d:port-forward
```

This creates a local Kubernetes cluster with:

- 2 agent nodes
- Port mappings: 3000, 5432, 8080
- Auto-configured kubectl context

## 📚 Full Documentation

- **NPM Scripts Reference**: [NPM_SCRIPTS.md](./NPM_SCRIPTS.md) - All available npm commands
- **Detailed Guide**: [K3D_LOCAL_TESTING.md](./K3D_LOCAL_TESTING.md) - Complete testing guide
- **All Options**: [DEPLOYMENT_OVERVIEW.md](./DEPLOYMENT_OVERVIEW.md) - All deployment methods

## 🛠️ Useful Commands

### NPM Scripts (Recommended)

| Command | Purpose |
|--------|---------|
| `npm run k3d:verify` | Verify installation and setup |
| `npm run k3d:setup` | Create k3d cluster |
| `npm run k3d:build` | Build Docker image |
| `npm run k3d:load` | Load image into cluster |
| `npm run k3d:build-load` | Build and load in one command |
| `npm run k3d:deploy` | Deploy to Kubernetes |
| `npm run k3d:status` | Show cluster status |
| `npm run k3d:logs` | View application logs |
| `npm run k3d:full` | Build, deploy, and show status |
| `npm run k3d:port-forward` | Access app locally |
| `npm run k3d:teardown` | Delete cluster |

### Direct Scripts

| Script | Purpose |
|--------|---------|
| `./scripts/verify-k3d.sh` | Verify installation and setup |
| `./scripts/setup-k3d.sh` | Create k3d cluster |
| `./scripts/load-image.sh <image>` | Load Docker image into cluster |
| `./scripts/teardown-k3d.sh` | Delete k3d cluster |

See [NPM_SCRIPTS.md](./NPM_SCRIPTS.md) for complete script reference.

## 🎯 Quick Workflow

**Using NPM (Easiest):**
```bash
1. Start Docker Desktop
2. npm run k3d:setup
3. npm run k3d:full
4. npm run k3d:port-forward  # In another terminal
```

**Using Scripts Directly:**
```bash
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
