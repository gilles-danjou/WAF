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
 * Tag Property Descriptor Management
 * @namespace WAF.tags.list
 * @class PropertyDescriptor
 */
WAF.tags.list.PropertyDescriptor = function () {
    this._list = [];
    this._hash = {};
}

/**
 * Add an item (a descriptor of an attribute, event or style of a tag)
 * @namespace WAF.tags.list.PropertyDescriptor
 * @method add
 * @param {Object} item a tag descriptor attribute, event or style
 */
WAF.tags.list.PropertyDescriptor.prototype.add = function (item) {
    this._list.push(item);
    if (typeof item._name !== 'undefined') {
        this._hash[item._name] = item;
    }    
};

/**
 * Get the number of item in the catalog
 * @namespace WAF.tags.list.PropertyDescriptor
 * @method count
 * @return {Integer} number of item
 */
WAF.tags.list.PropertyDescriptor.prototype.count = function () {
    return this._list.length;
};

/**
 * 
 * @namespace WAF.tags.list.PropertyDescriptor
 * @method get
 * @param {Integer} position position of the item
 */
WAF.tags.list.PropertyDescriptor.prototype.get = function (position) {
    var result = null;

    if (position < this.count()) {
        result = this._list[position];
    }

    return result;
};

/**
 * Get a tag definition by its description
 * @namespace WAF.tags.list.PropertyDescriptor
 * @method getByDescription
 * @param {String} description description property to search
 */
WAF.tags.list.PropertyDescriptor.prototype.getByDescription = function (description) {
    var i = 0,
    result = null,
    desc = null,
    length = 0;

    length = this.count();

    for (i = 0; i < length; i++) {
        desc = this.get(i);
        if (desc.getDescription() == description) {
            result = desc;
            break;
        }
    }
    return result;
};

/**
 * Get a tag definition by its name
 * @namespace WAF.tags.list.PropertyDescriptor
 * @method getByName
 * @param {String} name name property to search
 */
WAF.tags.list.PropertyDescriptor.prototype.getByName = function (name) {
    return this._hash[name];
};

/**
 * Get a tag definition by its selector (for structure attribute)
 * @namespace WAF.tags.list.PropertyDescriptor
 * @method getBySelector
 * @param {String} selector selector to search
 */
WAF.tags.list.PropertyDescriptor.prototype.getBySelector = function (selector) {
    var i = 0,
    result = null,
    desc = null,
    length = 0;

    length = this.count();

    for (i = 0; i < length; i++) {
        desc = this.get(i);
        if (desc.getSelector() == selector) {
            result = desc;
            break;
        }
    }
    return result;
};

/**
 * Remove a property
 * @namespace WAF.tags.list.PropertyDescriptor
 * @method remove
 * @param {String} name name of the property to remove
 */
WAF.tags.list.PropertyDescriptor.prototype.remove = function (name) {
    var i = 0,
    position = -1,
    desc = null,
    length = 0;

    length = this.count();

    for (i = 0; i < length; i++) {
        desc = this.get(i);
        if (desc.getName() == name) {
            position = i;
            break;
        }
    }    
    
    if (position != -1) {
        this._list = this._list.slice(0, position).concat(this._list.slice(position+1));
    }
};