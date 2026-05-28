#!/bin/bash

# Manual deployment script for specific services
# Usage: ./deploy-service.sh <service-name> [environment] [version]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
SERVICE_NAME="$1"
ENVIRONMENT="${2:-staging}"
VERSION="${3:-$(git rev-parse --short HEAD)}"

# Configuration
AWS_REGION="ap-southeast-5"
AWS_ACCOUNT_ID="311141556953"
REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Environment-specific configuration
case "$ENVIRONMENT" in
    "staging")
        EKS_CLUSTER_NAME="asb-microservices-cluster"
        EKS_NAMESPACE="staging"
        ;;
    "production")
        EKS_CLUSTER_NAME="asb-microservices-prod-cluster"
        EKS_NAMESPACE="production"
        ;;
    *)
        echo -e "${RED}❌ Invalid environment: $ENVIRONMENT${NC}"
        echo "Valid environments: staging, production"
        exit 1
        ;;
esac

# Available services
AVAILABLE_SERVICES=(
    "cms-service"
    "identity-service"
    "payment-service"
    "portfolio-service"
    "transaction-service"
)

# Helper functions
usage() {
    echo "Usage: $0 <service-name> [environment] [version]"
    echo ""
    echo "Arguments:"
    echo "  service-name    Name of the service to deploy"
    echo "  environment     Target environment (staging|production) [default: staging]"
    echo "  version         Version/tag to deploy [default: current git commit]"
    echo ""
    echo "Available services:"
    for service in "${AVAILABLE_SERVICES[@]}"; do
        echo "  - $service"
    done
    echo ""
    echo "Examples:"
    echo "  $0 cms-service"
    echo "  $0 identity-service production"
    echo "  $0 payment-service staging v1.2.3"
}

validate_service() {
    local service="$1"
    for available in "${AVAILABLE_SERVICES[@]}"; do
        if [ "$service" = "$available" ]; then
            return 0
        fi
    done
    return 1
}

check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check if service exists
    if [ -z "$SERVICE_NAME" ]; then
        echo -e "${RED}❌ Service name is required${NC}"
        usage
        exit 1
    fi
    
    if ! validate_service "$SERVICE_NAME"; then
        echo -e "${RED}❌ Invalid service: $SERVICE_NAME${NC}"
        usage
        exit 1
    fi
    
    # Check if Dockerfile exists
    if [ ! -f "apps/${SERVICE_NAME}/prod.Dockerfile" ]; then
        echo -e "${RED}❌ prod.Dockerfile not found for $SERVICE_NAME${NC}"
        exit 1
    fi
    
    # Check required tools
    for tool in docker aws kubectl; do
        if ! command -v "$tool" &> /dev/null; then
            echo -e "${RED}❌ $tool is not installed${NC}"
            exit 1
        fi
    done
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

build_and_push() {
    echo -e "${BLUE}🏗️ Building and pushing $SERVICE_NAME:$VERSION...${NC}"
    
    IMAGE_NAME="${REGISTRY}/pothys-microservice/${SERVICE_NAME}:${VERSION}"
    IMAGE_LATEST="${REGISTRY}/pothys-microservice/${SERVICE_NAME}:latest"
    
    # ECR Login
    echo -e "${BLUE}👉 Logging into ECR...${NC}"
    aws ecr get-login-password --region "$AWS_REGION" | \
        docker login --username AWS --password-stdin "$REGISTRY"
    
    # Build image
    echo -e "${BLUE}👉 Building Docker image...${NC}"
    docker build -t "$IMAGE_NAME" -t "$IMAGE_LATEST" \
        -f "apps/${SERVICE_NAME}/prod.Dockerfile" .
    
    # Push images
    echo -e "${BLUE}👉 Pushing images to ECR...${NC}"
    docker push "$IMAGE_NAME"
    docker push "$IMAGE_LATEST"
    
    echo -e "${GREEN}✅ $SERVICE_NAME:$VERSION pushed successfully${NC}"
}

deploy_to_kubernetes() {
    echo -e "${BLUE}🚀 Deploying to Kubernetes ($ENVIRONMENT)...${NC}"
    
    # Update kubeconfig
    aws eks --region "$AWS_REGION" update-kubeconfig --name "$EKS_CLUSTER_NAME"
    
    # Check if deployment exists
    if ! kubectl get deployment "$SERVICE_NAME" -n "$EKS_NAMESPACE" >/dev/null 2>&1; then
        echo -e "${RED}❌ Deployment $SERVICE_NAME not found in $EKS_NAMESPACE namespace${NC}"
        echo -e "${YELLOW}Available deployments:${NC}"
        kubectl get deployments -n "$EKS_NAMESPACE" || echo "No deployments found"
        exit 1
    fi
    
    # Update deployment image
    kubectl set image deployment/"$SERVICE_NAME" \
        "$SERVICE_NAME=${REGISTRY}/pothys-microservice/${SERVICE_NAME}:${VERSION}" \
        -n "$EKS_NAMESPACE"
    
    # Restart deployment
    kubectl rollout restart deployment/"$SERVICE_NAME" -n "$EKS_NAMESPACE"
    
    # Wait for rollout to complete
    echo -e "${BLUE}👉 Waiting for deployment to complete...${NC}"
    kubectl rollout status deployment/"$SERVICE_NAME" -n "$EKS_NAMESPACE" --timeout=300s
    
    echo -e "${GREEN}✅ $SERVICE_NAME deployed successfully to $ENVIRONMENT${NC}"
}

show_deployment_status() {
    echo -e "${BLUE}📊 Deployment Status:${NC}"
    echo -e "  Service: ${GREEN}$SERVICE_NAME${NC}"
    echo -e "  Environment: ${GREEN}$ENVIRONMENT${NC}"
    echo -e "  Version: ${GREEN}$VERSION${NC}"
    echo -e "  Namespace: ${GREEN}$EKS_NAMESPACE${NC}"
    echo -e "  Registry: ${GREEN}$REGISTRY${NC}"
    echo ""
    
    # Show pod status
    echo -e "${BLUE}🏃 Pod Status:${NC}"
    kubectl get pods -n "$EKS_NAMESPACE" -l app="$SERVICE_NAME" -o wide
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Pothys Service Deployment Script${NC}"
    echo -e "${BLUE}====================================${NC}"
    
    check_prerequisites
    build_and_push
    deploy_to_kubernetes
    show_deployment_status
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
}

# Execute main function
main "$@"