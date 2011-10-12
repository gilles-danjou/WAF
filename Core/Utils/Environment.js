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
 * @module Utils
 **/


// NOTE: It would be nice if we could remove this obsolet detection


/**
 * User-agent environment
 *
 * @class WAF.utils.environment
 **/
WAF.utils.environment = {};

/**
 * User-agent environment detection
 *
 * @static
 * @method browserDetect
 **/
WAF.utils.environment.browserDetect = function(){
    var ua = navigator.userAgent;
    
    
    /**
     * User-agent environment
     *
     * @class WAF.utils.environment.browser
     **/
	WAF.utils.environment.browser = {};
    
    /**
     * Internet Explorer
     *
     * @static
     * @property ie
     * @type Boolean
     **/
    WAF.utils.environment.browser.ie = false;
    
    /**
     * Internet Explorer 6
     *
     * @static
     * @property ie6
     * @type Boolean
     **/
    WAF.utils.environment.browser.ie6 = false;
    
    /**
     * Internet Explorer 7
     *
     * @static
     * @property ie7
     * @type Boolean
     **/
    WAF.utils.environment.browser.ie7 = false;
    
    /**
     * Gecko
     *
     * @static
     * @property gecko
     * @type Boolean
     **/
    WAF.utils.environment.browser.gecko = false;
    
    /**
     * Safari
     *
     * @static
     * @property safari
     * @type Boolean
     **/
    WAF.utils.environment.browser.safari = false;
    
    /**
     * Safari 2
     *
     * @static
     * @property safari2
     * @type Boolean
     **/
    WAF.utils.environment.browser.safari2 = false;
    
    /**
     * Safari 3
     *
     * @static
     * @property safari3
     * @type Boolean
     **/
    WAF.utils.environment.browser.safari3 = false;
    
    /**
     * Firefox 3
     *
     * @static
     * @property firefox3
     * @type Boolean
     **/
    WAF.utils.environment.browser.firefox3 = false;
    
    if (ua.indexOf('Firefox/3') >= 0) {
		WAF.utils.environment.browser.firefox3 = true;
	}
	else {
		if (ua.indexOf("MSIE") >= 0) {
			WAF.utils.environment.browser.ie = true;
			if (ua.indexOf("MSIE 7") >= 0) {
				WAF.utils.environment.browser.ie7 = true;
			}
			if (ua.indexOf("MSIE 6") >= 0) {
				WAF.utils.environment.browser.ie6 = true;
			}
		}
		else {
			if (ua.indexOf("iPhone") >= 0) {
				WAF.utils.environment.browser.iphone = true;
				WAF.utils.environment.browser.safari = true;
			}
			else {
				if (ua.indexOf("WebKit") >= 0) {
					WAF.utils.environment.browser.safari = true;
					if (ua.indexOf("Version/3") >= 0) {
						WAF.utils.environment.browser.safari3 = true;
					}
					else {
						WAF.utils.environment.browser.safari2 = true;
					}
				}
				else {
					if (ua.indexOf("Gecko") >= 0) {
						WAF.utils.environment.browser.gecko = true;
					}
				}
			}
		}
	}
}

WAF.utils.environment.browserDetect();
