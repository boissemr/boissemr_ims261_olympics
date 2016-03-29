$(document).ready(function() {

	var leftGutterWidth = 60,
		horizontalSpacing = 40,
		w = horizontalSpacing * countries.length + leftGutterWidth,
		countryHomeWins = [],
		countryAwayWins = [],
		countryPercentages = [],
		countryHosted = [],
		grandTotal = 0,
		totalBarScale = .06,
		averageBarScale = 1;

	var percentageToRadians = function(percentage) {
		return (360 * percentage / 100) * Math.PI / 180;
	}

	var makeHoverer = function(country, index, appendTarget, y, h, text, fade, year) {
		
		var x = index * horizontalSpacing + leftGutterWidth - (horizontalSpacing / 2);
		
		var hoverer = appendTarget.append("g")
			.attr("class", "hoverer " + index + ((fade)?" fadeMe":"") + ((year != null)?(" " + year):""))
			.attr("index", index)
			.attr("year", year);

		hoverer
			.append("rect")
			.attr("x", x)
			.attr("y", y)
			.attr("height", h)
			.attr("width", horizontalSpacing);

		for(k = 0; k < text.length; k++) {
			hoverer
				.append("text")
				.attr("x", x + (horizontalSpacing / 2))
				.attr("y", y + (h / 2) + (k * 20))
				.attr("text-anchor", "middle")
				.text(text[k]);
		}
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

	var initialize_totalBars = function() {

		// local variables
		var h = 100;

		// svg
		var totalBars = d3.select("#totalBars")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		// total bars
		var makeHomeWinBar = function(country, index) {
			var x = index * horizontalSpacing + leftGutterWidth - (horizontalSpacing / 2);
			totalBars
				.append("rect")
				.attr("x", x)
				.attr("y", h - countryHomeWins[i] * totalBarScale)
				.attr("height", countryHomeWins[i] * totalBarScale)
				.attr("width", horizontalSpacing / 2)
				.attr("class", "barForeground");
		}
		var makeAwayWinBar = function(country, index) {
			var x = index * horizontalSpacing + leftGutterWidth - (horizontalSpacing / 2);
			totalBars
				.append("rect")
				.attr("x", x + (horizontalSpacing / 2))
				.attr("y", h - countryAwayWins[i] * totalBarScale)
				.attr("height", countryAwayWins[i] * totalBarScale)
				.attr("width", horizontalSpacing / 2)
				.attr("class", "barBackground");
		}
		for(i = 0; i < countries.length; i++) makeHomeWinBar(countries[i], i);
		for(i = 0; i < countries.length; i++) makeAwayWinBar(countries[i], i);

		// hoverer
		for(i = 0; i < countries.length; i++) {
			var s = [
				countryHomeWins[i] + " home",
				countryAwayWins[i] + " away"
			];
			makeHoverer(countries[i], i, totalBars, 0, h, s, true);
		}
	}

	var initialize_averageBars = function() {

		// local variables
		var h = 100;

		// svg
		var averageBars = d3.select("#averageBars")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		// total bars
		var makeHomeWinBar = function(country, index) {
			var x = index * horizontalSpacing + leftGutterWidth - (horizontalSpacing / 2);
			averageBars
				.append("rect")
				.attr("x", x)
				.attr("y", h - (countryHomeWins[i] / countryHosted[i]) * averageBarScale)
				.attr("height", (countryHomeWins[i] / countryHosted[i]) * averageBarScale)
				.attr("width", horizontalSpacing / 2)
				.attr("class", "barForeground");
		}
		var makeAwayWinBar = function(country, index) {
			var x = index * horizontalSpacing + leftGutterWidth - (horizontalSpacing / 2);
			averageBars
				.append("rect")
				.attr("x", x + (horizontalSpacing / 2))
				.attr("y", h - (countryAwayWins[i] / (data.length - countryHosted[i])) * averageBarScale)
				.attr("height", (countryAwayWins[i] / (data.length - countryHosted[i])) * averageBarScale)
				.attr("width", horizontalSpacing / 2)
				.attr("class", "barBackground");
		}
		for(i = 0; i < countries.length; i++) makeHomeWinBar(countries[i], i);
		for(i = 0; i < countries.length; i++) makeAwayWinBar(countries[i], i);

		// hoverer
		for(i = 0; i < countries.length; i++) {
			var s = [
				Math.floor(countryHomeWins[i] / countryHosted[i]) + " home",
				Math.floor(countryAwayWins[i] / (data.length - countryHosted[i])) + " away"
			];
			makeHoverer(countries[i], i, averageBars, 0, h, s, true);
		}
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

		// hoverer
		for(i = 0; i < countries.length; i++) {
			var s = [Math.floor(countryPercentages[i]) + "%"];
			makeHoverer(countries[i], i, percentageBars, 0, h, s, true);
		}
	}

	var initialize_countryNames = function() {

		// local variables
		var margin = 10,
			h = 150;

		// svg
		var countryNames = d3.select("#countryNames")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		// names
		var makeCountryName = function(country, index) {
			var x = index * horizontalSpacing + leftGutterWidth,
				y = h - margin;
			countryNames
				.append("text")
				.attr("x", x)
				.attr("y", y)
				.style("text-anchor", "end")
				.attr("transform", "rotate(90 " + x + " " + y + ")")
				.attr("class", "countryName " + index)
				.text(formalNames[index]);
		}
		for(i = 0; i < countries.length; i++) makeCountryName(countries[i], i);

		// hoverer
		for(i = 0; i < countries.length; i++) {
			s = [];
			makeHoverer(countries[i], i, countryNames, 0, h, s, false);
		}
	}

	var initialize_dotPlot = function() {

		// local variables
		var verticalSpacing = 30,
			h = verticalSpacing * data.length,
			dotScale = .15;
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
			})
			.attr("class", function(d, i) {
				return "yearText " + d.year;
			});

		// dots
		var makeDotPlot = function(country, index) {
			var	countryTotalWins = 0,
				countryHomeWins_ = 0;

			countryHosted[index] = 0;

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
						countryHomeWins_ += eval("d." + country);
						countryHosted[index] += 1;
						return "home";
					} else {
						return "";
					}
				});
			countryPercentages[index] = countryHomeWins_ / countryTotalWins * 100;
			grandTotal += countryTotalWins;
			countryHomeWins[index] = countryHomeWins_;
			countryAwayWins[index] = countryTotalWins - countryHomeWins_;
		}
		for(i = 0; i < countries.length; i++) makeDotPlot(countries[i], i);

		// hoverer
		for(i = 0; i < countries.length; i++) {
			for(j = 0; j < data.length; j++) {
				var s = [eval("data[j]." + countries[i])];
				var temp = makeHoverer(countries[i], i, dotPlot, j * verticalSpacing, verticalSpacing, s, true, data[j].year);
			}
		}
	}

	initialize_dotPlot();
	initialize_countryNames();
	initialize_percentageBars();
	initialize_totalBars();
	initialize_averageBars();
	initialize_totalPie();

	$(".hoverer").hover(
		function() {
			$("." + $(this).attr("index")).toggleClass("on", true);
			$(".yearText." + $(this).attr("year")).toggleClass("on", true);
		},
		function() {
			$(".hoverer, .countryName, .yearText").toggleClass("on", false);
		}
	);
});