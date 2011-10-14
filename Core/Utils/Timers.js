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

/**
 * @module Utils
 */

/**
 * The Timers module is part of the Core and Utils composite
 * modules and implements 2 functions to time code execution.
 *
 * @class WAF.utils.timer
 */

// Old global "private" container for timers
WAF._private.globals.timers = [];

(function (timers) {

    /**
     * This private variable stores starting date of each timers
     *
     * @private
     * @property timers
     * @type Array
     */
    timers = timers || [];

    WAF.utils.timer = {

        /**
         * Start a timer identified by an id parameter
         * 
         * @static
         * @method start
         * @param {String|Number} id Required.
         */
        start : function (id) {
            if (timers[id] !== undefined) {
                timers[id].start = new Date().getTime();
            } else {
                timers[id] = {
                    start   : new Date().getTime(),
                    duration: null
                };
            }
        },

        /**
         * Get the time spent since a timer was started with this id
         * 
         * @static
         * @method getValue
         * @param {String|Number} id Required.
         * @return {Number|Null}
         */
        getValue : function (id) {
            if (timers[id] !== undefined) {
                return new Date().getTime() - timers[id].start;
            } else {
                return null;
            }
        }
    };

}(WAF._private.globals.timers));