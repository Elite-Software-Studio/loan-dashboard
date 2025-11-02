output "namespace" {
  description = "Kubernetes namespace"
  value       = kubernetes_namespace.loan_admin.metadata[0].name
}

output "app_service_name" {
  description = "Application service name"
  value       = kubernetes_service.app.metadata[0].name
}

output "postgres_service_name" {
  description = "PostgreSQL service name"
  value       = kubernetes_service.postgres.metadata[0].name
}

output "ingress_host" {
  description = "Ingress hostname"
  value       = var.enable_ingress ? var.ingress_host : null
}

output "app_deployment_name" {
  description = "Application deployment name"
  value       = kubernetes_deployment.app.metadata[0].name
}

output "postgres_deployment_name" {
  description = "PostgreSQL deployment name"
  value       = kubernetes_deployment.postgres.metadata[0].name
}

# Connection info (for documentation)
output "database_connection_info" {
  description = "Database connection information"
  value = {
    host     = kubernetes_service.postgres.metadata[0].name
    port     = 5432
    database = var.postgres_db
    user     = var.postgres_user
  }
  sensitive = false
}

output "application_url" {
  description = "Application URL"
  value       = var.enable_ingress ? "https://${var.ingress_host}" : "Service: ${kubernetes_service.app.metadata[0].name}.${var.namespace}.svc.cluster.local"
}

