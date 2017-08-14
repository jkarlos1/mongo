
$(document).ready(function(){
	//Get the context of the canvas element we want to select
	var ctx = document.getElementById("myChart").getContext("2d");
	var ctx1 = document.getElementById("myChart1").getContext("2d");
	var ctx2 = document.getElementById("myChart2").getContext("2d");
	var ctx3 = document.getElementById("myChart3").getContext("2d");
	var ctx4 = document.getElementById("myChart4").getContext("2d");
	var ctx5 = document.getElementById("myChart5").getContext("2d");
	var ctx6 = document.getElementById("myChart6").getContext("2d");
	var ctx7 = document.getElementById("myChart7").getContext("2d");
	var ctx8 = document.getElementById("myChart8").getContext("2d");
	var ctx9 = document.getElementById("myChart9").getContext("2d");
	var ctx10 = document.getElementById("myChart10").getContext("2d");
	var ctx11 = document.getElementById("myChart11").getContext("2d");
	var ctx12 = document.getElementById("myChart12").getContext("2d");



	var month_names = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	var plot_colors = ["#0000FF","#FF0000","#FFFF00","#006600","#6600FF","#FF6600","#663300", "#0099CC", "#339966", "#CC99FF"];
	var plot_highlighted_colors = ["#000099","#800000","#CC9900","#003300","#660033","#CC3300","#331A00", "#0066FF", "#009933", "#CC66FF"];

	var pieOptions = {
	    //Boolean - Whether we should show a stroke on each segment
	    segmentShowStroke : true,

	    //String - The colour of each segment stroke
	    segmentStrokeColor : "#fff",

	    //Number - The width of each segment stroke
	    segmentStrokeWidth : 2,

	    //Number - The percentage of the chart that we cut out of the middle
	    percentageInnerCutout : 50, // This is 0 for Pie charts

	    //Number - Amount of animation steps
	    animationSteps : 100,

	    //String - Animation easing effect
	    animationEasing : "easeOutBounce",

	    //Boolean - Whether we animate the rotation of the Doughnut
	    animateRotate : true,

	    //Boolean - Whether we animate scaling the Doughnut from the centre
	    animateScale : false,

	    //String - A legend template
	    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

	}

	var options = {
	    // Boolean - Whether to animate the chart
	    animation: true,

	    // Number - Number of animation steps
	    animationSteps: 60,

	    // String - Animation easing effect
	    animationEasing: "easeOutQuart",

	    // Boolean - If we should show the scale at all
	    showScale: true,

	    // Boolean - If we want to override with a hard coded scale
	    scaleOverride: false,

	    // ** Required if scaleOverride is true **
	    // Number - The number of steps in a hard coded scale
	    scaleSteps: null,
	    // Number - The value jump in the hard coded scale
	    scaleStepWidth: null,
	    // Number - The scale starting value
	    scaleStartValue: null,

	    // String - Colour of the scale line
	    scaleLineColor: "rgba(0,0,0,.1)",

	    // Number - Pixel width of the scale line
	    scaleLineWidth: 1,

	    // Boolean - Whether to show labels on the scale
	    scaleShowLabels: true,

	    // Interpolated JS string - can access value
	    scaleLabel: "<%=value%>",

	    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
	    scaleIntegersOnly: true,

	    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
	    scaleBeginAtZero: false,

	    // String - Scale label font declaration for the scale label
	    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

	    // Number - Scale label font size in pixels
	    scaleFontSize: 12,

	    // String - Scale label font weight style
	    scaleFontStyle: "normal",

	    // String - Scale label font colour
	    scaleFontColor: "#666",

	    // Boolean - whether or not the chart should be responsive and resize when the browser does.
	    responsive: false,

	    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
	    maintainAspectRatio: true,

	    // Boolean - Determines whether to draw tooltips on the canvas or not
	    showTooltips: true,

	    // Array - Array of string names to attach tooltip events
	    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

	    // String - Tooltip background colour
	    tooltipFillColor: "rgba(0,0,0,0.8)",

	    // String - Tooltip label font declaration for the scale label
	    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

	    // Number - Tooltip label font size in pixels
	    tooltipFontSize: 14,

	    // String - Tooltip font weight style
	    tooltipFontStyle: "normal",

	    // String - Tooltip label font colour
	    tooltipFontColor: "#fff",

	    // String - Tooltip title font declaration for the scale label
	    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

	    // Number - Tooltip title font size in pixels
	    tooltipTitleFontSize: 14,

	    // String - Tooltip title font weight style
	    tooltipTitleFontStyle: "bold",

	    // String - Tooltip title font colour
	    tooltipTitleFontColor: "#fff",

	    // Number - pixel width of padding around tooltip text
	    tooltipYPadding: 6,

	    // Number - pixel width of padding around tooltip text
	    tooltipXPadding: 6,

	    // Number - Size of the caret on the tooltip
	    tooltipCaretSize: 8,

	    // Number - Pixel radius of the tooltip border
	    tooltipCornerRadius: 6,

	    // Number - Pixel offset from point x to tooltip edge
	    tooltipXOffset: 10,

	    // String - Template string for single tooltips
	    tooltipTemplate: "<%if (label){%>Categoría <%=label%>: <%}else{%>Categoría 0<%}%><%= value %>",

	    // String - Template string for single tooltips
	    multiTooltipTemplate: "<%= value %>",

	    // Function - Will fire on animation progression.
	    onAnimationProgress: function(){},

	    // Function - Will fire on animation completion.
	    onAnimationComplete: function(){}
	}

	function plotValues(data,plotCtx){
		var plotData = {
			labels : data.keys,
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					data : data.values
				}
			]
		}
		
		
		var plotChart = new Chart(plotCtx).Line(plotData, options);
	}

	function plotPieValues(key ,values ,plotCtx){
		var plot_data = [];
		for (var i = 0; i < key.length; i++) {
			var plot_data_obj = {};
			plot_data_obj.value = values[i];
			plot_data_obj.color = plot_colors[i];
			plot_data_obj.highlight = plot_highlighted_colors[i];
			plot_data_obj.label = key[i];
			plot_data.push(plot_data_obj);
		};
			
						
		
		var myPieChart = new Chart(plotCtx).Pie(plot_data, options);
	}

	$.ajax({
		  url: "/stats/new_users",
		  context: document.body
		}).done(function(data ) {
		 plotValues(data,ctx)
	});

	$.ajax({
		  url: "/stats/new_deals",
		  context: document.body
		}).done(function(data ) {
		  plotValues(data,ctx1)
	});

	$.ajax({
		  url: "/stats/new_invitations",
		  context: document.body
		}).done(function(data ) {
		  plotValues(data,ctx2)
	});

	$.ajax({
		  url: "/stats/new_sales",
		  context: document.body
		}).done(function(data ) {
			plotValues(data,ctx3)
	});

	$.ajax({
		  url: "/stats/weekly_sales",
		  context: document.body
		}).done(function(data ) {
			plotValues(data,ctx4)
	});

	$.ajax({
		  url: "/stats/monthly_promoters",
		  context: document.body
		}).done(function(data ) {
			plotValues(data,ctx5)
	});
	

	$.ajax({
		  url: "/stats/promoter_level_proportions",
		  context: document.body
		}).done(function(data ) {
			var json_data = JSON.parse(data);
			var keys = [];
			var values = [];
			for (var i = 0; i < json_data.length; i++) {
				keys.push(json_data[i].level[0].name)
				values.push(json_data[i].cant)
			};
			plotPieValues(keys ,values ,ctx6)
	});

	$.ajax({
		  url: "/stats/deal_price_proportions",
		  context: document.body
		}).done(function(data ) {
			var json_data = JSON.parse(data);
			var keys = [];
			var values = [];
			for (var i = 0; i < json_data.length; i++) {
				keys.push(json_data[i]._id)
				values.push(json_data[i].cant)
			};
			plotPieValues(keys ,values ,ctx7)
	});

	$.ajax({
		  url: "/stats/deal_bougth_proportions",
		  context: document.body
		}).done(function(data ) {
			var json_data = JSON.parse(data);
			var keys = [];
			var values = [];
			for (var i = 0; i < json_data.length; i++) {
				keys.push(json_data[i]._id)
				values.push(json_data[i].cant)
			};
			plotPieValues(keys ,values ,ctx8)
	});

	$.ajax({
		  url: "/stats/count_sellers",
		  context: document.body
			}).done(function(cant_sellers ) {
			$.ajax({
				  url: "/stats/count_partners",
				  context: document.body
					}).done(function(cant_partners ) {
						$.ajax({
							  url: "/stats/count_promoters",
							  context: document.body
								}).done(function(cant_promoters ) {
									var keys = ["Vendedores", "Socios", "Promotores"];
									var values = [cant_sellers, cant_partners ,cant_promoters];
									plotPieValues(keys ,values ,ctx9)
							});
			});
	});

	$.ajax({
		  url: "/stats/top_active_sellers",
		  context: document.body
		}).done(function(data ) {
			var json_data = JSON.parse(data);
			var keys = [];
			var values = [];
			for (var i = 0; i < json_data.length; i++) {
				keys.push(json_data[i].user[0].name+' '+json_data[i].user[0].lname)
				values.push(json_data[i].cant)
			};
			plotPieValues(keys ,values ,ctx10)
	});

	$.ajax({
		  url: "/stats/top_active_inviters",
		  context: document.body
		}).done(function(data ) {
			var json_data = JSON.parse(data);
			var keys = [];
			var values = [];
			for (var i = 0; i < json_data.length; i++) {
				if(typeof json_data[i].user[0] !== "undefined"){
					keys.push(json_data[i].user[0].name+' '+json_data[i].user[0].lname)
					values.push(json_data[i].cant)
				}
			};
			plotPieValues(keys ,values ,ctx11)
	});

		$.ajax({
		  url: "/stats/top_commissioners",
		  context: document.body
		}).done(function(data ) {
			var json_data = JSON.parse(data);
			var keys = [];
			var values = [];
			for (var i = 0; i < json_data.length; i++) {
				if(typeof json_data[i].user[0] !== "undefined"){
					keys.push(json_data[i].user[0].name+' '+json_data[i].user[0].lname)
					values.push(json_data[i].cant)
				}
				
			};
			plotPieValues(keys ,values ,ctx12)
	});

})