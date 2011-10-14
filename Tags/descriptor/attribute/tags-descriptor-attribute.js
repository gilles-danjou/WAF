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
 * @class Attribute
 * @params {Object} config parameters
 */
WAF.tags.descriptor.Attribute = function(config) {
    config = config || {};

    config.name             = config.name         || '';
    config.defaultValue     = config.defaultValue || '';
    config.typeValue        = config.typeValue    || '';
    config.description      = config.description  || '';
    config.tooltip          = config.tooltip      || '';
    config.type             = config.type         || '';
    config.options          = config.options      || '';
    config.tab              = config.tab          || '';
    if (typeof config.visibility === 'undefined') {
        config.visibility   = true;
    }
    if (typeof config.category === 'undefined') {
        config.category     = 0;
    }    

    // properties inherited from config
    this._name              = config.name;
    this._defaultValue      = config.defaultValue;
    this._description       = config.description;
    this._tooltip           = config.tooltip;
    this._type              = config.type;
    this._options           = config.options;
    this._category          = config.category;
    this._tab               = config.tab;
    this._typeValue         = config.typeValue;

    // property
    this._value             = '';
    this._oldValue          = '';
    this._descriptor        = {};
};


// GETTER


/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getName
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getName = function () {
    return this._name;
};

/**
 * Get the value of the default value of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getDefaultValue
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getDefaultValue = function () {
    return this._defaultValue;
};

/**
 * Get the type of the value of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getTypeValue
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getTypeValue = function () {
    return this._typeValue;
};

/**
 * Get the value of the description of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getDescription
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getDescription = function () {
    return this._description;
};

/**
 * Get the value of the desritor of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getDescriptor
 * @return {WAF.tags.Descriptor} the value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getDescriptor = function () {
    return this._descriptor;
};

/**
 * Get the value of the options of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getOptions
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getOptions = function () {
    var options = [];
    var i       = 0;

    if (this._options.length === 0) {
        for (i in this._options) {
            options.push(this._options[i]);
        }
    } else {
        options = this._options;
    }
    
    return options;
};

/**
 * Get the value of the tooltip of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getTooltip
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getTooltip = function () {
    return this._tooltip;
};

/**
 * Get the value of the type of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getType
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getType = function () {
    return this._type;
};

/**
 * Get the value of the type of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getVisibility
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getVisibility = function () {
    return this._visibility;
};

/**
 * Get the value of the type of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getCategory
 * @return {Integer} the value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getCategory = function () {
    return this._category;
};

/**
 * Get the tab where the attribute must be placed
 * @namespace WAF.tags.descriptor.Attribute
 * @method getTab
 * @return {String} name of the tab
 */
WAF.tags.descriptor.Attribute.prototype.getTab = function () {
    return this._tab;
};

/**
 * Get the value of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getValue
 * @return {String} value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getValue = function () {    
    return this._value;
};

/**
 * Get the old value of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getOldValue
 * @return {String} value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.getOldValue = function () {    
    return this._oldValue;
};


// SETTER


/**
 * Set the value of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method setValue
 * @param {String} value new value of the attribute
 */
WAF.tags.descriptor.Attribute.prototype.setValue = function (value) {        
    this._oldValue = this._value;
    this._value = value;
};

/**
 * Set the descriptor to link to the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method setDescriptor
 * @param {WAF.tags.Descriptor} descriptor descriptor to link
 */
WAF.tags.descriptor.Attribute.prototype.setDescriptor = function (descriptor) {
    this._descriptor = descriptor;
};


// PUBLIC METHODS


/**
 * Remove the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method remove
 */
WAF.tags.descriptor.Attribute.prototype.remove = function () {    
    this.getDescriptor()._attributes.remove(this.getName());    
};



