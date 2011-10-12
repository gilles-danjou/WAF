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
/**
 * Event of the Tag
 * @namespace WAF.tags.descriptor
 * @class Event
 * @params {Object} config parameters
 */
WAF.tags.descriptor.Event = function(config) {
    config = config || {};

    config.name        = config.name         || '';
    config.description = config.description  || '';
    config.handlername = config.handlername  || '';
    config.category = config.category        || '';

    // properties inherited from config
    this._name         = config.name;
    this._description  = config.description;
    this._category     = config.category;
    
    // value
    this._handlername  = config.handlername;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.Event
 * @method getDefaultValue
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Event.prototype.getName = function () {
    return this._name;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.Event
 * @method getDescription
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Event.prototype.getDescription = function () {
    return this._description;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.Event
 * @method getHandlerName
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Event.prototype.getHandlerName = function () {
    return this._handlername;
};

/**
 * Get the value of the category of the attribute
 * @namespace WAF.tags.descriptor.Event
 * @method getCategory
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Event.prototype.getCategory = function () {
    return this._category;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.Event
 * @method setHandlerName
 * @paramn {name} the name of the handler
 */
WAF.tags.descriptor.Event.prototype.setHandlerName = function (name) {
    this._handlername = name;
};