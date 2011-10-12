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

WAF.Widget.provide(

    /**
     * WAF Menu widget
     *
     * @class WAF.widget.Menu
     * @extends WAF.Widget
     */
    'MenuBar',
    
    
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
     * @default WAF.widget.GoogleMap
     **/
    function (inConfig, inData, shared) {
        var 
        i,
        classes,
        theme,
        parentClasses,
        isSubmenu,
        themes,
        htmlObject,
        htmlObjectItems;            
            
        htmlObject          = $(this.containerNode);      
        htmlObjectItems     = htmlObject.children('.waf-menuItem');      
        classes             = htmlObject.attr('class');
        isSubmenu           = htmlObject.parents('.waf-menuItem, .waf-menuBar').length > 0 ? true : false;
        parentClasses       = isSubmenu ? htmlObject.parents('.waf-menuBar').attr('class') : '';
        
        htmlObject.addClass('waf-menuBar-' + inData.display);
        
        // Setting the theme
        if (inData.theme) {
           htmlObject.addClass(inData.theme);
        }
        
        themes = [];
        
        for (i in WAF.widget.themes) {
            theme = WAF.widget.themes[i].key;
            if (classes.match(theme)) {                
               if (isSubmenu) {
                   htmlObject.removeClass(theme);
                   htmlObjectItems.removeClass(theme);
               }
            }
            
            if (parentClasses.match(theme)) {   
                themes.push(theme);
            }
        }
                      
        if (isSubmenu) {
            htmlObject.addClass(themes.join(' '));
            htmlObjectItems.addClass(themes.join(' '));
        }
    },
    {
        // [Prototype]
        // The public shared properties and methods inherited by all the instances
        // NOTE: "this" is available in this context
        // These methods and properties are available from the constructor through "this" 

    }

);
