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
 * API for management of the HTML / JSON document
 *
 * @author			erwan carriou
 * @date			january 2010
 * @version			0.2
 * @module WAF.dom
 * @example

var mydocument = new WAF.dom.HTMLDocument({
    "document":[{
        "nodeType":10,
        "name":"html"
    },{
        "nodeType":1,
        "nodeName":"html",
        "childNodes":[{
            "nodeType":3,
            "nodeValue":"\n\n"
        },{
            "nodeType":1,
            "nodeName":"head",
            "childNodes":[{
                "nodeType":3,
                "nodeValue":"\n\n"
            },{
                "nodeType":1,
                "nodeName":"title",
                "childNodes":[{
                    "nodeType":3,
                    "nodeValue":"dddfff"
                }]
                },{
                "nodeType":3,
                "nodeValue":"\n\n"
            },{
                "nodeType":1,
                "nodeName":"meta",
                "attributes":{
                    "http-equiv":"Content-Type",
                    "content":"text/html; charset=UTF-8"
                }
            },{
            "nodeType":3,
            "nodeValue":"\n\n"
        },{
            "nodeType":1,
            "nodeName":"meta",
            "attributes":{
                "name":"generator",
                "content":"Wakanda GUIDesigner"
            }
        },{
        "nodeType":3,
        "nodeValue":"\n\n"
    },{
        "nodeType":1,
        "nodeName":"meta",
        "attributes":{
            "http-equiv":"X-UA-Compatible",
            "content":"IE=Edge"
        }
    },{
    "nodeType":3,
    "nodeValue":"\n\n"
},{
    "nodeType":1,
    "nodeName":"meta",
    "attributes":{
        "id":"waf-interface-css",
        "name":"WAF.config.loadCSS",
        "content":"styles/dddfff.css"
    }
},{
    "nodeType":3,
    "nodeValue":"\n"
}]
},{
    "nodeType":3,
    "nodeValue":"\n\n"
},{
    "nodeType":1,
    "nodeName":"body",
    "childNodes":[{
        "nodeType":3,
        "nodeValue":"\n\n"
    }],
    "attributes":{
        "id":"waf-body",
        "data-type":"document",
        "data-lib":"WAF",
        "data-theme":"metal",
        "data-rpc-activate":"false",
        "data-rpc-namespace":"rpc",
        "data-rpc-validation":"false",
        "style":""
    }
},{
    "nodeType":3,
    "nodeValue":"\n\n"
}]
}]
});


var tabScript = mydocument.getElementsByTagName('script');

if (tabScript.length === 0) {
    var script = mydocument.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'waLib/WAF/Loader.js');

    mydocument.body.appendChild(script);
};

 */


if (typeof WAF === 'undefined') {
    WAF = {};
}

if (typeof WAF.dom === 'undefined') {
    WAF.dom = {};
}

/**
 * Document
 * @namespace WAF.dom
 * @class HTMLDocument
 * @param {JSON} json json structure of the HTML Document
 */
WAF.dom.Document = function (json) {

    /**
     * structure of the current document
     * @namespace WAF.dom.HTMLDocument
     * @property _json
     */
    this._json = {};

    // init
    this._json = json;

};

/**
 * add a node
 * @namespace WAF.dom.Document
 * @method appendChild
 * @param {Node} parentNode node in which to add the new element
 * @param {WAF.dom.Element} childNode node to add
 * @return {WAF.dom.Element} references to the new node
 */
WAF.dom.Document.prototype.appendChild = function (parentNode, childNode) {
    if (parentNode._json.childNodes) {
        parentNode._json.childNodes.push(childNode._json);
    } else {
        parentNode._json.childNodes = [];
        parentNode._json.childNodes.push(childNode._json);
    }

    childNode.parenNode = parentNode._json;
    childNode._position = parentNode._json.childNodes.length - 1;

    return childNode;
};

/**
 * create a CDATA section
 * @namespace WAF.dom.Document
 * @method createCDATASection
 * @param {String} data data
 * @return {Object} the text node
 */
WAF.dom.Document.prototype.createCDATASection = function (data) {
    var node = new WAF.dom.Node();
    node._json['nodeType'] = 4;
    node._json['nodeValue'] = data;

    node.nodeType = 4;
    node.wholeText = data;

    node._document = this;

    return node;
};

/**
 * create a comment
 * @namespace WAF.dom.Document
 * @method createComment
 * @param {String} comment comment
 * @return {Object} the text node
 */
