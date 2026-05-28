#!/bin/bash

# Detect which services need to be deployed based on git changes
set -e

# Default values
PREV_COMMIT="${1:-HEAD~1}"
CURRENT_COMMIT="${2:-HEAD}"
FORCE_DEPLOY_ALL="${FORCE_DEPLOY_ALL:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Detecting changes between ${PREV_COMMIT} and ${CURRENT_COMMIT}${NC}"

# Get all changed files
CHANGED_FILES=""
if git rev-parse --verify ${PREV_COMMIT} >/dev/null 2>&1; then
    CHANGED_FILES=$(git diff --name-only ${PREV_COMMIT} ${CURRENT_COMMIT} 2>/dev/null || echo "")
else
    echo -e "${YELLOW}⚠️  Previous commit ${PREV_COMMIT} not found, treating as initial commit${NC}"
    # For initial commit or when prev commit doesn't exist, get all files
    CHANGED_FILES=$(git ls-files 2>/dev/null || echo "")
fi

if [ -z "$CHANGED_FILES" ] && [ "$FORCE_DEPLOY_ALL" != "true" ]; then
    echo -e "${YELLOW}⚠️  No changes detected${NC}"
    echo "DEPLOY_SERVICES="
    echo '{"services": []}' > "/tmp/deployment-matrix.json"
    exit 10
fi

echo -e "${BLUE}📁 Changed files:${NC}"
echo "$CHANGED_FILES" | sed 's/^/  /'

# Define all available services
SERVICES=(
    "cms-service"
    "identity-service" 
    "payment-service"
    "portfolio-service"
    "transaction-service"
)

# Service dependencies - if these change, which services need to be rebuilt
SHARED_DEPS_LIBS="cms-service identity-service payment-service portfolio-service transaction-service"
SHARED_DEPS_PACKAGE="cms-service identity-service payment-service portfolio-service transaction-service"
SHARED_DEPS_PNPM="cms-service identity-service payment-service portfolio-service transaction-service"
SHARED_DEPS_TSCONFIG="cms-service identity-service payment-service portfolio-service transaction-service"
SHARED_DEPS_DOCKER="cms-service identity-service payment-service portfolio-service transaction-service"
SHARED_DEPS_K8S="cms-service identity-service payment-service portfolio-service transaction-service"

# Arrays to store deployment decisions
DEPLOY_SERVICES=()
REBUILD_ALL=false

echo -e "${BLUE}🔍 Analyzing changes...${NC}"

# Check if force deploy all is enabled
if [ "$FORCE_DEPLOY_ALL" = "true" ]; then
    echo -e "${YELLOW}🚀 FORCE_DEPLOY_ALL is enabled - deploying all services${NC}"
    DEPLOY_SERVICES=("${SERVICES[@]}")
    REBUILD_ALL=true
else
    # Check for shared dependency changes
    if echo "$CHANGED_FILES" | grep -q "^libs/"; then
        echo -e "${YELLOW}⚠️  Shared dependency changed: libs/${NC}"
        echo -e "${YELLOW}   This affects: ${SHARED_DEPS_LIBS}${NC}"
        REBUILD_ALL=true
    elif echo "$CHANGED_FILES" | grep -q "^package.json"; then
        echo -e "${YELLOW}⚠️  Shared dependency changed: package.json${NC}"
        echo -e "${YELLOW}   This affects: ${SHARED_DEPS_PACKAGE}${NC}"
        REBUILD_ALL=true
    elif echo "$CHANGED_FILES" | grep -q "^pnpm-lock.yaml"; then
        echo -e "${YELLOW}⚠️  Shared dependency changed: pnpm-lock.yaml${NC}"
        echo -e "${YELLOW}   This affects: ${SHARED_DEPS_PNPM}${NC}"
        REBUILD_ALL=true
    elif echo "$CHANGED_FILES" | grep -q "^tsconfig.base.json"; then
        echo -e "${YELLOW}⚠️  Shared dependency changed: tsconfig.base.json${NC}"
        echo -e "${YELLOW}   This affects: ${SHARED_DEPS_TSCONFIG}${NC}"
        REBUILD_ALL=true
    elif echo "$CHANGED_FILES" | grep -q "^docker/"; then
        echo -e "${YELLOW}⚠️  Shared dependency changed: docker/${NC}"
        echo -e "${YELLOW}   This affects: ${SHARED_DEPS_DOCKER}${NC}"
        REBUILD_ALL=true
    elif echo "$CHANGED_FILES" | grep -q "^k8s/"; then
        echo -e "${YELLOW}⚠️  Shared dependency changed: k8s/${NC}"
        echo -e "${YELLOW}   This affects: ${SHARED_DEPS_K8S}${NC}"
        REBUILD_ALL=true
    fi

    if [ "$REBUILD_ALL" = "true" ]; then
        DEPLOY_SERVICES=("${SERVICES[@]}")
        echo -e "${YELLOW}🔄 Rebuilding all services due to shared dependency changes${NC}"
    else
        # Check for service-specific changes
        for service in "${SERVICES[@]}"; do
            if echo "$CHANGED_FILES" | grep -q "^apps/${service}/"; then
                echo -e "${GREEN}✅ Changes detected in ${service}${NC}"
                DEPLOY_SERVICES+=("$service")
            fi
        done
    fi
fi

# Output results
if [ ${#DEPLOY_SERVICES[@]} -eq 0 ]; then
    echo -e "${BLUE}ℹ️  No services need deployment${NC}"
    echo "DEPLOY_SERVICES="
else
    echo -e "${GREEN}🚀 Services to deploy:${NC}"
    for service in "${DEPLOY_SERVICES[@]}"; do
        echo -e "  ${GREEN}• ${service}${NC}"
    done
    
    # Output for Jenkins/CI consumption
    DEPLOY_LIST=$(IFS=','; echo "${DEPLOY_SERVICES[*]}")
    echo "DEPLOY_SERVICES=$DEPLOY_LIST"
fi

# Create deployment matrix file for Jenkins
MATRIX_FILE="/tmp/deployment-matrix.json"
if [ ${#DEPLOY_SERVICES[@]} -eq 0 ]; then
    echo '{"services": []}' > "$MATRIX_FILE"
else
    MATRIX_JSON='{"services": ['
    for i in "${!DEPLOY_SERVICES[@]}"; do
        if [ $i -gt 0 ]; then
            MATRIX_JSON+=','
        fi
        MATRIX_JSON+="\"${DEPLOY_SERVICES[$i]}\""
    done
    MATRIX_JSON+=']}'
    echo "$MATRIX_JSON" > "$MATRIX_FILE"
fi

echo -e "${BLUE}📋 Deployment matrix saved to: ${MATRIX_FILE}${NC}"
cat "$MATRIX_FILE"

# Exit with specific codes for different scenarios
if [ ${#DEPLOY_SERVICES[@]} -eq 0 ]; then
    exit 10  # No deployment needed
elif [ "$REBUILD_ALL" = "true" ]; then
    exit 20  # Full rebuild needed
else
    exit 0   # Selective deployment
fi