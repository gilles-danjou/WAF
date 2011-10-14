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
/**
 * @author
 * @date			january 2010
 * @version			0.1
 *
 */

/**
 * WAF Slider widget
 *
 * @namespace WAF.widget
 * @class Slider
 * @param {object} config configuration of the widget
 */
WAF.widget.Slider = function (config) {
    var slider = {},
    widget = {},
    sliderConfig = {},
    tmp = [],
    borderWidth = 0;

    config = config || {};

    // {String} data-type data-type of the widget
    config['data-type'] = config['data-type'] || '';

    // {String} class class of the widget
    config['class'] = config['class'] || '';

    // {String} data-binding binding of the widget
    config['data-binding'] = config['data-binding'] || '';

    // {String} data-errorDiv errorDiv of the widget
    config['data-errorDiv'] = config['data-errorDiv'] || '';

    // {String} data-minValue minValue of the widget
    config['data-minValue'] = config['data-minValue'] || '';

    // {String} data-maxValue maxValue of the widget
    config['data-maxValue'] = config['data-maxValue'] || '';
    
    // {String} data-step step of the slider
    config['data-step'] = config['data-step'] || '1';

    // {String} data-label label of the widget
    config['data-label'] = config['data-label'] || '';

    slider = document.getElementById(config.id);

    this.sliderEventHandler = function(event)
    {
        var widget = event.data.widget;
        //console.log(event.dataSource.getPosition())
        $('#' + widget.divID + ' .ui-slider-range').css('width', '0%')
        $('#' + widget.divID).slider("value", widget.sourceAtt.getValue());
    }

    this.createSlider = function(divID, binding, params){
        //console.log(binding)
        var result = WAF.AF.createWidget(divID, binding, params);

        if (result != null)
        {
            sliderConfig = {
                slide: function(e, ui) {
                    var widget = WAF.widgets[this.id],
                    value = ui.value;

                    var sourceAtt = widget.source.getAttribute(widget.att.name);

                    sourceAtt.setValue(value, {
                        dispatcherID    :   widget.divID
                    });
                },
                start : function (e, ui) {
                    var dsPos = $(this).parent().attr('data-dspos');
                    if (dsPos) {
                        var widget = WAF.widgets[this.id];
                        widget.source.select(parseInt(dsPos));
                    }
                }
            };

            var listenerConfig = {
                listenerID  :divID,
                listenerType:'slider',
                subID       : params.subID ? params.subID : null
            };

            result.sourceAtt.addListener(this.sliderEventHandler, listenerConfig, {
                widget:result,
                divID : divID
            });

        } else {// Display a slider where binding is undefined
            result = {};
        }
        
        $.extend(sliderConfig, {
            min: new Number(config['data-minValue']).valueOf() || 0,
            max: new Number(config['data-maxValue']).valueOf() || 100,
            step: new Number(config['data-step']).valueOf() || 1,
            range: config['data-range'] || false,
            //range: true,
            orientation: config['data-orientation']
        //values: [30, 60]
        });

        // WARNING !!!
        // addClass first, *then* create the slider.
        // If reverse order, slider's sub-elements dimensions are computed against the default jQuery-ui sliders' styles
        $('#' + config.id)
        .slider(sliderConfig)
        .addTouch(); /* add special mobile behavior */

        //**********
        // Remove the background image if has been setting
        if ($("#" + config.id).css('background-color') ) {
            $("#" + config.id).css('background-color', $("#" + config.id).css('background-color'));
        }

        if (config['data-handler-background-color']) {
            $("#" + config.id + ' a').css('background-color', config['data-handler-background-color']);
        }
        if ($("#" + config.id).css('border-color')) {
            $("#" + config.id + ' a').css('border-color', $("#" + config.id).css('border-color'));
        }

        if ($("#" + config.id).css('border')) {
            var tmp = String($("#" + config.id).css('border')).split('px');
            borderWidth = parseInt(tmp[0]);
        } else if ($("#" + config.id).css('border-width')) {
            borderWidth = parseInt($("#" + config.id).css('border-width'));
            $("#" + config.id + ' a').css('border-width', $("#" + config.id).css('border-width'));
        }


        if ($("#" + config.id).css('border-style')) {
            $("#" + config.id + ' a').css('border-style', $("#" + config.id).css('border-style'));
        }

        if ($("#" + config.id).css('border')) {
            $("#" + config.id + ' a').css('border', $("#" + config.id).css('border'));
        }

        if (config['data-range-background-color']) {
            $("#" + config.id + ' .ui-widget-header').css('background-color', config['data-range-background-color']);
        }


        return result;
    }

    slider = this.createSlider(config['id'], config['data-binding'] ? config['data-binding'] : '', config);

    // add in guiObject
    widget = slider;

    widget.kind     = 'slider';
    widget.id       = config['id'];
    widget.divID    = config['id'];
    widget.renderId = config['id'];
    widget.ref      = slider;
    widget.minValue = config['data-minValue'];
    widget.maxValue = config['data-maxValue'];
    widget.config   = config;
    

    WAF.widgets[config['id']] = widget;

    widget.setValue = function(val) {
        $('#' + this.id).slider("value", val);
    }

    return widget;
};