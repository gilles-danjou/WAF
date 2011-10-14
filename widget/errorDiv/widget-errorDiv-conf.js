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
    type        : 'errorDiv',
    lib         : 'WAF',
    description : 'Display Error',
    category    : 'Controls',
    img         : '/walib/WAF/widget/errorDiv/icons/widget-errorDiv.png',
    tag         : 'div',
    attributes  : [
    {
        name       : 'class',
        description: 'Css class'
    }],
    style: [
    {
        name        : 'width',
        defaultValue: '150px'
    },
    {
        name        : 'height',
        defaultValue: '20px'
    }],
    events: [],
    properties: {
        style: {
            theme       : false,
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            label       : false,
            shadow      : true,
            disabled    : []
        }
    },
    onInit: function (config) {
        var errorDiv = new WAF.widget.ErrorDiv(config);
        return errorDiv;
    },
    onDesign: function (config, designer, tag, catalog, isResize) {
    }
});