WAF.dom.Document.prototype.createComment = function (comment) {
    var node = new WAF.dom.Node();
    node._json['nodeType'] = 8;
    node._json['nodeValue'] = comment;

    node.nodeType = 8;
    node.nodeValue = comment;

    node._document = this;

    return node;
};

/**
 * create an element
 * @namespace WAF.dom.Document
 * @method createElement
 * @param {String} name name of the element
 * @return {Element} the new element
 */
WAF.dom.Document.prototype.createElement = function (name) {
    var element = new WAF.dom.Element(name);
    element._document = this;
    return element;
};

/**
 * create a processin instruction
 * @namespace WAF.dom.Document
 * @method createProcessingInstruction
 * @param {String} target target
 * @param {String} data data
 * @return {Object} the text node
 */
WAF.dom.Document.prototype.createProcessingInstruction = function (target, data) {
    var node = new WAF.dom.Node();
    node._json['nodeType'] = 7;
    node._json['target'] = target;
    node._json['data'] = data;

    node.nodeType = 7;
    node.target = target;
    node.data = data;

    node._document = this;

    return node;
};

/**
 * create a text node
 * @namespace WAF.dom.Document
 * @method createTextNode
 * @param {String} text text
 * @return {Object} the text node
 */
WAF.dom.Document.prototype.createTextNode = function (text) {
    var node = new WAF.dom.Node();
    node._json['nodeType'] = 3;
    node._json['nodeValue'] = text;

    node.nodeType = 3;
    node.nodeValue = text;

    node._document = this;

    return node;
};

/**
 * search for a node
 * @namespace WAF.dom.Document
 * @method getElementsByAttribute
 * @param {String} name type of the element
 * @param {String} attribute attribute of the element
 * @param {String} value attribute of the element
 * @return {Array} array of Element
 */
WAF.dom.Document.prototype.getElementsByAttribute = function (name, attribute, value) {
    var length = this._json.document.length,
    attributeName = '',
    i = 0,
    result = [],
    that = this;

    /**
     * @private
     */
    function searchLoop (nodeParent, node, position, name, attribute, value) {
        var j = 0,
        element = {};
        if (node && node.nodeName) {
            if (node.nodeName === name || name === '*') {
                if (attribute) {
                    if (node.attributes) {
                        for(attributeName in node.attributes) {
                            if (attributeName === attribute) {
                                if (value) {                                         
                                    if (
                                        (typeof value == 'string' && node.attributes[attributeName] === value) ||
                                        (value instanceof RegExp && node.attributes[attributeName].search(value) != -1)
                                        ) {
                                        element = that.createElement();
                                        element.parentNode = that.createElement();
                                        element.parentNode._json = nodeParent;
                                        element._json = node;
                                        element._position = position;

                                        result.push(element);
                                    }
                                } else {
                                    element = that.createElement();
                                    element.parentNode = that.createElement();
                                    element.parentNode._json = nodeParent;
                                    element._json = node;
                                    element._position = position;

                                    result.push(element);
                                }
                            }
                        }
                    }
                } else {
                    element = that.createElement();
                    element.parentNode = that.createElement();
                    element.parentNode._json = nodeParent;
                    element._json = node;
                    element._position = position;

                    result.push(element);
                }
            }
        }
        if (node && node.childNodes && node.childNodes.length) {
            for (j = 0; j < node.childNodes.length; j++) {
                searchLoop(node, node.childNodes[j], j, name, attribute, value);
            }
        }
    }

    for (i = 0; i < length; i++) {
        searchLoop(this._json.document, this._json.document[i], i, name, attribute, value);
    }

    return result;
};

/**
 * search for a node by its tag name
 * @namespace WAF.dom.Document
 * @method getElementsByTagName
 * @param {String} tagName type of the element
 * @return {Array} array of Element
 */
WAF.dom.Document.prototype.getElementsByTagName = function(tagName) {
    return this.getElementsByAttribute(tagName);
};

/**
 * remove a node
 * @namespace WAF.dom.Document
 * @method removeNode
 * @param {String} name type of the element
 * @param {Array} attribute attribute of the element
 * @param {Array} value attribute of the element
 */
WAF.dom.Document.prototype.removeNode = function (name, attribute, value) {
    var tabResult = this.getElementsByAttribute(name, attribute, value),
    length = tabResult.length,
    node = {},
    position = -1,
    i = 0;

    for (i = 0; i < this.getElementsByAttribute(name, attribute, value).length; i++) {
        node = this.getElementsByAttribute(name, attribute, value)[i].parentNode || {};
        position = this.getElementsByAttribute(name, attribute, value)[i]._position || -1;
        if (node._json && node._json.childNodes) {
            node._json.childNodes = node._json.childNodes.slice(0, position).concat(node._json.childNodes.slice(position + 2));
        }
    }
}

