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
 * Style of the Tag
 * @namespace WAF.tags.descriptor
 * @class Style
 * @params {Object} config parameters
 */
WAF.tags.descriptor.Style = function(config) {
    config = config || {};

    config.name         = config.name         || '';
    config.defaultValue = config.defaultValue || '';

    // properties inherited from config
    this._name = config.name;
    this._defaultValue = config.defaultValue;

};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.Style
 * @method getDefaultValue
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Style.prototype.getDefaultValue = function () {
    return this._defaultValue;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.Style
 * @method getName
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Style.prototype.getName = function () {
    return this._name;
};