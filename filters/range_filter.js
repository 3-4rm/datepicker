angular.module("ctDatePickerDemo")	
	.filter("range", function () {
	    return function (data, page, size) {
	    	
	    	//return data;
	        if (angular.isArray(data) && angular.isNumber(page) && angular.isNumber(size)) {

	            var start_index = (page - 1) * size;
	            if (data.length < start_index) {
	                return [];
	            } else {
	                return data.slice(start_index, start_index + size);
	            }
	        } else {
	            return data;
	        }
	    }
	})