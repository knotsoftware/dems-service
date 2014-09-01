(function () {
	angular.module('DemS').controller("LocationsController", ['$scope', '$http', function($scope, $http){
		$http.get("/api/test/patients").success(function(data) {
      $scope.patients = data;
    });

		$scope.setPatient = function (patientId) {
			$scope.patient = $scope.patients[patientId];
		};
  } ] );
})();