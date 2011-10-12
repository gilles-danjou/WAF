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
//// "use strict";

/*global WAF,window*/

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */

WAF.widget.Toolbar = function(elements) {

    var toolbarNode = $('<ul class="waf-toolbar"></ul>');
    
    $(elements).each(function(i, element) {
        var elementNode = $('<li class="waf-toolbar-element ' + [].concat(element.className).join(' ') + '" title="' + element.title + '"></li>');
        
        if (element.icon) {
            var icon = new WAF.widget.Icon(element.icon);
            elementNode.append(icon.containerNode);
        }
        
        if (element.text) {
            elementNode.append(element.text);
        }
        
        if (element.click) {
            elementNode.click(element.click);
        }
        
        toolbarNode.append(elementNode);
    });
    
    return toolbarNode;
};
