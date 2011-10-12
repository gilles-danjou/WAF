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
     * TODO: Write a description of this WAF widget
     *
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    '', // TODO: set the widget constructor name in CamelCase (ex: "DataGrid")
    
                
    {
    // Shared private properties and methods
    // NOTE: "this" is NOT available in this context to access the current to widget instance
    // These methods and properties are available from the constrctor through "shared"

    // /**
    //  * A Private shared Method
    //  *
    //  * @/private
    //  * @/shared
    //  * @/method privateSharedMethod
    //  * @/param {String} inWidget
    //  **/
    // privateSharedMethod: function privateSharedMethod(inWidget) {
    //    can work on the widget instance through inWidget
    // }
        
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
     * @default TODO: set to the name to this class (ex: WAF.widget.DataGrid)
     **/
    function WAFWidget(config, data, shared) {

        // PUT THE CODE OF THE WIDGET HERE

        // /**
        //  * A Private property
        //  *
        //  * @/private
        //  * @/property privateProperty
        //  **/
        // var privateProperty
               
        // /**
        //  * A Private Method
        //  *
        //  * @/private
        //  * @/method privateMethod
        //  **/
        // function privateMethod() {
        //    can work on the widget instance through inWidget
        // }

       
        /* Example of use of a private shared method: */
        
        // result = shared.privateSharedMethod(this);


        /* Example of use of a public shared method (from the prototype of the constructor): */
        
        // result = this.publicSharedMethod();
        
        var eventHandlerFunction = function(event)
        {
            var widget = event.data.widget;
            var source = event.dataSource;
            
            // PUT THE CODE TO EXECUTE WHEN THE EVENT HAPPENS HERE
        }

        if ('source' in this) {
            this.source.addListener("attributeChange", eventHandlerFunction, {
                attributeName: this.att.name
                }, {
                widget:this
            });
        /*
            this.source.subscribe(
                {
                    widget: this,
                    id: this.id,
                    eventKind: 'attributeChange', // event to listen
                    attributeName: this.att.name,
                    notify: function notify(inNotifyEvent) {
                    
                            // PUT THE CODE TO EXECUTE WHEN THE EVENT HAPPENS HERE
                            
                    }
                }
            );
	*/
        }

    },
    
                
    {
    // [Prototype]
    // The public shared properties and methods inherited by all the instances
    // NOTE: "this" is available in this context
    // These methods and properties are available from the constructor through "this" 
    // NOTE 2: private properties and methods are not available in this context


    // /**
    //  * A Public shared Property
    //  *
    //  * @/shared
    //  * @/property publicSharedProperty
    //  **/
    // publicSharedProperty: 12,


    // /**
    //  * A Public shared Method
    //  *
    //  * @/shared
    //  * @/method publicSharedMethod
    //  **/
    // publicSharedMethod: function publicSharedMethod() {
    //    can work on the widget instance through "this"
    // }        
    }

    );
