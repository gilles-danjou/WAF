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
    'Label',   
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
        forAttr,
        minWidth;

        htmlObject  = $(this.containerNode);
        
        minWidth    = parseInt(htmlObject.css('min-width'));
        
        /*
         * Remove label if for is unvalid
         */
        forAttr     = htmlObject.attr('for');
        if (forAttr) {
            if ($('#' + htmlObject.attr('for')).length === 0) {
                htmlObject.remove();
            }
        } else {
            htmlObject.remove();
        }
        
        if (minWidth == 0) {
            htmlObject.css('width', 'auto');
        }
    }, {
        
    }
);
    