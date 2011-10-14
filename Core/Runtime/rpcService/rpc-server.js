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
 * @brief			rpc-server.js
 * @details
 *
 *
 *
 * @author		        erwan carriou
 * @date			July 2009
 * @version			0.9
 *
 *
 * @bugs
 * - not possible to have the doRequest in a namespace
 */

/**
 * @namespace WAF
 */

if (typeof WAF === 'undefined') {
    WAF = {};
}
WAF.classes = WAF.classes || {};
WAF.classes.Rpc = WAF.classes.Rpc || {} ;
/***
 * root object
 */
WAF.root = this;

/* RPC static methods
 * @namespace WAF.rpc
 */
WAF.rpc = {

    serviceDescription : {},

    /**
     * Call a function
     * @namespace WAF.rpc
     * @method call
     * @param {String} functionName name of the function to call
     * @param {Array} args arguments to send to the function
     * @static
     */
    call : function (functionName, args) {
        var result = '',
        tabArgs = [];

        if (args.constructor === Array) {
            tabArgs = args;
        } else {
            tabArgs.push(args);
        }

        tabArgs.push(args);
        result = WAF.root[functionName].apply(this, tabArgs);
        return result;
    },

    /**
     * execute a function
     * @namespace WAF.rpc
     * @method execute
     * @param {String} parameters name of the function to call
     * @param {Array} args arguments to send to the function
     * @param {Array} body arguments to send to the function
     * @static
     */
    execute : function (parameters, args, body) {
        var temporaryFunction = {},
        result = "";

        parameters = parameters || [];
        args = args || {};
        body = body || "";

        temporaryFunction = new Function(parameters, body);

        if ((typeof args === 'object') && (args instanceof Array)) {
            result  = temporaryFunction.apply(this,args);
        } else {
            result  = temporaryFunction(args);
        }

        return result;
    },

    /**
     * Message Factory
     * @namespace WAF.rpc.MessageFactory
     */
    MessageFactory : {

        /**
         * Create a message
         * @namespace WAF.rpc
         * @method createMessage
         * @param {Object} params parameters
         * @static
         */
        createMessage : function (params) {
            params = params || {};

            // {String} type type of the message
            params.messageType = params.messageType || 'json';

            switch (params.messageType) {
                case 'json':
                    return new WAF.classes.Rpc.message.JsonMessage(params);
                case 'xml':
                    return new WAF.classes.Rpc.message.XmlMessage(params);
                default:
                    return new WAF.classes.Rpc.message.JsonMessage(params);
            }
        }
    }
};

/**
 * RPC Message
 * @namespace WAF.classes.Rpc.message
 */
WAF.classes.Rpc.message = {

    /**
     * XML message Object
     * @namespace WAF.classes.Rpc.message
     * @class XmlMessage
     * @param {Object} config parameters
     */
    XmlMessage : function (config) {
    // TO IMPLEMENTS
    },

    /**
     * JSON message
     * @namespace WAF.classes.Rpc.message
     * @class JsonMessage
     * @param {Object} config parameters
     */
    JsonMessage : function (config) {
        var message = {};

        // config
        config = config || {};

        // {String} version version of the json-rpc to use
        config.version = config.version || '2.0';

        // {Integer} id id of the request
        config.id = config.id || -1;

        // {Object} result result to send
        if (typeof config.result === undefined) {
            config.result = '';
        }

        // {Integer} errorCode code of the error
        config.errorCode = config.errorCode || null;

        // {String} errorMessage message of the error
        config.errorMessage = config.errorMessage || null;

        // {String} errorInfo additional message about the error
        config.errorInfo = config.errorInfo || null;

        if (config.errorCode !== null) {
            if (config.errorInfo) {
                message = {
                    'jsonrpc' : config.version,
                    'id'      : config.id,
                    'error'   : {
                        'code'    : config.errorCode,
                        'message' : config.errorMessage,
                        'data'    : config.errorInfo
                    }
                };
            } else {
                message = {
                    'jsonrpc' : config.version,
                    'id'      : config.id,
                    'error'   : {
                        'code'   : config.errorCode,
                        'message': config.errorMessage
                    }
                }
            }
        } else {
            message = {
                'jsonrpc': config.version,
                'result' : config.result,
                'id'     : config.id
            };
        }

        return message;
    }
};

/**
 * Get the catalogue
 * @method getCatalog
 * @param {Object} params parameters
 * @return {Object} signature of the methods
 */
