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
    type        : 'googleMap',
    lib         : 'WAF',
    description : 'Google Map',
    category    : 'Experimental',
    img         : '/walib/WAF/widget/googleMap/icons/widget-googleMap.png',
    tag         : 'img',
    attributes  : [
    {
        name         : 'data-binding',
        defaultValue : '',
        description  : 'Source'
    },
    {
        name         : 'data-mapType',
        defaultValue : 'hybrid',
        description  : 'Type'
    },
    {
        name         : 'data-zoom',
        defaultValue : '10',
        description  : 'Zoom'
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
    }
    ],
    style: [
    {
        name         : 'width',
        defaultValue : '338px'
    },
    {
        name         : 'height',
        defaultValue : '200px'
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
            theme       : false,
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
        var widget = new WAF.widget.GoogleMap(config);
        return widget;
    },
    onDesign: function(config, designer, tag, catalog, isResize) {
        document.getElementById(tag.getAttribute('id').getValue()).src = "../walib/WAF/widget/googleMap/images/googleMap.jpg";
    }    
});
