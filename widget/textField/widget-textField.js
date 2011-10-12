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
    'TextField',   
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
        that,
        htmlObject;

        that        = this;
        htmlObject  = $(this.containerNode);    
        
        /*
         * To prevent browser input autofill
         */
        htmlObject.attr("name", that.id + parseInt(Math.random()*100));
        
        /*
         * Transform somes value into boolean
         */
        data['datapicker-on']          = WAF.utils.getBoolValue(data['datapicker-on']);
        data['datapicker-icon-only']   = WAF.utils.getBoolValue(data['datapicker-icon-only']);
        data['password']               = WAF.utils.getBoolValue(data['password']);

        /*
         * ------------ <MOUSE EVENTS> ------------
         * To change status
         */
        htmlObject.hover(
            function () {
                $(this).addClass("waf-state-hover");
            },
            function () {
                $(this).removeClass("waf-state-hover");
            }
        );

        htmlObject.unbind('focusin');
        htmlObject.unbind('focusout');
    
        htmlObject.bind('focusin', {}, function(e) {
            $(this).addClass("waf-state-focus");
        });
    
        htmlObject.bind('focusout', {}, function(e) {
            $(this).removeClass("waf-state-focus");
        });   
        /*
         * ------------ </MOUSE EVENTS> ------------
         */        
        
        /*
         * Set input as password field if defined
         */
        if (data.password) {
            document.getElementById(config.id).setAttribute('type', 'password');
        }   
        
        /*
         * If widget is binded
         */
        if (this.sourceAtt) {
            this.sourceAtt.addListener(function(e) {          
                var
                text,
                widget,
                widgetID,
                items,
                enumValueList,
                mustAutoComplete,
                dateOptions,
                autoCompleteWidget,
                dateIcon,
                htmlObject,
                isParentMatrix,
                dateIconLeft;
                
                widget          = e.data.widget;
                widgetID        = widget.id;
                enumValueList   = [];                
                htmlObject      = $('#' + widgetID)
                
                widget.clearErrorMessage();     
    
                /*
                 * Set the value
                 */
                if (!widget.att.simple) {
                    text = "";
                } else {
                    if (widget.isInFocus) {
                        text = widget.sourceAtt.getValue(); 
                    } else {
                        text = widget.getFormattedValue();
                    }
		}
                
                htmlObject.val(text);
                isParentMatrix = htmlObject.parents('.waf-matrix');
                
		if (widget.att.enumeration != null && !widget.att.readOnly && !widget.sourceAtt.readOnly) {
                    items = widget.att.enumeration.item;
                    
                    for (var i = 0, nb = items.length; i < nb; i++) {
                            enumValueList.push(items[i].name);
                    }
		}
		
                mustAutoComplete = false;
                
		if (widget.att.autoComplete) {
                    mustAutoComplete = true;
		}
                
                if (data.autocomplete != null && !data.autocomplete){
                    mustAutoComplete = false;
                }
                
		
                if (enumValueList.length > 0) {
                    if (isParentMatrix.length == 0 || (e.subID && isParentMatrix.length != 0)) {
                        htmlObject
                            .data('enumValueList', enumValueList)
                            .autocomplete({
                                source: function(request, response) {
                                    response($.grep($(this.element.context).data('enumValueList'), function(item, index) {
                                        return item.toLowerCase().indexOf(request.term.toLowerCase()) === 0;
                                    }));
                                }
                            });                        

                        autoCompleteWidget = htmlObject.autocomplete('widget');
                        
                        if (isParentMatrix.length == 0) {
                            htmlObject.blur(that.autocompleteBlur);
                        }
                    }
                    
                } else if (mustAutoComplete) {  
                    if (isParentMatrix.length == 0 || (e.subID && isParentMatrix.length != 0)) {
                        htmlObject.autocomplete({
                            source: function(request, response) {
                                $.ajax({
                                    url: '/rest/' + widget.source.getDataClass().getName() + '/' + widget.att.name + '?$distinct=true&$top=20',
                                    data: {
                                        '$filter': '"' + widget.att.name + '=\'' + request.term + '@\'"'
                                    },
                                    success: function(data) {
                                        response($.map(data, function(item) {
                                            return {
                                                value: item
                                            }
                                        }));
                                    }
                                });
                            }
                        });

                        autoCompleteWidget = htmlObject.autocomplete('widget'); 
                        
                        if (isParentMatrix.length == 0) {
                            htmlObject.blur(that.autocompleteBlur);
                        }
                    }                

                    
                /*
                 * case of calendar
                 */
                } else {
                    if (widget.att.type == 'date') {
                        dateOptions = {
                            changeMonth: true,
                            changeYear: true
                        };
                        
                        if (data['datapicker-on']) {
                            /*
                             * If icon only active => add calendar button
                             */
                            if (data['datapicker-icon-only']) {
                                dateOptions.showOn          =  "button";
                                dateOptions.buttonImage     = "waLib/WAF/widget/png/date-picker-trigger.png?id=" + widgetID;
                                dateOptions.buttonImageOnly = true;   
                            }
                            
                            /*
                             * Fix bug on calendar on textfield into a matrix
                             */
                            if (isParentMatrix.length == 0 || (e.subID && isParentMatrix.length != 0)) {
                                htmlObject.datepicker(dateOptions);
                            }
                            
                            /*
                             * Get linked calendar button
                             */
                            if (data['datapicker-icon-only'] && htmlObject[0]) {
                                dateIcon        = $('img[src="waLib/WAF/widget/png/date-picker-trigger.png?id=' + widgetID + '"]');
                                
                                dateIconLeft    = (parseInt(htmlObject.css('left')) + htmlObject[0].offsetWidth);
                                
                                //console.log(htmlObject, config.id, dateIconLeft)
                                dateIcon.css({
                                    'position'  : 'absolute',
                                    'left'      : dateIconLeft + 'px',
                                    'top'       : htmlObject.css('top'),
                                    'cursor'    : 'pointer'
                                });
                            }
                        }
                    }
                }
                
                /*
                 * Set the same as the htmlobject css to the autocomplete
                 */
                if (autoCompleteWidget != null) {
                    ["font-family","font-size","font-style","font-variant","font-weight","text-align","letter-spacing","background-color","color"].forEach(function(elem) {
                            autoCompleteWidget.css(elem, htmlObject.css(elem));
                    });
		}
                 
                /*
                 * Change datasource value on change event
                 */
                htmlObject.bind('change', {}, that.change);
                
                
                /*
                 * Remove formatted value on focus
                 */
                htmlObject.bind('focus',function(event) {
                    var 
                    widget,
                    sourceAtt;
                    
                    widget = WAF.widgets[this.id];
                    widget.isInFocus = true;
                    
                    if (widget.format != null && widget.format.format != null) {
                        sourceAtt = widget.sourceAtt;
                        
                        if (sourceAtt != null) {
                            this.value = sourceAtt.getValueForInput();
                        }
                    }
                });
                
                /*
                 * Reset formatted value on blur
                 */
                htmlObject.bind('blur',function(event) {
                    var 
                    widget,
                    value,
                    sourceAtt;
                    
                    widget  = WAF.widgets[this.id];
                    value   = '';
                    
                    widget.isInFocus = false;
                    
                    if (widget.format != null && widget.format.format != null) {
                        sourceAtt = widget.sourceAtt;
                        if (sourceAtt != null){
                            value = sourceAtt.getValue();
                        }
                        this.value = widget.getFormattedValue(value);
                    }
                });
                
                /*
                 * Active/Desactive input depending on readOnly attribute
                 */
		if (widget.att.readOnly || widget.sourceAtt.readOnly){
                    htmlObject.disabled = true;
                } else {
                    htmlObject.disabled = false;
                }

            },{
                listenerID      : config.id,
                listenerType    : 'textInput',
                subID           : config.subID ? config.subID : null
            }, {
                widget:this
            });
        } else {
            this._tmpVal = htmlObject.attr('value');
            text = this.getFormattedValue(htmlObject.val());            
            htmlObject.val(text);
            
            htmlObject.focusin(function() {
               $(this).val(that._tmpVal);
            });
            
            htmlObject.focusout(function() {
                that._tmpVal = $(this).val();
               $(this).val(that.getFormattedValue(that._tmpVal));
            });
        }
    }, {
        /*
         * TextField widget change event function
         */
        change : function() { 
            var 
            widget,
            value,
            sourceAtt,
            validation;

            widget  = WAF.widgets[this.id];
            
            if (widget != null) {
                if (widget.doNotUpdate){
                    widget.doNotUpdate = false;
                } else {                          
                    sourceAtt   = widget.sourceAtt;
                    value       = sourceAtt.normalize(this.value);
                    validation  = sourceAtt.validate(value);

                    if (validation.valid) {
                        sourceAtt.setValue(value, {dispatcherID:widget.divID});
                        widget.clearErrorMessage();
                    } else {
                        sourceAtt.setValue(value, {dispatcherID:widget.divID});
                        widget.setErrorMessage(validation.messages.join(", "));
                    }
                }
            }
        },
        /*
         * TextField autocomplete widget blur event function
         */
        autocompleteBlur : function(event) { 
            var
            widget,
            sourceAtt;

            widget      = WAF.widgets[this.id];                        
            sourceAtt   = widget.sourceAtt;

            if (this.value !== sourceAtt.getValue())
            {
                sourceAtt.setValue(this.value, {
                    dispatcherID    : this.id
                });
            }
        }
    }
);