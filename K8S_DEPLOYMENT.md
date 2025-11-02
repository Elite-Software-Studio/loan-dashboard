# Kubernetes Deployment Guide

This guide covers deploying the Loan Admin application to Kubernetes.

## Prerequisites

- Kubernetes cluster (v1.24+)
- `kubectl` configured and connected to your cluster
- `kustomize` (optional, for using kustomization.yaml)
- Docker image pushed to a container registry
- Storage class configured in your cluster
- Ingress controller installed (if using ingress)

## Quick Start

### 1. Build and Push Docker Image

```bash
# Build the image
docker build -t your-registry.io/loan-admin:v1.0.0 .

# Push to registry
docker push your-registry.io/loan-admin:v1.0.0
```

### 2. Update Image Reference

Edit `k8s/app-deployment.yaml` and update the image:

```yaml
image: your-registry.io/loan-admin:v1.0.0
```

Or use kustomize to override:

```bash
kubectl apply -k k8s/ --dry-run=client -o yaml | \
  sed 's/loan-admin:latest/your-registry.io\/loan-admin:v1.0.0/' | \
  kubectl apply -f -
```

### 3. Configure Secrets

**IMPORTANT**: Update the secrets before deploying!

```bash
# Create secret with secure password
kubectl create secret generic loan-admin-secrets \
  --from-literal=POSTGRES_PASSWORD=your-secure-password \
  --namespace=loan-admin \
  --dry-run=client -o yaml > k8s/secrets.yaml

# Or edit k8s/secrets.yaml directly and base64 encode:
echo -n 'your-password' | base64
```

### 4. Deploy with kubectl

```bash
# Apply all manifests
kubectl apply -f k8s/

# Or deploy namespace first, then secrets, then rest
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
kubectl apply -f k8s/ingress.yaml  # If using ingress
kubectl apply -f k8s/hpa.yaml      # If using HPA
```

### 5. Deploy with Kustomize

```bash
# Apply with kustomize
kubectl apply -k k8s/
```

### 6. Verify Deployment

```bash
# Check all resources
kubectl get all -n loan-admin

# Check pods
kubectl get pods -n loan-admin

# Check logs
kubectl logs -n loan-admin -l app=loan-admin

# Check database logs
kubectl logs -n loan-admin -l app=postgres
```

## Configuration

### Environment Variables

Update `k8s/configmap.yaml` for application configuration:
- `NODE_ENV`: Environment (production, staging)
- `APP_PORT`: Application port (default: 3000)
- `SEED_DATABASE`: Set to "true" to seed on startup

### Secrets

**Critical**: Change default passwords in production!

Update `k8s/secrets.yaml`:
- `POSTGRES_PASSWORD`: Secure database password
- Base64 encode values: `echo -n 'value' | base64`

### Storage

Update `k8s/postgres-pvc.yaml`:
- `storage`: Size of persistent volume (default: 10Gi)
- `storageClassName`: Match your cluster's storage class

### Scaling

**Manual Scaling:**
```bash
kubectl scale deployment loan-admin-app --replicas=5 -n loan-admin
```

**HPA (Automatic Scaling):**
HPA is configured in `k8s/hpa.yaml`:
- Min replicas: 2
- Max replicas: 10
- CPU target: 70%
- Memory target: 80%

### Service Types

Update `k8s/app-service.yaml`:

- **ClusterIP**: Internal only (default)
- **LoadBalancer**: Cloud provider load balancer
- **NodePort**: Expose on cluster nodes

### Ingress

Configure ingress in `k8s/ingress.yaml`:
- Update `host` to your domain
- Configure TLS if needed
- Ensure ingress controller is installed

## Terraform Deployment

### 1. Configure Terraform

```bash
cd terraform

# Copy example variables
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Plan Deployment

```bash
terraform plan
```

### 4. Apply Configuration

```bash
terraform apply
```

### 5. View Outputs

```bash
terraform output
```

## Common Operations

### Update Application

```bash
# Update image
kubectl set image deployment/loan-admin-app \
  app=your-registry.io/loan-admin:v1.0.1 \
  -n loan-admin

# Rollout status
kubectl rollout status deployment/loan-admin-app -n loan-admin
```

### Database Migrations

```bash
# Run migrations manually
kubectl exec -it -n loan-admin deployment/loan-admin-app -- \
  npx prisma migrate deploy

# Seed database
kubectl exec -it -n loan-admin deployment/loan-admin-app -- \
  npm run prisma:seed
```

### Access Application

**Via Port Forward:**
```bash
kubectl port-forward -n loan-admin service/loan-admin-service 3000:80
# Access at http://localhost:3000
```

**Via Ingress:**
```bash
# Get ingress IP/domain
kubectl get ingress -n loan-admin
```

### Troubleshooting

**Pods not starting:**
```bash
# Describe pod
kubectl describe pod <pod-name> -n loan-admin

# Check events
kubectl get events -n loan-admin --sort-by='.lastTimestamp'
```

**Database connection issues:**
```bash
# Check postgres service
kubectl get svc postgres-service -n loan-admin

# Test connection
kubectl exec -it -n loan-admin deployment/loan-admin-app -- \
  sh -c 'PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres-service -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT 1"'
```

**View logs:**
```bash
# Application logs
kubectl logs -n loan-admin -l app=loan-admin --tail=100 -f

# Database logs
kubectl logs -n loan-admin -l app=postgres --tail=100 -f
```

**Restart deployment:**
```bash
kubectl rollout restart deployment/loan-admin-app -n loan-admin
```

## Resource Management

### Resource Requests and Limits

Current configuration:
- **App**: 512Mi-1Gi memory, 250m-1000m CPU
- **Postgres**: 256Mi-1Gi memory, 250m-1000m CPU

Adjust in deployment YAMLs or via Terraform variables.

### Cleanup

```bash
# Delete all resources
kubectl delete namespace loan-admin

# Or delete individually
kubectl delete -f k8s/
```

## Production Considerations

1. **Security**:
   - Change all default passwords
   - Use Kubernetes secrets properly
   - Enable network policies
   - Use TLS for ingress

2. **Backups**:
   - Set up regular PostgreSQL backups
   - Backup persistent volumes
   - Test restore procedures

3. **Monitoring**:
   - Set up Prometheus metrics
   - Configure alerts
   - Monitor resource usage

4. **High Availability**:
   - Run multiple replicas
   - Use pod anti-affinity
   - Configure node selectors

5. **CI/CD**:
   - Automate image builds
   - Use GitOps (ArgoCD, Flux)
   - Implement blue/green or canary deployments

## Support

For issues:
1. Check pod status: `kubectl get pods -n loan-admin`
2. View logs: `kubectl logs -n loan-admin <pod-name>`
3. Describe resources: `kubectl describe <resource> -n loan-admin`
4. Check events: `kubectl get events -n loan-admin`

