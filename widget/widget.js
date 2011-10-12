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

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true, indent: 4 */


/**
 * WAF widget global class
 *
 * @module widget
 *
 * @class WAF.Widget
 * @extends Object
 *
 * @author			The Wakanda Team
 * @date			august 2010
 * @version			0.1
 *
 */
WAF.Widget = function WAFWidget() {
    var outWidget;

    outWidget = (typeof this === "undefined") ? new WAF.Widget() : this;

    return outWidget;
};


WAF.Widget.prototype.getUuidlet = function() {
    return(((1+Math.random())*0x10000)|0).toString(16).substring(1);
}


/**
 * Initialize the widget
 *
 * @method init
 * @param {Object} inConfig inConfiguration of the widget
 **/
WAF.Widget.prototype.init = function (inClassName, inConfig) {
    
    var  
    itemName, 
    item,
    binding,
    bindingInfo,
    id,
    widget,
    resizeWidgets,
    resizableWidgets;
    
    if (typeof inConfig === "undefined") {
        throw new Error('inConfig not defined');
    }
        
    
    /**
     * The id of the widget
     *
     * @property id
     * @type String
     **/
    if ('id' in inConfig) {
        this.id = inConfig.id;
    } else {
        //throw new Error('inConfig id not defined');
        this.id = inClassName.toLowerCase() + '-' + this.getUuidlet() + '-' + this.getUuidlet() + '-' + this.getUuidlet() + '-' + this.getUuidlet() + this.getUuidlet() + this.getUuidlet();
        /**
         * @todo waf.console.warn('An id has been generated for:', this)
         */
    }
    
    
    /**
     * The kind of the widget
     *
     * @property kind
     * @type String
     * @default googleMap
     **/
    if ('data-type' in inConfig) {
        this.kind = inConfig['data-type'];
    } else {
        //throw new Error('inConfig data-type not defined');
        this.kind = inClassName.substr(0, 1).toLowerCase() + inClassName.substr(1);
       
    }
        
    
    /**
     * The divID of the widget (by default the same as the id property)
     *
     * @property divID
     * @type String
     * @deprecated already defined by the id property
     **/
    this.divID = ('divID' in inConfig) ? inConfig.divID : this.id;
    
    
    /**
     * The renderId of the widget (by default the same as the id property)
     *
     * @property renderId
     * @type String
     **/
    this.renderId = ('renderId' in inConfig) ? inConfig.renderId : this.id;

    /**
     * Config as widget property to be used by the matrix
     *
     * @property config
     * @type Object
     **/
    this.config = inConfig;
    
    /**
     * The reference of the DOM node Element of the widget
     *
     * @property containerNode
     * @type HTMLElement
     **/
    this.containerNode = document.getElementById(this.id);
    if (this.containerNode === null) {
        // throw new Error('DOM Element not found: ' + this.id);
        if ("div, span, img".indexOf(inConfig.tagName) != -1) {
            throw new Error('Bad tagName in config !');   
        }
//        this.containerNode = document.createElement(WAF.config.taglib[inClassName].tag || 'div');
        this.containerNode = document.createElement('div');
    }
    
    

    
    /**
     * The reference of the DOM node Element of the widget
     *
     * @property ref
     * @type HTMLElement
     * @todo Should be replaced by the <code>containerNode</code> property
     **/
    this.ref = this.containerNode;
    
    

    
    /**
     * The label widget of the current widget
     *
     * @property ref
     * @type WAF.widget.Label
     **/
    this.label = null;
    for (itemName in WAF.widgets) {
        if (WAF.widgets.hasOwnProperty(itemName)) {
            item = WAF.widgets[itemName];
            if (item.type === 'label' && item.ref['for'] === this.id) {
                this.label = item;
                break;
            }
        }
    }
    
            
    if ('data-errorDiv' in inConfig) {
        /**
        * The id of the container for error information
        *
        * @property errorDiv
        * @type String|undefined
        **/
        this.errorDiv = inConfig['data-errorDiv'];    
        
        /**
         * Clear the error message from the associated error display widget
         *
         * @method clearErrorMessage
         **/
        this.clearErrorMessage = WAF.AF.clearErrorMessage;
        
        /**
         * Display an error message from the associated error display widget
         *
         * @method setErrorMessage
         * @param {String} message
         **/          
        this.setErrorMessage = WAF.AF.setErrorMessage;
    
        
    } else {
    
        this.clearErrorMessage = this.setErrorMessage = function () {};
    
    }
    
    
    /**
     * The representation format of the value
     *
     * @property format
     * @type String|undefined
     **/
    this.format = { 
        format: inConfig['data-format']
    };
    
    
    /**
     * Return the value with its format applyed
     *
     * @method getFormattedValue
     * @param {String} AttributeName
     * @return {String}
     **/ 
    this.getFormattedValue = function(value) {
        var
        test,
        result;
        
        if (value === undefined) {
            if (this.sourceAtt == null) {
                value = this.source.getAttribute(this.att.name).getValue();
            } else {
                value = this.sourceAtt.getValue();
            }
        }
        
        /*
         * Converte "number" strings into real number variable
         */     
        if (value && !/[a-z]/i.test(value)) {
            test = parseInt(value);   
            value = test;
        }
        
        if (typeof (value) == "number") {
            result = WAF.utils.formatNumber(value, this.format);
        } else if (this.att && this.att.type == "date") {
            result = WAF.utils.formatDate(value,this.format);
        } else if (this.att && this.att.type == "image") {
            if (value) {
                if (value.__deferred) {
                    value = value.__deferred.uri;
                } else {
                    value = value[0].__deferred[0].uri; 
                }				
            } else {
                value = '';
            }
            result = value;
        } else if (typeof (value) == "string") {
            if (this.kind === 'textField') {
                result = value;
            } else{
                result = htmlEncode(value, true, 4)
            }
        } else {
            if (value == null){
                result = "";
            } else{
                result = String(value);
            }
        }
        
        return result;
    }

    
    
    /**
     * isInFocus
     *
     * @property isInFocus
     * @type Boolean
     * @default false
     **/
    this.isInFocus = false;
    
    
    binding     = inConfig['data-binding'] || '';
    bindingInfo = WAF.dataSource.solveBinding(binding);

    this.source = bindingInfo.dataSource;
    if ('source' in this) {
        this.att = bindingInfo.dataClassAtt;
        this.sourceAtt = bindingInfo.sourceAtt;
        // if no format is defined, set the potential default format 
        if (this.att !== null && typeof this.format === "undefined") {
            this.format = this.att.defaultFormat;
        }

    }
        
    
    /**
     * Get the current theme of the widget
     *
     * @method getTheme
     * @return {String}
     **/ 
    this.getTheme = function() {
        var
        i,
        theme,
        themes,
        classes,
        htmlObject;
        
        htmlObject  = $(this.containerNode);   
        themes      = [];
        classes = htmlObject.attr('class');
        
        for (i in WAF.widget.themes) {
            theme = WAF.widget.themes[i].key;
            if (classes.match(theme)) {   
                themes.push(theme);
            }
        }
                   
        return themes.join(' ');
    }
    
    
    
    // add the widget instance to the widget instance list    
    WAF.widgets[this.id] = this;
        
    /*
     * Force resize on window event
     */
    WAF.widgets._length = WAF.widgets._length || 0;
    WAF.widgets._length += 1;
    
    /*
     * When all widgets are ready
     */
    if ($('.waf-widget').length == WAF.widgets._length) {
        resizableWidgets = $('body').children('.waf-container[data-constraint-right][data-constraint-bottom],.waf-matrix[data-constraint-right][data-constraint-bottom]').not(':hidden');
        
        /*
         * Resize widgets with constraints
         */
        resizeWidgets = function resizeWidgets() {
             $.each(resizableWidgets, function(i) {
                id      = $(this).attr('id');
                widget  = $$(id);

                if (widget.onResize) {
                    widget.onResize();            
                }
            });
        };
        
        /*
         * Force resize on load
         */
        resizeWidgets();        
        
        /*
         * Force resize on window resize
         */
        $(window).resize(resizeWidgets);    
        
        /*
         * To prevent bubbling
         */
        $('label').bind('click', {}, function() {
            $('#' + $(this).attr('for')).trigger('click');
            $('#' + $(this).attr('for')).select();
            return false;
        });
    }
    
};


