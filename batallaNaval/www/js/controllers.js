angular.module('starter.controllers', ['ngDragDrop'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams, $apply) {
  })

  .controller('JugarCtrl', function ($scope, $ionicPopup) {
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
    $arrayBarcos = [];

    $scope.agregarBarcoPopUp = function (posIniF, posIniC) {
      $scope.posIniF = posIniF;
      $scope.posIniC = posIniC;
      $scope.data = {};
      $scope.cambiarBarcosPorPuntos();
      $scope.myPopup = $ionicPopup.show({
        template: '<button ng-click="agregarBarco(1)" class="button button-positive button-full">Un Casillero</button> ' +
        '<button ng-click="agregarBarco(2)" class="button button-positive button-full">Dos Casilleros</button> ' +
        '<button ng-click="agregarBarco(3)" class="button button-positive button-full">Tres Casilleros</button> ' +
        '<button ng-click="agregarBarco(4)" class="button button-positive button-full">Cuatro Casilleros</button> ',
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
              console.log("asdkj")
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
            
          }
          break;
        case "down":

          break;
        case "left":

          break;
        case "right":

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
  });
