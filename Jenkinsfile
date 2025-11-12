def acrName = "mycicdacr8957" 
def appName = "my-cicd-todo-app-9495" 
def resourceGroup = "MyTodoAppRG"
def dockerImageName = "${acrName}.azurecr.io/todo-app:${env.BUILD_NUMBER}"

pipeline {
    agent any 

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Installing dependencies and running tests...'
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
                withCredentials([usernamePassword(credentialsId: 'acr-creds', usernameVariable: 'ACR_USERNAME', passwordVariable: 'ACR_PASSWORD')]) {
                    bat "docker login ${acrName}.azurecr.io -u %ACR_USERNAME% -p %ACR_PASSWORD%"
                    bat "docker push ${dockerImageName}"
                }
            }
        }

        stage('Deploy to Azure App Service') {
            steps {
                echo "Logging in to Azure CLI and deploying..."
                withCredentials([azureServicePrincipal('azure-sp')]) {
                    bat 'az login --service-principal -u %AZURE_CLIENT_ID% -p %AZURE_CLIENT_SECRET% -t %AZURE_TENANT_ID%'
                    bat "az webapp config container set --name ${appName} --resource-group ${resourceGroup} --docker-custom-image-name ${dockerImageName}"
                    bat 'az logout'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished. Cleaning up workspace.'
            bat "docker logout ${acrName}.azurecr.io"
        }
    }
}