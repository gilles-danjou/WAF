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
WAF.Widget.provide(

    /**
     *      
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    'Slider',   
    {   
    },
    /**
     * @constructor
     * @param {Object} inConfig configuration of the widget
     */

    /**
     * The constructor of the widget
     *
     * @shared
     * @property constructor
     * @type Function
     **/
    function WAFWidget(config, data, shared) {   
        var
        that,
        sliderConfig,
        htmlObject;

        that            = this;
        htmlObject      = $(this.containerNode);    
        sliderConfig    = {};
        
        $.extend(sliderConfig, {
            min         : parseInt(data['minValue'])    || 0,
            max         : parseInt(data['maxValue'])    || 0,
            step        : parseInt(data['step'])        || 1,
            range       : data['range']                 || false,
            orientation : data['orientation']
        });        
        
        /*
         * If widget is binded
         */
        if (this.sourceAtt) { 
            var
            sliderConfig;

            /*
             * Extend slider config to set slide and start functions
             */
            $.extend(sliderConfig, {
                slide: function(e, ui) {
                    var
                    widget,
                    value,
                    sourceAtt;

                    widget      = WAF.widgets[this.id];
                    value       = ui.value;
                    sourceAtt   = widget.source.getAttribute(widget.att.name);

                    sourceAtt.setValue(value, {
                        dispatcherID    :   widget.id
                    });
                },
                start : function (e, ui) {
                    var
                    dsPos,
                    widget;

                    dsPos = $(this).parent().attr('data-dspos');
                    if (dsPos) {
                        widget = WAF.widgets[this.id];
                        widget.source.select(parseInt(dsPos));
                    }
                }
            });
                
            this.sourceAtt.addListener(function(e) {
                var 
                widget,
                isParentMatrix,
                htmlObject,
                widgetID;
                
                widget          = e.data.widget;       
                widgetID        = widget.id;
                htmlObject      = $('#' + widgetID);
                isParentMatrix  = htmlObject.parents('.waf-matrix');
                
                /*
                 * Set value depending on datasource value
                 */                
                if (isParentMatrix.length == 0 || (e.subID && isParentMatrix.length != 0)) {
                    
                    sliderConfig.value = widget.sourceAtt.getValue();                    
        
                    /*
                     * Create jquery ui slider
                     */
                    htmlObject.slider(sliderConfig);
                }
                
            },{
                listenerID      : config.id,
                listenerType    : 'slider',
                subID           : config.subID ? config.subID : null
            }, {
                widget:this,
                sliderConfig    : sliderConfig
            });
        } else {        
            /*
             * Create jquery ui slider
             */
            htmlObject.slider(sliderConfig)
        }        
    },{
        
    }
);