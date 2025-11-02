terraform {
  required_version = ">= 1.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  # Backend configuration (uncomment and configure for your setup)
  # backend "s3" {
  #   bucket = "loan-admin-terraform-state"
  #   key    = "terraform.tfstate"
  #   region = "us-east-1"
  # }
}

# Configure Kubernetes provider
# This assumes you have kubectl configured or provide credentials
provider "kubernetes" {
  # Configuration options
  # config_path    = "~/.kube/config"  # For local development
  # config_context = "my-context"
}

provider "helm" {
  # Configuration options
  # kubernetes {
  #   config_path = "~/.kube/config"
  # }
}

# Kubernetes namespace
resource "kubernetes_namespace" "loan_admin" {
  metadata {
    name = var.namespace
    labels = {
      name        = "loan-admin"
      environment = var.environment
    }
  }
}

# ConfigMap
resource "kubernetes_config_map" "loan_admin_config" {
  metadata {
    name      = "loan-admin-config"
    namespace = kubernetes_namespace.loan_admin.metadata[0].name
  }

  data = {
    NODE_ENV     = var.node_env
    APP_PORT     = var.app_port
    POSTGRES_DB  = var.postgres_db
    POSTGRES_USER = var.postgres_user
    POSTGRES_PORT = var.postgres_port
    SEED_DATABASE = var.seed_database ? "true" : "false"
  }

  depends_on = [kubernetes_namespace.loan_admin]
}

# Secrets
resource "kubernetes_secret" "loan_admin_secrets" {
  metadata {
    name      = "loan-admin-secrets"
    namespace = kubernetes_namespace.loan_admin.metadata[0].name
  }

  data = {
    POSTGRES_PASSWORD         = base64encode(var.postgres_password)
    DATABASE_URL_POSTGRESQL = base64encode("postgresql://${var.postgres_user}:${var.postgres_password}@postgres-service:5432/${var.postgres_db}")
  }

  depends_on = [kubernetes_namespace.loan_admin]
}

# PostgreSQL Persistent Volume Claim
resource "kubernetes_persistent_volume_claim" "postgres_pvc" {
  metadata {
    name      = "postgres-pvc"
    namespace = kubernetes_namespace.loan_admin.metadata[0].name
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.postgres_storage_size
      }
    }
    storage_class_name = var.storage_class_name
  }

  depends_on = [kubernetes_namespace.loan_admin]
}

# PostgreSQL Deployment
resource "kubernetes_deployment" "postgres" {
  metadata {
    name      = "postgres"
    namespace = kubernetes_namespace.loan_admin.metadata[0].name
    labels = {
      app = "postgres"
    }
  }

  spec {
    replicas = var.postgres_replicas

    selector {
      match_labels = {
        app = "postgres"
      }
    }

    template {
      metadata {
        labels = {
          app = "postgres"
        }
      }

      spec {
        container {
          name  = "postgres"
          image = "${var.postgres_image}:${var.postgres_version}"

          port {
            container_port = 5432
            name           = "postgres"
          }

          env {
            name = "POSTGRES_DB"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.loan_admin_config.metadata[0].name
                key  = "POSTGRES_DB"
              }
            }
          }

          env {
            name = "POSTGRES_USER"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.loan_admin_config.metadata[0].name
                key  = "POSTGRES_USER"
              }
            }
          }

          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.loan_admin_secrets.metadata[0].name
                key  = "POSTGRES_PASSWORD"
              }
            }
          }

          volume_mount {
            name       = "postgres-storage"
            mount_path = "/var/lib/postgresql/data"
          }

          liveness_probe {
            exec {
              command = ["/bin/sh", "-c", "pg_isready -U ${var.postgres_user}"]
            }
            initial_delay_seconds = 30
            period_seconds        = 10
          }

          readiness_probe {
            exec {
              command = ["/bin/sh", "-c", "pg_isready -U ${var.postgres_user}"]
            }
            initial_delay_seconds = 5
            period_seconds        = 5
          }

          resources {
            requests = {
              memory = var.postgres_memory_request
              cpu    = var.postgres_cpu_request
            }
            limits = {
              memory = var.postgres_memory_limit
              cpu    = var.postgres_cpu_limit
            }
          }
        }

        volume {
          name = "postgres-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.postgres_pvc.metadata[0].name
          }
        }
      }
    }
  }

  depends_on = [
    kubernetes_namespace.loan_admin,
    kubernetes_config_map.loan_admin_config,
    kubernetes_secret.loan_admin_secrets,
    kubernetes_persistent_volume_claim.postgres_pvc
  ]
}

