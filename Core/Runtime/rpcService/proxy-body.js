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
if (typeof WAF === 'undefined') {
    WAF = {};
}
if (typeof WAF.proxy === 'undefined') {
    WAF.proxy = {};
}
if (typeof WAF.rpc === 'undefined') {
    WAF.rpc = {};
}

WAF.proxy.HttpRequest = function (config) {
    var xmlHttpRequest = {},
    acceptType = '',
    contentType = '';
 
    config = config || {};
    if (typeof config !== 'object') {
        config = {};
    }
    config.url = config.url || '';
 
    if (config.isasync === undefined) {
        config.isasync = true;
    }
    if (config.ispost === undefined) {
        config.ispost = true;
    }
 
    config.messagetype = config.messagetype || 'text';
 
    this.init = function () {
        var httpRequest = {};
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType('text/javascript');
        }
        try {
            httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e1) {
            try {
                httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e2) {
            }
        }
        xmlHttpRequest = httpRequest;
        contentType = 'application/json-rpc; charset=utf-8';
        acceptType = 'application/json-rpc';
    };
 
    this.send = function (params) {
        var oResponse = {},
        method = 'POST',
        xhr = xmlHttpRequest;
 
        params = params || {};
        if (typeof params !== 'object') {
            params = {};
        }
 
        params.message = params.message || ' ';
        params.onsuccess = params.onsuccess || function () {};
        params.onerror = params.onerror || function () {};
 
        if (!config.ispost) {
            method = 'GET';
        }
 
        xhr.open(method, config.url, config.isasync);
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.setRequestHeader('Accept', acceptType);
        xhr.send(params.message);
 
        if (!config.isasync) {
            if (xhr.readyState === 4) {
                oResponse = xhr.responseText.replace(/^\s+|\s+$/g, '');
                if (oResponse !== null) {
                    try{
                        oResponse = JSON.parse(oResponse);
                    } catch (e) {
                        throw WAF.proxy.ErrorFactory.createError({
                            code    : '-32603',
                            message : e.data || e.message
                        });
                    }
                    if (oResponse.result !== undefined) {
                        return oResponse.result;
                    } else if (oResponse.error !== undefined) {
                        if (oResponse.error.data) {
                            throw WAF.proxy.ErrorFactory.createError({
                                code    : oResponse.error.code,
                                message : oResponse.error.message,
                                data    : oResponse.error.data
                            });
                        } else {
                            throw WAF.proxy.ErrorFactory.createError({
                                code    : oResponse.error.code,
                                message : oResponse.error.message
                            });
                        }
                    } else {
						return null;
					}
                } else {
                    return null;
                }
            }
        } else {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    oResponse = xhr.responseText.replace(/^\s+|\s+$/g, '');
                    if (oResponse !== null) {
                        try {
                            oResponse = JSON.parse(oResponse);
                        } catch (e) {
                            params.onerror(e);
                            return;
                        }
                        if (oResponse.result !== undefined) {
                            oResponse = oResponse.result;
                            params.onsuccess(oResponse);
                        } else {
                            if (oResponse.error) {
                                params.onerror(oResponse.error);
                            } else {
                                params.onerror(oResponse);
                            }
                        }
                    }
                }
            }
        }
    };
 
    this.abort = function () {
        xmlHttpRequest.abort();
    };
}
 
WAF.proxy.JsonMessage = function (config) {
    var tabArgs = [],
    i = 0,
    arg = '',
    args = {},
    message = {},
    argumentsLength = 0;
 
    config = config || {};
    if (typeof config !== 'object') {
        config = {};
    }
 
    config.name = config.name || '';
    config.arguments = config.arguments || {};
    config.parameters = config.parameters || [];
    config.body = config.body || '';
 
    function generateId() {
        var id = new Date();
        id = parseInt(Math.random() * id.getTime(), 10);
        return id;
    }
 
    if (config.arguments.length !== undefined) {
        argumentsLength = config.arguments.length;
        for (i = 0; i < argumentsLength; i += 1) {
            arg = config.arguments[i];
            tabArgs.push(arg);
        }
        args = tabArgs;
    } else {
        args = config.arguments;
    }
    if (config.body.length === 0) {
        message =  {
            jsonrpc : '2.0',
            id      : generateId(),
            method  : config.name,
            params  : args
        };
    }
    return message;
};
 