/**
 * Provide a Widget Class from a name, a constructor, a prototype, and a private shared object
 *
 * @static
 * @method provide
 *
 * @throw {Error} If the constructor name is not valid or if the constructor is not a function
 *
 * @param {String} name Required. The name of the widget constructor (ex: Datagrid)
 * @param {Object} shared The private properties and methods shared between all the instances
 * @param {Function} construct Required. The constructor used to create the widget instance
 * @param {Object} proto The public shared properties and methods inherited by all the instances
 *
 * @return {Function} The constructor of the widget
 **/          
WAF.Widget.provide = function provide(name, shared, construct, proto) {
    
    var ThisConstructor, thisPrototype, itemName;
    
    // Create the "shared" private object
    
    shared = arguments[1];
    
    // Check the parameters validity
    
    if (typeof name !== 'string' || name.length < 2) {
        throw new Error('The constructor name is missing or too short');
    }

	// This is really annoying for widget's type setting which
	// should be the same that the widget's folder name.
	// Maybe the constructor's name could be automatically
	// CamelCased instead of throwing an error ?
    //if (!/[A-Z]/.test(name[0])) {
    //    throw new Error('The first letter of the constructor name must be an uppercase letter. Actually it is not: "' + name + '"');
    //}

    if (typeof construct !== 'function') {
        throw new Error('The constructor function is missing or is not a function');
    }
    
    // Create the widget Constructor
    
    ThisConstructor = WAF.widget[name] = function (config, data) {        
        var 
        that,
        itemName, 
        outWidget,
        htmlObject;
        
        that = this;
        
        if (data === undefined) {
            data = {};
            for (itemName in config) {
                if (itemName.substr(0, 5) === 'data-') {
                    data[itemName.substr(5)] = config[itemName];
                }
            }
        }
        
        if (typeof this === 'undefined') {
        
            outWidget = new ThisConstructor(config, data);
        
        } else {            
        
            this.init(name, config);
            
            // to replace by this.call(this, construct, config, data, shared);
            this.create = construct;
            this.create(config, data, shared);
            delete this.create;
            
            outWidget = this;
            
        }
        
        /*
         * Enable resizable
         */
        this.resizable = function () {
            var 
            htmlObject;
            htmlObject  = $(this.containerNode);
            
            htmlObject.resizable({                
                start : function(e) {
                    that.resize('start');
                },
                resize : function(e) {
                    that.resize('on');
                },
                stop : function(e) {
                    that.resize('stop');
                }
            });
            
        }  
            
        /*
         * Called when the widget is resized
         */
        this.resize = function( type ){
            var
            that,
            events,
            htmlObject;
            
            that        = this;
            events      = WAF.events[that.id];
            htmlObject  = $(that.containerNode);
            
            type        = type || 'on';
            
            /*
             * Execute custom method
             */
            switch(type) {
                case 'on':
                    if (that.onResize) {
                        that.onResize();
                    }

                    break;
                    
                case 'start':
                    if (that.startResize) {
                        that.startResize();
                    }

                    break;
                    
                case 'stop':
                    if (that.stopResize) {
                        that.stopResize();
                    }

                    break;
            }

            /*
             * Execute resize event
             */
            if (events) {
                $.each(WAF.events[that.id], function () {
                    if (
                        ( this.name == 'onResize'    && type == 'on' )
                    ||  ( this.name == 'startResize' && type == 'start' )
                    ||  ( this.name == 'stopResize'  && type == 'stop' ) ) {
                        this.fn();
                    }
                });
            }
            
            $.each(htmlObject.children(), function() {
                var
                child,
                childWidget,
                checkResize;

                child       = $(this);
                childWidget = $$(child.attr('id'));
                
                if (childWidget && childWidget.checkResize) {
                    
                    /*
                     * Check if the children is resizable (depending on constraints)
                     */
                    checkResize = childWidget.checkResize();

                    if (childWidget && (checkResize.x == true || checkResize.y == true)) {
                        childWidget.resize(type);
                    }
                }
            });
        };
        
        /*
         * Append resizable method if defined
         */
        if (data && data.resizable == 'true') {
            this.resizable();
        }
        
        
        /*
         * Enable draggable
         */
        this.draggable = function () {
            var 
            htmlObject;
            htmlObject  = $(this.containerNode);
            
            if (this.kind != 'autoForm' && this.kind != 'queryForm') {
                htmlObject.css('cursor', 'pointer');
            }
            
            htmlObject.draggable({
                cancel  : '.waf-widget-body',
                stack   : '.waf-widget'
            });
            
        }
        
        /*
         * Append resizable method if defined
         */  
        if (data && data.draggable == 'true') {
            this.draggable();
        }
        
        /*
         * Clear widgets values
         */
        this.clear = function widget_clear () {
            var 
            htmlObject;
            htmlObject  = $(this.containerNode);
            
            switch(this.kind) {
                case 'textField':
                    htmlObject.val('');
                    break;
                    
                case 'richText':
                    htmlObject.html('');
                    break;
                    
                case 'checkbox':
                    htmlObject.removeAttr('checked');       
                    htmlObject.removeClass('waf-state-selected'); 
                    break;
                    
                case 'image':
                    htmlObject.find('img').attr('src', '/waLib/WAF/widget/png/blank.png');
                    break;                    
                    
                case 'slider':
                    htmlObject.slider( "value" , 0);       
                    break;
                    
                default :
                    htmlObject.html('');
                    break;
            }
        }
        
        /*
         * Check if a widget is resizable depending on its position constraints
         */
        this.checkResize = function widget_check_resize() {
            var 
            result,
            htmlObject;
            
            htmlObject  = $(this.containerNode);
            result      = {};         
            
            if (htmlObject.attr('data-constraint-right') == 'true' && htmlObject.attr('data-constraint-left') == 'true') {
                result.x = true;
            }
            
            if (htmlObject.attr('data-constraint-top') == 'true' && htmlObject.attr('data-constraint-bottom') == 'true') {
                result.x = true;
            }            
            
            return result;
        }
        
        return outWidget;
        
    };
    
    // Extend the provided Widget from WAF.Widget
    
    try {
        ThisConstructor.name = name;
    } catch (e) {
        
    } 
    thisPrototype = ThisConstructor.prototype = new WAF.Widget();
    thisPrototype.constructor = ThisConstructor;
    
    // Add its own prototype properties and methods to the Constructor
    
    for (itemName in proto) {
        if (proto.hasOwnProperty(itemName)) {
            thisPrototype[itemName] = proto[itemName];
        }
    }
    itemName = undefined;

};


 WAF.openContainerInAPanel = function(divID, config)
 {
	var formdiv = $('#'+divID);
	var already = formdiv.attr("data-inPanel");
	if (already == "1")
	{
		if (formdiv.attr('type') == 'textarea') 
			formdiv = formdiv.parent();
		formdiv.dialog("open");
	}
	else
	{	
		formdiv.attr("data-inPanel", "1");

		var off = formdiv.offset();
		var h = formdiv.height();
		var w = formdiv.width();
		
		formdiv.css('position', 'relative');
		formdiv.css('top','0px');
		formdiv.css('left','0px');

		if (formdiv.attr('type') == 'textarea') 	
		{
			formdiv.wrap('<div></div>');
			formdiv.css('width', '100%');
			formdiv.css('height', '100%');
			formdiv = formdiv.parent();
			formdiv.css('position', 'relative');
			formdiv.css('top','0px');
			formdiv.css('left','0px');
		}
		var title = config.title;
		if (title == null)
			title = "";
		formdiv.dialog({ 
			dialogClass: 'waf-container-panel '+formdiv.attr('class'),
			title: title,
			position: [off.left, off.top],
			width: w,
			height:h
		});
		
	}
}

