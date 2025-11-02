#!/bin/bash

echo "🔍 Verifying k3d setup..."

# Check Docker
echo -n "Docker: "
if command -v docker &> /dev/null && docker info > /dev/null 2>&1; then
    echo "✅ Running"
    docker --version
else
    echo "❌ Not running or not installed"
    echo "   Start Docker Desktop or install Docker"
fi

# Check k3d
echo -n "k3d: "
if command -v k3d &> /dev/null; then
    echo "✅ Installed"
    k3d --version
else
    echo "❌ Not installed"
    echo "   Install with: brew install k3d"
fi

# Check kubectl
echo -n "kubectl: "
if command -v kubectl &> /dev/null; then
    echo "✅ Installed"
    kubectl version --client 2>/dev/null | head -n 1
else
    echo "❌ Not installed"
    echo "   Install with: brew install kubectl"
fi

# Check cluster
echo -n "k3d cluster: "
if k3d cluster list | grep -q "loan-admin-cluster"; then
    echo "✅ Found 'loan-admin-cluster'"
    k3d cluster list
else
    echo "⚠️  No cluster found"
    echo "   Create with: ./scripts/setup-k3d.sh"
fi

# Check kubectl context
echo -n "kubectl context: "
if kubectl config current-context 2>/dev/null | grep -q "k3d"; then
    echo "✅ Connected to k3d cluster"
    kubectl config current-context
else
    echo "⚠️  Not connected to k3d cluster"
    echo "   Run: ./scripts/setup-k3d.sh"
fi

echo ""
echo "📋 Summary:"
if command -v docker &> /dev/null && docker info > /dev/null 2>&1 && \
   command -v k3d &> /dev/null && \
   command -v kubectl &> /dev/null; then
    echo "✅ All tools are installed!"
    if k3d cluster list | grep -q "loan-admin-cluster"; then
        echo "✅ Cluster is ready!"
        echo ""
        echo "🚀 Next step:"
        echo "   1. Build image: docker build -t loan-admin:latest ."
        echo "   2. Load image: ./scripts/load-image.sh loan-admin:latest"
        echo "   3. Deploy: kubectl apply -f k8s/"
    else
        echo "⚠️  Create cluster: ./scripts/setup-k3d.sh"
    fi
else
    echo "⚠️  Some tools are missing. Install them first."
fi

