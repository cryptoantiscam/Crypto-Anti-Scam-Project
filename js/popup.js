jQuery(document).ready(function () {
	var currentscams = localStorage.getItem('scams');
  	var currentspams = localStorage.getItem('spams');
  	var totalcount = parseInt(currentscams)+parseInt(currentspams);
  	$('#totalcount').text(totalcount);
  	$('#scamscount').text(currentscams);
  	$('#spamscount').text(currentspams);
});
 
