var org_twittername = '';
var org_twitterscreenname = '';
var fakeCount = 0;
chrome.runtime.onMessage.addListener(function (msg, sender,sendResponse) {
  if (msg.action === 'reset') {
	fakeCount = 0;
  }
});

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
jQuery(document).ready(function () {
	if(location.href.indexOf("https://twitter.com/")!=-1){
		var timer = setInterval(function(){ 
			org_twittername = $('.permalink-header').find('strong.fullname').text().replace(/\u00AD/g, '').trim();
			org_twitterscreenname = $('.permalink-header').find('a.js-account-group span.username').text().replace(/\u00AD/g, '').trim();
			if($('#descendants').length){
				$('#descendants').find('div.stream-item-header a.js-action-profile').each(function(){
					var new_twittername = $(this).find('strong.fullname').text().replace(/\u00AD/g, '').trim();
					var new_twitterscreenname = $(this).find('span.username').text().replace(/\u00AD/g, '').trim();
					var sim = similarity(org_twittername, new_twittername);
					//console.log(org_twitterscreenname+"----"+new_twitterscreenname);
					//console.log(new_twittername+"==="+sim);
					if(sim>0.4 && org_twitterscreenname != new_twitterscreenname){
						fakeCount ++;
						chrome.runtime.sendMessage({type: "change", field:"scams", val: fakeCount}, function(response) {
						});
						$(this).parent().parent().parent().parent().parent().remove();
					}
					/*if(new_twittername==org_twittername){
						var sim = similarity(org_twitterscreenname, new_twitterscreenname);
						console.log(new_twitterscreenname+"==="+sim);
						if(sim>0.4){
							fakeCount ++;
							chrome.runtime.sendMessage({type: "change", val: fakeCount}, function(response) {
							});
							$(this).parent().parent().parent().parent().parent().remove();
						}
					}*/
				});
			}
		}, 500);
		/*var cash_timer = setInterval(function(){
			$('.js-tweet-text-container').each(function(){
				var cash_count = 0;
				$(this).find("a[data-query-source=cashtag_click]").each(function(){
					cash_count++;

					if(cash_count>=6){
						fakeCount ++;
						chrome.runtime.sendMessage({type: "change", field:"spams", val: fakeCount}, function(response) {
						});
						$(this).parent().parent().parent().parent().parent().remove();
					}
				});
			});
		}, 500);*/
	}
});