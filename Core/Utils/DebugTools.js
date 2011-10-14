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
/**
 * @module Utils
 **/


/**
 * The Debug module is part of the Core and Utils composite modules and implements various functions for debugging purposes.
 *  
 * @class			WAF.utils.debug
 */
WAF.utils.debug = {

    /**
     * console
     *
     * @class			WAF.utils.debug.console
     */
	console		: {
        
        /**
         * log the message to the console of the browser is the debugMode is set to true
         *
         * @static
         * @method log
         * @param {String} string
         **/
		log: function(string){
			if (WAF.config.debugMode) {
				if (typeof console  != "undefined") {
					if (console.log) {
						console.log(string);
					}
				}
			}
		},
        
        /**
         * show the object in the console of the browser is the debugMode is set to true
         *
         * @static
         * @method dir
         * @param {String} object
         **/
		dir: function(object){
			if (WAF.config.debugMode) {
				if (typeof console != "undefined") {
					if (console.dir) {
						console.dir(object);
					}
				}
			}
		}
	}
};