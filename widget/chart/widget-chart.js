/*
* Copyright (c) 4D, 2011
*
* This file is part of Wakanda Application Framework (WAF).
* Wakanda is an open source platform for building business web applications
* with nothing but JavaScript.
*
* Wakanda Application Framework is free software. You can redistribute it and/or
* modify since you respect the terms of the GNU General Public License Version 3,
* as published by the Free Software Foundation.
*
* Wakanda is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* Licenses for more details.
*
* You should have received a copy of the GNU General Public License version 3
* along with Wakanda. If not see : http://www.gnu.org/licenses/
*/
// "use strict";

/*global WAF,window*/

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */

WAF.Widget.provide(

    /**
     * WAF Google Chart widget
     *
     * @class WAF.widget.Chart
     * @extends WAF.Widget
     */
    'Chart',
    
    
    {
        // Shared private properties and methods
        // NOTE: "this" is NOT available in this context
    },


    /**
         * @constructor
         * @param {Object} inConfig configuration of the widget
         */

    /**
         * The constructor of the widget
         *
         * @property constructor
         * @type Function
         * @default WAF.widget.Chart
         **/
    function(inConfig, inData, shared) {
        var that = this;
        var labels = [],
            values = [],
            labels2= [],
            values2= [],
            source = this.source,
            columns= JSON.parse(inData['column'].replace(/'/g,'"'));
        
        this.isEmpty = true;
        this.columns = columns;
        
        /*
         * Drawing The legendary for Bar and Line Chart
         */
        that.createLengendary = function(){
            try{
                var legendaryC = $('#' + JSON.parse(decodeURI(inConfig['data-linkedWidgets'])).legendary);
                legendaryC.empty();
                legendaryC.css('overflow','auto');
                var legTable = $('<table></table>').appendTo('#' + legendaryC.attr('id'));

                for(var i = 0 ; i < values.length ; i++){
                    var htmlObj = $('<TR>' + 
                                     '<TD style="padding:1px">' + 
                                        '<DIV id = "' + legendaryC.attr('id') + '-legendary-item-' + i + '"></DIV></TD></TR>');
                    htmlObj.appendTo(legTable);
                    $('<TD style="padding-left:3px">' + unescape(columns[i].title) + '</TD>').appendTo(htmlObj);

                    Raphael(legendaryC.attr('id') + '-legendary-item-' + i , 20 , 20).rect(0,0,20,20).attr({
                        fill:that.colors[i]
                    });
                }
            }catch(e){
                return;
            }
            
       }
        
        var r = Raphael(inConfig.id,$("#" + inConfig.id).width(),$("#" + inConfig.id).height());
        that.colors = ["hsb(0.34,0.69,0.65)","hsb(0.19,0.82,0.81)","hsb(0.15,1,1)","hsb(0.10,0.91,0.97)","hsb(0.06,0.85,0.92)","hsb(0.02,0.83,0.90)","hsb(0.98,0.85,0.79)","hsb(0.82,0.71,0.51)","hsb(0.76,0.68,0.51)","hsb(0.69,0.65,0.52)","hsb(0.57,1,0.65)","hsb(0.46,1,0.61)"];
                
        if(source && inConfig['data-axisLabel'] && columns.length > 0){
            source.addListener("all",function(e){

               switch(e.eventKind){
                   case "onElementSaved" :
                   case "onCollectionChange" :
                       labels   = [];
                       values   = [];
                       labels2  = [];
                       values2  = [];
                       
                       for(var j = 0 ; j<columns.length ; j++){
                           values[j] = [];
                           values2[j] = [];
                       }
                       
                        for(var i = 0 ; i < Math.min(parseInt(inConfig['data-limitlength']), source.length) ; i++){
                            source.getElement(i, {
                                onSuccess : function(event){
                                    var item = event.element;
                                    if(item._private.currentEntity.isNew()){
                                        return;
                                    }
                                    labels.push(item[inConfig['data-axisLabel']]);
                                    
                                    for(j = 0 ; j < columns.length ; j++){
                                        values[j].push(isNaN(parseInt(item[columns[j].sourceAttID]))?0:parseInt(item[columns[j].sourceAttID]));
                                    }
                                    
                                    if(event.userData.onLastEntity){
                                        if(!that.isEmpty){
                                            r.clear();
                                        }
                                        switch(inConfig['data-chartType']){
                                            case 'Pie Chart':
                                                var radius  = Math.min($("#" + inConfig.id).width(),$("#" + inConfig.id).height())/2 - 55,
                                                    opts    = {
                                                        colors      : that.colors,
                                                        stroke      : null,
                                                        strokewidth : null,
                                                        init        : null,
                                                        href        : null,
                                                        legend      : null,
                                                        legendmark  : null,
                                                        legendothers: null,
                                                        legendpos   : null
                                                    };
                                                that.chart     = r.g.piechart(r.width/2, r.height/2, radius, values[0] , opts);
                                                that.chart.selected = -1;
                                                
                                                that.isEmpty = false;

                                                var i = 0;
                                                that.chart.each(function(){
                                                    var c = that.chart.series[i].clone().hide().translate(10*Math.cos(that.chart.series[i].mangle*Math.PI / 180),-10*Math.sin(that.chart.series[i++].mangle*Math.PI / 180));
                                                    this.cover.posSelect = c.attr('path');
                                                    this.cover.posOrigin = this.sector.attr('path');
                                                    this.sector.index = i-1;
                                                    c.remove();
                                                });

                                                that.chart.select = function(i){
                                                    if(i >= values[0].length || i < 0){
                                                        return;
                                                    }
                                                    
                                                    for(var j = 0 ; j<values[0].length ; j++){
                                                        if(values[0][j].order == i){
                                                            i = j;
                                                            break;
                                                        }
                                                    }
                                                    
                                                    if(this.selected == i){
                                                        this.selected = -1;
                                                        this.series[i].animate({path : this.covers[i].posOrigin} , 1000 , 'bounce');
                                                        return;
                                                    }
                                                    if(this.selected != -1){
                                                        this.series[this.selected].animate({path : this.covers[this.selected].posOrigin} , 1000 , 'bounce');
                                                    }
                                                    
                                                    
                                                    
                                                    this.series[i].animate({path : this.covers[i].posSelect} , 1000 , 'bounce');
                                                    this.selected = i;
                                                }

                                                that.chart.click(function(){
                                                    that.source.select(this.sector.value.order);
                                                });
                                                
                                                
                                                // Set the format :
                                                if(columns[0] && columns[0].format){
                                                    that.setFormat(columns[0].format);
                                                }
                                                
                                                if(inConfig['data-tooltipDisplay']==='true'){
                                                    that.chart.hover(function () {
                                                        this.tag = r.g.blob(this.cx + (radius + 2)*Math.cos(this.mangle*Math.PI / 180),this.cy-(radius + 2)*Math.sin(this.mangle*Math.PI / 180), labels[this.sector.value.order] + "\n" + that.getFormattedValue(this.sector.value.value), this.mangle).insertBefore(this.cover);
                                                        this.tag[0].attr({
                                                            fill : that.colors[this.sector.index], 
                                                            stroke : "#000"
                                                        });
                                                    }, function () {
                                                        this.tag.animate({
                                                            opacity: 0
                                                        }, 300, function () {
                                                            this.remove();
                                                        });
                                                    });
                                                }
                                                
                                                try{
                                                    var legendaryC = $('#' + JSON.parse(decodeURI(inConfig['data-linkedWidgets'])).legendary);
                                                    legendaryC.empty();
                                                    legendaryC.css('overflow','auto');
                                                    var legTable = $('<table></table>').appendTo('#' + legendaryC.attr('id'));
                                                    for(i = 0 ; i < values[0].length ; i++){
                                                        var htmlObj = $('<TR>' + 
                                                                         '<TD>' + 
                                                                            '<DIV id = "' + legendaryC.attr('id') + '-legendary-item-' + i + '"></DIV></TD></TR>');
                                                        htmlObj.appendTo(legTable);
                                                        $('<TD>' + labels[that.chart.series[i].value.order] + '</TD>').appendTo(htmlObj);
                                                        var legItem = Raphael(legendaryC.attr('id') + '-legendary-item-' + i , 20 , 20).rect(0,0,20,20).attr({
                                                            fill:that.chart.series.length==1?that.chart.series[0].attr('fill'):that.chart.series[i].attr('fill'), 
                                                            cursor : 'pointer'
                                                        });
                                                        legItem.index = that.chart.series[i].value.order;

                                                        legItem.click(function(){
                                                            that.source.select(this.index);
                                                        });
                                                    }
                                                }catch(e){
                                                    return;
                                                }
                                                break;
                                            case 'Line Chart' :
                                                var offset  = 20,
                                                    max     = values[0][0];
                                                opts    = {
                                                    vgutter     : null,
                                                    shade       : null,
                                                    nostroke    : false, 
                                                    axis        : "0 0 1 1",
                                                    axisxstep   : isNaN(parseInt(inConfig['data-xstepvalue']))?null:parseInt(inConfig['data-xstepvalue']), 
                                                    axisystep   : isNaN(parseInt(inConfig['data-ystepvalue']))?null:parseInt(inConfig['data-ystepvalue']), 
                                                    width       : null,
                                                    dash        : null, // 
                                                    smooth      : false,
                                                    symbol      : "o",
                                                    colors      : that.colors,
                                                    gutter      : 5
                                                };
                                                that.isEmpty = false;
                                                // Sorting the data :
                                                for (i = 0; i < labels.length; i++) {
                                                    var lab = labels[i];
                                                    labels[i] = {value: labels[i] , valueDes : lab , order: i, valueOf: function () {return this.valueDes;}};
                                                    for(var j = 0 ; j<values.length ; j++){
                                                        var val = values[j][i];
                                                        if(max < values[j][i]){
                                                            max = values[j][i];
                                                        }
                                                        values[j][i] = {value: values[j][i], valueDes : val , order: i , column : j , valueOf: function () {return this.valueDes;} , label : labels[i]};
                                                    }
                                                }
                                                
                                                offset = r.text(0,0,max).hide().getBBox().width + 10;


                                                for(i = 0 ; i<values.length ; i++){
                                                    values[i].sort(function (a, b) {
                                                        return labels[a.order].value - labels[b.order].value;
                                                    });
                                                }

                                                labels.sort(function (a, b) {
                                                    return a.value - b.value;
                                                });
                                                
                                                // Drawing the chart
                                                that.chart = r.g.linechart(offset, 20, r.width - offset - 30 , r.height - 40 , labels , values, opts);
                                                
                                                that.chart.clickColumn(function(){
                                                    that.source.select(this.values[0].order);
                                                });
                                                
                                                that.chart.click(function(){
                                                    that.source.select(this.value.order);
                                                });
                                                
                                                if(inConfig['data-tooltipDisplay'] == 'true'){
                                                    that.chart.hover(function(){
                                                        that.setFormat(columns[this.value.column].format);
                                                        this.line.attr({'stroke-width' : 3});
                                                        this.tags = r.set();
                                                        this.tags.push(r.g[inConfig['data-tooltipType']](this.x,inConfig['data-tooltipType'] === "label"?this.y-15:this.y, that.getFormattedValue(this.value.value) || "0",parseInt(inConfig['data-tooltipAngle'])-360).insertBefore(this).attr([{fill: this.symbol.attr("fill") , stroke : '#000'}, {fill: '#000'}]));
                                                    },function(){
                                                        this.tags && this.tags.remove();
                                                        this.line.attr({'stroke-width' : 2});
                                                    });
                                                }
                                                that.createLengendary();
                                                break;
                                            case 'Bar Chart'  :
                                                that.isEmpty = false;
                                                opts = {
                                                        type    : 'soft',
                                                        colors  : that.colors,
                                                        gutter  : 20,
                                                        vgutter : 5,
                                                        to      : isNaN(parseInt(inConfig['data-ymax']))?null:parseInt(inConfig['data-ymax']) - (isNaN(parseInt(inConfig['data-ymin']))?0:parseInt(inConfig['data-ymin'])),
                                                        stacked : null
                                                    };
                                                max = values[0][0];
                                                var vstep = 10;
                                                
                                                for (j = 0; j < values.length; j++) {
                                                    for(i = 0 ; i<values[j].length ; i++){
                                                        val = values[j][i];
                                                        if(!isNaN(parseInt(inConfig['data-ymin'])) && parseInt(inConfig['data-ymin'])>val){
                                                            val = 0;
                                                        }
                                                        if(max < values[j][i]){
                                                            max = values[j][i];
                                                        }
                                                        var temp = values[j][i] - (isNaN(parseInt(inConfig['data-ymin']))?0:parseInt(inConfig['data-ymin']));
                                                        values[j][i] = {
                                                                value: values[j][i], 
                                                                valueDes : temp, 
                                                                order: i, 
                                                                column : j,
                                                                valueOf: function () {return this.valueDes;} , 
                                                                'label' : labels[j]
                                                            };
                                                    }
                                                }
                                                
                                                if(inConfig['data-yinterval'] === 'Step Count'){
                                                    vstep = isNaN(parseInt(inConfig['data-ystepvalue']))?vstep:parseInt(inConfig['data-ystepvalue']);
                                                }
                                                else if(inConfig['data-yinterval'] === 'Range'){
                                                    var ymax = isNaN(parseInt(inConfig['data-ymax']))?max:parseInt(inConfig['data-ymax']),
                                                        ymin = isNaN(parseInt(inConfig['data-ymin']))?0:parseInt(inConfig['data-ymin']),
                                                        step = isNaN(parseInt(inConfig['data-ystepvalue']))?null:parseInt(inConfig['data-ystepvalue']);
                                                    
                                                    vstep = isNaN((ymax - ymin)/step)?vstep:parseInt((ymax - ymin)/step);
                                                }
                                                
                                                var barvgutter  = opts.vgutter || 20 ,
                                                    textSet     = r.set(),
                                                    y           = 35,
                                                    textMax     = 0,
                                                    textTemp    = r.text(0,0,max).hide(),
                                                    x           = textTemp.getBBox().width + 15,
                                                    gutter      = opts.gutter || 10,
                                                    barhgutter  = (r.width - x)*gutter/(labels.length*(100+gutter)+gutter),
                                                    barwidth    = barhgutter*100/gutter;
                                                    posTemp     = x + barhgutter;
                                                textTemp.remove();
//                                                for(i = 0 ; i < that.source.length ; i++){
//                                                    r.text(posTemp + barwidth/2 , r.height - 5 , labels[i]);
//                                                    posTemp += barwidth + barhgutter;
//                                                }
                                                
                                                for(i = 0 ; i < that.source.length ; i++){
                                                    textTemp = r.text(posTemp + barwidth/2 , r.height , labels[i]).rotate(90, posTemp + barwidth/2, r.height);
                                                    if(textMax<textTemp.getBBox().width){
                                                        textMax = parseInt(textTemp.getBBox().width);
                                                    }
                                                    posTemp += barwidth + barhgutter;
                                                    textSet.push(textTemp);
                                                }
                                                textSet.attr({'text-anchor' : 'start'}).translate(0, - textMax);
                                                
                                                that.chart = r.g.barchart(x , y, r.width - x, r.height - textMax - y, values,opts);
                                                r.g.axis(x + barhgutter/2 , r.height - textMax - barvgutter , r.height - textMax - y - 2*barvgutter , isNaN(parseInt(inConfig['data-ymin']))?0:parseInt(inConfig['data-ymin']) , isNaN(parseInt(opts.to))?max:opts.to+(isNaN(parseInt(inConfig['data-ymin']))?0:parseInt(inConfig['data-ymin'])) , vstep , 1 );
                                                r.g.axis(x + barhgutter/2 , r.height - textMax - barvgutter , r.width - x - barhgutter, 0 , 1 , labels.length , 2 ).text.remove();
                                                
                                                
                                                
                                                that.chart.click(function(){
                                                    that.source.select(this.value.order);
                                                })
                                                
                                                if(inConfig['data-tooltipDisplay'] == 'true'){
                                                    that.chart.hover(function () {
                                                        that.setFormat(columns[this.value.column].format);
                                                        this.tag = r.g[inConfig['data-tooltipType']](this.bar.x,inConfig['data-tooltipType'] === "label"?this.bar.y-15:this.bar.y, that.getFormattedValue(this.bar.value.value) || "0",parseInt(inConfig['data-tooltipAngle'])-360).insertBefore(this).attr([{fill: this.bar.attr("fill") , stroke : '#000'}, {fill: '#000'}]);
                                                    }, function () {
                                                        this.tag.animate({
                                                            opacity: 0
                                                        }, 300, function () {
                                                            this.remove();
                                                        });
                                                    });
                                                }
                                                
                                                that.createLengendary();
                                                
                                                break;
                                                
                                        }
                                        
                                        
                                    }
                                    
                                }
                              },{
                                  onLastEntity  : i == Math.min(parseInt(inConfig['data-limitlength']), source.length)-1,
                                  order         : i
                              }  
                            );
                       }
                       
                       break;
                  case "onCurrentElementChange" :
                      switch(inConfig['data-chartType']){
                            case 'Pie Chart' :
                                try{
                                    that.chart.select(that.source.getPosition());
                                }catch(e){
                                    
                                }
                                break;
                      }
                      break;
               }
            });
        }
        
    },

    {
        getchartType: function(){
            return this.config['data-chartType'];
        },
        setFormat   : function(format){
            if(!format){
                format = "";
            }
            this.format = {
                format : unescape(format)
            }
        }
    }

);