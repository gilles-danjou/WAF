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
/*jslint white: true, evil: true, es5: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true, strict: true */

// "use strict";

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

    var
        wafServerModulesFolder,
        wafAppModuleFolders,
        // module store
        wafModuleCache = {},
        wafModuleLoaded = {},
        wafParentModuleIds = [];

    require = Module.require = function require(id) {

        var
            exports,
            wafForce = arguments[1],
            wafClear = arguments[2],
            wafIsLoaded = arguments[3],
            wafMain = arguments[4];
        
        if (wafMain !== undefined) {
            wafModuleCache[id] = wafMain;
            return;
        }
        
        // unreference initialized module(s)
        if (wafClear === true) {
            
            if (require.log) {
                console.info('clear the cache');
            }

            if (id !== undefined) {
                // unreference a specific module
                if (id in wafModuleCache) {
            
                    delete wafModuleCache[id];
                
                    if (require.log) {
                        console.info('module "', id, '" removed from the cache');
                    }
                
                }
                
                return true;
            }
            
            // unreference all modules
            wafModuleCache = {};
            wafModuleLoaded = {};
            wafParentModuleIds = [];
            
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
         * @param {String} wafModuleFolder Required
         */
        function wafParseModuleFolders(wafModuleFolder) {
            var
                wafTs, 
                wafTc,
                wafEval,
                wafTopId,
                wafModuleFile,
                module;
                
            //if (wafModulePath !== '' && !id.match(wafRegExValidModuleId)) {
            //    throw new Error('Module ids must be token list of camelCase terms or "." or ".." separated by "/"');
            //}
            
            // set the top id
            if (wafModuleFolder === "") {
                wafModuleFile = File(id + '.js');
            } else {
                switch (typeof wafModuleFolder) {
                case "object":
                    if (wafModuleFolder.toString() !== "[object Folder]") {
                        wafModuleFolder = Folder(wafModuleFolder.toString());
                    }
                    break;
                case "string":
                    wafModuleFolder = Folder(wafModuleFolder);
                    break;
                default:
                    if (require.log) {
                        console.warn('Unexpected Module Folder type:', wafModuleFolder);
                    }
                    return false;
                }
                if (wafModuleFolder === null) {
                    return false;
                }
                wafModuleFile = File(wafModuleFolder.path + id + '.js');
            }
            if (wafModuleFile === null) {
                return false;
            }
            wafTopId = wafModuleFile.path;
            wafTopId = wafTopId.substr(0, wafTopId.length - 3);
                
               
            // module not found in the cache
            if (wafIsLoaded) {
                if (require.log) {
                    console.info('isLoaded: ' + (wafTopId in wafModuleLoaded) + ' (' + wafTopId + ')');
                    console.info('loaded modules: ' + Object.keys(wafModuleLoaded).toString());
                }
                return (wafTopId in wafModuleLoaded);
            }

            // look if the module is referenced in the cache
            if (wafModuleCache[wafTopId]) {
                if (require.log) {
                    console.info('module: ', wafTopId, ' found in cache');
                    console.info('exports: ', Object.keys(wafModuleCache[wafTopId]));
                }
                
                // set exports as the module referenced in the cache
                exports = wafModuleCache[wafTopId];
                
                if (wafForce !== true) {
                    // The module interface will be returned as is
                    if (require.log) {
                        console.info('Module returned from cache');
                    }
                    return true;
                }
                
            }
            
            // search the module at the current path
            if (!wafModuleFile.exists) {
                // module not found at this path
                if (require.log) {
                    console.info('path ko: ' + wafModuleFile.path);
                }
                return false;
            }
                    
            // module source file found
            if (require.log) {
                console.info('path ok: ' + wafModuleFile.path);
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
            module = {
                uri: wafModuleFile.getURL() // or wafModuleFile.urn
            };
            Object.defineProperty(
                module,
                'id',
                {
                    value: wafTopId,
                    writable: false, // read only
                    configurable: false, // don't delete
                    enumerable: true
                }
            );
            
            // used by relative module IDs
            wafParentModuleIds.push(wafTopId);
                
            // The reference of the module is immediatly cached
            // to enable cyclic module references
            wafModuleCache[wafTopId] = exports;
                
            try {   
                // load module source
                wafTs = TextStream(wafModuleFile, 'Read');
                wafTc = wafTs.read(0);
                wafTs.close();
                
                // clear module context
                wafForce = undefined;
                wafModuleFile = undefined;
                    
                // "exports" & "module" are not available in module scope when using "include"
                //wafEval = include(wafModulePath, true);
                
                // initialize the module
                wafEval = eval(wafTc);
                    
                if (require.log) {
                    console.log('eval :', wafEval);
                } 
                //include(wafModulePath);
                        
            } catch (error) {

                // error while evaluating the module
                if (require.log) {
                    console.error('require error: ', JSON.stringify(error));
                }
                // getting out of the module scope
                wafParentModuleIds.pop(); 
                throw error;
                
            }
            
            // module loaded
            if (require.log) {
                console.log('module loaded: ' + wafTopId);
            }
            wafModuleLoaded[wafTopId] = true;
            
            // getting out of the module scope
            if (require.log) {
                console.log('removing current module from the stack: ');
                console.log(wafParentModuleIds);
            }
            wafParentModuleIds.pop(); 
            if (require.log) {
                console.log(wafParentModuleIds);
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
            if (wafParentModuleIds.length === 0) {
                throw new Error(
                    "relative module ids are not supported outside of a module context.\n" +
                    "Consider to add your current path to require.paths and change the id into an absolute one"
                );
            }  
            // prepend the base path of the caller module top id with the current module id
            module = (typeof module === "undefined") ? {} : module;
            console.info("module.id ?", module.id);
            module.id = module.id || wafParentModuleIds[wafParentModuleIds.length - 1];
            id = module.id.substr(0, (module.id.lastIndexOf('/') + 1)) + id;
        }
        
        /*
         * Search the module in all available locations
         */
        
        // search the module from top id
        if (wafParseModuleFolders('')) {
            return wafIsLoaded ? true : exports;
        }
        
        // search the module in the custom paths
        if (require.paths.some(wafParseModuleFolders)) {
            if (console.log && !wafIsLoaded) {
                console.info('returning the module API', exports);
            }
            return wafIsLoaded ? true : exports;
        }
        
        // search the module in the project module folder
        if (wafAppModuleFolders === undefined) {
            if (application) {
                wafAppModuleFolders = [
                    Folder(getFolder().path + 'modules/'),
                    Folder(getFolder().path + 'Modules/')
                ];
                if (wafAppModuleFolders.some(wafParseModuleFolders)) {
                    return wafIsLoaded ? true : exports;
                }
            }
        } else {
            if (wafAppModuleFolders.some(wafParseModuleFolders)) {
                return wafIsLoaded ? true : exports;
            }
        }
        
        // search the module in the server module folder
        if (wafServerModulesFolder === undefined) {
            wafServerModulesFolder = Folder(getWalibFolder().path + '../Modules/');
        }
        if (wafParseModuleFolders(wafServerModulesFolder)) {
            return wafIsLoaded ? true : exports;
        }
        
        
        /*
         * Module not found in any of the available locations
         */
        
        if (wafIsLoaded) {
            return false;
        }
         
        throw new Error('Required module not found: ' + id);
        

    };

}());


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