WAF.proxy.error = {
    MethodNotFoundError : function (config) {
        var error = {};
 
        config = config || {};
        if (typeof config !== 'object') {
            config = {};
        }
 
        config.message = config.message || '';
        config.data = config.data || '';
 
        if (config.data) {
            error =  {
                name        : 'MethodNotFoundError',
                message     : config.message,
                data : config.data
            };
        } else {
            error =  {
                name    : 'MethodNotFoundError',
                message : config.message
            };
        }
        return error;
    },
 
    ServerError : function (config) {
        var error = {};
 
        config = config || {};
        if (typeof config !== 'object') {
            config = {};
        }
 
        config.message = config.message || '';
        config.data = config.data || '';
 
        if (config.data) {
            error =  {
                name        : 'ServerError',
                message     : config.message,
                data : config.data
            };
        } else {
            error =  {
                name    : 'ServerError',
                message : config.message
            };
        }
        return error;
    },
 
    InvalidParamsError : function (config) {
        var error = {};
 
        config = config || {};
        if (typeof config !== 'object') {
            config = {};
        }
 
        config.message = config.message || '';
        config.data = config.data || '';
 
        if (config.data) {
            error =  {
                name        : 'InvalidParamsError',
                message     : config.message,
                data : config.data
            };
        } else {
            error =  {
                name    : 'InvalidParamsError',
                message : config.message
            };
        }
        return error;
    },
 
    InternalError : function (config) {
        var error;
        config = config || {};
        if (typeof config !== 'object') {
            config = {};
        }
 
        config.message = config.message || '';
        config.data = config.data || '';
 
        if (config.data) {
            error =  {
                name        : 'InternalError',
                message     : config.message,
                data : config.data
            };
        } else {
            error =  {
                name    : 'InternalError',
                message : config.message
            };
        }
        return error;
    }
};
 
WAF.proxy.ErrorFactory = {
    createError : function (params) {
        var error = WAF.proxy.error;
 
        params = params || {};
        if (typeof params !== 'object') {
            params = {};
        }
        params.code = params.code || '-1';
 
        switch (params.code) {
            case '-32700':
                return new error.MethodNotFoundError(params);
            case '-32602':
                return new error.InvalidParamsError(params);
            case '-32603':
                return new error.InternalError(params);
            default:
                return new error.ServerError(params);
        }
    }
};

WAF.proxy.ProxyFactory = {

    createSyncFunc : function(name) {
        return function() {
            var result = '',
            message = {},
            request = {},
            i = 0;

            request = new WAF.proxy.HttpRequest ({
                url         : WAF.proxy.rpcService,
                isasync     : false
            });
            request.init();
            message = new WAF.proxy.JsonMessage ({
                name        : name,
                arguments   : arguments
            });
            message = JSON.stringify(message);
            result = request.send({
                'message' : message
            });
            if (result !== undefined) {
                if (result !== null && result.error !== undefined) {
                    if (result.error.data) {
                        throw WAF.proxy.ErrorFactory.createError({
                            code    : result.error.code,
                            message : result.error.message,
                            data    : result.error.data
                        });
                    } else {
                        throw WAF.proxy.ErrorFactory.createError({
                            code    : result.error.code,
                            message : result.error.message
                        });
                    }
                }
                else {
                    return result;
                }
            } else {
                return true;
            }
        }
    },

    createAsyncFunc : function(name) {       
        return function () {
            var message = {},
            request = {},
            i = 0,
            tabArguments = [],
            argumentsLength = 0;

            request = new WAF.proxy.HttpRequest ({
                url         : WAF.proxy.rpcService
            });
            request.init();
            if (typeof arguments[0] === 'function') {
                arguments[0].onsuccess = arguments[0];
            }
            if (arguments[0].onsuccess || arguments[0].onerror || arguments[0].params) {

                if (arguments[0].params && arguments.length === 1) {
                    message = new WAF.proxy.JsonMessage ({
                        name        : name,
                        arguments   : arguments[0].params
                    });
                } else {
                    argumentsLength = arguments.length;
                    for (i = 0; i < argumentsLength; i += 1) {
                        tabArguments[i - 1] = arguments[i];
                    }
                    message = new WAF.proxy.JsonMessage ({
                        name        : name,
                        arguments   : tabArguments
                    });
                }
                message = JSON.stringify(message);
                request.send({
                    message   : message,
                    onsuccess : arguments[0].onsuccess,
                    onerror   : arguments[0].onerror
                });
            } else {
                message = new WAF.proxy.JsonMessage ({
                    name        : name,
                    arguments   : arguments
                });
                message = JSON.stringify(message);

                request.send({
                    message    : message
                });
            }
            return request;
        }
    }
    
}

WAF.proxy.rpcService = '{rpc-pattern}';
WAF.proxy.publishInGlobalNamespace = {publishInGlobalNamespace};