/**
 * Node
 * @namespace WAF.dom
 * @class Node
 */
WAF.dom.Node = function () {

    // {Element} parentNode parent element
    this.parentNode = null;
    // {integer} _position position of the element in the child list of the parent
    this._position = -1;
    // {JSON} _json structure representation of the element
    this._json = {};
    // {JSON} _document document
    this._document = {};

}

/**
 * clone the node
 * @namespace WAF.dom.Node
 * @method cloneNode
 * @return {WAF.dom.Node}
 */
WAF.dom.Node.prototype.cloneNode = function () {
    var clone = {},
    property = '';

    for (property in this) {
        // copy
        clone[property] = this[property];
    }
    return clone;
}

/**
 * Append an element to the current element at the first child place
 * @namespace WAF.dom.Node
 * @method insertAfter
 * @param {Element} newElement element to insert
 * @param {Element} referenceElement element where to insert the newElement before
 */
WAF.dom.Node.prototype.insertAfter = function (newElement, referenceElement) {
    this._json.childNodes.splice(referenceElement._position + 1, 0, newElement._json);
    newElement.parentNode = this;
    newElement._position = referenceElement._position + 1;
};

/**
 * Append an element to the current element at the first child place
 * @namespace WAF.dom.Node
 * @method insertAt
 * @param {Integer} position position of the element
 * @param {Element} newElement element to insert
 */
WAF.dom.Node.prototype.insertAt = function (position, newElement) {
    this._json.childNodes.splice(position, 0, newElement._json);
    newElement.parentNode = this;
    newElement._position = position;
};

/**
 * Append an element to the current element at the first child place
 * @namespace WAF.dom.Node
 * @method insertBefore
 * @param {Element} newElement element to insert
 * @param {Element} referenceElement element where to insert the newElement before
 */
WAF.dom.Node.prototype.insertBefore = function (newElement, referenceElement) {
    this._json.childNodes.splice(referenceElement._position, 0, newElement._json);
    newElement.parentNode = this;
    newElement._position = referenceElement._position;
    referenceElement._position = referenceElement._position + 1;
};

/**
 * remove the current element
 * @namespace WAF.dom.Node
 * @method remove
 */
WAF.dom.Node.prototype.remove = function () {
    if (this.parentNode) {
        this.parentNode._json.childNodes = this.parentNode._json.childNodes.slice(0, this._position-1).concat(this.parentNode._json.childNodes.slice(this._position));
    }
}

/**
 * Element
 * @namespace WAF.dom
 * @class Element
 */
WAF.dom.Element = function (name) {

    // {Element} parentNode parent element
    this.parentNode = null;
    // {integer} _position position of the element in the child list of the parent
    this._position = -1;
    // {JSON} _json structure representation of the element
    this._json = {};
    // {JSON} _document document
    this._document = {};

    if (name) {
        this._json['nodeType'] = 1;
        this._json['nodeName'] = name;
        this.nodeType = 1;
        this.nodeName = 1;
    }

    // public properties
    this.tagName = this._json['nodeName'];

};

/**
 * append an element to the current element
 * @namespace WAF.dom.Element
 * @method appendChild
 * @param {Element} element to add to the current element
 */
WAF.dom.Element.prototype.appendChild = function (element) {
    element.parentNode = this;
    if (!this._json['childNodes']) {
        this._json['childNodes'] = [];
    }
    element._position = this._json['childNodes'].length;
    this._json['childNodes'].push(element._json);
};

/**
 * clone the node
 * @namespace WAF.dom.Element
 * @method cloneNode
 * @return {WAF.dom.Element}
 */
WAF.dom.Element.prototype.cloneNode = function () {
    var clone = {},
    property = '';

    for (property in this) {
        // copy
        clone[property] = this[property];
    }
    return clone;
};

/**
 * get the value of an attribute
 * @namespace WAF.dom.Element
 * @method getAttribute
 * @param {String} name name of the attribute
 * @return {String} value value of the attribute
 */
WAF.dom.Element.prototype.getAttribute = function (name) {
    var value = '';
    if (this._json['attributes']) {
        value = this._json['attributes'][name];
    }
    return value;
};

/**
 * get the list of attributes
 * @namespace WAF.dom.Element
 * @method getAttributes
 * @return {Array} array of attributes
 */
WAF.dom.Element.prototype.getAttributes = function () {
    var attributes = [];
    if (this._json['attributes']) {
        attributes = this._json['attributes'];
    }
    return attributes;
};

