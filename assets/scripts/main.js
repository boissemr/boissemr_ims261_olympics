$(document).ready(function() {

	var leftGutterWidth = 60,
		horizontalSpacing = 40,
		w = horizontalSpacing * countries.length + leftGutterWidth,
		countryPercentages = [],
		grandTotal = 0;

	var percentageToRadians = function(percentage) {
		return (360 * percentage / 100) * Math.PI / 180;
	}

	var initialize_totalPie = function() {

		// local variables
		var h = 150,
			radius = 50;

		// svg
		var totalPie = d3.select("#totalPie")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		// find the numbers within
		var totalHomeWinPercentage = 0;
		for(i = 0; i < countryPercentages.length; i++) {
			totalHomeWinPercentage += countryPercentages[i];
		}
		totalHomeWinPercentage /= countryPercentages.length;

		// pie
		var backgroundArc = d3.svg.arc()
			.outerRadius(radius)
			.innerRadius(0)
			.startAngle(0)
			.endAngle(percentageToRadians(100));
		var foregroundArc = d3.svg.arc()
			.outerRadius(radius)
			.innerRadius(0)
			.startAngle(0)
			.endAngle(percentageToRadians(totalHomeWinPercentage));
		totalPie.append("path")
			.attr("d", backgroundArc)
			.attr("class", "totalPieBackground")
			.attr("transform", "translate(" + (w/2) + ", " + (h/2) + ")");
		totalPie.append("path")
			.attr("d", foregroundArc)
			.attr("class", "totalPieForeground")
			.attr("transform", "translate(" + (w/2) + ", " + (h/2) + ")");
	}

	var initialize_percentageBars = function() {

		// local variables
		var h = 100;

		// svg
		var percentageBars = d3.select("#percentageBars")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		// percentage bars
		var makePercentageBar = function(country, index) {
			var x = index * horizontalSpacing + leftGutterWidth - (horizontalSpacing / 2);
			percentageBars
				.append("rect")
				.attr("x", x)
				.attr("y", 0)
				.attr("height", h)
				.attr("width", horizontalSpacing)
				.attr("class", "barBackground");
			percentageBars
				.append("rect")
				.attr("x", x)
				.attr("y", h - countryPercentages[i])
				.attr("height", countryPercentages[i])
				.attr("width", horizontalSpacing)
				.attr("class", "barForeground");
		}
		for(i = 0; i < countries.length; i++) makePercentageBar(countries[i], i);
	}

	var initialize_countryNames = function() {

		// local variables
		var h = 120,
			padding = 25;

		// svg
		var countryNames = d3.select("#countryNames")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		// names
		var makeCountryName = function(country, index) {
			var x = index * horizontalSpacing + leftGutterWidth,
				y = padding;
			countryNames
				.append("text")
				.attr("x", x)
				.attr("y", y)
				.style("text-anchor", "start")
				.attr("transform", "rotate(90 " + x + " " + y + ")")
				.text(country);
		}
		for(i = 0; i < countries.length; i++) makeCountryName(countries[i], i);
	}

	var initialize_dotPlot = function() {

		// local variables
		var h = 850,
			dotScale = .15,
			verticalSpacing = 30,
			countryTotalWins = 0,
			countryHomeWins = 0;

		// svg
		var dotPlot = d3.select("#dotPlot")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		// year labels in left gutter
		dotPlot.selectAll()
			.data(data)
			.enter()
			.append("text")
			.attr("x", 0)
			.attr("y", function(d, i) {
				return i * verticalSpacing + 15;
			})
			.text(function(d, i) {
				return d.year;
			});

		// dots
		var makeDotPlot = function(country, index) {
			dotPlot.selectAll()
				.data(data)
				.enter()
				.append("circle")
				.attr("cx", function(d, i) {
					return index * horizontalSpacing + leftGutterWidth;
				})
				.attr("cy", function(d, i) {
					return i * verticalSpacing + 10;
				})
				.attr("r", function(d, i) {
					return eval("d." + country) * dotScale;
				})
				.attr("class", function(d, i) {
					countryTotalWins += eval("d." + country);
					if(d.host == country) {
						countryHomeWins += eval("d." + country);
						return "home";
					} else {
						return "";
					}
				});
			countryPercentages[index] = countryHomeWins / countryTotalWins * 100;
			grandTotal += countryTotalWins;
		}
		for(i = 0; i < countries.length; i++) makeDotPlot(countries[i], i);
	}

	initialize_dotPlot();
	initialize_countryNames();
	initialize_percentageBars();
	initialize_totalPie();
});