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

WAF.onAfterInit = function onAfterInit() {// @lock

    // @region namespaceDeclaration// @startlock
    var documentEvent = WAF.namespace("projComp.test.documentEvent.events");	// @document
    // @endregion// @endlock

    // eventHandlers// @lock

    documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
    {// @endlock
        var componentPath = WAF.getUrlValue('component');
        if (componentPath) {
            WAF.loadComponent({
                id   : 'component0',
                path : componentPath         
            }); 
        }
		
    };// @lock

    // @region eventManager// @startlock
    WAF.addListener("documentEvent", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
