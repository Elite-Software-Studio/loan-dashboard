#!/bin/bash
set -e

CLUSTER_NAME="loan-admin-cluster"
IMAGE_NAME="${1:-loan-admin:latest}"

if [ -z "$1" ]; then
    echo "📦 Using default image name: $IMAGE_NAME"
    echo "   Usage: $0 <image-name>"
    echo "   Example: $0 myregistry.io/loan-admin:v1.0.0"
fi

# Check if cluster exists
if ! k3d cluster list | grep -q "$CLUSTER_NAME"; then
    echo "❌ Cluster '$CLUSTER_NAME' does not exist."
    echo "   Run: ./scripts/setup-k3d.sh"
    exit 1
fi

# Check if image exists locally
if ! docker image inspect "$IMAGE_NAME" > /dev/null 2>&1; then
    echo "❌ Docker image '$IMAGE_NAME' not found locally."
    echo "   Build it first: docker build -t $IMAGE_NAME ."
    exit 1
fi

echo "📤 Loading image '$IMAGE_NAME' into k3d cluster '$CLUSTER_NAME'..."
k3d image import "$IMAGE_NAME" -c "$CLUSTER_NAME"

echo "✅ Image loaded successfully!"
echo ""
echo "🔍 Verify image is available:"
echo "   kubectl get nodes -o wide"
echo ""
echo "📝 Update k8s/app-deployment.yaml with:"
echo "   image: $IMAGE_NAME"

