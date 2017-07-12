// import 'd3/build/d3.min.js'
import * as d3 from 'd3';

export default class mainController {
    constructor($http) {
        'ngInject';
        this._$http = $http;
    }

    callTele() {
        this._$http({
            url: 'callTele',
            method: 'POST',
            data: {
                'info': 'foobar'
            }
        }).then((response) => {
            var data = response.data;

            var width = 1000;
            var height = 500;

            var min = data.readings[0][1];
            var max = data.readings[0][1];
            var start = data.readings[0][0];
            var end = data.readings[data.readings.length - 1][0];
            var j;
            for (j = 0; j < data.readings.length; j++) {
                if (min > data.readings[j][1]) min = data.readings[j][1];
                if (max < data.readings[j][1]) max = data.readings[j][1];

                if (start > data.readings[j][0]) start = data.readings[j][0];
                if (end < data.readings[j][0]) end = data.readings[j][0];
            }
            start *= 1000;
            end *= 1000;

            var unitSize = 4;

            var margin = {
                top: 20,
                right: 10,
                bottom: 20,
                left: 10 + (unitSize * 7),
            };
            width = width - margin.left - margin.right;
            if (width < 0) return;
            height = height - margin.top - margin.bottom;

            var newChart = d3.select('#my-graph')
                .append('svg')
                .attr('class', 'Chart-Container')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
                .classed('svg-content-responsive', true);

            var xScale = d3.scaleTime()
                .domain([new Date(start), new Date(end), ])
                .rangeRound([0, width, ]);

            var yScale = d3.scaleLinear()
                .domain([min, max + (max - min) * 0.1, ])
                .rangeRound([height, margin.bottom, ]);

            function getTic() {
                var Ticks = [];
                var ratio = (max - min) / 6;
                for (var i = 0; i < 7; i++) {
                    Ticks.push(min + (ratio * i));
                }
                return Ticks;
            }

            //y axis
            var yAxis = d3.axisLeft(yScale)
                .tickSizeInner(-width)
                .tickSizeOuter(-10)
                .tickValues(getTic())
                .tickFormat(function(d) {
                    return d;
                });


            newChart.append('g')
                .attr('class', 'ChartAxis-Shape')
                .call(yAxis);


            //X Axis
            var xAxis = d3.axisBottom(xScale)
                .tickSizeInner(-height + margin.bottom)
                .tickSizeOuter(0)
                .tickPadding(10)
                .ticks(12);

            newChart.append('g')
                .attr('class', 'ChartAxis-Shape')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);


            var xAxisTop = d3.axisBottom(xScale)
                .ticks(0);

            newChart.append('g')
                .attr('class', 'ChartAxis-Shape')
                .attr('transform', 'translate(0, ' + margin.bottom + ')')
                .call(xAxisTop);

            var yAxisRight = d3.axisLeft(yScale)
                .ticks(0);

            newChart.append('g')
                .attr('class', 'ChartAxis-Shape')
                .attr('transform', 'translate(' + width + ', 0)')
                .call(yAxisRight);


            var meanTimes = [];
            var lastPoint = (data.readings[0][0]);

            for (j = 0; j < data.readings.length; j++) {
                meanTimes.push((data.readings[j][0] - lastPoint) * 0.0001);
                lastPoint = data.readings[j][0];
            }
            meanTimes.sort();

            var lineFunction = d3.line()
                .x(function(d) {
                    return isNaN(xScale(d[0] * 1000)) ? 0 : xScale(d[0] * 1000);
                })
                .y(function(d) {
                    return yScale(d[1]);
                });
            newChart.append('path')
                .attr('d', lineFunction(data.readings))
                .attr('stroke', '#FFB90F')
                .attr('stroke-width', 2)
                .attr('fill', 'none');

            //TOOL-TIPS
            //Tooltip container
            var tooltip = newChart.append('g')
                .style('display', 'none');

            var circleElements = [],
                textElements = [];

            //for every stream. create a circle, text, and horizontal line element and store in an array
            var newCircle = tooltip.append('circle')
                .attr('class', 'tooltip-circle')
                .style('fill', 'none')
                .style('stroke', 'blue')
                .attr('r', 4);
            circleElements.push(newCircle);

            var newText = tooltip.append('text')
                .attr('width', 100 * 2)
                .attr('height', 100 * 0.4)
                .attr('fill', 'black');

            textElements.push(newText);


            //Y-axis line for tooltip
            var yLine = tooltip.append('g')
                .append('line')
                .attr('class', 'tooltip-line')
                .style('stroke', 'blue')
                .style('stroke-dasharray', '3,3')
                .style('opacity', 0.5)
                .attr('y1', margin.bottom)
                .attr('y2', height);

            //Date text
            var timeText = tooltip.append('text')
                .attr('x', 0)
                .attr('y', margin.bottom - 5)
                .attr('width', 100)
                .attr('height', 100 * 0.4)
                .attr('fill', 'black');

            var myData = [];
            for (var x in data.readings) {
                myData.push(new Date(data.readings[x][0]).getTime() * 1000);
            }

            //Selection box
            var selectionBox = newChart.append('rect')
                .attr('fill', 'none')
                .attr('opacity', 0.5)
                .attr('x', 0)
                .attr('y', margin.bottom)
                .attr('width', 14)
                .attr('height', height - margin.bottom)
                .attr('class', 'myselection');

            //Drag behaivors for the selection box.
            var dragStart = 0,
                dragStartPos = 0,
                dragEnd = 0;
            var drag = d3.drag()
                .on('drag', function(d, i) {
                    var x0 = xScale.invert(d3.mouse(this)[0]).getTime();
                    i = d3.bisect(myData, x0);
                    var d0 = data.readings[i - 1],
                        d1 = data.readings[i];
                    if (d1 === undefined) return;
                    d = x0 - d0[0] * 1000 > d1[0] * 1000 - x0 ? d1 : d0;
                    if (xScale(d[0] * 1000) > dragStartPos) {
                        selectionBox.attr('width', (xScale(d[0] * 1000) - dragStartPos));
                    } else {
                        selectionBox.attr('width', (dragStartPos - xScale(d[0] * 1000)));
                        selectionBox.attr('transform', 'translate(' + xScale(d[0] * 1000) + ',0)');
                    }
                })
                .on('end', function() {
                    dragEnd = d3.mouse(this)[0];
                    if (Math.abs(dragStart - dragEnd) < 10) return;

                    var x0 = xScale.invert(dragStart),
                        x1 = xScale.invert(dragEnd);
                    if (x1 > x0) {
                        start = x0.getTime();
                        end = x1.getTime();
                    } else {
                        start = x1.getTime();
                        end = x0.getTime();
                    }
                });
            //Hit area for selection box
            newChart.append('rect')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .on('mouseover', function() {
                    tooltip.style('display', null);
                })
                .on('mouseout', function() {
                    tooltip.style('display', 'none');
                })
                .on('mousemove', function() {
                    var x0 = xScale.invert(d3.mouse(this)[0]).getTime(),
                        i = d3.bisect(myData, x0),
                        d0 = data.readings[i - 1],
                        d1 = data.readings[i];
                    var d;
                    if (d0 === undefined && d1 === undefined) return;
                    if (d0 === undefined) {
                        d = d1;
                    } else if (d1 === undefined) {
                        d = d0;
                    } else {
                        if (x0 - d0[0] * 1000 > d1[0] * 1000 - x0) {
                            d = d1;
                        } else {
                            d = d0;
                        }
                    }
                    if (d[1] < min || d[1] > max) return;
                    circleElements[0].attr('transform', 'translate(' + xScale(d[0] * 1000) + ',' + yScale(d[1]) + ')');
                    yLine.attr('transform', 'translate(' + xScale(d[0] * 1000) + ',' + 0 + ')');
                    timeText.text(new Date(d[0] * 1000) + ' | ' + d[1]);

                    textElements[0]
                        .text(d[1])
                        .attr('transform', 'translate(' + (xScale(d[0] * 1000) + 10) + ',' + (yScale(d[1]) - 10) + ')');

                })
                .on('mousedown', function() {
                    selectionBox.attr('fill', '#b7ff64');
                    dragStart = d3.mouse(this)[0];

                    var x0 = xScale.invert(d3.mouse(this)[0]).getTime(),
                        i = d3.bisect(myData, x0),
                        d0 = data.readings[i - 1],
                        d1 = data.readings[i];
                    if (d1 === undefined) return;
                    var d = x0 - d0[0] * 1000 > d1[0] * 1000 - x0 ? d1 : d0;
                    selectionBox.attr('transform', 'translate(' + xScale(d[0] * 1000) + ',0)');
                    dragStartPos = xScale(d[0] * 1000);
                })
                .call(drag);
        });
    }
}
