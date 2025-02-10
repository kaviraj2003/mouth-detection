
pipeline {
    agent {
        // define agent details
    }
    stages {
        stage('Example stage 1') {
            steps {
                withCredentials(bindings: [sshUserPrivateKey(credentialsId: 'jenkins-pat-kavi', \
                                                             keyFileVariable: 'SSH_KEY_FOR_ABC')]) {
                  //
                }
            }
        }
        stage('Example stage 2') {
            steps {
                //
            }
        }
    }
}
