(function($) {
    $.urlParam = function(name){
      	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
      	if (!results) { return 0; }
      	return results[1] || 0;
    }
})((typeof jQuery !== 'undefined' ? jQuery : (window.jQuery = {})));
