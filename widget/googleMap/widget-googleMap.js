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
* @author       The Wakanda Team
* @date			august 2010
* @version		0.1
*
*/

/**
* WAF Template widget
*
* @namespace WAF.widget
* @class Template
* @param {object} config configuration of the widget
*/
WAF.widget.GoogleMap = function(config) {
    var widget = {};

    config = config || {};

    // {String} id id of the widget
    config['id'] = config['id'] || {};

    // {String} data-type type of the widget
    config['data-mapType'] = config['data-mapType'] || "hybrid";

    // TODO Give all the attributes of the widget

    // TODO
    // Source code of the widget

    // get the widget-dom
    var theDOMWidget = document.getElementById(config.id);

    // Build the drawing function
    var drawTheMap = function DrawTheMap(inPosition, inZoom, inDOMWidget) {
        
        // base url of static google map
        var map = "http://maps.google.com/maps/api/staticmap?sensor=false";

        // fix the position on wich is centered the map
        map += "&center=" + inPosition;

        // fix a zoom value
        map += "&zoom=" + inZoom;
		
        // Map type :
        map += "&maptype=" + $("#"+widget.divID).attr("data-mapType");

        // fix the size of the image
        map += "&size=" + $(inDOMWidget).css('width').replace('px','') + "x" + $(inDOMWidget).css('height').replace('px','');

        // add a marker on the map
        map += "&markers=color:red|label:P|" + inPosition;
        inDOMWidget.src = map;
    }

    // Draw the map when no value or datasource is avilable
    drawTheMap('0', config['data-zoom'], theDOMWidget);

    // Creae the widget and make it auto-update when the source is modified
    var theGMWidget = WAF.AF.createWidget(config['id'], config['data-binding'] ? config['data-binding'] : '', config);

    if (theGMWidget != null && theGMWidget.source != null) {
        theGMWidget.source.addListener("attributeChange", function(event)
        {
            var widget = event.data.widget;
            if (widget != null) {
                drawTheMap(event.dataSource.getAttribute(widget.att.name).getValue(), $("#"+widget.divID).attr("data-zoom"), event.data.domNode);
            }
        } , {
            attributeName: theGMWidget.att.name
        }, {
            widget:theGMWidget, 
            domNode:theDOMWidget
        });       
    }


    // add in WAF.widgets
    widget.kind = config['data-type'];
    widget.id = config['id'];
    widget.divID = config['id'];
    widget.renderId = config['id'];
    widget.ref = document.getElementById(config['id']);

    WAF.widgets[config['id']] = widget;

    return widget;
}