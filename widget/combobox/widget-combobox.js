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
     *      
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    'Combobox',   
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
        comboboxHtml,
        comboboxID,
        htmlObject,
        key,
        sourceIn,
        sourceOut,
        autoDispatch,
        options,
        primary,
        tagWidth,
        inputHtmlObject,
        buttonHtmlObject,
        listHtmlObject,
        listClass,
        buttonSize,
        i;


        htmlObject      = $(this.containerNode); 
        comboboxID      = config.id;
        key             = data['binding-key'];
        sourceIn        = data['binding'];
        sourceOut       = data['binding-out'];
        autoDispatch    = data['autoDispatch'];
        options         = data['binding-options'];
        primary         = "ID";
        tagWidth        = parseInt(htmlObject.css('width'));
        buttonSize      = 25;
        
        comboboxHtml  = htmlObject.children('select');
            
        comboboxHtml.combobox();   

        inputHtmlObject     = htmlObject.children('input');
        buttonHtmlObject    = htmlObject.children('button');
        inputHtmlObject.css({
            'width'     : (tagWidth - buttonSize) + 'px',
            'height'    : '100%'
        });

        buttonHtmlObject.css({
            'width'     : buttonSize + 'px',
            'height'    : '100%'
        });
        
        if (data.editable == 'false') {
            inputHtmlObject.css({'cursor' : 'pointer'});
            
            inputHtmlObject.attr('readonly', 'readonly');
            
            inputHtmlObject.bind('click', {}, function (){
                var that;                
                that = $(this);
                 
                buttonHtmlObject.click();
                
                that.bind( "autocompleteselect", function(event, ui) {
                    that.blur();  
                });
            })
        }
        
        listHtmlObject = inputHtmlObject.autocomplete( "widget" );
        listHtmlObject.addClass('waf-combobox-list-' + config.id + ' waf-combobox-list');
        
        listClass = htmlObject.attr('class').split(' ');
        
        for (i = 0; i < listClass.length; i += 1) {
            if(!/waf-/.test(listClass[i])){
                listHtmlObject.addClass(listClass[i])
            }
        }
                
        // ********* <STATES EVENTS> *********
        htmlObject.hover(
            function () {
                $(this).addClass("waf-state-hover");
            },
            function () {
                $(this).removeClass("waf-state-hover");
            }
        );
            
        inputHtmlObject.focusin(function() {
            htmlObject.addClass("waf-state-active");
            $(this).addClass("waf-state-focus");
        })
        .focusout(function() {
            htmlObject.removeClass("waf-state-active");
            $(this).removeClass("waf-state-focus");
        });       
        
        inputHtmlObject.bind( "autocompleteopen", function(event, ui) {
            $(this).focus();
            htmlObject.addClass("waf-state-active");
        });
        
        inputHtmlObject.bind( "autocompleteclose", function(event, ui) {
            if (!inputHtmlObject.hasClass('waf-state-focus')) {
                htmlObject.removeClass("waf-state-active");
            }
        });
        // ********* </STATES EVENTS> ********

        this.createCombobox= function(divID, binding, params){
            var result      = WAF.AF.createWidget(divID, binding, params); 

            if (result) {

                var listenerConfig = {
                    listenerID  :divID,
                    listenerType:'dropDown',
                    subID       : params.subID ? params.subID : null
                };


                //result.source.addListener("all", function(e) {
                result.sourceAtt.addListener(function(e) {
                    //console.log(e.subID)
                    var dsID = e.dataSource.getID();

                    switch(e.eventKind) {
                        case  'onCurrentElementChange' :
                            // Save value if binding "in" is defined
                            if ((autoDispatch && autoDispatch !== 'false' )|| autoDispatch === 'true') {                                
                                if (sourceOut) {
                                    var bindingInfo = WAF.dataSource.solveBinding(sourceOut);
                                    if (dsID === key) {
                                        bindingInfo.dataSource[dsID].set(e.dataSource);
                                        comboboxHtml.combobox('setValue', e.dataSource.getAttribute(primary).getValue());
                                    } else {
                                        value = e.dataSource.getAttribute(key).getValue();
                                        bindingInfo.dataSource.getAttribute(bindingInfo.attName).setValue(value);
                                        comboboxHtml.combobox('setValue', value);
                                    }
                                } else {
                                    if (dsID !== key) {
                                        value = e.dataSource.getAttribute(key).getValue();
                                        comboboxHtml.combobox('setValue', value);
                                    }
                                }
                            }
                            break;

                        case  'onCollectionChange' :
                        case  'attributeChange' :
                            comboboxHtml.children().remove();
                            for (var i = 0; i <= e.dataSource.length, i <= 100; i += 1) {

                                e.dataSource.getElement(i, {
                                    onSuccess: function(e){
                                        if (e.element) {
                                            var split = options.split(' ');
                                            var label = '';
                                            var value = e.element.getAttributeValue(key);

                                            if (typeof(value) === 'undefined') {
                                                value = e.element.getAttributeValue(primary);
                                            }

                                            var nb = 0;
                                            for (var i = 0; i < split.length; i += 1) {
                                                if (split[i] !== '') {
                                                    nb += 1;
                                                    label += e.element.getAttributeValue(split[i].replace('[', '').replace(']', '')) + ' ';
                                                }
                                            }

                                            // Format if label is a number
                                            if (nb === 1 && label.replace(/ /g, '').match('^\\d+$') && !label.replace(/ /g, '').match('-')) {
                                                label = e.data.widget.getFormattedValue(parseInt(label));
                                            }

                                            comboboxHtml.append(
                                                $('<option/>').attr({
                                                    value: value
                                                }).html(label)
                                            );
                                        }
                                    }
                                },{
                                    widget : e.data.widget
                                })
                            }
                            break;
                    }
                }, listenerConfig, {
                    widget:result
                });

                // Change current entity on change event
                
        
                inputHtmlObject.bind( "autocompleteselect", function(event, ui) {
                        var value = result.source[key];

                    if ((autoDispatch && autoDispatch !== 'false' )|| autoDispatch === 'true' ) {
                        result.source.select(ui.item.option.index)
                    }


                    // Save value if binding "out" is defined
                    if (sourceOut) {
                        var bindingInfo = WAF.dataSource.solveBinding(sourceOut);

                        if (typeof(value) === 'undefined' && result.source.getID() === key) {
                            result.source.select(ui.item.option.index);
                            bindingInfo.dataSource[result.source.getID()].set(result.source);
                        } else {
                            bindingInfo.dataSource.getAttribute(bindingInfo.attName).setValue(event.target.value);
                        }
                    }
                });

                if (sourceOut) {
                    var bindingInfo = WAF.dataSource.solveBinding(sourceOut);
                    var thisDS = bindingInfo.dataSource;

                    thisDS.addListener('onCurrentElementChange', function(e) {
                        var value = e.dataSource.getAttribute(bindingInfo.attName).getValue();

                        if (e.data.source.getID() === e.data.search) {
                            e.dataSource[e.data.source.getID()].load({
                                onSuccess : function(e) {
                                    if (e.entity) {
                                        comboboxHtml.combobox('setValue', e.entity[primary].getValue());
                                    }
                                }
                            });
                        } else {
                            comboboxHtml.combobox('setValue', value);
                        }

                        if ((autoDispatch && autoDispatch !== 'false' )|| autoDispatch === 'true' ) {
                            result.source.select(comboboxHtml.attr( "selectedIndex" ));
                        }
                    }, {}, {
                        search : key,
                        source : result.source
                    })
                }
            } else {
                // Change current entity on change event
                inputHtmlObject.bind( "autocompleteselect", function(event, ui) {
                    // Save value if binding "out" is defined
                    if (sourceOut) {
                        var bindingInfo = WAF.dataSource.solveBinding(sourceOut);
                        bindingInfo.dataSource.getAttribute(bindingInfo.attName).setValue(ui.item.value);
                    }
                });
            }
        }

        this.createCombobox(comboboxID, sourceIn ? sourceIn : '', config);    
            
    },        
    {
        
    }
);