# PostgreSQL Service
resource "kubernetes_service" "postgres" {
  metadata {
    name      = "postgres-service"
    namespace = kubernetes_namespace.loan_admin.metadata[0].name
    labels = {
      app = "postgres"
    }
  }

  spec {
    type = "ClusterIP"
    port {
      port        = 5432
      target_port = 5432
      protocol    = "TCP"
      name        = "postgres"
    }
    selector = {
      app = "postgres"
    }
  }

  depends_on = [kubernetes_deployment.postgres]
}

# Application Deployment
resource "kubernetes_deployment" "app" {
  metadata {
    name      = "loan-admin-app"
    namespace = kubernetes_namespace.loan_admin.metadata[0].name
    labels = {
      app       = "loan-admin"
      component = "frontend"
    }
  }

  spec {
    replicas = var.app_replicas

    selector {
      match_labels = {
        app       = "loan-admin"
        component = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app       = "loan-admin"
          component = "frontend"
        }
      }

      spec {
        container {
          name  = "app"
          image = "${var.app_image}:${var.app_version}"
          # image_pull_policy = "Always"

          port {
            container_port = 3000
            name           = "http"
          }

          env {
            name  = "NODE_ENV"
            value = var.node_env
          }

          env {
            name  = "PORT"
            value = var.app_port
          }

          env {
            name = "POSTGRES_DB"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.loan_admin_config.metadata[0].name
                key  = "POSTGRES_DB"
              }
            }
          }

          env {
            name = "POSTGRES_USER"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.loan_admin_config.metadata[0].name
                key  = "POSTGRES_USER"
              }
            }
          }

          env {
            name = "POSTGRES_PORT"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.loan_admin_config.metadata[0].name
                key  = "POSTGRES_PORT"
              }
            }
          }

          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.loan_admin_secrets.metadata[0].name
                key  = "POSTGRES_PASSWORD"
              }
            }
          }

          env {
            name = "SEED_DATABASE"
            value = var.seed_database ? "true" : "false"
          }

          env {
            name  = "DATABASE_URL_POSTGRESQL"
            value = "postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@postgres-service:5432/$(POSTGRES_DB)"
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 3000
            }
            initial_delay_seconds = 60
            period_seconds        = 30
            timeout_seconds       = 10
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 3000
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold     = 3
          }

          resources {
            requests = {
              memory = var.app_memory_request
              cpu    = var.app_cpu_request
            }
            limits = {
              memory = var.app_memory_limit
              cpu    = var.app_cpu_limit
            }
          }
        }

        init_container {
          name  = "wait-for-db"
          image = "postgres:15-alpine"
          command = ["sh", "-c", "until pg_isready -h postgres-service -p 5432; do sleep 2; done"]
        }
      }
    }
  }

  depends_on = [
    kubernetes_service.postgres,
    kubernetes_config_map.loan_admin_config,
    kubernetes_secret.loan_admin_secrets
  ]
}

# Application Service
resource "kubernetes_service" "app" {
  metadata {
    name      = "loan-admin-service"
    namespace = kubernetes_namespace.loan_admin.metadata[0].name
    labels = {
      app       = "loan-admin"
      component = "frontend"
    }
  }

  spec {
    type = var.service_type
    port {
      port        = 80
      target_port = 3000
      protocol    = "TCP"
      name        = "http"
    }
    selector = {
      app       = "loan-admin"
      component = "frontend"
    }
  }

  depends_on = [kubernetes_deployment.app]
}

# Ingress (optional)
resource "kubernetes_ingress_v1" "app" {
  count = var.enable_ingress ? 1 : 0

  metadata {
    name      = "loan-admin-ingress"
    namespace = kubernetes_namespace.loan_admin.metadata[0].name
    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/"
      "nginx.ingress.kubernetes.io/ssl-redirect"    = "true"
    }
  }

  spec {
    ingress_class_name = var.ingress_class_name

    rule {
      host = var.ingress_host
      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service.app.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
      }
    }

    # TLS configuration (optional)
    dynamic "tls" {
      for_each = var.enable_tls ? [1] : []
      content {
        hosts       = [var.ingress_host]
        secret_name = var.tls_secret_name
      }
    }
  }

  depends_on = [kubernetes_service.app]
}

# Horizontal Pod Autoscaler
resource "kubernetes_horizontal_pod_autoscaler_v2" "app" {
  count = var.enable_hpa ? 1 : 0

  metadata {
    name      = "loan-admin-hpa"
    namespace = kubernetes_namespace.loan_admin.metadata[0].name
  }

  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.app.metadata[0].name
    }

    min_replicas = var.hpa_min_replicas
    max_replicas = var.hpa_max_replicas

    metric {
      type = "Resource"
      resource {
        name = "cpu"
        target {
          type                = "Utilization"
          average_utilization = var.hpa_cpu_target
        }
      }
    }

    metric {
      type = "Resource"
      resource {
        name = "memory"
        target {
          type                = "Utilization"
          average_utilization = var.hpa_memory_target
        }
      }
    }
  }

  depends_on = [kubernetes_deployment.app]
}

