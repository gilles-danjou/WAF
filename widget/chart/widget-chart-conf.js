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
WAF.addWidget({
    
    /**
    *  Widget Descriptor
    *
    */ 
    
    /* PROPERTIES */

    // {String} internal name of the widget
    type        : 'chart',  
    test        : "this is a test",

    // {String} library used ('waf', 'jquery', 'extjs', 'yui') (optional)
    lib         : 'WAF',

    // {String} display name of the widget in the GUI Designer 
    description : 'Chart',

    // {String} category in which the widget is displayed in the GUI Designer
    category    : 'Reporting',//'Reporting',

    // {Array} css file needed by widget (optional)
    css         : [],                                                     

    // {Array} script files needed by widget (optional) 
    include     : [],                 

    // {String} type of the html tag ('div' by default)
    tag         : 'div',                               

    // {Array} attributes of the widget. By default, we have 3 attributes: 'data-type', 'data-lib', and 'id', so it is unnecessary to add them
    // 
    // @property {String} name, name of the attribute (mandatory)     
    // @property {String} description, description of the attribute (optional)
    // @property {String} defaultValue, default value of the attribute (optional)
    // @property {'string'|'radio'|'checkbox'|'textarea'|'dropdown'|'integer'} type, type of the field to show in the GUI Designer (optional)
    // @property {Array} options, list of values to choose for the field shown in the GUI Designer (optional)
    attributes  : [                                                       
    {
        name        : 'data-binding',
        description : 'Source',
        type        : 'string'
    }, {
        name        : 'data-axisLabel',
        visibility  : 'hidden'
    }, {
        name        : 'data-chartType',
//        description : 'Type',
//        type        : 'dropdown',
//        options     : ['Pie Chart' , 'Line Chart' , 'Bar Chart'],
        defaultValue: 'Pie Chart',
        visibility  : 'hidden'
    }, {
        name        : 'data-tooltipDisplay',
        visibility  : 'hidden',
        defaultValue: 'true'
    }, {
        name        : 'data-tooltipType',
        visibility  : 'hidden',
        defaultValue: 'blob'
    }, {
        name        : 'data-tooltipAngle',
        visibility  : 'hidden',
        defaultValue: '90'
    },{
        name        : 'data-limitlength',
        description : 'Limit length',
        type        : 'integer',
        defaultValue: '100'
    },
    {
        name        : 'data-column',
        visibility  : 'hidden',
        defaultValue: '[]'
    },
    {
        name        : 'data-draggable',
        description : 'Draggable',
        type        : 'checkbox',
        defaultValue: 'false'
    },  {
        name        : 'data-linkedWidgets',
        visibility  : 'hidden'
    }, {
        name        : 'data-oldSource',
        visibility  : 'hidden',
        type        : 'string',
        defaultValue: ''
    },  {
        name        : 'data-ymin',
        visibility  : 'hidden'
    },  {
        name        : 'data-ymax',
        visibility  : 'hidden'
    },  {
        name        : 'data-yinterval',
        visibility  : 'hidden',
        defaultValue: 'Step Count'
    },  {
        name        : 'data-xstepvalue',
        visibility  : 'hidden',
        defaultValue: ''
    },  {
        name        : 'data-ystepvalue',
        visibility  : 'hidden',
        defaultValue: ''
    }
    ],
    columns: {
        attributes : [    
        {
            name       : 'format'        
        }
        ],
        events: []
    },

    // {Array} default height and width of the container for the widget in the GUI Designer
    // 
    // @property {String} name, name of the attribute 
    // @property {String} defaultValue, default value of the attribute  
    style: [
    {
        name        : 'width',
        defaultValue: '480px'
    },
    {
        name        : 'height',
        defaultValue: '300px'
    }],

    // {Array} events ot the widget
    // 
    // @property {String} name, internal name of the event (mandatory)     
    // @property {String} description, display name of the event in the GUI Designer
    // @property {String} category, category in which the event is displayed in the GUI Designer (optional)
    events: [
    {
        name       : 'click',
        description: 'On Click',
        category   : 'Data Point Events'
    },{
        name       : 'dblclick',
        description: 'On Double Click',
        category   : 'Data Point Events'
    },{
        name       : 'mousedown',
        description: 'On Mouse Down',
        category   : 'Data Point Events'
    },{
        name       : 'mousemove',
        description: 'On Mouse Move',
        category   : 'Data Point Events'
    },{
        name       : 'mouseout',
        description: 'On Mouse Out',
        category   : 'Data Point Events'
    },{
        name       : 'mouseover',
        description: 'On Mouse Over',
        category   : 'Data Point Events'
    },{
        name       : 'mouseup',
        description: 'On Mouse Up',
        category   : 'Data Point Events'
    }
    ],

    // {JSON} panel properties widget
    //
    // @property {Object} enable style settings in the Styles panel in the Properties area in the GUI Designer
    properties: {
        style: {
            theme       : {
                'roundy'    : false
            },
            fClass      : true,
            text        : false,
            background  : true,
            border      : true,
            sizePosition: true,
            shadow      : true,
            label       : false,
            disabled    : []
        }
    },

    // (optional area)
    // 
    // {Array} list of sub elements for the widget
    // 
    // @property {String} label of the sub element
    // @property {String} css selector of the sub element
    structure: [],

    /* METHODS */

    /*
    * function to call when the widget is loaded by WAF during runtime
    * 
    * @param {Object} config contains all the attributes of the widget  
    * @result {WAF.widget.Rifox} the widget
    */
    onInit: function (config) {                                
        var widget = new WAF.widget.Chart(config); 
        if (config['data-draggable'] === "true") {
            $('#' + config.id).draggable({});
            $('#' + config.id).css('cursor', 'pointer');
        }
        return widget;
    },

    /**
    * function to call when the widget is displayed in the GUI Designer
    * 
    * @param {Object} config contains all the attributes for the widget
    * @param {Designer.api} set of functions used to be managed by the GUI Designer
    * @param {Designer.tag.Tag} container of the widget in the GUI Designer
    * @param {Object} catalog of dataClasses defined for the widget
    * @param {Boolean} isResize is a resize call for the widget (not currently available for custom widgets)
    */
    onDesign: function (config, designer, tag, catalog, isResize) {
        
        var columns = tag.getColumns().toArray();
        
        var values  = function(){
                var res = [];
                for(var i = 1 ; i <= columns.length ; i++){
                    res.push([10*i,30*i,100*i,20*i]);
                }
                return res;
            }.call(),
            labels          = function(){
                var result = [];
                for(var item in values[0]){
                    result.push((tag.getSource() ? tag.getSource() + ' Entity ' : 'Fake Data ') + item)
                }
                return result;
            }.call();
         
        
        
        /*
         *Initialization of the structure of the widget
         */
        tag.createChart = function tag_draw() {
            this._linkedWidgets = {};
            var containerDef    = Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('container')),
            container       = new Designer.tag.Tag(containerDef),
            titleDef        = Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('richText')),
            title           = new Designer.tag.Tag(titleDef),
            subTitleDef     = Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('richText')),
            subTitle        = new Designer.tag.Tag(subTitleDef),
            legendaryDef    = Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('container')),
            legendary       = new Designer.tag.Tag(legendaryDef);
                
            
            // The Container
            container.create({
                id      : this.getId() + "-container",
                width   : this.getWidth() + 180,
                height  : this.getHeight() + 90
            });
            
            container._linkedWidget = this;
            container.setXY(this.getX(), this.getY(), true);
            container.setParent(this.getParent());
            
            
            // The Title :
            title.create({
                id      : this.getId() + "-title",
                width   : container.getWidth(),
                height  : 40
            });
            
            title._linkedWidget = this;
            title.getAttribute('data-autoWidth').setValue("false");
            title.getAttribute('data-text').setValue("Wakanda Chart");
            title.setXY(0, 10, true);
            title.setParent(container);
            
            // Css of the title : 
            title.setCss('font-family'  , "'Times New Roman', Times, serif");
            title.setCss('font-size'    , "30px");
            title.setCss('font-weight'  , "bold");
            title.setCss('text-align'   , "center");
            
            // The subTitle : 
            subTitle.create({
                id      : this.getId() + "-subTitle",
                width   : 175,
                height  : 13
            });
            
            subTitle._linkedWidget = this;
            subTitle.getAttribute('data-autoWidth').setValue("false");
            subTitle.getAttribute('data-text').setValue("");
            subTitle.setXY(( container.getWidth() - 175 )/2, 55, true);
            subTitle.setParent(container);
            
            // Css of the subTitle :
            subTitle.setCss('text-align'   , "center");
            
            // The Legendary :
            legendary.create({
                id      : this.getId() + "-legendary",
                width   : 130,
                height  : 102
            });
            
            legendary.getAttribute('data-draggable').setValue(true);
            legendary._properties.style.text = true;
            legendary.setXY(510, 80, true);
            legendary._linkedWidget = this;
            legendary.setParent(container);
            
            this.setXY(20, 80, true);
            this.setParent(container);
            this._linkedWidgets = {
                                    container   : container,
                                    title       : title,
                                    subTitle    : subTitle,
                                    legendary   : legendary
                                };
            this.refresh();
        }
        /*
         * Designing the legendary
         */
        if(tag._linkedWidgets && tag._linkedWidgets.title && tag.getAttribute('data-oldSource').getValue() !== tag.getSource()){
            tag._linkedWidgets.title.getAttribute('data-text').setValue(tag.getSource() + " Chart");
            tag._linkedWidgets.title.refresh();
           
            tag.getAttribute('data-oldSource').setValue(tag.getSource());
        }
        if(typeof tag._linkedWidgets !== 'undefined' && tag._linkedWidgets.legendary !== 'undefined'){
            legendary = tag._linkedWidgets.legendary;
            if (legendary) {
                $('#' + legendary.getId()).empty();
            }
        }
        
        if(labels.length == 0 || values.length == 0){
            var r = Raphael(tag.getId(),$("#" + tag.getId()).width(),$("#" + tag.getId()).height());
            r.text(r.width/2,r.height/2,'Drop a datasource here').attr({'font-size':20});
            return;
        }
        
        /*
         * Drawing The legendary for Bar and Line Chart
         */
        tag.createLengendary = function(){
            if(typeof tag._linkedWidgets !== 'undefined' && legendary){
                var legendaryC = $('#' + legendary.getId());
                legendaryC.empty();
                legendaryC.css('overflow','auto');
                var legTable = $('<table></table>').appendTo('#' + legendaryC.attr('id'));

                for(var i = 0 ; i < values.length ; i++){
                    var htmlObj = $('<TR>' + 
                                     '<TD style="padding:1px">' + 
                                        '<DIV id = "' + legendaryC.attr('id') + '-legendary-item-' + i + '"></DIV></TD></TR>');
                    htmlObj.appendTo(legTable);
                    $('<TD style="padding-left:3px">' + tag.getColumns().toArray()[i].title  + '</TD>').appendTo(htmlObj);
                    Raphael(legendaryC.attr('id') + '-legendary-item-' + i , 20 , 20).rect(0,0,20,20).attr({
                        fill:colors[i]
                    });
                }
            }
       }
        
        /*
         * Initialization of the graph
         */
        var r = Raphael(tag.getId(),$("#" + tag.getId()).width(),$("#" + tag.getId()).height());
        var colors = ["hsb(0.34,0.69,0.65)","hsb(0.19,0.82,0.81)","hsb(0.15,1,1)","hsb(0.10,0.91,0.97)","hsb(0.06,0.85,0.92)","hsb(0.02,0.83,0.90)","hsb(0.98,0.85,0.79)","hsb(0.82,0.71,0.51)","hsb(0.76,0.68,0.51)","hsb(0.69,0.65,0.52)","hsb(0.57,1,0.65)","hsb(0.46,1,0.61)"];
        tag.chart = null;
        
        /*
         * Drawing the graph
         */
        
        switch(tag.getAttribute('data-chartType').getValue()){
            /*
             * Drawing the pie chart
             */
            case 'Pie Chart' :
                
                
                var radius  = Math.min(tag.getWidth(), tag.getHeight())/2 - 50,
                    opts    = {
                            colors      : colors,
                            stroke      : null,
                            strokewidth : null,
                            init        : null,
                            href        : null,
                            legend      : null,
                            legendmark  : null,
                            legendothers: null,
                            legendpos   : null
                        };
                tag.chart     = r.g.piechart(r.width/2, r.height/2, radius, values[0],opts);
                
                if(tag.getAttribute('data-tooltipDisplay').getValue() == 'true'){
                    tag.chart.hover(function () {
                        this.tag = r.g.blob(this.cx + (radius + 2)*Math.cos(this.mangle*Math.PI / 180),this.cy-(radius + 2)*Math.sin(this.mangle*Math.PI / 180), labels[this.sector.value.order] + "\n" + this.sector.value.value, this.mangle).insertBefore(this.cover);
                        this.tag[0].attr({
                            fill : colors[this.sector.index], 
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
                
                var i = 0;
                tag.chart.each(function(){
                    this.sector.index = i++;
                });
                delete i;
                
                if (typeof tag._linkedWidgets !== 'undefined' && legendary){
                    $('#' + legendary.getId()).css('overflow','auto');
                    var legTable = $('<table></table>').appendTo('#' + legendary.getId());
                    for(i = 0 ; i < labels.length ; i++){
                        var htmlObj = $('<TR>' + 
                                         '<TD style="padding:1px">' + 
                                            '<DIV id = "' + tag.getId() + '-legendary-item-' + i + '"></DIV></TD></TR>');
                        htmlObj.appendTo(legTable);
                        $('<TD style="padding-left:3px">' + labels[tag.chart.series[i].value.order] + '</TD>').appendTo(htmlObj);
                        var legItem = Raphael(tag.getId() + '-legendary-item-' + i , 20 , 20).rect(0,0,20,20);
                        legItem.attr({
                            fill:colors[tag.chart.series[i].index]
                        });
                        delete legItem;
                    }
                }
                
                break;
            case 'Line Chart':
                if(columns.length == 0){
                    return;
                }
                labels = [0,1,2,3];
                var offset = 20,
                    opts    = {
                        vgutter     : null,
                        shade       : null,
                        nostroke    : false, 
                        axis        : "0 0 1 1",
                        axisstep    : null,
                        width       : null,
                        dash        : null,
                        smooth      : false,
                        symbol      : "o",
                        colors      : colors,
                        gutter      : 5
                    };
                    
                // Sorting the data :
                                                
                for (i = 0; i < labels.length; i++) {
                    labels[i] = {value: labels[i], order: i, valueOf: function () {return this.value;}};
                    for(var j = 0 ; j<values.length ; j++){
                        if(max < values[j][i]){
                            max = values[j][i];
                        }
                        values[j][i] = {value: values[j][i], order: i, valueOf: function () {return this.value;} , label : labels[i]};
                    }
                }


                for(i = 0 ; i<values.length ; i++){
                    values[i].sort(function (a, b) {
                        return labels[a.order].value - labels[b.order].value;
                    });
                }

                labels.sort(function (a, b) {
                    return a.value - b.value;
                });
                
                
                tag.chart = r.g.linechart(offset, offset, r.width - offset - 30 , r.height - offset - 20 , labels , values, opts);
                tag.createLengendary();
                break;
            case 'Bar Chart' :
                if(columns.length == 0){
                    return;
                }
                opts = {
                    type    : 'soft',
                    colors  : colors,
                    gutter  : 50,
                    vgutter : 10,
                    to      : null,
                    stacked : null
                };
                var max = values[0][0],
                    textMax     = 0;
                    textSet     = r.set(),
                    y           = 25,
                    barvgutter  = opts.vgutter || 20 ,
                    textTemp    = r.text(0,0,max).hide(),
                    x           = textTemp.getBBox().width + 15,
                    gutter      = opts.gutter || 10,
                    barhgutter  = (r.width - x)*gutter/(labels.length*(100+gutter)+gutter),
                    barwidth    = barhgutter*100/gutter;
                    posTemp     = x + barhgutter;
                    
                textTemp.remove();   
                for (i = 0; i < values.length; i++) {
                    for(j = 0 ; j<values[i].length ; j++){
                        if(max < values[i][j]){
                            max = values[i][j];
                        }
                    }
                }
                
                for(i = 0 ; i < labels.length ; i++){
                    textTemp = r.text(posTemp + barwidth/2 , r.height , labels[i]).rotate(90, posTemp + barwidth/2, r.height - 10); 
                    if(textMax<textTemp.getBBox().width){
                        textMax = parseInt(textTemp.getBBox().width);
                    }
                    posTemp += barwidth + barhgutter;
                    textSet.push(textTemp);
                }
                textSet.attr({'text-anchor' : 'start'}).translate(0, - textMax + 5);
                
                
                tag.chart = r.g.barchart(x , y, r.width - x, r.height - textMax - y, values,opts);
                
                r.g.axis(x + barhgutter/2 , r.height - textMax - barvgutter , r.height - textMax - y - 2*barvgutter , 0 , max , 10 , 1 );
                r.g.axis(x + barhgutter/2 , r.height - textMax - barvgutter , r.width - x - barhgutter, 0 , 1 , labels.length , 2 ).text.remove();
                tag.createLengendary();
                break;
        }
        if(tag.getAttribute('data-chartType').getValue() === 'Bar Chart' || tag.getAttribute('data-chartType').getValue() === 'Line Chart'){
            try{
                var pos = {
                    x : tag.getWidth()/2,
                    y : tag.getHeight()/2
                }
                switch(tag.getAttribute('data-chartType').getValue()){
                    case 'Line Chart':
                        pos = {
                            x : parseInt(tag.chart.symbols[0][2].attr('cx')),
                            y : parseInt(tag.chart.symbols[0][2].attr('cy'))
                        };
                        break;
                    case 'Bar Chart':
                        pos = {
                            x : parseInt(tag.chart.bars[0][2].x),
                            y : parseInt(tag.chart.bars[0][2].y)
                        };
                        break;
                }
                var dirs = ['South','West','North','East'];
                tag.tooltip = r.g[tag.getAttribute('data-tooltipType').getValue()](pos.x,tag.getAttribute('data-tooltipType').getValue() === 'label'?pos.y - 15 :pos.y,tag.getAttribute('data-tooltipType').getValue() === "popup"?dirs[parseInt(tag.getAttribute('data-tooltipAngle').getValue())%360]:parseInt(tag.getAttribute('data-tooltipAngle').getValue() + "°"),parseInt(tag.getAttribute('data-tooltipAngle').getValue())-360).attr([{fill: 'green' , stroke : '#000'}, {fill: '#000'}]);
            }
            catch(e){

            }
        }
    }
});              

