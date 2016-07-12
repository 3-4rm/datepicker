angular.module("ctDatePickerDemo")
	.directive("ctDatePicker", function(){
					return {
						link: function(scope, element, attrs){

						},/*end link:*/
						compile: function(scope, element, attrs){

						},/*end compile*/
						restrict: "A",
						scope:{					
								selectedDate: "=watchdate", //This implementation tracks changes of this property in 2 directions: updates calendar if property changed and sets it when new date selected in calendar 
								selectableRangeStartDate: "=startrange", //Will be used as value for initialization. This implementation does not have any handlers on change of this property.
								selectableRangeEndDate: "=endrange" //Will be used as value for initialization. This implementation does not have any handlers on change of this property.
						},

						templateUrl: "directives/ct_date_picker/ct_date_picker_template.html",

						controller:  function($scope, $attrs){

							var arrayOfDates = [];//length should be 42 (6 rows is max to show)		
							$scope.displayed = {};//object for storing day, month and year that are CURRENTLY displayed in calendar
							$scope.yearsOptions = [];//options to show in year's dropdown.

							//options to show in month's dropdown. Month names should be in sync with month numbers. Controller operates on months numbers.
							$scope.monthsOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];				

							//insure that selectedDate, selectableRangeStartDate and selectableRangeEndDate are Date objects to eliminate further errors
							if(!angular.isDate($scope.selectedDate)){
								$scope.selectedDate = new Date();
							}
							if(!angular.isDate($scope.selectableRangeStartDate)){	
								$scope.selectableRangeStartDate = new Date();
							}
							if(!angular.isDate($scope.selectableRangeStartDate)){
								$scope.selectableRangeEndDate = new Date();
							}

							//populate year dropdown with options:
							for (	year = $scope.selectableRangeStartDate.getFullYear();
									year <= $scope.selectableRangeEndDate.getFullYear();
									year++){
								$scope.yearsOptions.push(year);
							}

							//calendar weeks represented as array that consist of arrays that are represent every week.
							function getMonthData(){
								var datesArray = getArrayOfDates($scope.displayed.year, $scope.displayed.month);  
								var weeksArray = splitToWeeks(datesArray);
								return datesArray;
							};

							//needed to populate calendar with dates:
							function getNumberOfDaysInMonth(year,month) {
			   					var num = new Date(year, month+1, 0).getDate();
			   					return num;
							};

							//needed to populate calendar with dates:
							function getFirstWeekDay(year, month){
								return new Date(year, month, 1).getDay();
							};

							//Days in month are stored in array of numbers with offset dependand on which day of week month starts.
							//for example if month starts with Tuesday than offset is 2 (Sunday and Monday)
							function getArrayOfDates(year, month){
								var offset = getFirstWeekDay(year, month);//find the offset to start
								var lastDay = getNumberOfDaysInMonth(year, month);
								var arrayOfDates = [];

								for (i = 1; i<=42; i++){
									if(i < offset+1){
										arrayOfDates.push(null);
									}
									else{
										if(i<=lastDay+offset){
										arrayOfDates.push(i - offset);
										}
										else{
											arrayOfDates.push(null);
										}
									}
								}
								return arrayOfDates;
							};

							//To display weeks in rows, each week is represented as array that is obtained from splitting of "linear calendar", see getArrayOfDates function.
							function splitToWeeks(days){
								var weeks = [];
								for(i=0; i<6; i++){
									slice = days.slice(i*7,i*7+7);
									weeks[i] = slice;
								}
								return weeks;
							};	

							//handles click event on next month button:
							$scope.incrementMonth = function(){
								if($scope.displayed.month == 11){
									$scope.displayed.year++;
									$scope.displayed.month = 0;
								}
								else{
									$scope.displayed.month++;
								}
							};

							//handles click event on previous month button:
							$scope.decrementMonth = function() {
								if($scope.displayed.month==0)
								{
									$scope.displayed.month = 11;
									$scope.displayed.year--;
								}
								else{
									$scope.displayed.month--;
								}
							};

							//handles click on day of month in calendar:
							$scope.setDate = function(day){
								if(day != null){
									//create Date object for current day for comparition:
									var currentDate = new Date($scope.displayed.year, $scope.displayed.month, day); 
									//set date only if it is within selectable range:
									if(currentDate >= $scope.selectableRangeStartDate && currentDate <= $scope.selectableRangeEndDate){

										$scope.displayed.selectedDay = day;
										$scope.selectedDate = new Date($scope.displayed.year, $scope.displayed.month, $scope.displayed.selectedDay);
									}							
								}
							};

							//Calculates the class for each day displayed in calendar. Used in ng-class directive in template
							//A day may be "selectedDay" if this day matches $scope.selectedDate; "selectableDay" - if day within selectable range, and "nonSelectableDay" - if out of selectable range
							$scope.getDayClass = function(day){
								if(day === null){//"empty" day automatically not selectable, and no need to execute the rest of function
									return "nonDisplayedMonthDay";
								};

								var result = "";// a name of css class to be returned
								//create Date object for current day for comparition
								var currentDate = new Date($scope.displayed.year, $scope.displayed.month, day); 
								if(currentDate >= $scope.selectableRangeStartDate && currentDate <= $scope.selectableRangeEndDate){
									result = "selectableDay";
								}
								else{
									result = "nonSelectableDay";
								};

								//now check whether checked day is selected one:
								if ($scope.displayed.month == $scope.selectedDate.getMonth() &&
									$scope.displayed.year == $scope.selectedDate.getFullYear() &&
									day == $scope.selectedDate.getDate()){
										result= "selectedDay";
									}

								return result;
							}//end $scope.getDayClass...


							$scope.$watch('selectedDate', function(){
								$scope.displayed.selectedDay = $scope.selectedDate.getDate();
								$scope.displayed.month = $scope.selectedDate.getMonth();
								$scope.displayed.year = $scope.selectedDate.getFullYear();
								$scope.monthData = getMonthData();
							});					

							$scope.$watch('displayed.year', function(){
								$scope.monthData = getMonthData();
							});

							$scope.$watch('displayed.month', function(){
								//keep month name displayed in dropdown in sync with month's number
								$scope.selectedMonthName = $scope.monthsOptions[$scope.displayed.month];
								$scope.monthData = getMonthData();
							});

							$scope.$watch('selectedMonthName', function(){
								//keep month number in sync with months name when user selects in dropdown
								$scope.displayed.month = $scope.monthsOptions.indexOf($scope.selectedMonthName);
							});
						}//end controller:...
					}//end return...
			})//end of .directive("ctDatePicker", function(){...