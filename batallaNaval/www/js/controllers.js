angular.module('starter.controllers', ['ngDragDrop'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup) {

  var base = new Firebase("https://batalla-naval-3d1b2.firebaseio.com");
  var provider = new firebase.auth.GoogleAuthProvider();
  $scope.loginUser;
  $scope.loginPassword;
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function(loginUser, loginPassword) {
    base.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
  };

  $scope.logout = function(){
    $scope.data = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      title: 'Desea cerrar sesion?',
      scope: $scope,
      buttons: [
        { text: 'No' },
        {
          text: 'Si',
          type: 'button-positive',
          onTap: function(e) {
            firebase.auth().signOut();
            $scope.modal.show();
          }
        }
        ]
      });
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(loginUser, loginPassword) {
    firebase.auth().signInWithEmailAndPassword(loginUser, loginPassword).then(function(result) {
      console.log(JSON.stringify(result));
      $scope.modal.hide();
      window.location.href="#/app/jugar"
    }, function(error) {                  
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/wrong-password') {
            alert('La contraseña es incorrecta');
          } else {
            if(errorCode=='auth/user-not-found')
            {
              alert('El usuario no existe');
            }
            else
            {
               alert(errorMessage);
            }
          }
          console.log(error);

      });

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    
  };
})

.controller('JugarCtrl', function($scope) {

})

