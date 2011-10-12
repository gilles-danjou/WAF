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
WAF.addWidget({
    
    /**
    *  Widget Descriptor
    *
    */ 
    
    /* PROPERTIES */

    // {String} internal name of the widget
    type        : 'template',  

    // {String} library used ('waf', 'jquery', 'extjs', 'yui') (optional)
    lib         : 'WAF',

    // {String} display name of the widget in the GUI Designer 
    description : 'Template',

    // {String} category in which the widget is displayed in the GUI Designer
    category    : '',

    // {String} image of the tag to display in the GUI Designer (optional)
    img         : '/walib/WAF/widget/template/icons/widget-template.png', 

    // {Array} css file needed by widget (optional)
    css         : [],                                                     

    // {Array} script files needed by widget (optional) 
    include     : [],                 

    // {String} type of the html tag ('div' by default)
    tag         : 'div',                               

    // {Array} attributes of the widget. By default, we have 3 attributes: 'data-type', 'data-lib', and 'id', so it is unnecessary to add them
    // 
    // @property {String} name, name of the attribute (mandatory)     
    // @property {String} description, description of the attribute (optional)
    // @property {String} defaultValue, default value of the attribute (optional)
    // @property {'string'|'radio'|'checkbox'|'textarea'|'dropdown'|'integer'} type, type of the field to show in the GUI Designer (optional)
    // @property {Array} options, list of values to choose for the field shown in the GUI Designer (optional)
    attributes  : [                                                       
    {
        name        : '',                                                 
        description : '',                                                 
        defaultValue: '',                                                 
        type        : '',                                                 
        options     : []                                                  
    }    
    ],

    // {Array} default height and width of the container for the widget in the GUI Designer
    // 
    // @property {String} name, name of the attribute 
    // @property {String} defaultValue, default value of the attribute  
    style: [                                                                     
    {
        name        : 'width',
        defaultValue: '200px'
    },
    {
        name        : 'height',
        defaultValue: '200px'
    }],

    // {Array} events ot the widget
    // 
    // @property {String} name, internal name of the event (mandatory)     
    // @property {String} description, display name of the event in the GUI Designer
    // @property {String} category, category in which the event is displayed in the GUI Designer (optional)
    events: [                                                              
    {
        name       : 'click',
        description: 'On Click',
        category   : 'Mouse Events'
    },
    {
        name       : 'dblclick',
        description: 'On Double Click',
        category   : 'Mouse Events'
    },
    {
        name       : 'mousedown',
        description: 'On Mouse Down',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseout',
        description: 'On Mouse Out',
        category   : 'Mouse Events'
    },
    {
        name        : 'mouseover',
        description: 'On Mouse Over',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseup',
        description: 'On Mouse Up',
        category   : 'Mouse Events'
    }],

    // {JSON} panel properties widget
    //
    // @property {Object} enable style settings in the Styles panel in the Properties area in the GUI Designer
    properties: {
        style: {                                                
            theme       : false,                 // false to not display the "Theme" option in the "Theme & Class" section

            //    theme : {
            //    	roundy: false		//all the default themes are displayed by default. Pass an array with the
            //   }				//themes to hide ('default', 'inherited', roundy, metal, light)
        
            fClass      : true,                 // true to display the "Class" option in the "Theme & Class" section
            text        : true,                 // true to display the "Text" section
            background  : true,                 // true to display widget "Background" section
            border      : true,                 // true to display widget "Border" section
            sizePosition: true,                 // true to display widget "Size and Position" section
            label       : true,                 // true to display widget "Label Text" and "Label Size and Position" sections
            // For these two sections, you must also define the "data-label" in the Attributes array
            disabled     : ['border-radius']     // list of styles settings to disable for this widget
        }
    },

    // (optional area)
    // 
    // {Array} list of sub elements for the widget
    // 
    // @property {String} label of the sub element
    // @property {String} css selector of the sub element
    structure: [{
        description : 'Description',
        selector    : '.subElement',
        style: {
            background  : true, //define which elements in the Styles tab you want to display
            gradient    : true,
            border      : true
        }
    }],

    /* METHODS */

    /*
    * function to call when the widget is loaded by WAF during runtime
    * 
    * @param {Object} config contains all the attributes of the widget  
    * @result {WAF.widget.Template} the widget
    */
    onInit: function (config) {                                
        var widget = new WAF.widget.Template(config);       
        return widget;
    },

    /**
    * function to call when the widget is displayed in the GUI Designer
    * 
    * @param {Object} config contains all the attributes for the widget
    * @param {Designer.api} set of functions used to be managed by the GUI Designer
    * @param {Designer.tag.Tag} container of the widget in the GUI Designer
    * @param {Object} catalog of dataClasses defined for the widget
    * @param {Boolean} isResize is a resize call for the widget (not currently available for custom widgets)
    */
    onDesign: function (config, designer, tag, catalog, isResize) {
        var widget = new WAF.widget.Template(config);               
    }                                                               
    
});                                                                                                                                  