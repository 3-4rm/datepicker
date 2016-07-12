angular.module("ctDatePickerDemo")			
	.directive("ctSelect", function(){
		return {
			scope:{
				selected: "=ctSelect",
				options: "=ctOptions"
			},
			templateUrl:"directives/ct_select/ct_select_template.html",
			restrict: "A",
			controller: function($scope, $attrs){
				$scope.selectOption = function(option) {
					$scope.selected = option;
					$scope.toggleOptionsContainerState();
				}

				$scope.isOptionsContainerHidden = true;
				$scope.toggleOptionsContainerState = function(){
					$scope.isOptionsContainerHidden == true ?
					$scope.isOptionsContainerHidden = false :
					$scope.isOptionsContainerHidden = true;
				}
			}
		}
	})