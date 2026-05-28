#!/bin/bash

# Rollback deployment script
# Usage: ./rollback-service.sh <service-name> [environment] [revision]

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
REVISION="${3:-}" # If empty, rollback to previous revision

# Configuration
AWS_REGION="ap-southeast-5"

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
    echo "Usage: $0 <service-name> [environment] [revision]"
    echo ""
    echo "Arguments:"
    echo "  service-name    Name of the service to rollback"
    echo "  environment     Target environment (staging|production) [default: staging]"
    echo "  revision        Specific revision to rollback to [default: previous]"
    echo ""
    echo "Available services:"
    for service in "${AVAILABLE_SERVICES[@]}"; do
        echo "  - $service"
    done
    echo ""
    echo "Examples:"
    echo "  $0 cms-service"
    echo "  $0 identity-service production"
    echo "  $0 payment-service staging 2"
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
    
    # Check required tools
    for tool in aws kubectl; do
        if ! command -v "$tool" &> /dev/null; then
            echo -e "${RED}❌ $tool is not installed${NC}"
            exit 1
        fi
    done
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

show_rollout_history() {
    echo -e "${BLUE}📋 Rollout History for $SERVICE_NAME:${NC}"
    kubectl rollout history deployment/"$SERVICE_NAME" -n "$EKS_NAMESPACE"
}

perform_rollback() {
    echo -e "${BLUE}🔄 Performing rollback for $SERVICE_NAME...${NC}"
    
    # Update kubeconfig
    aws eks --region "$AWS_REGION" update-kubeconfig --name "$EKS_CLUSTER_NAME"
    
    # Check if deployment exists
    if ! kubectl get deployment "$SERVICE_NAME" -n "$EKS_NAMESPACE" >/dev/null 2>&1; then
        echo -e "${RED}❌ Deployment $SERVICE_NAME not found in $EKS_NAMESPACE namespace${NC}"
        exit 1
    fi
    
    # Perform rollback
    if [ -n "$REVISION" ]; then
        echo -e "${BLUE}👉 Rolling back to revision $REVISION...${NC}"
        kubectl rollout undo deployment/"$SERVICE_NAME" --to-revision="$REVISION" -n "$EKS_NAMESPACE"
    else
        echo -e "${BLUE}👉 Rolling back to previous revision...${NC}"
        kubectl rollout undo deployment/"$SERVICE_NAME" -n "$EKS_NAMESPACE"
    fi
    
    # Wait for rollback to complete
    echo -e "${BLUE}👉 Waiting for rollback to complete...${NC}"
    kubectl rollout status deployment/"$SERVICE_NAME" -n "$EKS_NAMESPACE" --timeout=300s
    
    echo -e "${GREEN}✅ Rollback completed successfully${NC}"
}

show_deployment_status() {
    echo -e "${BLUE}📊 Current Deployment Status:${NC}"
    echo -e "  Service: ${GREEN}$SERVICE_NAME${NC}"
    echo -e "  Environment: ${GREEN}$ENVIRONMENT${NC}"
    echo -e "  Namespace: ${GREEN}$EKS_NAMESPACE${NC}"
    echo ""
    
    # Show deployment details
    kubectl describe deployment "$SERVICE_NAME" -n "$EKS_NAMESPACE"
    
    echo ""
    echo -e "${BLUE}🏃 Pod Status:${NC}"
    kubectl get pods -n "$EKS_NAMESPACE" -l app="$SERVICE_NAME" -o wide
}

# Main execution
main() {
    echo -e "${BLUE}🔄 Pothys Service Rollback Script${NC}"
    echo -e "${BLUE}==================================${NC}"
    
    check_prerequisites
    show_rollout_history
    
    # Confirm rollback
    echo -e "${YELLOW}⚠️  Are you sure you want to rollback $SERVICE_NAME in $ENVIRONMENT?${NC}"
    read -p "Type 'yes' to continue: " confirmation
    
    if [ "$confirmation" != "yes" ]; then
        echo -e "${YELLOW}❌ Rollback cancelled${NC}"
        exit 0
    fi
    
    perform_rollback
    show_deployment_status
    
    echo -e "${GREEN}🎉 Rollback completed successfully!${NC}"
}

# Execute main function
main "$@"