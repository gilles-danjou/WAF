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
 * Style properties of the Tag
 * @namespace WAF.tags.descriptor
 * @class PropertyStyle
 * @params {Object} config parameters
 */
WAF.tags.descriptor.PropertyStyle = function(config) {
    config = config || {};

    if (typeof config.fClass === 'undefined') {
        config.fClass = true;
    }
    if (typeof config.text === 'undefined') {
        config.text = true;
    }
    if (typeof config.background === 'undefined') {
        config.background = true;
    }
    if (typeof config.border === 'undefined') {
        config.border = true;
    }
    if (typeof config.sizePosition === 'undefined') {
        config.sizePosition = true;
    }
    if (typeof config.label === 'undefined') {
        config.label = true;
    }    

    // properties inherited from config

    /**
     * fClass
     * @private
     * @property fClass
     * @type Boolean
     * @default true
     */
    this._fClass = config.fClass;
    this._text = config.text;
    this._background = config.background;
    this._border = config.border;
    this._sizePosition = config.sizePosition;
    this._label = config.label;

};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.PropertyStyle
 * @method getFClass
 * @return {Boolean} the value of the attribute
 */
WAF.tags.descriptor.PropertyStyle.prototype.getFClass = function () {
    return this._fClass;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.PropertyStyle
 * @method getText
 * @return {Boolean} the value of the attribute
 */
WAF.tags.descriptor.PropertyStyle.prototype.getText = function () {
    return this._text;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.PropertyStyle
 * @method getBackground
 * @return {Boolean} the value of the attribute
 */
WAF.tags.descriptor.PropertyStyle.prototype.getBackground = function () {
    return this._background;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.PropertyStyle
 * @method getBorder
 * @return {Boolean} the value of the attribute
 */
WAF.tags.descriptor.PropertyStyle.prototype.getBorder = function () {
    return this._border;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.PropertyStyle
 * @method getSizePosition
 * @return {Boolean} the value of the attribute
 */
WAF.tags.descriptor.PropertyStyle.prototype.getSizePosition = function () {
    return this._sizePosition;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.PropertyStyle
 * @method getLabel
 * @return {Boolean} the value of the attribute
 */
WAF.tags.descriptor.PropertyStyle.prototype.getLabel = function () {
    return this._label;
};