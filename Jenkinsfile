pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Sarim-Ali-Shah/bazaar-hub.git'
            }
        }
        stage('Build') {
            steps {
                sh 'docker-compose -f docker-compose-ci.yml up -d --build'
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished!'
        }
    }
}