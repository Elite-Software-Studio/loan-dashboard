variable "namespace" {
  description = "Kubernetes namespace for loan-admin"
  type        = string
  default     = "loan-admin"
}

variable "environment" {
  description = "Environment name (e.g., production, staging, development)"
  type        = string
  default     = "production"
}

# Application Configuration
variable "app_image" {
  description = "Docker image name for the application"
  type        = string
  default     = "loan-admin"
}

variable "app_version" {
  description = "Application version tag"
  type        = string
  default     = "latest"
}

variable "app_replicas" {
  description = "Number of application replicas"
  type        = number
  default     = 2
}

variable "app_port" {
  description = "Application port"
  type        = string
  default     = "3000"
}

variable "node_env" {
  description = "Node environment"
  type        = string
  default     = "production"
}

# PostgreSQL Configuration
variable "postgres_image" {
  description = "PostgreSQL Docker image"
  type        = string
  default     = "postgres"
}

variable "postgres_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "15-alpine"
}

variable "postgres_replicas" {
  description = "Number of PostgreSQL replicas (usually 1)"
  type        = number
  default     = 1
}

variable "postgres_db" {
  description = "PostgreSQL database name"
  type        = string
  default     = "loan_admin"
}

variable "postgres_user" {
  description = "PostgreSQL username"
  type        = string
  default     = "postgres"
}

variable "postgres_password" {
  description = "PostgreSQL password (should be set via TF_VAR or .tfvars)"
  type        = string
  sensitive   = true
  default     = "postgres" # CHANGE IN PRODUCTION!
}

variable "postgres_port" {
  description = "PostgreSQL port"
  type        = string
  default     = "5432"
}

variable "postgres_storage_size" {
  description = "PostgreSQL persistent volume size"
  type        = string
  default     = "10Gi"
}

# Resource Limits
variable "app_memory_request" {
  description = "Application memory request"
  type        = string
  default     = "512Mi"
}

variable "app_memory_limit" {
  description = "Application memory limit"
  type        = string
  default     = "1Gi"
}

variable "app_cpu_request" {
  description = "Application CPU request"
  type        = string
  default     = "250m"
}

variable "app_cpu_limit" {
  description = "Application CPU limit"
  type        = string
  default     = "1000m"
}

variable "postgres_memory_request" {
  description = "PostgreSQL memory request"
  type        = string
  default     = "256Mi"
}

variable "postgres_memory_limit" {
  description = "PostgreSQL memory limit"
  type        = string
  default     = "1Gi"
}

variable "postgres_cpu_request" {
  description = "PostgreSQL CPU request"
  type        = string
  default     = "250m"
}

variable "postgres_cpu_limit" {
  description = "PostgreSQL CPU limit"
  type        = string
  default     = "1"
}

# Storage
variable "storage_class_name" {
  description = "Storage class name for PVCs"
  type        = string
  default     = "standard"
}

# Service Configuration
variable "service_type" {
  description = "Kubernetes service type (ClusterIP, LoadBalancer, NodePort)"
  type        = string
  default     = "ClusterIP"
}

# Ingress Configuration
variable "enable_ingress" {
  description = "Enable ingress resource"
  type        = bool
  default     = false
}

variable "ingress_class_name" {
  description = "Ingress class name"
  type        = string
  default     = "nginx"
}

variable "ingress_host" {
  description = "Ingress hostname"
  type        = string
  default     = "loan-admin.example.com"
}

variable "enable_tls" {
  description = "Enable TLS for ingress"
  type        = bool
  default     = false
}

variable "tls_secret_name" {
  description = "TLS secret name"
  type        = string
  default     = "loan-admin-tls"
}

# HPA Configuration
variable "enable_hpa" {
  description = "Enable Horizontal Pod Autoscaler"
  type        = bool
  default     = true
}

variable "hpa_min_replicas" {
  description = "HPA minimum replicas"
  type        = number
  default     = 2
}

variable "hpa_max_replicas" {
  description = "HPA maximum replicas"
  type        = number
  default     = 10
}

variable "hpa_cpu_target" {
  description = "HPA CPU target percentage"
  type        = number
  default     = 70
}

variable "hpa_memory_target" {
  description = "HPA memory target percentage"
  type        = number
  default     = 80
}

# Database Seeding
variable "seed_database" {
  description = "Seed database on startup"
  type        = bool
  default     = false
}

