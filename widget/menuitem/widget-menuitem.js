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
    'MenuItem',
    
    
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
            htmlObject,
            height,            
            width,
            paragraphe,
            padding,
            fnShow,
            fnHide,
            subMenuShow,
            parentSubMenuShow,
            parentBars,
            except,
            exceptItem;                     
        
        htmlObject          = $(this.containerNode); 
        
        parentBars          = htmlObject.parents('.waf-menuBar');
        height              = htmlObject.outerHeight();
        width               = htmlObject.outerWidth();
        paragraphe          = htmlObject.children('p');
        padding             = parseInt(htmlObject.css('padding-left'));
        
        width               = (parseInt(width) - (padding*2));
        height              = (parseInt(height) - (padding*2));
        subMenuShow         = $(parentBars[parentBars.length - 1]).attr('data-subMenuShow');
        
        
        if (inData.theme) {
           htmlObject.addClass(inData.theme);
        }        
        paragraphe.css({
            height  : height + 'px',
            width   : width + 'px'
        })
        
        htmlObject.html(htmlObject.html().replace(/\n/g, '<br/>'));
                
        // Setting the theme
        if (inData.theme) {
           htmlObject.addClass(inData.theme);
        }
        
        /**
         * Display a submenu
         */
        fnShow = function fnShow (e) {
            var 
                that,
                ul;
                
            that    = $(this);
            ul      = that.children('ul');
            
            
            if (e.type === 'click') {          
                
                except      = '';
                exceptItem  = '';
                
                $('.waf-menuItem .waf-menuBar').each(function(){
                    var thisBarId = $(this).attr('id');
                    
                    parentBars.each(function() {
                        var thatElt = $(this);
                        if (thatElt.attr('id') === thisBarId) {
                            except += '[id!=' + thisBarId + ']';
                            exceptItem += '[id!=' + thatElt.parent().attr('id') + ']';
                        }
                    })
                });
                
                $('.waf-menuItem .waf-menuBar' + except + '').fadeOut(200);
                $('.waf-menuItem' + exceptItem + '').removeClass('waf-state-active');
                that.addClass('waf-state-active');
                
                
        
            } else {
                that.addClass('waf-state-hover');
            }
                        
            $('#' + that.attr('id') + '>ul>li>p').css('width', that.outerWidth() + 'px')
            
            ul.stop(true, true).fadeIn(100);
        }
        
        /**
         * Hide a submenu
         */
        fnHide = function fnHide (e) {
            var 
                that,
                ul;
                
            that    = $(this);
            ul      = that.children('ul');
            ul.stop(true, true).fadeOut(200);
            
            if (e.type !== 'click') {    
                that.removeClass('waf-state-hover');
            }
        }
        
        switch (subMenuShow) {
            case 'click' :
                htmlObject.click(fnShow);
                
                // Add hover class on hover                
                htmlObject.hover(function(e){$(this).addClass('waf-state-hover')}, function(e){$(this).removeClass('waf-state-hover')});                   
                break;
                
            default :
                htmlObject.mouseenter(fnShow);
                htmlObject.mouseleave(fnHide);
                break;
        }
        
        htmlObject.bind('click', function(e) {e.stopPropagation();});
    },
    
    {
        // [Prototype]
        // The public shared properties and methods inherited by all the instances
        // NOTE: "this" is available in this context
        // These methods and properties are available from the constructor through "this" 

    }

);
