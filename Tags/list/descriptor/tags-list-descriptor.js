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
 * Tag Descriptor List Management
 * @namespace WAF.tags.list
 * @class Descriptor
 */
WAF.tags.list.Descriptor = function () {
    this._list = [];
}

/**
 * Add a tag descriptor in the list
 * @namespace WAF.tags.list.Descriptor
 * @method add
 * @param {WAF.tags.Descriptor} tag tag descriptor
 */
WAF.tags.list.Descriptor.prototype.add = function (tag) {
    this._list.push(tag);
};

/**
 * Get the number of tag definition in the catalog
 * @namespace WAF.tags.list.Descriptor
 * @method count
 * @return {Integer} number of element
 */
WAF.tags.list.Descriptor.prototype.count = function () {
    return this._list.length;
};

/**
 * Get a tag definition by its position
 * @namespace WAF.tags.list.Descriptor
 * @method get
 * @param {Integer} position position of the tag
 */
WAF.tags.list.Descriptor.prototype.get = function (position) {
    var result = null;

    if (position < this.count()) {
        result = this._list[position];
    }

    return result;
};

/**
 * Get a tag definition by its position
 * @namespace WAF.tags.list.Descriptor
 * @method get
 * @param {String} type type of the tag
 */
WAF.tags.list.Descriptor.prototype.getByType = function (type) {
    var i = 0,
    result = null,
    desc = null,
    length = 0;

    length = this.count();

    for (i = 0; i < length; i++) {
        desc = this.get(i);
        if (desc.getType() == type) {
            result = desc;
            break;
        }
    }
    return result;
};