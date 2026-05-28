#!/bin/bash

# Service status monitoring script
# Usage: ./monitor-services.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="${1:-staging}"

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

setup_kubectl() {
    echo -e "${BLUE}🔧 Setting up kubectl...${NC}"
    aws eks --region "$AWS_REGION" update-kubeconfig --name "$EKS_CLUSTER_NAME"
}

show_cluster_info() {
    echo -e "${BLUE}🏛️ Cluster Information:${NC}"
    echo -e "  Environment: ${GREEN}$ENVIRONMENT${NC}"
    echo -e "  Cluster: ${GREEN}$EKS_CLUSTER_NAME${NC}"
    echo -e "  Namespace: ${GREEN}$EKS_NAMESPACE${NC}"
    echo -e "  Region: ${GREEN}$AWS_REGION${NC}"
    echo ""
}

show_service_status() {
    echo -e "${BLUE}📊 Service Status Overview:${NC}"
    echo "=============================="
    
    # Check deployments
    echo -e "${BLUE}🚀 Deployments:${NC}"
    kubectl get deployments -n "$EKS_NAMESPACE" -o wide
    echo ""
    
    # Check services
    echo -e "${BLUE}🌐 Services:${NC}"
    kubectl get services -n "$EKS_NAMESPACE" -o wide
    echo ""
    
    # Check pods
    echo -e "${BLUE}🏃 Pods:${NC}"
    kubectl get pods -n "$EKS_NAMESPACE" -o wide
    echo ""
}

show_detailed_service_info() {
    echo -e "${BLUE}📋 Detailed Service Information:${NC}"
    echo "================================="
    
    for service in "${AVAILABLE_SERVICES[@]}"; do
        echo -e "${YELLOW}📦 $service:${NC}"
        
        if kubectl get deployment "$service" -n "$EKS_NAMESPACE" >/dev/null 2>&1; then
            # Deployment status
            READY=$(kubectl get deployment "$service" -n "$EKS_NAMESPACE" -o jsonpath='{.status.readyReplicas}')
            DESIRED=$(kubectl get deployment "$service" -n "$EKS_NAMESPACE" -o jsonpath='{.spec.replicas}')
            IMAGE=$(kubectl get deployment "$service" -n "$EKS_NAMESPACE" -o jsonpath='{.spec.template.spec.containers[0].image}')
            
            if [ "$READY" = "$DESIRED" ]; then
                STATUS_COLOR="$GREEN"
                STATUS="✅ Healthy"
            else
                STATUS_COLOR="$RED"
                STATUS="❌ Unhealthy"
            fi
            
            echo -e "  Status: ${STATUS_COLOR}$STATUS${NC} ($READY/$DESIRED replicas)"
            echo -e "  Image: $IMAGE"
            
            # Show recent events
            echo -e "  Recent Events:"
            kubectl get events -n "$EKS_NAMESPACE" --field-selector involvedObject.name="$service" --sort-by='.lastTimestamp' | tail -3 | sed 's/^/    /'
        else
            echo -e "  Status: ${RED}❌ Not Found${NC}"
        fi
        echo ""
    done
}

show_resource_usage() {
    echo -e "${BLUE}💾 Resource Usage:${NC}"
    echo "=================="
    
    # Node information
    echo -e "${BLUE}🖥️ Nodes:${NC}"
    kubectl top nodes 2>/dev/null || echo "Metrics server not available"
    echo ""
    
    # Pod resource usage
    echo -e "${BLUE}🏃 Pod Resource Usage:${NC}"
    kubectl top pods -n "$EKS_NAMESPACE" 2>/dev/null || echo "Metrics server not available"
    echo ""
}

check_service_health() {
    echo -e "${BLUE}🏥 Service Health Check:${NC}"
    echo "======================="
    
    for service in "${AVAILABLE_SERVICES[@]}"; do
        if kubectl get deployment "$service" -n "$EKS_NAMESPACE" >/dev/null 2>&1; then
            READY=$(kubectl get deployment "$service" -n "$EKS_NAMESPACE" -o jsonpath='{.status.readyReplicas}')
            DESIRED=$(kubectl get deployment "$service" -n "$EKS_NAMESPACE" -o jsonpath='{.spec.replicas}')
            
            if [ "$READY" = "$DESIRED" ] && [ "$READY" -gt 0 ]; then
                echo -e "  ${GREEN}✅ $service: Healthy ($READY/$DESIRED)${NC}"
            else
                echo -e "  ${RED}❌ $service: Unhealthy ($READY/$DESIRED)${NC}"
                
                # Show problematic pods
                echo -e "    ${YELLOW}Problematic pods:${NC}"
                kubectl get pods -n "$EKS_NAMESPACE" -l app="$service" --field-selector='status.phase!=Running' | sed 's/^/      /'
            fi
        else
            echo -e "  ${RED}❌ $service: Not deployed${NC}"
        fi
    done
    echo ""
}

show_logs() {
    local service="$1"
    local lines="${2:-50}"
    
    if [ -z "$service" ]; then
        echo -e "${YELLOW}📋 Available services for logs:${NC}"
        for svc in "${AVAILABLE_SERVICES[@]}"; do
            echo "  - $svc"
        done
        return
    fi
    
    echo -e "${BLUE}📜 Recent logs for $service (last $lines lines):${NC}"
    echo "============================================="
    
    if kubectl get deployment "$service" -n "$EKS_NAMESPACE" >/dev/null 2>&1; then
        kubectl logs deployment/"$service" -n "$EKS_NAMESPACE" --tail="$lines"
    else
        echo -e "${RED}❌ Service $service not found${NC}"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🔍 Pothys Service Monitor${NC}"
    echo -e "${BLUE}=========================${NC}"
    
    # Check if kubectl is available
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}❌ kubectl is not installed${NC}"
        exit 1
    fi
    
    setup_kubectl
    show_cluster_info
    
    # Interactive menu
    while true; do
        echo -e "${BLUE}Select an option:${NC}"
        echo "1. Service Status Overview"
        echo "2. Detailed Service Information"
        echo "3. Resource Usage"
        echo "4. Health Check"
        echo "5. View Service Logs"
        echo "6. Refresh All"
        echo "7. Exit"
        echo ""
        
        read -p "Enter your choice (1-7): " choice
        
        case $choice in
            1)
                show_service_status
                ;;
            2)
                show_detailed_service_info
                ;;
            3)
                show_resource_usage
                ;;
            4)
                check_service_health
                ;;
            5)
                echo -n "Enter service name: "
                read service_name
                echo -n "Number of lines (default 50): "
                read log_lines
                show_logs "$service_name" "${log_lines:-50}"
                ;;
            6)
                clear
                show_cluster_info
                show_service_status
                show_detailed_service_info
                check_service_health
                ;;
            7)
                echo -e "${GREEN}👋 Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid choice. Please enter 1-7.${NC}"
                ;;
        esac
        
        echo ""
        echo -e "${YELLOW}Press Enter to continue...${NC}"
        read
        clear
    done
}

# Execute main function
main "$@"