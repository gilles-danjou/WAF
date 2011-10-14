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
WAF.Widget.provide(

    /**
     *      
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    'Checkbox',   
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
        i,
        checkboxHtml,
        readOnly,
        icon,
        theme,
        themes,
        definedTheme,
        classes,
        htmlObject,
        imgHtml,
        icons,
        cssClass;

        config      = config || {};

        htmlObject  = $(this.containerNode);
        classes     = htmlObject.attr('class');
        themes      = [];
        
        /*
         * Get widget theme
         */
        for (i in WAF.widget.themes) {
            theme = WAF.widget.themes[i].key;
            if (classes.match(theme)) {
                themes.push(theme);
                
                if (theme != 'inherited') {
                    definedTheme = theme;
                }
            }
        }    
        
        htmlObject.children().remove()
        
        $('<div class="waf-checkbox-box">').appendTo(htmlObject);
        
        
        icons   = [];
        
        if (data['icon-default'])    icons.push({cssClass : 'waf-checkbox-icon-default',  value : data['icon-default']});
        if (data['icon-hover'])      icons.push({cssClass : 'waf-checkbox-icon-hover',    value : data['icon-hover']});
        if (data['icon-active'])     icons.push({cssClass : 'waf-checkbox-icon-active',   value : data['icon-active']});
        if (data['icon-selected'])   icons.push({cssClass : 'waf-checkbox-icon-selected', value : data['icon-selected']});

        cssClass    = 'waf-icon waf-checkbox-icon';
        
        if (icons.length == 0) {
            cssClass += ' waf-icon-svg';
        } else {
            cssClass += ' waf-icon-image';
        }

        icon    = $('<div class="' + cssClass + '">');
        
        /*
         * Img icon
         */
        if (icons.length > 0) {         
            for (i = 0; i < icons.length; i += 1) {   
                imgHtml = $('<img>');

                imgHtml.addClass(icons[i].cssClass);
                
                imgHtml.attr({
                    src : icons[i].value
                });

                imgHtml.appendTo(icon);
            }
        /*
         * Svg icon
         */
        } else {
            icon.svg({
                loadURL: '/walib/WAF/widget/checkbox/skin/' + definedTheme + '/svg/widget-checkbox-skin-' + definedTheme + '.svg',
                onLoad: function(svg) {
                    svg.configure({
                        width: '100%',
                        height: '100%',
                        preserveAspectRatio: 'none'
                    });
                }
            });
        }
            
        icon.appendTo(htmlObject);

        checkboxHtml = $('<input>').attr('type', 'checkbox');

        checkboxHtml.appendTo(htmlObject);
        
        /*
         * Check the box if checked is true
         */
        if(data.checked === 'true' || data.checked === true) {
            checkboxHtml.attr('checked', 'checked');        
            htmlObject.addClass('waf-state-selected');
        } else {
            checkboxHtml.removeAttr('checked');
        }
        
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
            if (checkboxHtml.attr('checked')) {    
                htmlObject.removeClass('waf-state-selected');
            }
        
            $(this).addClass("waf-state-active");
        });

        htmlObject.bind('mouseup', {}, function(e) {
            $(this).removeClass("waf-state-active");
        
            if (checkboxHtml.attr('checked')) {    
                htmlObject.removeClass('waf-state-selected');
            } else {
                htmlObject.addClass('waf-state-selected');
            }
        });

        htmlObject.focusin(function() {
            $(this).addClass("waf-state-focus");
        });

        htmlObject.focusout(function() {
            $(this).removeClass("waf-state-focus");
        });
        
        /*
         * ------------ </MOUSE EVENTS> ------------
         */
        
        /*
         * Data sources binded
         */
        if (this.sourceAtt) {    
            checkboxHtml.unbind('click');
            
            readOnly    = this.att.readOnly;

            checkboxHtml.bind('click', {}, function() {
                var 
                widget,
                sourceAtt,
                value;
                
                widget      = WAF.widgets[config.id];
                sourceAtt   = widget.source.getAttribute(widget.att.name);
                value       = '';
                
                if(checkboxHtml.is(':checked')) {
                    value = sourceAtt.normalize('true');
                } else {
                    value = sourceAtt.normalize('false');
                }

                sourceAtt.setValue(value, {
                    dispatcherID: config.id
                });

                widget.clearErrorMessage();
            })


            if (readOnly) {
                htmlObject.disabled = true;
            } else {
                htmlObject.disabled = false;
            }
            /*
             * Save value if binding "in" is defined
             */
            this.sourceAtt.addListener(function(e) {
                var 
                widget,
                widgetID,
                htmlObject,
                checkboxHtml,
                value;
                    
                widget          = e.data.widget;
                widgetID        = widget.id;
                htmlObject      = $('#' + widgetID);
                checkboxHtml    = htmlObject.find('input');
                
                widget.clearErrorMessage();                    
                    
                if (checkboxHtml.length > 0) {
                    value = widget.sourceAtt.getValue();      

                    if (!value || value === 'false') {
                        checkboxHtml[0].checked = false;
                        checkboxHtml.removeAttr('checked', 'checked');        
                        htmlObject.removeClass('waf-state-selected');
                    } else {
                        checkboxHtml[0].checked = true;
                        checkboxHtml.attr('checked', 'checked');    
                        htmlObject.addClass('waf-state-selected');
                    }
                }
            }, {
                listenerID      : config.id,
                listenerType    : 'checkBox',
                subID           : config.subID ? config.subID : null
            },{
                widget  : this
            });
        }
    }, {
        
    }
);