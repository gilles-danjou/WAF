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
/*
 * AUTOFORM USING WIDGET'S PROVIDE
 */
WAF.Widget.provide(
    'QueryForm',    
    {
    },
    function WAFWidget(config, data, shared) {
        var
        source,
        nameList,
        attrList,
        errorDiv,
        mustDisplayError,
        divID,
        options,
        htmlObject;
        
        htmlObject          = $(this.containerNode);
        source              = WAF.source[config['data-binding']];
        nameList            = [];
        attrList            = [];
        errorDiv            = config['data-error-div'];
        mustDisplayError    = config['data-display-error'];
        divID               = config['id'];
        options             = {};

        if (mustDisplayError == null) {
            mustDisplayError = true;
        } else {
            mustDisplayError = (mustDisplayError == '1' || mustDisplayError == 'true');
        }
        
        options.mustDisplayError = mustDisplayError;
        options.errorDiv = errorDiv;

        if (source != null) {
            /*
             * Getting the names list
             */
            if(data['column-name']) {
                nameList = data['column-name'].split(',')
            }

            /*
             * Getting the attributes list
             */
            if(data['column-attribute']) {
                attrList = data['column-attribute'].split(',')
            }

            if (data['columns'] != null && data['columns'] != '' && !data['column-name'] ) {
                attrList = data['columns'].split(',');
                nameList = data['columns'].split(',');
            }
            
            /*
             * Call queryform build method
             */
            WAF.AF.buildQueryForm(divID, source, attrList, nameList, options );                          
            
            /*
             * DEPRECATED AFTER REFACTORING
             */
            WAF.widgets[this.id] = this;
        /*
         * Display a message to indicate that the widget is not binded
         */
        } else {
            
            htmlObject.addClass('waf-autoForm')
            $('<div class="waf-autoForm-missingBinding" style="top:20px;">Datasource is either missing <br>or <br>invalid</div>').appendTo(htmlObject);
        }
        
        if (data.draggable == 'true') {
            htmlObject.find('.waf-widget-header,.waf-widget-footer').css('cursor', 'pointer');
        }
    }, {       
        /*
         * Resize method called during resize
         * @method onResize
         */
        onResize : function queryform_resize() {  
            var
            width,
            height,
            newHeight,
            htmlObject;
            
            /*
             * Resize autoform body
             */
            htmlObject  = $(this.containerNode);
            width       = htmlObject.width();
            height      = htmlObject.height();            
            newHeight   = height - parseInt(htmlObject.find('.waf-widget-footer').css('height'));
            newHeight  -= parseInt(htmlObject.find('.waf-widget-header').css('height'));
            
            htmlObject.find('.waf-widget-body').css('width', width);
            
            htmlObject.find('.waf-widget-body').css('height',  newHeight + 'px');        
        },
        
        /*
         * Resize method called on stop resize
         * @method onResize
         */
        stopResize : function queryform_stop_resize() {   
        }   
        
    }
);