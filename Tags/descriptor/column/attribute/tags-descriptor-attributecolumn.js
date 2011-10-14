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
 * Attribute of Tag Descriptor
 * @namespace WAF.tags.descriptor
 * @class AttributeColumn
 * @params {Object} config parameters
 */
WAF.tags.descriptor.AttributeColumn = function(config) {
    config = config || {};

    config.name             = config.name         || '';
    config.defaultValue     = config.defaultValue || '';

    // properties inherited from config
    this._name              = config.name;
    this._defaultValue      = config.defaultValue;

    // property
    this._value             = '';
    this._oldValue          = '';
    
    // defaultValue
    this._value = this._defaultValue;
};


// GETTER


/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.AttributeColumn
 * @method getName
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.AttributeColumn.prototype.getName = function () {
    return this._name;
};

/**
 * Get the value of the default value of the attribute
 * @namespace WAF.tags.descriptor.AttributeColumn
 * @method getDefaultValue
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.AttributeColumn.prototype.getDefaultValue = function () {
    return this._defaultValue;
};

/**
 * Get the value of the attribute
 * @namespace WAF.tags.descriptor.AttributeColumn
 * @method getValue
 * @return {String} value of the attribute
 */
WAF.tags.descriptor.AttributeColumn.prototype.getValue = function () {    
    return this._value;
};

/**
 * Get the old value of the attribute
 * @namespace WAF.tags.descriptor.AttributeColumn
 * @method getOldValue
 * @return {String} value of the attribute
 */
WAF.tags.descriptor.AttributeColumn.prototype.getOldValue = function () {    
    return this._oldValue;
};


// SETTER


/**
 * Set the value of the attribute
 * @namespace WAF.tags.descriptor.AttributeColumn
 * @method setValue
 * @param {String} value new value of the attribute
 */
WAF.tags.descriptor.AttributeColumn.prototype.setValue = function (value) {
    this._oldValue = this._value;
    this._value = value;
};