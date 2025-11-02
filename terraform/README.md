# Terraform Infrastructure as Code

This directory contains Terraform configuration for deploying the Loan Admin application to Kubernetes.

## Overview

The Terraform configuration manages:
- Kubernetes namespace
- ConfigMaps and Secrets
- PostgreSQL deployment with persistent storage
- Application deployment
- Services (ClusterIP, LoadBalancer, or NodePort)
- Ingress (optional)
- Horizontal Pod Autoscaler (optional)

## Prerequisites

1. **Terraform** >= 1.0 installed
2. **Kubernetes cluster** accessible via kubectl
3. **kubectl** configured and connected
4. **Container registry** with your application image
5. **Storage class** configured in your cluster

## Quick Start

### 1. Configure Variables

```bash
# Copy example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

**Important variables to set:**
- `app_image`: Your container registry/image path
- `app_version`: Image version tag
- `postgres_password`: Secure database password
- `ingress_host`: Your domain name (if using ingress)

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Review Plan

```bash
terraform plan
```

### 4. Apply Configuration

```bash
terraform apply
```

Type `yes` to confirm.

### 5. Verify Deployment

```bash
# Get outputs
terraform output

# Check Kubernetes resources
kubectl get all -n loan-admin
```

## Configuration

### Variables File

Create `terraform.tfvars` with your configuration:

```hcl
namespace   = "loan-admin"
environment  = "production"

app_image    = "registry.io/loan-admin"
app_version  = "v1.0.0"
app_replicas = 3

postgres_password = "secure-password-here"

enable_ingress = true
ingress_host   = "loan-admin.example.com"
```

### Environment Variables

Alternatively, use environment variables:

```bash
export TF_VAR_postgres_password="secure-password"
export TF_VAR_app_image="registry.io/loan-admin"
terraform apply
```

### Backend Configuration

For production, configure remote state:

```hcl
# Uncomment in main.tf
backend "s3" {
  bucket = "loan-admin-terraform-state"
  key    = "terraform.tfstate"
  region = "us-east-1"
}
```

## Terraform Commands

### Plan

Preview changes:

```bash
terraform plan
```

### Apply

Apply configuration:

```bash
terraform apply
```

### Destroy

Remove all resources:

```bash
terraform destroy
```

### State Management

```bash
# View state
terraform show

# List resources
terraform state list

# Import existing resource
terraform import <resource_type>.<name> <resource_id>
```

### Outputs

View outputs:

```bash
terraform output
terraform output application_url
```

## Variables Reference

### Application

| Variable | Description | Default |
|----------|-------------|---------|
| `app_image` | Docker image name | `loan-admin` |
| `app_version` | Image version tag | `latest` |
| `app_replicas` | Number of replicas | `2` |
| `app_port` | Application port | `3000` |

### PostgreSQL

| Variable | Description | Default |
|----------|-------------|---------|
| `postgres_password` | Database password | `postgres` |
| `postgres_db` | Database name | `loan_admin` |
| `postgres_user` | Database user | `postgres` |
| `postgres_storage_size` | PVC size | `10Gi` |

### Resource Limits

| Variable | Description | Default |
|----------|-------------|---------|
| `app_memory_request` | App memory request | `512Mi` |
| `app_memory_limit` | App memory limit | `1Gi` |
| `app_cpu_request` | App CPU request | `250m` |
| `app_cpu_limit` | App CPU limit | `1000m` |

### Ingress

| Variable | Description | Default |
|----------|-------------|---------|
| `enable_ingress` | Enable ingress | `false` |
| `ingress_host` | Domain name | `loan-admin.example.com` |
| `enable_tls` | Enable TLS | `false` |

### HPA

| Variable | Description | Default |
|----------|-------------|---------|
| `enable_hpa` | Enable HPA | `true` |
| `hpa_min_replicas` | Min replicas | `2` |
| `hpa_max_replicas` | Max replicas | `10` |
| `hpa_cpu_target` | CPU target % | `70` |

## Updating Deployment

### Update Application Version

```bash
# Edit terraform.tfvars
app_version = "v1.0.1"

# Apply
terraform apply
```

### Scale Application

```bash
# Edit terraform.tfvars
app_replicas = 5

# Apply
terraform apply
```

### Update Resources

```bash
# Edit terraform.tfvars with new limits
# Apply changes
terraform apply
```

## Workspaces (Environments)

Use Terraform workspaces for multiple environments:

```bash
# Create workspace
terraform workspace new staging
terraform workspace new production

# Switch workspace
terraform workspace select staging

# Workspace-specific variables
terraform apply -var-file="staging.tfvars"
```

## Best Practices

1. **State Management**: Use remote backend for team collaboration
2. **Secrets**: Never commit secrets to git; use variables or secret management
3. **Versioning**: Pin provider versions in `versions.tf`
4. **Modularity**: Break into modules for reusability
5. **Documentation**: Document all custom variables and resources

## Troubleshooting

### Provider Authentication

```bash
# Verify kubectl access
kubectl cluster-info

# Check context
kubectl config current-context
```

### State Issues

```bash
# Refresh state
terraform refresh

# Reconcile state
terraform plan -refresh-only
```

### Resource Conflicts

```bash
# Import existing resource
terraform import kubernetes_namespace.loan_admin loan-admin

# Or taint and recreate
terraform taint kubernetes_deployment.app
terraform apply
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Terraform Apply
  run: |
    terraform init
    terraform plan
    terraform apply -auto-approve
  env:
    TF_VAR_postgres_password: ${{ secrets.POSTGRES_PASSWORD }}
```

### GitLab CI Example

```yaml
terraform:
  script:
    - terraform init
    - terraform plan
    - terraform apply -auto-approve
  variables:
    TF_VAR_postgres_password: $POSTGRES_PASSWORD
```

## Support

For issues:
1. Check Terraform logs: `TF_LOG=DEBUG terraform apply`
2. Verify kubectl access: `kubectl get nodes`
3. Review variable values: `terraform show`
4. Check resource state: `terraform state list`

