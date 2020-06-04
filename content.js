var log = function($selector) {
    $selector.each(function() {
        console.log(this);
    });
};

var chart_features = {
	x_axis: null,
	y_axis: null,
	type: null,
	subtype: null,
	foundChart: false,
	foundSVG: false,
}

var months =['january', 'jan', 'february', 'feb', 'march', 'mar', 'april', 'apr', 'may', 'june', 'jun', 'july', 'jul', 'august' , 'aug','september', 'sep', 'sept' , 'october', 'oct', 'november', 'nov', 'december', 'dec'];
var days = ['monday', 'mon', 'tuesday', 'tues','tue', 'wednesday', 'wed', 'thursday', 'thu', 'thurs', 'friday', 'fri', 'saturday','sat','sun', 'sunday']

function parseIsChart($clicked) {
	var $svg = $clicked.closest('svg');
	if($svg.length > 0 ) {
		chart_features['foundSVG'] = true;
	}
	var $chart_div = $svg.closest('[class*="chart"],[class*="graph"]');
	if($chart_div.length == 0) {
		$chart_div = $svg.siblings('[class*="chart"],[class*="graph"]');
	}
	if($chart_div.length == 0) {
		$chart_div = $svg.parents('[class*="chart"],[class*="graph"]');
	}
	if($chart_div.length > 0) {
		chart_features['foundChart'] = true;
	}

}

function parseType($clicked) {
	var $svg = $clicked.closest('svg');
	// just try a bunch of stuff tbh
	var line_matches = $svg.find('[class*="line"]').length;
	var bar_matches = $svg.find('[class*="bar"]').length;
	var rect_matches = $svg.find('rect').length;
	console.log(line_matches + ", " + bar_matches + ", "+rect_matches);
	if(Math.max(line_matches, bar_matches, rect_matches) == line_matches && line_matches > 0) {
		chart_features['type'] = 'line';
		if(bar_matches > 0  && rect_matches > 10) {
			chart_features['subtype'] = 'bar';
		}
	} else if(bar_matches > 0  || rect_matches > 0) {
		chart_features['type'] = 'bar';
		if(line_matches > 0) {
			chart_features['subtype'] = 'line';
		}
	}
}

function parseTitle($clicked) {
	var $svg = $clicked.closest('svg');
	var $parents = $svg.parents('[class*="chart"],[id*="chart"]');
	var outer = $svg[0];
	if($parents.length > 0) {
		outer = $parents[$parents.length - 1];
	}
	
	// just try a bunch of stuff tbh
	var $title_matches = $(outer).find('[class*="title"]');
	var possible = $(outer).find('text, p, :header');
	for(var i = 0; i<possible.length; i++) {
		var pText = possible[0].innerHTML;
		if(pText.length > 3 && pText.includes(" ")) {
			chart_features['title'] = pText;
			return;
		}
	}
}

