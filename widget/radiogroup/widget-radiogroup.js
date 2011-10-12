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
    'RadioGroup',   
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
        listenerConfig,
        htmlObject,
        key,
        sourceOut,
        autoDispatch,
        options,
        primary,
        themes,
        classes,
        theme,
        icon,
        icons,
        definedTheme,
        radioLabel;

        that            = this;
        config          = config || {};
        htmlObject      = $(this.containerNode);
            
        key             = data['binding-key'];
        sourceOut       = data['binding-out'];
        autoDispatch    = data['autoDispatch'];
        options         = data['binding-options'];
        primary         = "ID";
        classes         = htmlObject.attr('class');
        themes          = [];
        definedTheme    = '';
        
        for (i in WAF.widget.themes) {
            theme = WAF.widget.themes[i].key;
            if (classes.match(theme)) {
                themes.push(theme);
                
                if (theme != 'inherited') {
                    definedTheme = theme;
                }
            }
        }
        
        /*
         * Add display class
         */
        htmlObject.removeClass('horizontal vertical');
        htmlObject.addClass(data.display);
        
        this.tmpIcon = null;
    
        /*
         * Create a radio input
         * @method _createRadio
         */
        this._createRadio = function radiogroup_createradio(li, svg, icons) {
            var
            i,
            radioLi,
            radioDiv,
            radioIcon,
            radioInput,
            imgHtml,
            cssClass;
            
            radioLi         = li;
            radioInput      = radioLi.children('input');
            radioLabel      = radioLi.children('label');
            
            radioLi.children('.waf-widget.waf-radio').remove();
            
            radioDiv = $('<div class="waf-widget waf-radio">');     
            
            radioDiv.addClass(themes.join(' '));            
            
            $('<div class="waf-radio-box">').appendTo(radioDiv);
            
            cssClass    = 'waf-icon waf-radio-icon';

            if (svg) {
                cssClass += ' waf-icon-svg';
            } else {
                cssClass += ' waf-icon-image';
            }
            
            /*
             * To prevent many svg load requests
             */
            radioIcon    = $('<div class="' + cssClass + '">');

            /*
             * Img icon
             */
            if (icons) {         
                for (i = 0; i < icons.length; i += 1) {   
                    imgHtml = $('<img>');

                    imgHtml.addClass(icons[i].cssClass);

                    imgHtml.attr({
                        src : icons[i].value
                    });

                    imgHtml.appendTo(radioIcon);
                }
            /*
             * Svg icon
             */
            }  else {
                radioIcon.html($(svg).html());
            }
            
            radioIcon.appendTo(radioDiv);
            
            radioInput.appendTo(radioDiv);
            
            radioDiv.appendTo(radioLi);
            
            radioLabel.appendTo(radioLi);

            /*
             * Hover States events for radios & label
             */
            this.hoverIn = function (e) {
                radioDiv.addClass("waf-state-hover");
            }
                
            this.hoverOut = function (e) {
                radioDiv.removeClass("waf-state-hover waf-state-active");
            }
            radioInput.hover(this.hoverIn, this.hoverOut);
            radioLabel.hover(this.hoverIn, this.hoverOut);
            
            /*
             * Mouse down States events for radios & label
             */
            this.mouseDown = function(e) {
                radioDiv.addClass("waf-state-active");
            }

            radioInput.bind('mousedown', {}, this.mouseDown);
            radioLabel.bind('mousedown', {}, this.mouseDown);

            /*
             * Mouse up States events for radios
             */
            radioInput.bind('mouseup', {}, function(e) {
                htmlObject.find('.waf-radio').removeClass("waf-state-selected");
                
                radioDiv.addClass("waf-state-selected");
                radioDiv.removeClass("waf-state-active");
            });

            radioInput.focusin(function() {
                radioDiv.addClass("waf-state-focus");
            });

            radioInput.focusout(function() {
                radioDiv.removeClass("waf-state-focus");
            });
            
            /*
             * To force radio state change even if click on label
             */
            radioInput.bind('change', {}, function (e) {
                that._checkRadio($(this))
            });
            
                //console.log(this._value, radioInput.val())
            
            if (this._value && this._value == radioInput.val()) {
                radioInput[0].setAttribute('checked', 'checked')
                //this._value = null;
            }
            
            if (radioInput && radioInput[0] && radioInput[0].getAttribute('checked')) {
                radioDiv.addClass('waf-state-selected');
            }            
        }                            
        
        icons   = [];

        if (data['icon-default'])    icons.push({cssClass : 'waf-radio-icon-default',  value : data['icon-default']});
        if (data['icon-hover'])      icons.push({cssClass : 'waf-radio-icon-hover',    value : data['icon-hover']});
        if (data['icon-active'])     icons.push({cssClass : 'waf-radio-icon-active',   value : data['icon-active']});
        if (data['icon-selected'])   icons.push({cssClass : 'waf-radio-icon-selected', value : data['icon-selected']});

        if (icons.length > 0) {
            $.each(htmlObject.children(), function(){
                that._createRadio($(this), null, icons);
            });
        } else {

            $('<div>').svg({                        
                loadURL: '/walib/WAF/widget/radiogroup/skin/' + definedTheme + '/svg/widget-radiogroup-skin-' + definedTheme + '.svg',
                onLoad: function(svg) {
                    var
                    thisSvg;

                    thisSvg = this;
                    svg.configure({
                            width: '100%',
                            height: '100%',
                            preserveAspectRatio: 'none'
                    });    
                    
                    $.each(htmlObject.children(), function(){
                        that._createRadio($(this), thisSvg);
                    });

                }
            });
        }        
        
        listenerConfig = {
                listenerID      :this.id,
                listenerType    :'radioGroup',
                subID           : config.subID ? config.subID : null
            };
        
        /*
         * Check a radio and add appropriated classes
         */
        this._checkRadio = function radiogroup__checkRadio(radio) {
            radio.attr("checked", "checked");
            
            htmlObject.find('.waf-radio').removeClass("waf-state-selected");
                
            radio.parent().addClass("waf-state-selected");
        }
        
        if (this.sourceAtt) {            
            /*
             * Save value if binding "in" is defined
             */

            this.sourceAtt.addListener(function(e) {
                var 
                dsID,
                thatDs;
                
                dsID    = e.dataSource.getID();
                thatDs  = {};
                
                switch(e.eventKind) {
                    case  'onCurrentElementChange' :
                        /*
                         * Save value if binding "in" is defined
                         */
                        if ((autoDispatch && autoDispatch !== 'false' )|| autoDispatch === 'true') {                                
                            if (sourceOut) {
                                var bindingInfo = WAF.dataSource.solveBinding(sourceOut);
                                if (dsID === key) {
                                    bindingInfo.dataSource[dsID].set(e.dataSource);
                                    
                                    that._checkRadio($('#' + htmlObject.attr('id') + ' input[value="' + e.dataSource.getAttribute(primary).getValue() + '"]'));
                                } else {
                                    value = e.dataSource.getAttribute(key).getValue();
                                    bindingInfo.dataSource.getAttribute(bindingInfo.attName).setValue(value);
                                    
                                    that._checkRadio($('#' + htmlObject.attr('id') + ' input[value="' + value + '"]'));
                                }
                            } else {
                                if (dsID !== key) {
                                    value = e.dataSource.getAttribute(key).getValue();
                                   
                                   that._checkRadio($('#' + htmlObject.attr('id') + ' input[value="' + value + '"]'));
                                }
                            }
                        }
                        break;

                    case  'onCollectionChange' :
                    case  'attributeChange' :            
                        /*
                         * Add a radio for each data
                         */
                        thatDs.addRadio = function (thisSvg, icons) {          
                            var
                            i;                            
                            
                            htmlObject.children().remove();
                            
                            for (i = 0; i <= e.dataSource.length; i += 1) {
                                if (i <= 100) {
                                    e.dataSource.getElement(i, {
                                        onSuccess: function(e){
                                            var 
                                            i,
                                            split,
                                            label,
                                            value,
                                            li,
                                            nb;

                                            if (e.element) {
                                                split = options.split(' ');
                                                label = '';
                                                value = e.element.getAttributeValue(key);
                                                li    = $('<li>');

                                                if (typeof(value) === 'undefined') {
                                                    value = e.element.getAttributeValue(primary);
                                                }

                                                nb = 0;
                                                for (i = 0; i < split.length; i += 1) {
                                                    if (split[i] !== '') {
                                                        nb += 1;
                                                        label += e.element.getAttributeValue(split[i].replace('[', '').replace(']', '')) + ' ';
                                                    }
                                                }

                                                /*
                                                 *  Format if label is a number
                                                 */  
                                                if (nb === 1 && label.replace(/ /g, '').match('^\\d+$') && !label.replace(/ /g, '').match('-')) {
                                                    label = e.data.widget.getFormattedValue(parseInt(label));
                                                }

                                                li.append($('<input/>').attr({
                                                    'type'    : 'radio',
                                                    'name'    : config.id,
                                                    'data-num': e.position,
                                                    'id'      : config.id + '-' + e.position,
                                                    'value'   : value
                                                }));
                                                li.append($('<label/>').attr('for', config.id + '-' + e.position).html(label));

                                                htmlObject.append(li);
                                                
                                                that._createRadio(li, thisSvg, icons);
                                            }
                                        }
                                    },{
                                        widget : e.data.widget
                                    });
                                }
                            }
                            
                        }
                        
                        if (icons.length > 0) {
                            thatDs.addRadio(null, icons);                            
                        } else {
                            
                            $('<div>').svg({                        
                                loadURL: '/walib/WAF/widget/radiogroup/skin/' + definedTheme + '/svg/widget-radiogroup-skin-' + definedTheme + '.svg',
                                onLoad: function(svg) {
                                    var
                                    thisSvg;

                                    thisSvg = this;
                                    svg.configure({
                                            width: '100%',
                                            height: '100%',
                                            preserveAspectRatio: 'none'
                                    }); 

                                    thatDs.addRadio(thisSvg);
                                }
                            });
                        }
                        
                        
                        break;
                }
            }, listenerConfig, {widget : this});
            
            /*
             * Change current entity on change event
             */
            htmlObject.bind('change', {source : this.source, search : key}, function(e) {
                var 
                value,
                bindingInfo,
                htmlObj;
                
                value   = e.data.source[e.data.search];
                htmlObj = $(e.target);
                
                if ((autoDispatch && autoDispatch !== 'false') || autoDispatch === 'true' ) {                    
                    e.data.source.select(parseInt(htmlObj.attr('data-num')))
                }

                /*
                 * Save value if binding "out" is defined
                 */
                if (sourceOut) {
                    bindingInfo = WAF.dataSource.solveBinding(sourceOut);

                    if (typeof(value) === 'undefined' && e.data.source.getID() === e.data.search) {
                        e.data.source.select(htmlObj.attr('data-num'));
                        bindingInfo.dataSource[e.data.source.getID()].set(e.data.source);
                    } else {
                        bindingInfo.dataSource.getAttribute(bindingInfo.attName).setValue(e.target.value);
                    }
                }
            });
            
            /*
             * Change value of defined source out
             */
            if (sourceOut) {
                var 
                bindingInfo,
                thisDS;
                
                bindingInfo = WAF.dataSource.solveBinding(sourceOut);
                thisDS      = bindingInfo.dataSource;

                thisDS.addListener('onCurrentElementChange', function(e) {
                
                    var value;
                    
                    value = e.dataSource.getAttribute(bindingInfo.attName).getValue();

                    if (e.data.source.getID() === e.data.search) {
                        e.dataSource[e.data.source.getID()].load({
                            onSuccess : function(e) {
                                if (e.entity) {
                                    that._checkRadio($('#' + htmlObject.attr('id') + ' [data-num=' + (e.entity[primary].getValue()-1) + ']'));                            
                                }
                            }
                        });
                    } else {
                        that._checkRadio($('#' + htmlObject.attr('id') + ' input[value="' + value + '"]'));   
                    }

                }, {}, {
                    search : key,
                    source : this.source
                })
            }
            
        /*
         * Unbinded radio
         */
        } else {
            /*
             * Change current entity on change event
             */
            htmlObject.bind('change', {}, function(e) {
                var bindingInfo
                
                /*
                 * Save value if binding "out" is defined
                 */
                if (sourceOut) {
                    bindingInfo = WAF.dataSource.solveBinding(sourceOut);
                    bindingInfo.dataSource.getAttribute(bindingInfo.attName).setValue(e.target.value);
                }
            });
        }
        
    },{
        /*
         * Select a radio of the radiogroup depending on a value
         * @method select
         * @param {String} value
         */
        select : function radio_select(value) {
            var
            radio,
            htmlObject;
            
            htmlObject = $(this.containerNode);
            
            radio = htmlObject.find('[value="' + value + '"]');
            
            this._value = value;
            
            if (radio.length > 0) {
                this._checkRadio(radio);
            }
        }
    }
);
