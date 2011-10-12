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
WAF.Widget.provide(

    /**
     *      
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    'RichText',   
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
        htmlObject,
        text;

        config      = config || {};
        htmlObject  = $(this.containerNode);
        
        /*
         * For binded richtext
         */
        if (this.sourceAtt) {
            this.sourceAtt.addListener(function(e) {          
                if (data.link) {
                    htmlObject.html('<a href="' + data.link + '" target="' + data.target + '">' + e.data.widget.getFormattedValue() + '</a>');
                } else {
                    htmlObject.html(e.data.widget.getFormattedValue());
                }
            }, {
                listenerID      : config.id,
                listenerType    : 'staticText',
                subID           : config.subID ? config.subID : null
            }, {
                widget:this
            });
        } else {
            text = this.getFormattedValue(htmlObject.html());            
            htmlObject.html(text);
        }
        
        text = htmlObject.html().replace(/\n/g, '<br/>');
        
        /*
         * Add link if exists
         */
        if (data.link) {
            htmlObject.html('<a href="' + data.link + '" target="' + data.target + '">' + text + '</a>');
        } else {
            htmlObject.html(text);
        }     
        
        switch (data.overflow) {     
            case 'Horizontal' :
                htmlObject.css({
                    'overflow-x' : 'auto',
                    'overflow-y' : 'hidden'
                });
                break;
                
            case 'Vertical' :
                htmlObject.css({
                    'overflow-x' : 'hidden',
                    'overflow-y' : 'auto'
                });
                break;
                
            case 'Both' :
                htmlObject.css({
                    'overflow-x' : 'auto',
                    'overflow-y' : 'auto'
                });
                break;
                
            case 'Hidden' :
            default :
                break;
        }
        
        /*
         * Remove useless attribute
         */
        htmlObject.removeAttr('data-link');
        
        if (data.autoWidth == 'true') {
            htmlObject.css('width', 'auto');
        }
    },{
        
    }
);

