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

  $scope.login = function() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        $scope.modal.hide();
        window.location.href="#/app/buscador";
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
      window.location.href="#/app/buscador";
      $scope.enviar();
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
  }

    $scope.enviar=function(){
      var http = new XMLHttpRequest();
      var url =  'https://fcm.googleapis.com/fcm/send';
    
      var params = JSON.stringify({
          "to":"/topics/all",
          "notification":{
              "title":"Batalla Naval",  //Any value
              "body":"Hay una nueva batalla",  //Any value
              "sound":"default", //If you want notification sound
              "click_action":"FCM_PLUGIN_ACTIVITY",  //Must be present for Android
              "icon":"fcm_push_icon"  //White icon Android resource
            },
              "priority":"high" //If not set, notification won't be delivered on completely closed iOS app
        });

      http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/json");
        http.setRequestHeader('Authorization', 'key=AAAA7lgZHa0:APA91bFU108VnIMCYVNrt9dByKE8bs_KMquBR2d8_MxDJoXhhJ0Z4Vs6wKzYamsvZa9zd7MBoOsLFI_VukAF4WRqqLdyguCLkz_FoEolBuXKoPBOZ3x-JOZW4tKvb9MzqVQ6KbaaWu1J');

        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                console.log(http.responseText);
            }
        }
      http.send(params);
    }
}).controller('BuscadorCtrl', function ($scope, $ionicPopup) {
    $scope.irAjugar = function () {
      window.location.href = "#/app/jugar";
    }
  })

  .controller('JugarCtrl', function ($scope, $ionicPopup) {
    var baseDatos = new Firebase("https://batalla-naval-3d1b2.firebaseio.com");
    $scope.posIniF;
    $scope.posIniC;
    $scope.barcoActual = null;
    $scope.sePuedeGuardar = false;
    $scope.myPopup;
    $scope.barcoActual;
    $scope.arrayTableroOcupado = [
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
      [false, false, false, false, false, false]
    ];
    $scope.arrayClases = [
      ['', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['', '', '', '', '', '']
    ];
    $scope.maximosBarcos = [2, 2, 1, 1];
    $scope.arrayBarcos = [];
    $scope.bloquearTablero = false;
    $scope.agregarBarcoPopUp = function (posIniF, posIniC) {

      $scope.posIniF = posIniF;
      $scope.posIniC = posIniC;
      $scope.data = {};
      var botonesCasilleros = ['<button ng-click="agregarBarco(1)" class="button button-positive button-full">Un Casillero</button> ',
        '<button ng-click="agregarBarco(2)" class="button button-positive button-full">Dos Casilleros</button> ',
        '<button ng-click="agregarBarco(3)" class="button button-positive button-full">Tres Casilleros</button> ',
        '<button ng-click="agregarBarco(4)" class="button button-positive button-full">Cuatro Casilleros</button> '];
      function getCasilleros() {
        var maximos = [2, 2, 1, 1];
        var casillerosBoton = ''
        for (var i = 0; i < $scope.arrayBarcos.length; i++) {
          var barco = $scope.arrayBarcos[i];
          maximos[barco.size - 1]--;
        }
        for (var i = 0; i < maximos.length; i++) {
          if (maximos[i] != 0) {
            casillerosBoton += botonesCasilleros[i];
          }
        }
        return casillerosBoton;
      }
      if ($scope.bloquearTablero || !getCasilleros())
        return;
      $scope.cambiarBarcosPorPuntos();
      $scope.myPopup = $ionicPopup.show({
        template: getCasilleros()
        ,
        title: 'Elegí tu barco',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }
        ]
      });
      $scope.myPopup.then(function (res) {
        console.log('Tapped!', res);
      });
    }

    function Barco(posIniC, posIniF, size, isHorizontal) {

      this.posIniC = posIniC;
      this.posIniF = posIniF;
      this.size = size;
      this.isHorizontal = isHorizontal;
    }
    $scope.cambiarBarcosPorPuntos = function () {
      for (var i = 0; i < $scope.arrayClases.length; i++) {
        var elementA = $scope.arrayClases[i];
        for (var j = 0; j < elementA.length; j++) {
          var element = elementA[j];
          if (element != "") {
            $scope.arrayClases[i][j] = "redBox"
          }
        }
      }
      console.log(JSON.stringify($scope.arrayClases))
    }
    $scope.cambiarPuntoPorBarco = function () {

    }
    $scope.agregarBarco = function (size) {

      $scope.bloquearTablero = true;

      $scope.sePuedeGuardar = false;
      $scope.myPopup.close();
      //alert($scope.posIniF + "-" + $scope.posIniC)
      var barco = new Barco($scope.posIniC, $scope.posIniF, size, true);
      $scope.barcoActual = barco;
      console.log($scope.posIniF + " -" + $scope.posIniC)
      $scope.pintarBarcoHorizontal(barco);
      console.log(JSON.stringify($scope.arrayClases))
    }
    $scope.pintarBarcoHorizontal = function (barco) {
      switch (barco.size) {
        case 1:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = "ship-1-1-h"
          $scope.sePuedeGuardar = true;
          break;
        case 2:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = "ship-2-1-h"
          if (barco.posIniC != 5) {
            $scope.sePuedeGuardar = true;
            $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = "ship-2-2-h"
          }

          break;
        case 3:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = "ship-3-1-h"
          if (barco.posIniC < 4) {
            $scope.sePuedeGuardar = true;
            $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = "ship-3-2-h"
            $scope.arrayClases[barco.posIniF][barco.posIniC + 2] = "ship-3-3-h"
          } else {
            if (barco.posIniC == 4) {
              $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = "ship-3-2-h"
            }
          }
          break;
        case 4:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = "ship-4-1-h"
          if (barco.posIniC < 3) {
            $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = "ship-4-2-h"
            $scope.arrayClases[barco.posIniF][barco.posIniC + 2] = "ship-4-3-h"
            $scope.arrayClases[barco.posIniF][barco.posIniC + 3] = "ship-4-4-h"
            $scope.sePuedeGuardar = true;
          } else {
            if (barco.posIniC == 3) {
              $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = "ship-4-2-h"
              $scope.arrayClases[barco.posIniF][barco.posIniC + 2] = "ship-4-3-h"
            } else {
              if (barco.posIniC == 4) {
                $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = "ship-3-2-h"
              }
            }
          }
          break;
      }
    }
    $scope.pintarBarcoVertical = function (barco) {
      switch (barco.size) {
        case 1:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = "ship-1-1-h"
          $scope.sePuedeGuardar = true;
          break;
        case 2:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = "ship-2-1-h"
          if (barco.posIniF != 5) {
            $scope.sePuedeGuardar = true;
            $scope.arrayClases[barco.posIniF + 1][barco.posIniC] = "ship-2-2-h"
          }

          break;
        case 3:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = "ship-3-1-h"
          if (barco.posIniF < 4) {
            $scope.sePuedeGuardar = true;
            $scope.arrayClases[barco.posIniF + 1][barco.posIniC] = "ship-3-2-h"
            $scope.arrayClases[barco.posIniF + 2][barco.posIniC] = "ship-3-3-h"
          } else {
            if (barco.posIniF == 4) {
              $scope.arrayClases[barco.posIniF + 1][barco.posIniC] = "ship-3-2-h"
            }
          }
          break;
        case 4:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = "ship-4-1-h"
          if (barco.posIniF < 3) {
            $scope.arrayClases[barco.posIniF + 1][barco.posIniC] = "ship-4-2-h"
            $scope.arrayClases[barco.posIniF + 2][barco.posIniC] = "ship-4-3-h"
            $scope.arrayClases[barco.posIniF + 2][barco.posIniC] = "ship-4-4-h"
            $scope.sePuedeGuardar = true;
          } else {
            if (barco.posIniF == 3) {
              $scope.arrayClases[barco.posIniF + 1][barco.posIniC] = "ship-4-2-h"
              $scope.arrayClases[barco.posIniF + 2][barco.posIniC] = "ship-4-3-h"
            } else {
              if (barco.posIniF == 4) {
                $scope.arrayClases[barco.posIniF + 2][barco.posIniC] = "ship-3-2-h"
              }
            }
          }
          break;
      }
    }
    $scope.moverBarco = function (tipo) {
      var barco = $scope.barcoActual;
      switch (tipo) {
        case "up":
          if (barco.posIniF != 0) {
            if (barco.isHorizontal) {
              console.log(JSON.stringify($scope.barcoActual))
              $scope.borrarBarcoHorizontal(barco);
              $scope.barcoActual.posIniF--;
              console.log(JSON.stringify($scope.barcoActual))
              $scope.pintarBarcoHorizontal(barco);
            }
            else {
              $scope.borrarBarcoVertical(barco);
              $scope.barcoActual.posIniF--;
              $scope.pintarBarcoVertical(barco);
          }
          break;
        case "down":
          if (barco.posIniF != 5) {
            if (barco.isHorizontal) {
              console.log(JSON.stringify($scope.barcoActual))
              $scope.borrarBarcoHorizontal(barco);
              $scope.barcoActual.posIniF++;
              console.log(JSON.stringify($scope.barcoActual))
              $scope.pintarBarcoHorizontal(barco);
            }
            else {
              $scope.borrarBarcoVertical(barco);
              $scope.barcoActual.posIniF++;
              $scope.pintarBarcoVertical(barco);
            }
          }
          break;
        case "left":
          if (barco.posIniC != 0) {
            if (barco.isHorizontal) {
              console.log(JSON.stringify($scope.barcoActual))
              $scope.borrarBarcoHorizontal(barco);
              $scope.barcoActual.posIniC--;
              console.log(JSON.stringify($scope.barcoActual))
              $scope.pintarBarcoHorizontal(barco);
            }
            else {
              $scope.borrarBarcoVertical(barco);
              $scope.barcoActual.posIniC--;
              $scope.pintarBarcoVertical(barco);
            }
          }
          break;
        case "right":
          if (barco.posIniC != 5) {
            if (barco.isHorizontal) {
              console.log(JSON.stringify($scope.barcoActual))
              $scope.borrarBarcoHorizontal(barco);
              $scope.barcoActual.posIniC++;
              console.log(JSON.stringify($scope.barcoActual))
              $scope.pintarBarcoHorizontal(barco);
            }
            else {
              $scope.borrarBarcoVertical(barco);
              $scope.barcoActual.posIniC++;
              $scope.pintarBarcoVertical(barco);
            }
          }

          break;

        default:
          break;
      }
    }
    $scope.borrarBarcoVertical = function (barco) {
      switch (barco.size) {
        case 1:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = ""
          $scope.sePuedeGuardar = true;
          break;
        case 2:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = ""
          if (barco.posIniF != 5) {
            $scope.sePuedeGuardar = true;
            $scope.arrayClases[barco.posIniF + 1][barco.posIniC] = ""
          }

          break;
        case 3:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = ""
          if (barco.posIniF < 4) {
            $scope.sePuedeGuardar = true;
            $scope.arrayClases[barco.posIniF + 1][barco.posIniC] = ""
            $scope.arrayClases[barco.posIniF + 2][barco.posIniC] = ""
          } else {
            if (barco.posIniF == 4) {
              $scope.arrayClases[barco.posIniF + 1][barco.posIniC] = ""
            }
          }
          break;
        case 4:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = ""
          if (barco.posIniF < 3) {
            $scope.arrayClases[barco.posIniF + 1][barco.posIniC] = ""
            $scope.arrayClases[barco.posIniF + 2][barco.posIniC] = ""
            $scope.arrayClases[barco.posIniF + 2][barco.posIniC] = ""
            $scope.sePuedeGuardar = true;
          } else {
            if (barco.posIniF == 3) {
              $scope.arrayClases[barco.posIniF + 1][barco.posIniC] = ""
              $scope.arrayClases[barco.posIniF + 2][barco.posIniC] = ""
            } else {
              if (barco.posIniF == 4) {
                $scope.arrayClases[barco.posIniF + 2][barco.posIniC] = ""
              }
            }
          }
          break;
      }
    }
    $scope.borrarBarcoHorizontal = function (barco) {
      switch (barco.size) {
        case 1:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = ""
          $scope.sePuedeGuardar = true;
          break;
        case 2:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = ""
          if (barco.posIniC != 5) {
            $scope.sePuedeGuardar = true;
            $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = ""
          }

          break;
        case 3:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = ""
          if (barco.posIniC < 4) {
            $scope.sePuedeGuardar = true;
            $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = ""
            $scope.arrayClases[barco.posIniF][barco.posIniC + 2] = ""
          } else {
            if (barco.posIniC == 4) {
              $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = ""
            }
          }
          break;
        case 4:
          $scope.arrayClases[barco.posIniF][barco.posIniC] = ""
          if (barco.posIniC < 3) {
            $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = ""
            $scope.arrayClases[barco.posIniF][barco.posIniC + 2] = ""
            $scope.arrayClases[barco.posIniF][barco.posIniC + 3] = ""
            $scope.sePuedeGuardar = true;
          } else {
            if (barco.posIniC == 3) {
              $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = ""
              $scope.arrayClases[barco.posIniF][barco.posIniC + 2] = ""
            } else {
              if (barco.posIniC == 4) {
                $scope.arrayClases[barco.posIniF][barco.posIniC + 1] = ""
              }
            }
          }
          break;
      }
    }

    $scope.dibujarBarco = function (barco) {
      if (barco.isHorizontal) {
        $scope.pintarBarcoHorizontal(barco);
      } else {
        $scope.pintarBarcoVertical(barco);
      }
    }
    $scope.rotarBarco = function () {
      if ($scope.barcoActual.isHorizontal) {
        $scope.borrarBarcoHorizontal($scope.barcoActual);
      } else {
        $scope.borrarBarcoVertical($scope.barcoActual);
      }
      $scope.barcoActual.isHorizontal = !$scope.barcoActual.isHorizontal;
      if ($scope.barcoActual.isHorizontal) {
        $scope.pintarBarcoHorizontal($scope.barcoActual);
      } else {
        $scope.pintarBarcoVertical($scope.barcoActual);
      }
    }
    $scope.guardarBarco = function () {
      if ($scope.sePuedeGuardar) {
        var barco = new Barco($scope.barcoActual.posIniC, $scope.barcoActual.posIniF,
          $scope.barcoActual.size, $scope.barcoActual.isHorizontal)
        $scope.arrayBarcos.push(barco);
        $scope.barcoActual = null;
        $scope.bloquearTablero = false;
        $scope.dibujarTodos();
      }
    }
    $scope.dibujarTodos = function () {
      var arrayBarcos = $scope.arrayBarcos;
      for (var i = 0; i < arrayBarcos.length; i++) {
        $scope.dibujarBarco(arrayBarcos[i]);
      }
    }
    $scope.limpiarGrafico = function () {
      $scope.arrayTableroOcupado = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false]
      ];
      $scope.arrayClases = [
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', '']
      ];
      $arrayBarcos = [];
    }
    $scope.iniciarPartida = function () {

    }
  });
