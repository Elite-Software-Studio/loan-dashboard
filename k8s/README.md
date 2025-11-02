# Kubernetes Manifests

This directory contains Kubernetes manifests for deploying the Loan Admin application.

## Files Overview

| File | Description |
|------|-------------|
| `namespace.yaml` | Kubernetes namespace |
| `configmap.yaml` | Application configuration |
| `secrets.yaml` | Sensitive data (passwords, etc.) |
| `postgres-pvc.yaml` | Persistent volume for database |
| `postgres-deployment.yaml` | PostgreSQL database deployment |
| `postgres-service.yaml` | PostgreSQL service |
| `app-deployment.yaml` | Application deployment |
| `app-service.yaml` | Application service |
| `ingress.yaml` | Ingress for external access |
| `hpa.yaml` | Horizontal Pod Autoscaler |
| `kustomization.yaml` | Kustomize configuration |

## Quick Deploy

```bash
# Apply all manifests
kubectl apply -f k8s/

# Or with kustomize
kubectl apply -k k8s/
```

## Deployment Order

For manual deployment, follow this order:

1. `namespace.yaml` - Create namespace
2. `secrets.yaml` - Create secrets (update passwords first!)
3. `configmap.yaml` - Create configuration
4. `postgres-pvc.yaml` - Create storage
5. `postgres-deployment.yaml` - Deploy database
6. `postgres-service.yaml` - Expose database
7. `app-deployment.yaml` - Deploy application
8. `app-service.yaml` - Expose application
9. `ingress.yaml` - External access (optional)
10. `hpa.yaml` - Auto-scaling (optional)

## Important Notes

- **Update secrets**: Change default passwords in `secrets.yaml` before deploying
- **Update image**: Set your container image in `app-deployment.yaml`
- **Storage class**: Verify `storageClassName` in `postgres-pvc.yaml` matches your cluster
- **Ingress host**: Update domain in `ingress.yaml` if using ingress

## See Also

- [K8S_DEPLOYMENT.md](../K8S_DEPLOYMENT.md) - Complete deployment guide
- [DEPLOYMENT_OVERVIEW.md](../DEPLOYMENT_OVERVIEW.md) - All deployment options

