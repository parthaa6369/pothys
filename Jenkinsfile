pipeline {
    agent {
        kubernetes {
            cloud 'eks-docker-agents'
            inheritFrom 'docker-dind-agent'
            defaultContainer 'jnlp'
        }
    }

    environment {
        AWS_REGION        = "ap-southeast-5"
        AWS_ACCOUNT_ID    = "311141556953"
        REGISTRY          = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        GIT_COMMIT_HASH   = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
        VERSION           = "${GIT_COMMIT_HASH}"
        EKS_CLUSTER_NAME  = "asb-microservices-cluster"
        EKS_NAMESPACE     = "staging"
        DOCKER_HOST       = "tcp://localhost:2375"
        HOME              = "/home/jenkins/agent"
        // Force deploy all services if needed (set to 'true' for full deployment)
        FORCE_DEPLOY_ALL  = "${params.FORCE_DEPLOY_ALL ?: 'false'}"
    }

    parameters {
        booleanParam(
            name: 'FORCE_DEPLOY_ALL',
            defaultValue: false,
            description: 'Force deployment of all services regardless of changes'
        )
        choice(
            name: 'ENVIRONMENT',
            choices: ['staging', 'production'],
            description: 'Target environment for deployment'
        )
    }

    stages {
        stage('Run only on main') {
            when {
                branch 'main'
            }
            stages {
                stage('Build:Version') {
                    steps {
                        echo "🔖 Building version: ${VERSION}"
                        echo "🎯 Target environment: ${params.ENVIRONMENT}"
                        echo "🚀 Force deploy all: ${FORCE_DEPLOY_ALL}"
                    }
                }

                stage('Detect Changes') {
                    steps {
                        script {
                            container('node') {
                                sh '''
                                echo "🔍 Detecting service changes..."
                                chmod +x scripts/detect-changes.sh
                                
                                # Run change detection
                                set +e
                                FORCE_DEPLOY_ALL=${FORCE_DEPLOY_ALL} ./scripts/detect-changes.sh
                                DETECTION_EXIT_CODE=$?
                                set -e
                                
                                case $DETECTION_EXIT_CODE in
                                    0)
                                        echo "✅ Selective deployment needed"
                                        ;;
                                    10)
                                        echo "ℹ️ No deployment needed"
                                        ;;
                                    20)
                                        echo "🔄 Full rebuild required"
                                        ;;
                                    *)
                                        echo "❌ Change detection failed"
                                        exit 1
                                        ;;
                                esac
                                
                                # Store deployment matrix for next stages
                                if [ -f /tmp/deployment-matrix.json ]; then
                                    cp /tmp/deployment-matrix.json deployment-matrix.json
                                    echo "📋 Deployment matrix:"
                                    cat deployment-matrix.json
                                else
                                    echo '{"services": []}' > deployment-matrix.json
                                fi
                                '''
                                
                                // Read deployment matrix
                                def deploymentMatrix = readJSON file: 'deployment-matrix.json'
                                env.SERVICES_TO_DEPLOY = deploymentMatrix.services.join(',')
                                env.DEPLOYMENT_COUNT = deploymentMatrix.services.size().toString()
                                
                                echo "📋 Services to deploy: ${env.SERVICES_TO_DEPLOY}"
                                echo "📊 Total services: ${env.DEPLOYMENT_COUNT}"
                            }
                        }
                    }
                }

                stage('Setup & Build') {
                    when {
                        expression { env.DEPLOYMENT_COUNT.toInteger() > 0 }
                    }
                    parallel {
                        stage('Setup PNPM & Build') {
                            steps {
                                container('node') {
                                    sh '''
                                    apk add --no-cache docker-cli

                                    echo "👉 Waiting for Docker daemon to be ready..."
                                    timeout 120s sh -c 'until docker info >/dev/null 2>&1; do
                                        echo "Waiting for Docker daemon..."
                                        sleep 3
                                    done'
                                    echo "✅ Docker daemon is ready"
                                    docker version

                                    set -e
                                    echo "👉 Installing pnpm via npm..."
                                    npm install -g pnpm
                                    pnpm --version

                                    echo "👉 Installing dependencies..."
                                    pnpm install --frozen-lockfile

                                    echo "👉 Building libraries..."
                                    pnpm run build:libs
                                    echo "✅ Build setup completed"
                                    '''
                                }
                            }
                        }

                        stage('Docker Daemon Check') {
                            steps {
                                container('docker') {
                                    sh '''
                                    echo "👉 Checking Docker daemon..."
                                    timeout 120s sh -c 'until docker info >/dev/null 2>&1; do
                                        echo "Waiting for Docker daemon..."
                                        sleep 3
                                    done'
                                    echo "✅ Docker daemon is ready"
                                    docker info
                                    '''
                                }
                            }
                        }
                    }
                }

                stage('Deploy:Microservices') {
                    when {
                        expression { env.DEPLOYMENT_COUNT.toInteger() > 0 }
                    }
                    steps {
                        script {
                            def servicesToDeploy = env.SERVICES_TO_DEPLOY.split(',')
                            
                            if (servicesToDeploy.size() == 0) {
                                echo "ℹ️ No services to deploy - skipping deployment stage"
                                return
                            }
                            
                            echo "🚀 Deploying ${servicesToDeploy.size()} service(s): ${servicesToDeploy.join(', ')}"
                            
                            // Deploy services in parallel for faster deployment
                            def deploymentStages = [:]
                            
                            for (service in servicesToDeploy) {
                                deploymentStages["Deploy ${service}"] = {
                                    stage("Deploy ${service}") {
                                        container('docker') {
                                            sh """
                                            set -e
                                            apk add --no-cache aws-cli curl

                                            curl -LO "https://dl.k8s.io/release/\$(curl -sL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                                            chmod +x kubectl
                                            mv kubectl /usr/local/bin/

                                            echo "👉 ECR Login..."
                                            aws ecr get-login-password --region ${AWS_REGION} | \
                                                docker login --username AWS --password-stdin ${REGISTRY}

                                            echo "👉 Building ${service}..."
                                            IMAGE_NAME=${REGISTRY}/pothys-microservice/${service}:${VERSION}
                                            IMAGE_LATEST=${REGISTRY}/pothys-microservice/${service}:latest

                                            if [ -f "apps/${service}/prod.Dockerfile" ]; then
                                                docker build -t \$IMAGE_NAME -t \$IMAGE_LATEST \
                                                    -f apps/${service}/prod.Dockerfile .
                                            else
                                                echo "❌ prod.Dockerfile not found for ${service}"
                                                exit 1
                                            fi

                                            echo "👉 Pushing images..."
                                            docker push \$IMAGE_NAME
                                            docker push \$IMAGE_LATEST
                                            echo "✅ ${service} pushed successfully"

                                            echo "👉 Updating Kubernetes deployment..."
                                            aws eks --region ${AWS_REGION} update-kubeconfig --name ${EKS_CLUSTER_NAME}

                                            if kubectl get deployment ${service} -n ${EKS_NAMESPACE} >/dev/null 2>&1; then
                                                kubectl set image deployment/${service} \
                                                    ${service}=${REGISTRY}/pothys-microservice/${service}:${VERSION} \
                                                    -n ${EKS_NAMESPACE}
                                                    
                                                kubectl rollout restart deployment/${service} -n ${EKS_NAMESPACE}
                                                kubectl rollout status deployment/${service} -n ${EKS_NAMESPACE} --timeout=300s
                                                echo "✅ ${service} deployed successfully"
                                            else
                                                echo "❌ Deployment ${service} not found in ${EKS_NAMESPACE}"
                                                kubectl get deployments -n ${EKS_NAMESPACE} || echo "No deployments found"
                                                exit 1
                                            fi
                                            """
                                        }
                                    }
                                }
                            }
                            
                            // Execute all deployments in parallel
                            parallel deploymentStages
                        }
                    }
                }
                
                stage('Deployment Summary') {
                    when {
                        expression { env.DEPLOYMENT_COUNT.toInteger() > 0 }
                    }
                    steps {
                        script {
                            def servicesToDeploy = env.SERVICES_TO_DEPLOY.split(',')
                            echo "🎉 Deployment Summary:"
                            echo "📊 Total services deployed: ${servicesToDeploy.size()}"
                            echo "🚀 Services: ${servicesToDeploy.join(', ')}"
                            echo "🏷️ Version: ${VERSION}"
                            echo "🌍 Environment: ${params.ENVIRONMENT}"
                        }
                    }
                }
                
                stage('No Deployment Needed') {
                    when {
                        expression { env.DEPLOYMENT_COUNT.toInteger() == 0 }
                    }
                    steps {
                        echo "ℹ️ No services need deployment - all services are up to date"
                        echo "🔍 No changes detected in any service directories or shared dependencies"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                try {
                    cleanWs()
                } catch (Exception e) {
                    echo "⚠️ Warning: Could not clean workspace: ${e.getMessage()}"
                }
            }
        }
        failure {
            echo "❌ Pipeline failed. Check the logs above for details."
        }
        success {
            echo "✅ Pipeline completed successfully!"
        }
    }
}
