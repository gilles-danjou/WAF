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
 * Structure of the Tag
 * @namespace WAF.tags.descriptor
 * @class Structure
 * @params {Object} config parameters
 */
WAF.tags.descriptor.Structure = function(config) {
    config = config || {};

    config.description = config.description || '';
    config.selector    = config.selector    || '';
    config.style       = config.style       || {};
    config.state       = config.state       || {};

    // properties inherited from config
    this._description = config.description;
    this._selector    = config.selector;
    this._style       = config.style;
    this._states      = config.state;

};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.Structure
 * @method getDescription
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Structure.prototype.getDescription = function () {
    return this._description;
};

/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.Structure
 * @method getSelector
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Structure.prototype.getSelector = function () {
    return this._selector;
};

/**
 * Get the value a style of the current structure
 * @namespace WAF.tags.descriptor.Structure
 * @method getStyle
 * @param {String} styleName name of the style
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Structure.prototype.getStyle = function (styleName) {
    return this._style[styleName];
};;

/**
 * Get the states of the current structure
 * @namespace WAF.tags.descriptor.Structure
 * @method getState
 * @param {String} styleName name of the style
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Structure.prototype.getStates = function () {
    return this._states;
};

/**
 * Get all the name of style for the current structure
 * @namespace WAF.tags.descriptor.Structure
 * @method getStyles
 * @param
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Structure.prototype.getStyles = function () {
    var result = [],
    styleName = '';

    for (styleName in this._style) {
        result.push(styleName);
    }

    return result;
};