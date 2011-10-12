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
* along with Wakanda. If not see : <http://www.gnu.org/licenses/>
*/
WAF.addWidget({
    type        : 'yahooWeather',
    lib         : 'WAF',
    description : 'YAHOO! Weather',
    category    : 'Experimental',
    img         : '/walib/WAF/widget/yahooWeather/icons/widget-yahooWeather.png',
    include     : [],
    tag         : 'div',
    attributes  : [
    {
        name         : 'data-binding',
        defaultValue : '',
        description  : 'Source'
    },
    {
        name         : 'data-label',
        description  : 'Label',
        defaultValue : ''
    },
    {
        name         : 'data-label-position',
        description  : 'Label position',
        defaultValue : 'left'
    }],
    style: [
    {
        name         : 'width',
        defaultValue : '264px'
    },
    {
        name         : 'height',
        defaultValue : '209px'
    }],
    events: [
    {
        name       : 'click',
        description: 'On Click',
        category   : 'Mouse Events'
    },
    {
        name       : 'dblclick',
        description: 'On Double Click',
        category   : 'Mouse Events'
    },
    {
        name       : 'mousedown',
        description: 'On Mouse Down',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseout',
        description: 'On Mouse Out',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseover',
        description: 'On Mouse Over',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseup',
        description: 'On Mouse Up',
        category   : 'Mouse Events'
    }],
    properties : {
        style: {
            theme       : {
                'roundy'    : false
            },
            fClass      : true,
            text        : false,
            background  : true,
            border      : true,
            sizePosition: true,
            label       : true,
            disabled    : ['border-radius']
        }
    },
    onInit: function(config) {
        var widget = new WAF.widget.YahooWeather(config);
        $('#' + config['id']).addClass('waf-widget waf-yahooWeather').children('div').addClass('waf-container');
        return widget;
    },
    onDesign: function(config, designer, tag, catalog, isResize) {
        var className;
        
        className = tag.getTheme();
        if (tag.getAttribute('class')) {
            className += ' ' + tag.getAttribute('class').getValue().replace(',', ' ')
        }
        
        $('#' + tag.getAttribute('id').getValue())
        .append(
            $('<img />')
            .attr({
                src: '../walib/WAF/widget/yahooWeather/png/preview.png',
                width: 264,
                height: 253
            })
            .css({
                position: 'absolute',
                top: '-45px'
            })
            )
        .addClass(className);
    }
});
