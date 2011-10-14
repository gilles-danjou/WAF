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
 * @module			Native
 */

/* JSLint Declarations */

/*global WAF*/


/**
 * The Event class is used throughout the framework as prototype for the event objects passed as parameters to handlers.
 *
 * @class WAF.classes.Event
 * 
 * @constructor
 */

WAF.classes.Event = function () {
	
    /**
     * name of the event
     *
     * @property type
     * @type String
     **/ 
	this.type = null;

    /**
     * error
     *
     * @property error
     * @type Array
     **/ 
	this.error = [];
	
    /**
     * token
     *
     * @property token
     * @type Object|Null
     **/ 
	this.token = null;

    /**
     * stack
     *
     * @property stack
     * @type Object|Null
     **/ 
	this.stack = null;

    /**
     * rawResult
     *
     * @property rawResult
     * @type Object|Null
     **/ 
	this.rawResult = null;

    /**
     * result
     *
     * @property result
     * @type Object|Null
     **/ 
	this.result = null;

    /**
     * httpRequest
     *
     * @property httpRequest
     * @type Object|Null
     **/ 
	this.httpRequest = null;

    /**
     * fromCache
     *
     * @property fromCache
     * @type Boolean
     **/ 
	this.fromCache = false;
};
