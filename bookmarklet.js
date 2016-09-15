javascript:(function(){
	/* Ryan Baxley 2016 */
	if (window.hasOwnProperty('ryanDetectPropertyForOnlyOneInstance_dsljl23sdgsfdhsfdd326ag')) {
		alert('"No Location" has already been loaded.');
    }else{
        window.ryanDetectPropertyForOnlyOneInstance_dsljl23sdgsfdhsfdd326ag = true;
        
        alert("bookmarklet loaded");
        
        
        createRow = (function() {
        	var cached_function = createRow;
        	
        	return function() {
	        	/*console.log("before");
	        	console.debug(arguments);*/
	        	var result = cached_function.apply(this, arguments);
	        	return result;
	    	};
        })();
        
        onGetItemsResult = (function() {
        	var cached_function = onGetItemsResult;
        	
        	return function() {
	        	arguments[0].sort(function(a,b){
				  return new Date(a.date) - new Date(b.date);
				});
	        	
	        	var result = cached_function.apply(this, arguments);
	        	return result;
	    	};
        })();
    }
}) ();
