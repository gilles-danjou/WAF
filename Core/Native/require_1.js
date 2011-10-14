/*
Wakanda Software (the "Software") and the corresponding source code remain
the exclusive property of 4D and/or its licensors and are protected by national
and/or international legislations.
This file is part of the source code of the Software provided under the relevant
Wakanda License Agreement available on http://www.wakanda.org/license whose compliance
constitutes a prerequisite to any use of this file and more generally of the
Software and the corresponding source code.
*/
/*jslint white: true, evil: true, es5: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true, strict: true */

"use strict";

/*global console, solution, application, Folder, File, TextStream, include */

/**
 * @module CommonJS
 *
 * @todo manage require.main
 **/

var
  require,
  Module;


/**
 * @class Module
 */
Module = function Module() {};

Object.defineProperty(
    Module,
    "REGEX_DETECT_STARTING_RELATIVE_TERM",
    {
        value: /^(\.\/)|^(\.\.\/)/,
        enumerable: false,
        writable: false,
        configurable: false
    }
);

/** 
 * @static
 * @method require
 * @param {String} id Required. Absolute or relative "id" of a module 
 * @return Module
 */
(function createRequire() {
    
    require = Module.require = function require(id) {

        var
            exports;
            
        //arguments.id = arguments[0];
        arguments.force = arguments[1];
        arguments.clear = arguments[2];
        arguments.isLoaded = arguments[3];
        arguments.main = arguments[4];
    
        if (arguments.main !== undefined) {
            require.moduleCache[id] = arguments.main;
            return;
        }
        
        // unreference initialized module(s)
        if (arguments.clear === true) {
            
            if (require.log) {
                console.info('clear the cache');
            }

            if (id !== undefined) {
                // unreference a specific module
                if (require.moduleCache.hasOwnProperty(id)) {
            
                    delete require.moduleCache[id];
                
                    if (require.log) {
                        console.info('module "', id, '" removed from the cache');
                    }
                
                }
                
                return true;
            }
            
            // unreference all modules
            require.moduleCache = {};
            require.moduleLoaded = {};
            require.parentModuleIds = [];
            
            if (require.log) {
                console.info('module cache cleared');
            }
            return true;
        }
        
        
        /**
         * Search the module at a specified location
         *
         * @private
         * @method wafParseModuleFolders
         * @param {String} waInternal.moduleFolder Required
         */
        arguments.parseModuleFolders = function require_parseModuleFolders() {
            
            //if (waInternal.modulePath !== '' && !waInternal.id.match(waInternal.RegExValidModuleId)) {
            //    throw new Error('Module ids must be token list of camelCase terms or "." or ".." separated by "/"');
            //}
            arguments.moduleFolder = arguments[0];
            
            // set the top id
            if (arguments.moduleFolder === "") {
                arguments.moduleFile = File(id + '.js');
            } else {
                switch (typeof arguments.moduleFolder) {
                case "object":
                    if (arguments.toString() !== "[object Folder]") {
                        arguments.moduleFolder = Folder(arguments.moduleFolder.toString());
                    }
                    break;
                case "string":
                    arguments.moduleFolder = Folder(arguments.moduleFolder);
                    break;
                default:
                    if (require.log) {
                        console.warn('Unexpected Module Folder type:', arguments.moduleFolder);
                    }
                    return false;
                }
                if (arguments.moduleFolder === null) {
                    return false;
                }
                arguments.moduleFile = File(arguments.moduleFolder.path + id + '.js');
            }
            if (arguments.moduleFile === null) {
                return false;
            }
            arguments.topId = arguments.moduleFile.path;
            arguments.topId = arguments.topId.substr(0, arguments.topId.length - 3);
                
               
            // module not found in the cache
            if (this.isLoaded) {
                if (require.log) {
                    console.info('isLoaded: ' + (require.moduleLoaded.hasOwnProperty(arguments.topId)) + ' (' + arguments.topId + ')');
                    console.info('loaded modules: ' + Object.keys(require.moduleLoaded).toString());
                }
                return require.moduleLoaded.hasOwnProperty(arguments.topId);
            }

            // look if the module is referenced in the cache
            if (require.moduleCache[arguments.topId]) {
                if (require.log) {
                    console.info('module: ', arguments.topId, ' found in cache');
                    console.info('exports: ', Object.keys(require.moduleCache[arguments.topId]));
                }
                
                // set exports as the module referenced in the cache
                exports = require.moduleCache[arguments.topId];
                
                if (this.force !== true) {
                    // The module interface will be returned as is
                    if (require.log) {
                        console.info('Module returned from cache');
                    }
                    return true;
                }
                
            }
            
            // search the module at the current path
            if (!arguments.moduleFile.exists) {
                // module not found at this path
                if (require.log) {
                    console.info('path ko: ' + arguments.moduleFile.path);
                }
                return false;
            }
                    
            // module source file found
            if (require.log) {
                console.info('path ok: ' + arguments.moduleFile.path);
            }
            
            if (typeof exports === "undefined") {
                // the module is not already referenced in the cache
                // create a new one
                exports = new require.Module();
            }
            
            
            /**
             * <p>A module variable object is available in the scope of Modules</p>
             *
             * <p>properties</p>
             * <ul>
             *   <li>uri (String): It matches to the local URL of the module source file</li>
             *   <li>id (String): Read Only. It is the top id of the current module so require(module.id) will always return this exact module</li> 
             * </ul>
             *
             * @private
             * @property module
             * @type Object
             */
            module = Object.create(
                Object.prototype,
                {
                    'id': {
                        value: waInternal.topId,
                        writable: false, // read only
                        configurable: false, // don't delete
                        enumerable: true
                    },
                    'exports': {
                        get: function exports_getter() {
                            return exports;
                        }
                    },
                    'uri': {
                        value: waInternal.moduleFile.getURL(), // or waInternal.moduleFile.urn
                        writable: false, // read only
                        configurable: false, // don't delete
                        enumerable: true
                    }
                }
            );
            
            // used by relative module IDs
            require.parentModuleIds.push(arguments.topId);
                
            // The reference of the module is immediatly cached
            // to enable cyclic module references
            Object.defineProperty(
                require.moduleCache,
                arguments.topId,
                { 
                    value: exports,
                    writable: true,
                    configurable: true,
                    enumerable: true
                }
            );
                
            try {   
                // load module source
                arguments.fileStream = TextStream(arguments.moduleFile, 'Read');
                arguments.fileContent = arguments.fileStream.read(0);
                arguments.fileStream.close();
                
                // clear module context
                this.force = undefined;
                arguments.moduleFile = undefined;
                    
                // "exports" & "module" are not available in module scope when using "include"
                //wafEval = include(waInternal.modulePath, true);
                
                // initialize the module
                arguments.evaluated = eval(arguments.fileContent);
                    
                if (require.log) {
                    console.log('eval :', arguments.evaluated);
                } 
                //include(waInternal.modulePath);
                        
            } catch (error) {

                // error while evaluating the module
                if (require.log) {
                    console.error('require error: ', JSON.stringify(error));
                }
                // getting out of the module scope
                require.parentModuleIds.pop(); 
                throw error;
                
            }
            
            // module loaded
            if (require.log) {
                console.log('module loaded: ' + arguments.topId);
            }
            require.moduleLoaded[arguments.topId] = true;
            
            // getting out of the module scope
            if (require.log) {
                console.log('removing current module from the stack: ');
                console.log(require.parentModuleIds);
            }
            require.parentModuleIds.pop(); 
            if (require.log) {
                console.log(require.parentModuleIds);
            }
            
            return true;
        }
        
        
        
        /*
         * Manage relative ids
         */
         
        // Detect if the id starts by "./" or "../"
        if (id.match(Module.REGEX_DETECT_STARTING_RELATIVE_TERM)) {
            //if (!id.match(wafRegExValidModuleId)) {
            //    throw new Error('Module ids must be token list of camelCase terms or "." or ".." separated by "/"');
            //}
            if (require.parentModuleIds.length === 0) {
                throw new Error(
                    "relative module ids are not supported outside of a module context.\n" +
                    "Consider to add your current path to require.paths and change the id into an absolute one"
                );
            }  
            // prepend the base path of the caller module top id with the current module id
            module = (typeof module === "undefined") ? {} : module;
            console.info("module.id ?", module.id);
            module.id = module.id || require.parentModuleIds[require.parentModuleIds.length - 1];
            id = module.id.substr(0, (module.id.lastIndexOf('/') + 1)) + id;
        }
        
        /*
         * Search the module in all available locations
         */
        
        // search the module from top id
        if (arguments.parseModuleFolders('')) {
            return wafIsLoaded ? true : exports;
        }
        
        // search the module in the custom paths
        if (require.paths.some(arguments.parseModuleFolders)) {
            if (console.log && !waInternal.isLoaded) {
                console.info('returning the module API', exports);
            }
            return waInternal.isLoaded ? true : exports;
        }
        
        // search the module in the project module folder
        if (waInternal.appModuleFolders === undefined) {
            if (application) {
                waInternal.appModuleFolders = [
                    Folder(getFolder().path + 'modules/'),
                    Folder(getFolder().path + 'Modules/')
                ];
                if (waInternal.appModuleFolders.some(waInternal.parseModuleFolders)) {
                    return waInternal.isLoaded ? true : exports;
                }
            }
        } else {
            if (waInternal.appModuleFolders.some(waInternal.parseModuleFolders)) {
                return waInternal.isLoaded ? true : exports;
            }
        }
        
        // search the module in the server module folder
        if (waInternal.serverModulesFolder === undefined) {
            waInternal.serverModulesFolder = Folder(getWalibFolder().path + '../modules/');
        }
        if (waInternal.serverModulesFolder === undefined) {
            waInternal.serverModulesFolder = Folder(getWalibFolder().path + '../Modules/');
        }
        if (waInternal.parseModuleFolders(waInternal.serverModulesFolder)) {
            return waInternal.isLoaded ? true : exports;
        }
        
        
        /*
         * Module not found in any of the available locations
         */
        
        if (waInternal.isLoaded) {
            return false;
        }
         
        throw new Error('Required module not found: ' + waInternal.id);
        

    };

}());

