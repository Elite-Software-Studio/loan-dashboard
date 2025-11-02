#!/bin/bash
set -e

CLUSTER_NAME="loan-admin-cluster"

echo "🗑️  Tearing down k3d cluster '$CLUSTER_NAME'..."

if k3d cluster list | grep -q "$CLUSTER_NAME"; then
    k3d cluster delete "$CLUSTER_NAME"
    echo "✅ Cluster '$CLUSTER_NAME' deleted successfully!"
else
    echo "⚠️  Cluster '$CLUSTER_NAME' not found."
fi

echo "✅ Cleanup complete!"

