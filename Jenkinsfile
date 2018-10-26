#!groovy

@Library('ecs-jenkins-lib@v1.0.0') _

pipeline {
    agent any

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['staging', "prod"], description: 'Choose an environment.')
    }

    options {
        timeout(time: 1, unit: 'HOURS')
    }

    environment {
        APPLICATION = "paypal"
        BRANCH = "${"${env.ENVIRONMENT}" == "staging" ? "staging" : "master"}"
        VERSION = "${env.ENVIRONMENT}-${env.BRANCH}-${env.BUILD_NUMBER.toInteger()}"

        IAM_ROLE = "ecr:eu-west-2:ICM-AWS"
        REPO_URL = "https://github.com/ICMarkets/paypal-login-button-server.git"
        GIT_CRED_ID = "github-navjot"
        DOCKER_REPO_URL = "466803351965.dkr.ecr.eu-west-2.amazonaws.com"
        REGION = "eu-west-2"

        CLUSTER_NAME="icm-${params.ENVIRONMENT}-cluster"
        SERVICE_NAME="icm-${params.ENVIRONMENT}-${env.APPLICATION}-service"
        TASK_FAMILY="icm-${params.ENVIRONMENT}-${env.APPLICATION}-td"
        IMAGE_TO_DEPLOY = "${DOCKER_REPO_URL}/${APPLICATION}:${env.VERSION}"

    }

    // Stages
    stages {
        stage('Clean workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Code checkout') {
            steps {
                git branch: "${env.BRANCH}", changelog: false, credentialsId: "${env.GIT_CRED_ID}", poll: false, url: "${env.REPO_URL}"
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    docker.withRegistry("https://${env.DOCKER_REPO_URL}", "${env.IAM_ROLE}") {
                        IMAGENAME = "${env.DOCKER_REPO_URL}/${env.APPLICATION}"
                        image = docker.build("${IMAGENAME}")
                        docker.image("${IMAGENAME}").push("${env.VERSION}")
                        docker.image("${IMAGENAME}").push("${env.ENVIRONMENT}-latest")
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    ecs.deploy("${env.CLUSTER_NAME}", "${env.SERVICE_NAME}", "${env.TASK_FAMILY}", "${env.IMAGE_TO_DEPLOY}", "${env.REGION}", true)
                }
            }
        }


    }

    // Post actions
    post {
        aborted {
            echo('WARNING: Build process is aborted')
        }
        failure {
            echo('ERROR: Build process failed')
        }
        success {
            echo('INFO: Build process completed successfully')
        }
    }
}
