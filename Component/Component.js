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
 * WAF Component
 *
 * @module  component
 *
 * @class   WAF.Component
 * @extends Object
 *
 * @author  The Wakanda Team
 * @date    july 2011
 * @version 0.2
 *
 */

/**
 * Load a Web Component
 *
 * @static
 * @method loadComponent
 * @param {JSON} param parameters to create the component
 */
WAF.loadComponent = function (param) {
    var icomponent = {},
    tagStyle = null,
    tagWafCss = null,
    tagScript = null,
    name = '',
    definition = {},
    attributeName = '',
    nbAttributes = 0,
    domObj = null,
    tabName = [];        
    
    param = param || {} ;
    
    param.id   = param.id   || '';
    param.path = param.path || '';

    if (typeof param.data === 'undefined') {
        param.data = {};
        definition = WAF.config.widget.WAF['component'];
        domObj = document.getElementById(param.id);
        if (domObj) {
    
            // create the config
            for (i = 0, nbAttributes = definition.attributes.length; i < nbAttributes; i++) {
                attributeName = definition.attributes[i].name;
                param.data[attributeName] = domObj.getAttribute(attributeName);
            }

            // force getting the mandatory attribute
            attributeName = 'id';
            param.data[attributeName] = domObj.getAttribute(attributeName);
            attributeName = 'data-type';
            param.data[attributeName] = domObj.getAttribute(attributeName);
            attributeName = 'data-lib';
            param.data[attributeName] = domObj.getAttribute(attributeName);
        } 
    }    
            
    if (typeof param.data['data-path'] === 'undefined' || param.data['data-path'] === null || param.data['data-path'] === '') {
        param.data['data-path'] = param.path;
    }    

    if (typeof param.data['id'] === 'undefined' || param.data['id'] === null || param.data['id'] === '') {
        param.data['id'] = param.id;
    }
    
    // name of the component
    name = param.data['data-path'];
    tabName = name.split('/');
    name = tabName[tabName.length - 1].replace('.waComponent', '');
    
    param.name = name;
    
    // check if component ressources already loaded
    // read the ressources from the client cache
    if (WAF.components[param.path]) {
        icomponent = WAF.components[param.path];
        
        // add the component to the list of the widgets
        WAF.widgets[param.id] = {};
        WAF.widgets[param.id].data = param.data;
        
        // clean the component placeholder
        $('#' + param.id).empty();        
        if (document.getElementById('waf-component-' + param.id)) {
            $('#' + 'waf-component-' + param.id).remove();
        }
        
        // load the html
        htmlUpdate = icomponent.cache.html.replace(/{id}/g, param.id + '_')
        htmlUpdate = htmlUpdate.replace('<!DOCTYPE html >', '');
        htmlUpdate = htmlUpdate.replace('<meta name="generator" content="Wakanda GUIDesigner"/>', '');        
        $('#' + param.id).append(htmlUpdate);
        
        // load the css
        tagStyle = document.createElement('style');
        tagStyle.setAttribute('id', 'waf-component-' + param.id);
        tagStyle.innerHTML = icomponent.cache.style.replace(/{id}/g, param.id + '_');
        tagWafCss = document.getElementById('waf-interface-css');
                            
        tagWafCss.parentNode.insertBefore(tagStyle, tagWafCss);
        
        // load the js                          
        tagScript = document.createElement('script');
        tagScript.innerHTML = icomponent.cache.script;
        document.getElementsByTagName('head')[0].appendChild(tagScript);
        
        // create the instance of the component                                  
        Component = WAF.component[param.name];                                                              
        myComp = new Component(param.id);        
         
        if (myComp.load) {
            myComp.load(param.data);  
        }
        
        WAF.widgets[param.id] = myComp;
                
        // generate the widgets
        WAF.tags.generate(param.id);    
                                            
    } else {       
        
        // get the manifest
        $.ajax({
            url     : param.path + '/manifest.json',
            dataType: 'json',
            success : function (data) {
                icomponent = data;
            
                // create the cache
                icomponent.cache = {};
             
                // add the component to the list of component            
                WAF.components[param.path] = icomponent;
            
                // add the component to the list of the widgets
                WAF.widgets[param.id] = {};
                WAF.widgets[param.id].data = param.data;
            
                // get the html            
                $.get(param.path + '/' + icomponent.name + '.html', function (html) {
                
                    var tabRequire = [],
                    scripts = [],
                    styles = [],
                    listScripts = '',
                    listStyles = '',
                    i = 0,
                    length = 0,
                    xhref = '',
                    path = '',
                    reqCss = null,
                    reqScript = null,
                    htmlUpdate = '';
                
                    // add html
                    icomponent.cache.html = html;
                    htmlUpdate = html.replace(/{id}/g, param.id + '_');
                    htmlUpdate = htmlUpdate.replace('<!DOCTYPE html >', '');
                    htmlUpdate = htmlUpdate.replace('<meta name="generator" content="Wakanda GUIDesigner"/>', '');
                    
                    // clean the component placeholder
                    $('#' + param.id).empty();
                    if (document.getElementById('waf-component-' + param.id)) {
                        $('#' + 'waf-component-' + param.id).remove();
                    }
                
                    // include the html                    
                    $('#' + param.id).append(htmlUpdate);                               

                    // add CSS
                    styles = icomponent.styles;
                    length = styles.length;
                    for (i = 0; i < length; i++) {
                        tabRequire[i] = param.data['data-path'] + '/' + styles[i];
                    }                 
                    listStyles = tabRequire.join(',');
                    xhref = window.location.href.split('/').join('\\');
                    path = "/waf-optimize?referer='" + encodeURIComponent(xhref) + "'&files='" + listStyles + "'";
                
                    if (path[0] == '+') {
                        path = WAF.config.baseURL + path.slice(1);
                    }
                
                    reqCss = new XMLHttpRequest();
                    reqCss.open('POST', path, true);
                    reqCss.onreadystatechange = function () {
                        if (reqCss.readyState == 4) {
                            if (reqCss.status == 200) {
                                var tagStyle = null,
                                styleUpdate = '',
                                tagWafCss = null;
                                                      
                                icomponent.cache.style = reqCss.responseText;
                                styleUpdate = reqCss.responseText.replace(/{id}/g, param.id + '_'); 

                                tagStyle = document.createElement('style');
                                tagStyle.setAttribute('id', 'waf-component-' + param.id);
                                tagStyle.innerHTML = styleUpdate;
                                tagWafCss = document.getElementById('waf-interface-css');
                            
                                tagWafCss.parentNode.insertBefore(tagStyle, tagWafCss);
                            }
                        }
                        
                        // generate the widgets after the css
                        // needed for some jQuery widgets
                        WAF.tags.generate(param.id);                          
                    };
                        
                    reqCss.send(null);                                     

                    // add JS                                                                                
                    scripts = icomponent.scripts;
                    length = scripts.length;
                    for (i = 0; i < length; i++) {
                        tabRequire[i] = param.data['data-path'] + '/' + scripts[i];
                    }                
                    listScripts = tabRequire.join(',');
                    xhref = window.location.href.split('/').join('\\');
                    path = "/waf-optimize?referer='" + encodeURIComponent(xhref) + "'&files='" + listScripts + "'";
                
                    if (path[0] == '+') {
                        path = WAF.config.baseURL + path.slice(1);
                    }
                
                    reqScript = new XMLHttpRequest();
                    reqScript.open('POST', path, true);
                    reqScript.onreadystatechange = function () {
                        if (reqScript.readyState == 4) {
                            if (reqScript.status == 200) {
                                var codeComponent = '',
                                includeJavascript = '',
                                tagScript = null,
                                tabScript = [],
                                Component = null,
                                myComp = null;
  
                                // separate the code of the component
                                // from the script
                                
                                // split on end of component code
                                tabScript = reqScript.responseText.split('})();// @endlock'); 

                                if (tabScript.length > 1) {
                                    
                                    // check if code already loaded in parallele
                                    if (!WAF.component[param.name]) {                                                                        
                                        codeComponent = tabScript[0] + '})();// @endlock';
                                        includeJavascript = tabScript[1];                                                                       
                                                             
                                        // add the script
                                        tagScript = document.createElement('script');
                                        tagScript.innerHTML = includeJavascript;
                                        document.getElementsByTagName('head')[0].appendChild(tagScript);
                                    
                                        icomponent.cache.script = includeJavascript;  
                                        
                                        // add internal methods dynamically                                        
                                        codeComponent = codeComponent.replace("constructor (id) {" ,
                                            "constructor (id) { \r\n\r\n\tfunction getHtmlObj (componentId) { \r\n\t\treturn $('#' + id + '_' + componentId);\r\n\t};" +
                                            "\r\n\r\n\tfunction getHtmlId (componentId) { \r\n\t\treturn id + '_' + componentId;\r\n\t};"                                    
                                            );
     
                                        Component = eval(codeComponent);
                                
                                        // add the code of the component                                                                       
                                        WAF.component[param.name] = Component;
                                    } else {
                                    // DO NOTHING
                                    }
                                    Component = WAF.component[param.name]
                                    myComp = new Component(param.id);                               
                                                       
                                    if (myComp.load) {
                                        myComp.load(param.data);  
                                    }                                                                
                                                                
                                    WAF.widgets[param.id] = myComp;
                                                                        
                                } else {
                                    includeJavascript = tabScript[0];                                                                       
                                                             
                                    tagScript = document.createElement('script');
                                    tagScript.innerHTML = includeJavascript;
                                    document.getElementsByTagName('head')[0].appendChild(tagScript);
                                }                                                                                                                                                                                                                                                                      
                            }
                        }
                    };
                        
                    reqScript.send(null);               
                       
                });
            }    
        })
    }    
};