/**
 * get the list of attributes
 * @namespace WAF.dom.Element
 * @method getChildNodes
 * @return {Array} array of elements
 */
WAF.dom.Element.prototype.getChildNodes = function() {
    var element = {},
    length = {},
    i = 0,
    result = [];

    if (this._json.childNodes) {
        length = this._json.childNodes.length;
        for (i = 0; i < length; i++) {
            element = this._document.createElement();
            element.parentNode = this._document.createElement();
            element.parentNode._json = this._json;
            element._json = this._json.childNodes[i];
            element._position = i;
            element.tagName = element._json['nodeName'];
            result.push(element);
        }
    }

    return result;
}

/**
 * Append an element to the current element at the first child place
 * @namespace WAF.dom.Element
 * @method insertAfter
 * @param {Element} newElement element to insert
 * @param {Element} referenceElement element where to insert the newElement before
 */
WAF.dom.Element.prototype.insertAfter = function (newElement, referenceElement) {
    this._json.childNodes.splice(referenceElement._position + 1, 0, newElement._json);
    newElement.parentNode = this;
    newElement._position = referenceElement._position + 1;
};

/**
 * Append an element to the current element at the first child place
 * @namespace WAF.dom.Element
 * @method insertAt
 * @param {Integer} position position of the element
 * @param {Element} newElement element to insert
 */
WAF.dom.Element.prototype.insertAt = function (position, newElement) {
    this._json.childNodes.splice(position, 0, newElement._json);
    newElement.parentNode = this;
    newElement._position = position;
};

/**
 * Append an element to the current element at the first child place
 * @namespace WAF.dom.Element
 * @method insertBefore
 * @param {Element} newElement element to insert
 * @param {Element} referenceElement element where to insert the newElement before
 */
WAF.dom.Element.prototype.insertBefore = function (newElement, referenceElement) {
    this._json.childNodes.splice(referenceElement._position, 0, newElement._json);
    newElement.parentNode = this;
    newElement._position = referenceElement._position;
    referenceElement._position = referenceElement._position + 1;
};

/**
 * remove the current element
 * @namespace WAF.dom.Element
 * @method remove
 */
WAF.dom.Element.prototype.remove = function () {
    if (this.parentNode) {
        this.parentNode._json.childNodes = this.parentNode._json.childNodes.slice(0, this._position).concat(this.parentNode._json.childNodes.slice(this._position+1));
    }
};

/**
 * force remove the current element
 * @namespace WAF.dom.Element
 * @method remove
 */
WAF.dom.Element.prototype._forceRemove = function () {
    if (this.parentNode) {
        this.parentNode._json.childNodes[this._position] = null;
    }
}

/**
 * remove an attribute
 * @namespace WAF.dom.Element
 * @method setAttribute
 * @param {String} attributeName name of the attribute
 */
WAF.dom.Element.prototype.removeAttribute = function (attributeName) {
    var newAttributes = {},
    attribute = '';
    if (this._json['attributes']) {
        for (attribute in this._json['attributes']) {
            if (attributeName !== attribute) {
                newAttributes[attribute] = this._json['attributes'][attribute];
            }
        }

        this._json['attributes'] = newAttributes;
    }
};

/**
 * set the value of an attribute
 * @namespace WAF.dom.Element
 * @method setAttribute
 * @param {String} name name of the attribute
 * @param {String} value value of the attribute
 */
WAF.dom.Element.prototype.setAttribute = function (name, value) {
    if (this._json['attributes']) {
        this._json['attributes'][name] = value;
    } else {
        this._json['attributes'] = {};
        this._json['attributes'][name] = value;
    }
};

WAF.dom.HTMLDocument = function HTMLDocument (json) {

    /**
     * body representation of the document
     * @namespace WAF.dom.HTMLDocument
     * @property body
     */
    this.body = {};

    /**
     * head representation of the document
     * @namespace WAF.dom.HTMLDocument
     * @property head
     */
    this.head = {};

    /**
     * structure of the current document
     * @namespace WAF.dom.HTMLDocument
     * @property _json
     */
    this._json = {};

    // init
    this._json = json;

    // create head reference
    var tabHead = this.getElementsByTagName('head');
    if (tabHead.length > 0) {
        this.head = tabHead[0];
        this.body.tagName = 'head';
    }

    // create body reference
    var tabBody = this.getElementsByTagName('body');
    if (tabBody.length > 0) {
        this.body = tabBody[0];
        this.body.tagName = 'body';
    }

};

WAF.dom.HTMLDocument.prototype = new WAF.dom.Document();
WAF.dom.HTMLDocument.prototype.constructor = WAF.dom.HTMLDocument;