function getCatalog(params) {
    var signature = '',
    oSignature = {},
    tabParam = [],
    paramName = '',
    functionName = '',
    hasDescription = false,
    i = 0;

    signature = application.rpcService.getCatalog();  // SWIAC Edouard/sc 02/03/2010
    oSignature = JSON.parse(signature);

    // get Params
    tabParam = params instanceof Array ?  (params[0] instanceof Array ? params[0] : params) : [];

    if (tabParam.length > 0) {
        for (functionName in oSignature)  {
            if (typeof(oSignature[functionName]) !== 'string') {
                hasDescription = false;
                for (i = 0; i < tabParam.length; i += 1) {
                    paramName = tabParam[i];
                    if (paramName === functionName) {
                        hasDescription = true;
                        break;
                    }
                }
                if (!hasDescription) {
                    delete oSignature[functionName];
                }

            }
        }
    }

    // cache the description
    WAF.rpc.serviceDescription = oSignature;

    return JSON.stringify(oSignature);
}

/**
 * Get the request
 * @method doRequest
 * @param request the request send to the server
 * @param response the response
 */
function doRequest(request, response) {
    var	message = '',
    jsonObj = {},
    result = null,
    errorCode = null,
    version = '2.0',
    errorMessage = null,
    errorInfo = null,
    type = null;

    /**
     * Get the type of the request
     * @method getType
     * @param contentType the request send to the server
     * @return {String} type of the request
     */
    function getType(contentType) {
        var type = 'text/plain';
        if (contentType.indexOf("json")) {
            type = 'json';
        } else {
            if (contentType.indexOf("xml")) {
                type = 'xml';
            }
        }
        return type;
    }

    /**
     * Get the full type of the request
     * @method getFullType
     * @param contentType the request send to the server
     * @return {String} full type of the request
     */
    function getFullType(contentType) {
        var type = 'text/plain';
        if (contentType.indexOf("json")) {
            type = 'application/json-rpc';
        } else {
            if (contentType.indexOf("xml")) {
                type = 'application/xml';
            }
        }
        return type;
    }

    /**
     * Check the return type
     * @method checkReturnType
     * @param functionName the function name
     * @param returnValue the result of the function name
     */
    function checkReturnType(functionName, returnValue) {
        var description = null;

        getCatalog();
        description = WAF.rpc.serviceDescription[functionName];
        if (description) {
            if ((typeof returnValue !== description.returns) && (typeof description.returns !== 'undefined')) {
                errorCode = -32602;
                errorMessage = 'invalid return type (' + typeof returnValue + ' instead of ' + description.returns + ')';
                response.statusCode = 500;
            }
        }
    }

    try {
        jsonObj = JSON.parse(request.body);
	
        if (((typeof jsonObj.id === "object") && (jsonObj.id !== null)) || (typeof jsonObj.id === "function")) {
            errorCode = -32600;
            errorMessage = 'invalid request id type (' + typeof jsonObj.id + ' instead of number, string, boolean or undefined)';
            response.statusCode = 400;
        } else if (jsonObj.method.keys) {
            result = WAF.rpc.execute(jsonObj.method.keys, jsonObj.params, jsonObj.method.source);
            version = jsonObj.jsonrpc;
        } else {
            if (WAF.root[jsonObj.method] !== undefined) {
                result = WAF.rpc.call(jsonObj.method, jsonObj.params || []);
                version = jsonObj.jsonrpc;
            } else {
                errorCode = -32601;
                errorMessage = 'method ' + jsonObj.method + ' not found';
                response.statusCode = 500;
            }
        }

    } catch (error) {
        errorInfo = JSON.stringify(error);
        if (error instanceof RangeError) {
            errorCode = -32602;
            errorMessage = 'Invalid params';
            response.statusCode = 500;
        } else {
            errorCode = -32603;
            errorMessage = 'Internal error while handling ' + request.body;
            response.statusCode = 500;
        }
    }


    //checkReturnType(jsonObj.method, result);

    type = getType(request.headers['Content-Type']);

    message = WAF.rpc.MessageFactory.createMessage({
        'messageType'  : type,
        'version'      : version,
        'id'           : jsonObj.id,
        'result'       : result,
        'errorCode'    : errorCode,
        'errorMessage' : errorMessage,
        'errorInfo'    : errorInfo
    });

    response.headers['Content-Type'] = getFullType(request.headers['Content-Type']);

    message = JSON.stringify(message);
    return message;
}