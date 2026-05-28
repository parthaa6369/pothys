# Selective Deployment System

This directory contains scripts and configurations for implementing selective deployment in the Pothys microservices architecture. Only the services that have been modified will be deployed, optimizing CI/CD pipeline performance and reducing deployment risks.

## 🚀 Quick Start

### Using the Scripts Locally

1. **Detect Changes**

   ```bash
   ./scripts/detect-changes.sh
   ```

2. **Deploy a Specific Service**

   ```bash
   ./scripts/deploy-service.sh cms-service staging
   ```

3. **Monitor Services**

   ```bash
   ./scripts/monitor-services.sh staging
   ```

4. **Rollback a Service**
   ```bash
   ./scripts/rollback-service.sh cms-service staging
   ```

## 📁 Files Overview

### Scripts

- **`detect-changes.sh`** - Detects which services need deployment based on git changes
- **`deploy-service.sh`** - Manual deployment script for individual services
- **`rollback-service.sh`** - Rollback deployment to previous version
- **`monitor-services.sh`** - Interactive service monitoring dashboard

### Configuration

- **`deployment-config.yaml`** - Service dependencies and deployment configuration
- **`Jenkinsfile`** - Updated Jenkins pipeline with selective deployment
- **`.github/workflows/selective-deployment.yml`** - GitHub Actions workflow

## 🔍 How Selective Deployment Works

### 1. Change Detection

The system analyzes git changes between commits to determine which services need deployment:

- **Service-specific changes**: Changes in `apps/{service}/` trigger deployment of that service
- **Shared dependencies**: Changes in `libs/`, `package.json`, etc. trigger deployment of all services
- **Force deployment**: Manual override to deploy all services

### 2. Deployment Decision Matrix

```
Change Location          → Services Deployed
apps/cms-service/       → cms-service only
apps/identity-service/  → identity-service only
libs/                   → All services
package.json            → All services
docker/                 → All services
```

### 3. Parallel Deployment

Services are deployed in parallel to minimize total deployment time while maintaining isolation.

## 🛠️ Configuration

### Environment Variables

```bash
# AWS Configuration
AWS_REGION=ap-southeast-5
AWS_ACCOUNT_ID=311141556953
REGISTRY=311141556953.dkr.ecr.ap-southeast-5.amazonaws.com

# Kubernetes Configuration
EKS_CLUSTER_NAME=asb-microservices-cluster
EKS_NAMESPACE=staging

# Deployment Control
FORCE_DEPLOY_ALL=false  # Set to true to deploy all services
```

### Available Services

- `cms-service`
- `identity-service`
- `payment-service`
- `portfolio-service`
- `transaction-service`

### Environments

- **Staging**: `staging` namespace in `asb-microservices-cluster`
- **Production**: `production` namespace in `asb-microservices-prod-cluster`

## 📋 Usage Examples

### Jenkins Pipeline

The updated `Jenkinsfile` automatically:

1. Detects changes between commits
2. Builds only affected services
3. Deploys services in parallel
4. Provides deployment summary

**Manual trigger with parameters:**

- `FORCE_DEPLOY_ALL`: Deploy all services regardless of changes
- `ENVIRONMENT`: Target environment (staging/production)

### GitHub Actions

The GitHub Actions workflow provides:

1. Automatic change detection on push to main
2. Parallel service deployment
3. Environment-based deployment
4. Manual workflow dispatch with parameters

**Workflow inputs:**

- `force_deploy_all`: Boolean to force deploy all services
- `environment`: Target environment (staging/production)

### Local Development

**Check what would be deployed:**

```bash
# Detect changes since last commit
./scripts/detect-changes.sh

# Detect changes between specific commits
./scripts/detect-changes.sh HEAD~3 HEAD
```

**Deploy a single service manually:**

```bash
# Deploy to staging (default)
./scripts/deploy-service.sh cms-service

# Deploy to production
./scripts/deploy-service.sh cms-service production

# Deploy specific version
./scripts/deploy-service.sh cms-service staging v1.2.3
```

**Monitor deployments:**

```bash
# Interactive monitoring dashboard
./scripts/monitor-services.sh staging

# Quick health check
kubectl get deployments -n staging
```

**Rollback if needed:**

```bash
# Rollback to previous version
./scripts/rollback-service.sh cms-service staging

# Rollback to specific revision
./scripts/rollback-service.sh cms-service staging 2
```

## 🔧 Customization

### Adding New Services

1. Add service to `AVAILABLE_SERVICES` array in scripts
2. Update `deployment-config.yaml` with service configuration
3. Ensure Dockerfile exists at `apps/{service}/prod.Dockerfile`
4. Add Kubernetes deployment and service manifests

### Modifying Dependencies

Edit the `SHARED_DEPENDENCIES` mapping in `detect-changes.sh` to customize which file changes trigger full rebuilds.

### Environment Configuration

Update environment-specific settings in:

- `deployment-config.yaml` for service configuration
- Scripts for cluster names and namespaces
- CI/CD workflows for deployment targets

## 🚨 Troubleshooting

### Common Issues

1. **Service not found in Kubernetes**
   - Verify deployment exists: `kubectl get deployments -n {namespace}`
   - Check service name matches exactly

2. **ECR login failures**
   - Verify AWS credentials are configured
   - Check ECR repository exists and has proper permissions

3. **Change detection not working**
   - Ensure git history is available (fetch-depth: 0 in GitHub Actions)
   - Check file patterns match actual repository structure

4. **Deployment timeout**
   - Check pod logs: `kubectl logs deployment/{service} -n {namespace}`
   - Verify resource requests/limits
   - Check node capacity

### Debugging Commands

```bash
# Check deployment status
kubectl describe deployment {service} -n {namespace}

# View pod logs
kubectl logs -l app={service} -n {namespace} --tail=100

# Check events
kubectl get events -n {namespace} --sort-by='.lastTimestamp'

# View rollout history
kubectl rollout history deployment/{service} -n {namespace}
```

## 📊 Benefits

### Performance Improvements

- **Faster deployments**: Only changed services are deployed
- **Parallel execution**: Multiple services deploy simultaneously
- **Reduced resource usage**: Less compute and network overhead

### Risk Reduction

- **Isolated deployments**: Issues with one service don't affect others
- **Easier rollbacks**: Rollback only affected services
- **Clear change tracking**: Know exactly what's being deployed

### Developer Experience

- **Visual feedback**: Clear indication of what's being deployed
- **Interactive monitoring**: Real-time service status dashboard
- **Manual override**: Force deployment when needed

## 🔐 Security Considerations

- AWS credentials should be stored as secrets in CI/CD systems
- Kubernetes RBAC should limit deployment permissions
- Docker images should be scanned for vulnerabilities
- Production deployments should require manual approval

## 📈 Monitoring and Alerting

The monitoring script provides:

- Real-time service health status
- Resource usage metrics
- Recent deployment events
- Pod logs access

For production environments, consider integrating with:

- Prometheus for metrics collection
- Grafana for visualization
- AlertManager for notifications
- ELK stack for centralized logging