function parseAxis($clicked, xy) {
	var $svg = $clicked.closest('svg');
	var $chart_div = $svg.closest('[class*="chart"]');
	if($chart_div.length == 0) {
		$chart_div = $svg.siblings('[class*="chart"]');
	}
	if($chart_div.length == 0) {
		$chart_div = $svg.parents('[class*="chart"]');
	}
	
	var s ='[class*="' + xy + '-label"],[class*="' + xy + 'label"]'
	var $x_labels = $chart_div.find(s);
	var x_axis = null;
	
	if($x_labels.length == 0) {
		// look for x or axis then ticks
		var $x_g_div = $svg.find('.' + xy + ', .' + xy +'.axis');
		var $ticks = $x_g_div.find('.tick');
		if($ticks.length > 0) {
			$x_labels = $ticks;
		} else {
			var $lines = $chart_div.find('.grid-line.horizontal');

			if($lines.length > 0) {
				$x_labels = $lines;
			} else {
				var $axises = $chart_div.find('[class*="axis"]');
		
				if(xy == 'x'){
					var $labels = $axises.not('[class*="y-axis"]').not('[class*="yaxis"]').not('.y');
				} else {
					var $labels = $axises.not('[class*="x-axis"]').not('[class*="xaxis"]').not('.x');
				}

				if($labels.length > 0) {
					$x_labels = $labels;
				} else if ($axises.length > 0) {
					$x_labels = $axises;
				}
			}
		}
			// otherwise leave default

	}

	if($x_labels.length > 0) {
		// probably have an x label somewhere
		var classes = [];
		$x_labels.each(function() {
			classes = classes.concat($(this).attr('class').split(' '));
		  });

		for(var i=0; i<classes.length; i++){
			if(!classes[i].includes(xy + "label") && !classes[i].includes("svelte") 
				&& !classes[i].includes("chart") && !classes[i].includes("axis")
				&& classes[i] != xy && classes[i] != "tick" && classes[i] != "units"
				&& classes[i] != "grid-line" && classes[i] != "horizontal"){
				var xlab = classes[i].replace("axis", " ").split("-")[0];
				if(xlab != "" && xlab != xy){
					chart_features[xy + '_axis'] = xlab;
				}
			}
		  }

		// backup- look at formating
		if(chart_features[xy+'_axis'] === null){
			$x_labels.each(function() {
				var st = $(this).children().text().split(" ");
				st =  st.concat($(this).text().split(" "));
				for(var i =0; i<st.length; i++) {
					if(days.indexOf(st[i].replace(".", "").toLowerCase()) >= 0) {
						chart_features[xy+'_axis'] = 'day of week';
						return;
					}
					if(months.indexOf(st[i].replace(".", "").toLowerCase()) >= 0) {
						chart_features[xy+'_axis'] = 'month';
						return;
					}
					if(st[i].match(/^.*[%]$/)) {
						chart_features[xy+'_axis'] = 'percentage';
					}
					if(st[i].match(/^['`‘][0-9]{2}$/) || st[i].match(/^[1-2][0-9]{3}$/)) {
						chart_features[xy+'_axis'] = 'year';
					}
					if(st[i].match(/^.*[$].*$/)) {
						chart_features[xy+'_axis'] = 'dollars';
					}
					if(st[i].match(/^[0-9,]+$/)) {
						if(i < st.length-1 && st[i+1].match(/^[A-Za-z]+$/)){
							chart_features[xy+'_axis'] = st[i+1];
						}
					}
				}
			});
		}
	} 
	return $chart_div;
}


var parse_clicked = function($clicked) {
	parseAxis($clicked, 'x');
	parseAxis($clicked, 'y');
	parseType($clicked);
	parseTitle($clicked);
	parseIsChart($clicked);
}

function updatetype(features, res) {
	if(features['type'] == null) {
		res.document.getElementById('typenotfound').style.display =  "inline";
	} else if(features['type'] == 'line') {
		res.document.getElementById('typeline').style.display =  "inline";
	} else if(features['type'] == 'bar') {
		if(features['subtype'] == 'line') {
			res.document.getElementById('typelinebar').style.display =  "inline";
		} else {
			res.document.getElementById('typebar').style.display =  "inline";
		}
	}
}

function updatetitle(features, res) {
	if(features['title'] == null) {
		res.document.getElementById('titlenotfound').style.display =  "inline";
	} else {
		res.document.getElementById('titlefound').style.display =  "inline";
		res.document.getElementById('titletext').innerHTML =  features['title'];
	}
}

function updatexaxis(features, res) {
	if(features['x_axis'] == null) {
		res.document.getElementById('xnotfound').style.display =  "inline";
	} else {
		res.document.getElementById('xfound').style.display =  "inline";
		res.document.getElementById('xaxistext').innerHTML =  features['x_axis'];
	}
}

function updateyaxis(features, res) {
	if(features['y_axis'] == null) {
		res.document.getElementById('ynotfound').style.display =  "inline";
	} else {
		res.document.getElementById('yfound').style.display =  "inline";
		res.document.getElementById('yaxistext').innerHTML =  features['y_axis'];
	}
}

function updatePitfallsY(ycat, type, res) {
	if(ycat == 'day of week' || ycat == 'month') {
		res.document.getElementById(type+'pitfallynum').style.display =  "none";
	} else {
		res.document.getElementById(type+'pitfallycat').style.display =  "none";
		if(ycat != 'percentage') {
			res.document.getElementById(type+'pitfallynumpercent').style.display =  "none";
		}
	}
}

function updatePitfallsX(xcat, type, res) {
	if(xcat == 'day of week' || xcat == 'month') {
		res.document.getElementById(type+'pitfallxnum').style.display =  "none";
	} else {
		res.document.getElementById(type+'pitfallxcat').style.display =  "none";
	}
}

function updatePitfallsType(features, res) {
	if(features['type'] == 'line') {
		res.document.getElementById('barpitfalls').style.display =  "none";
		res.document.getElementById('barlinepitfalls').style.display =  "none";
		if(features['y_axis'] != null){
			updatePitfallsY(features['y_axis'], 'line', res);
		}
		if(features['x_axis'] != null){
			updatePitfallsX(features['x_axis'], 'line', res);
		}
	} else if (features['type'] == 'bar'){
		res.document.getElementById('linepitfalls').style.display =  "none";
		if(features['subtype'] != 'line') {
			res.document.getElementById('barlinepitfalls').style.display =  "none";
		}
		if(features['y_axis'] != null){
			updatePitfallsY(features['y_axis'], 'bar', res);
		}
		if(features['x_axis'] != null){
			updatePitfallsX(features['x_axis'], 'bar', res);
		}
	}
}


function checkSuccess() {
	if(chart_features['x_axis'] == null && chart_features['y_axis'] == null && chart_features['title'] == null){
		if(chart_features['type'] == null) {
			var msg = "Could not parse any chart features from the object you clicked. Do you still want to see general visualization advice?"
			+ " Otherwise, you can select a different object.";
			return window.confirm(msg);
		} else if(chart_features['foundChart']) {
			return true;
		} else {
			var msg = "Only able to parse limited chart information from this object, do you still want to attempt to analyze it?"
			+ " Otherwise, you can select a different object.";
			return window.confirm(msg);
		}
	}
	return true;
}
var click_called = false;
var url = chrome.runtime.getURL("result.html");
var html = "";

function requestListener() {
	html = this.responseText;
  };

  /// THIS IS THE MAIN FUNCTION that does all the other stuff
  // listen for a click then process the chart
  // if success, load and update the html webpage
$(document).click(function(e) {
	var $clicked = $(e.target);
	if(!click_called) {
		click_called = true;

		parse_clicked($clicked);
		// check for success 
		if(!checkSuccess()) {
			click_called = false;
			return;
		}

		console.log("features found:");
		console.log(chart_features);
		// load results page
		var request = new XMLHttpRequest();
		request.onload = requestListener;
		request.open("GET", url, false);
		request.send();
		
		var res = window.open("", "_blank");
		res.document.body.innerHTML = html;
		// modify the html elements
		updatetype(chart_features, res);
		updatetitle(chart_features, res);
		updatexaxis(chart_features, res);
		updateyaxis(chart_features, res);
		updatePitfallsType(chart_features, res);
	}
});

"running"




