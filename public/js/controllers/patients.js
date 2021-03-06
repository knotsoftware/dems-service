(function () {
	angular.module('DemS').controller("PatientsController", ['$scope', 'Session', 'Alerts','Carer','Patient', function($scope, Session, Alerts, Carer, Patient){
    var self = this;

    self.init = function () {
      $scope.carer = Session.currentCarer;

      refreshCarerPatientsList();

      // wait for digest to occur, certainly better way to do it
      window.setTimeout(function() {
        if(Session.currentPatient) {
          console.log("setting patient");
          self.setPatient(Session.currentPatient.id);
        }
      }, 100);

      // needed for smaller screen when reloading and having scrolled down.
      $("body").animate({ scrollTop: 0 }, 1000);


      // TODO: What if we get here and the current carer hasn't been set just yet (still waiting for response from server)
      if(!Session.carerHasEnoughInfo(Session.currentCarer) && !Session.shownNotEnoughInfoMessage) {
        Alerts.addAlert("You need to add more information. Please visit the Account Details page", {alert_type: "danger"});
        Session.shownNotEnoughInfoMessage = true;
      }

      if(Session.hiddenSideBar) {
        self.toggleSideBar(false);
      }
    };

		self.setPatient = function (patientId) {
			$scope.patient = $scope.patients[patientId];
      Session.currentPatient = $scope.patient;
      $('li[data-area="side-bar-link"] a').removeClass("active");
      $('li[data-area="side-bar-link"][data-patient-id="' + patientId + '"] a').addClass("active");
      $("#activities_flag").addClass("hide");
		};

    self.addPatient = function () {
      console.log("Add Patient");
    };

    self.setTab = function(tab) {
      $(".tab-content > .tab-pane.active").removeClass("active");
      $(tab).addClass("active");
      Session.currentTab =  tab.replace("#", "");
      if(tab === "#activities") {
        $(tab + "_flag").addClass("hide");
      }
    };

    self.toggleSideBar = function (animation) {
      $("#wrapper").toggleClass("toggled");

      if(animation) {
        $("#toggle").animate({width: Session.hiddenSideBar ? "250px" : "30px"}, 400);
        $("#toggle > b").toggleClass("caret-right").toggleClass("caret-left");
      } else {
        if(Session.hiddenSideBar) {
          $("#toggle").css("width", "30px");
          $("#toggle > b").addClass("caret-right").removeClass("caret-left");
        } else {
          $("#toggle").css("width", "250px");
          $("#toggle > b").removeClass("caret-right").addClass("caret-left");
        }
      }

      Session.hiddenSideBar = $("#wrapper").hasClass("toggled");

    };

    self.addPatientToCarerRelationsship = function () {
        console.log("Adding patient");
        Carer.updateRelation({carerId:$scope.carer.id, patientId:$scope.newPatient.id}, function(message){
          refreshCarerPatientsList();
          $scope.newPatient.id = null;
        });
      };

    self.orderPatients = function (patients) {
      // Sort by name
      patients.sort(function(a,b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });

      return patients;
    };

    self.getPatientObject = function (patients) {
      var patientsObject = {};
      for (var i = 0, length = patients.length; i < length; i++) {
        patientsObject[patients[i].id] =  patients[i];
      }
      return patientsObject;
    };

    var refreshCarerPatientsList = function(){
      console.log("Refreshing patients");
      Patient.getCarersPatients({id:$scope.carer.id}, function(patients){
        $scope.arrayOfPatients = patients;
        $scope.patients = self.getPatientObject($scope.arrayOfPatients);
      });
    };

    self.init();
  } ] );
})();