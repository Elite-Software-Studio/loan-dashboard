#!/bin/bash
set -e

echo "🚀 Setting up k3d cluster for Loan Admin..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if k3d is installed
if ! command -v k3d &> /dev/null; then
    echo "❌ k3d is not installed. Install it with: brew install k3d"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Install it with: brew install kubectl"
    exit 1
fi

CLUSTER_NAME="loan-admin-cluster"

# Check if cluster already exists
if k3d cluster list | grep -q "$CLUSTER_NAME"; then
    echo "⚠️  Cluster '$CLUSTER_NAME' already exists."
    read -p "Do you want to delete and recreate it? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Deleting existing cluster..."
        k3d cluster delete "$CLUSTER_NAME"
    else
        echo "✅ Using existing cluster."
        k3d kubeconfig merge "$CLUSTER_NAME" --kubeconfig-switch-context
        echo "✅ kubeconfig updated. Cluster is ready!"
        exit 0
    fi
fi

echo "📦 Creating k3d cluster '$CLUSTER_NAME'..."
k3d cluster create "$CLUSTER_NAME" \
    --port "3000:3000@loadbalancer" \
    --port "5432:5432@loadbalancer" \
    --port "8080:80@loadbalancer" \
    --agents 2 \
    --wait

echo "🔧 Merging kubeconfig..."
k3d kubeconfig merge "$CLUSTER_NAME" --kubeconfig-switch-context

echo "⏳ Waiting for cluster to be ready..."
kubectl wait --for=condition=Ready nodes --all --timeout=120s

echo "✅ k3d cluster '$CLUSTER_NAME' is ready!"
echo ""
echo "📋 Cluster information:"
kubectl cluster-info
echo ""
kubectl get nodes
echo ""
echo "🎯 Next steps:"
echo "   1. Build and load your Docker image:"
echo "      docker build -t loan-admin:latest ."
echo "      k3d image import loan-admin:latest -c $CLUSTER_NAME"
echo ""
echo "   2. Deploy to cluster:"
echo "      kubectl apply -f k8s/"
echo ""
echo "   3. Check deployment:"
echo "      kubectl get all -n loan-admin"