require.moduleCache = {};
require.moduleLoaded = {};
require.parentModuleIds = [];


/**
 * Custom Paths in which the modules will be looked for before to look into the default module folders.<br>
 *
 * Default module folders are looked into this order: 
 *  - the "modules" folder of the project
 *  - the "Modules" folder of the project 
 *  - the "Modules" folder of the server 
 *
 * @static
 * @property paths
 * @type Array
 */
require.paths = [];


/**
 * Main module
 *
 * @static
 * @property main
 * @type Object
 */
require.main = undefined;


/**
 * This method force the initialization of a module while conserving the cached reference
 *
 * @static
 * @method force
 * @throws {Error} If module not found
 * @param {String} id Required.
 * @return Object
 */
require.force = function force(id) {

    return require(id, true);

};


/**
 * This method remove a module reference from the cache.
 * If the "id" parameter is undefined, all modules are removed from the cache
 *
 * @static
 * @method clear
 * @param {String} id Id of a specific module
 * @return Object
 */
require.clear = function clear(id) {

    require(id, undefined, true);

};


/**
 * This method check if a module is already referenced in the cache
 *
 * @static
 * @method isLoaded
 * @param {String} id Required.
 * @return Boolean
 */
require.isLoaded = function isLoaded(id) {

    return require(id, undefined, undefined, true);

};


/**
 * This is the default Module constructor
 *
 * @static
 * @property Module
 * @type Function
 */
require.Module = Module;


/**
 * This method fix the main module
 *
 * @static
 * @property setMain
 * @type Function
 */
require.setMain = function setMain(exports, module) {

    Object.defineProperty(
        require,
        "main",
        {
            value: module,
            writable: false,
            configurable: false,
            enumerable: true
        }
    );
    
    return require(module.id, undefined, undefined, undefined, exports);

};


/**
 * This property, if set to true, allows "require" to log running informations
 *
 * @static
 * @property log
 * @type Boolean
 * @default false
 */
require.log = false;

Module.toString = function () {
    return 'function ' + this.name + '() {\n    [native code]\n}';
};
require.toString = Module.toString;
require.setMain.toString = Module.toString;
require.isLoaded.toString = Module.toString;
require.force.toString = Module.toString;
require.clear.toString = Module.toString;


require.version = "19";