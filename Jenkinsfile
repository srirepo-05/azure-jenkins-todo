// Get Azure credentials from the Jenkins vault
def acr = credentials('acr-creds')
def appService = credentials('azure-sp')

// --- !!! IMPORTANT: REPLACE THESE TWO VALUES !!! ---
def acrName = "mycicdacr8957" // Paste your ACR name (e.g., "mycicdacr1234")
def appName = "my-cicd-todo-app-9495" // Paste your App name (e.g., "my-cicd-todo-app-5678")
// ---

// Define other pipeline variables
def resourceGroup = "MyTodoAppRG"
def dockerImageName = "${acrName}.azurecr.io/todo-app:${env.BUILD_NUMBER}"

pipeline {
    agent any // Run on any available Jenkins agent

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                // This step is configured in the Jenkins Job (see next phase)
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Installing dependencies and running tests...'
                // 'bat' is for Windows agents, which you are using
                bat 'npm install'
                bat 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${dockerImageName}"
                bat "docker build -t ${dockerImageName} ."
            }
        }

        stage('Push to ACR') {
            steps {
                echo "Logging in to ACR and pushing image..."
                // Use the 'acr-creds' credentials we stored in Jenkins
                bat "docker login ${acrName}.azurecr.io -u ${acr.username} -p ${acr.password}"
                bat "docker push ${dockerImageName}"
            }
        }

        stage('Deploy to Azure App Service') {
            steps {
                echo "Logging in to Azure CLI and deploying..."
                
                // Use the 'azure-sp' service principal credential
                withCredentials([azureServicePrincipal('azure-sp')]) {
                    
                    // 1. Log in to Azure CLI using the Service Principal
                    // %...% is the syntax for Windows batch files
                    bat 'az login --service-principal -u %AZURE_CLIENT_ID% -p %AZURE_CLIENT_SECRET% -t %AZURE_TENANT_ID%'
                    
                    // 2. Tell App Service to pull and run the new image from ACR
                    bat "az webapp config container set --name ${appName} --resource-group ${resourceGroup} --docker-custom-image-name ${dockerImageName}"
                    
                    // 3. Log out of Azure
                    bat 'az logout'
                }
            }
        }
    }

    post {
        // This 'post' block runs after all stages
        always {
            echo 'Pipeline finished. Cleaning up workspace.'
            // Always log out of the Docker registry
            bat "docker logout ${acrName}.azurecr.io"
        }
    }
}