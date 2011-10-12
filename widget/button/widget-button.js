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
    'Button',   
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
        text,
        that,
        toinnerHTML,
        htmlObject,
        nb,
        thisI;

        that        = this;
        htmlObject  = $(this.containerNode);
        text        = data.text ? data.text : data.action;
        nb          = 0;

        if (data['state-1'] && !data.text) {
            text = "";
        }
        
        /*
         * Add button text
         */
        toinnerHTML = '<span class="text">' + text  + '</span>';
        
        /*
         * Add 4 states
         */
        for (var i = 1; i <= 4; i +=1) {
            if (data['state-' + i]) {
                toinnerHTML += '<img style="width:' + htmlObject.width() + 'px;height:' + htmlObject.height() + 'px;" src="' + data['state-' + i] + '" class="data-state-' + i +'" />';
                nb += 1;
            }
        }
        
        if (nb === 1) {
            toinnerHTML = '<img style="width:' + htmlObject.width() + 'px;height:' + htmlObject.height() + 'px;" src="' +  data['state-' + i]  + '" class="data-state-1 data-state-2 data-state-3 data-state-4" />';
        }     
        
        htmlObject.html(toinnerHTML);               

        /*
         * Fix button text position
         */
        htmlObject.children('.text').css('margin-top', '-' + parseInt(htmlObject.css('font-size'))/2 + 'px');

        
        /*
         * ------------ <MOUSE EVENTS> ------------
         * To change status
         */
        htmlObject.hover(
            function () {
                $(this).addClass("waf-state-hover");
            },
            function () {
                $(this).removeClass("waf-state-hover waf-state-active");
            }
        );
            
        htmlObject.bind('mousedown', {}, function(e) {
            $(this).removeClass("waf-state-hover");
            $(this).addClass("waf-state-active");
            
            htmlObject._state = 'active';
        });

        htmlObject.bind('mouseup', {}, function(e) {
            $(this).addClass("waf-state-hover");
            $(this).removeClass("waf-state-active");
            
            htmlObject._state = null;
        });

        htmlObject.focusin(function() {            
            if (htmlObject._state != 'active') {
                $(this).addClass("waf-state-focus");	
            }
        });

        htmlObject.focusout(function() {
            $(this).removeClass("waf-state-focus");
        });        
        /*
         * ------------ </MOUSE EVENTS> ------------
         */

        /*
         * BUTTON NAVIGATION
         */
        if (data['link']) {
            htmlObject.bind('click', {}, function(e) {
                switch(data['target']) {
                    case '_blank':
                        window.open(data['link']);
                        break;
                    
                    default :
                        window.location = data['link'];
                        break;
                }
            });
        }        
        
        /*
         * Add actions on data source if button is binded
         */
        if (this.source) {  
            htmlObject.bind('click', {}, function(e){
                switch (data['action']) {
                    case 'create' :
                        that.source.addNewElement();
                        break;
                        
                    case 'save' :
                        that.source.save();
                        break;
                        
                    case 'next' :
                        that.source.selectNext();
                        break;
                        
                    case 'previous' :
                        that.source.selectPrevious();
                        break;
                        
                    case 'last' :
                        var length = that.source._private.entityCollection.length;
                        that.source.select( parseInt(length-1) );
                        break;
                        
                    case 'first' :
                        that.source.select(0);
                        break;
                        
                    default:
                        break;
                }
            })
        }
    },{
        
    }
);