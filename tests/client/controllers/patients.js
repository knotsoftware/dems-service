describe('PatientsController', function() {
  var $rootScope,
      $scope,
      $http,
      controller,
      Session,
      createController,
      patients,
      orderedPatientsByName,
      patientsObject,
      carer,
      patients1,
      patients2;

  beforeEach(function() {
    module("DemS");

    patient1 = {
      id: 1,
      name: "Frankie"
    };

    patient2 = {
      id: 2,
      name: "Albert"
    };

    patients = [patient1, patient2];

    patientsObject = {};

    for (var i = 0, length = patients.length; i < length; i++) {
      patientsObject[patients[i].id] = patients[i];
    }

    orderedPatientsByName = [patient2, patient1];

    carer = {
      name: "Frankie Cares",
      id: 1,
    };

    Session = {
      currentCarer: carer,
      currentPatient: null,
      shownNotEnoughInfoMessage: false,
      hiddenSideBar: false,
      carerHasEnoughInfo: function (carer) {
        return true;
      },
    };

    var Alerts = {
      addAlert: function (msg, options) {
        return;
      }
    };

    inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $http = $injector.get('$http');

      $httpBackend = $injector.get('$httpBackend');

      $httpBackend.whenGET(/\/api\/carer\/[\d]+\/patients/)
        .respond(patients);

      var linkRegEx = /^\/api\/patient\/([\d]+)$/;
      $httpBackend.whenGET(linkRegEx).respond(function(method, url, data) {
        var patientId = parseInt(linkRegEx.exec(url)[1]);
        return patientsObject[patientId];
      });

      createController = function () {
        controller = $injector.get('$controller')("PatientsController", {$scope: $scope, $http: $http, Session: Session, Alerts: Alerts});
      };

      createController();
    });
  });

  it("does not call toggleSideBar if hiddenSideBar is false", function () {
    spyOn(controller, 'toggleSideBar');
    Session.hiddenSideBar = false;
    controller.init();
    expect(controller.toggleSideBar).not.toHaveBeenCalled();
  });

  it("does call toggleSideBar if hiddenSideBar is true", function () {
    spyOn(controller, 'toggleSideBar');
    Session.hiddenSideBar = true;
    controller.init();
    expect(controller.toggleSideBar).toHaveBeenCalled();
  });

  xit("gets the array of patients from backend and orders them by name", function () {
    $httpBackend.flush();
    expect($scope.arrayOfPatients).toEqual(orderedPatientsByName);
  });

  xit("gets the patients object from the array taken from the backend", function () {
    $httpBackend.flush();
    expect($scope.patients).toEqual(patientsObject);
  });

  xit("sets the patient in the session", function () {
    $httpBackend.flush();
    expect(Session.currentPatient).toEqual(null);
    controller.setPatient("1");
    expect(Session.currentPatient).toEqual(patient1);
  });
});