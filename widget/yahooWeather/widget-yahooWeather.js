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
//// "use strict";

/*global WAF,window*/

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */

WAF.Widget.provide(


    /**
     * TODO: Write a description of this WAF widget
     *
     * @class WAF.Widget.YahooWeather
     * @extends WAF.Widget
     */
    'YahooWeather',
    
    
    {
        // Shared private properties and methods
        // NOTE: "this" is NOT available in this context to access the current to widget instance
        // These methods and properties are available from the constrctor through "shared"
        
        /**
         * YQL params
         *
         * @private
         * @shared
         * @property shared.yql
         * @type Object
         */
        yql: {
            url: 'http://query.yahooapis.com/v1/public/yql',
            sql: 'select * from weather.forecast where location = ',
            query: {
                q: '',
                format: 'json',
                callback: ''
            }
        },
        
        /**
         * Format url to use in ajax call to YQL
         *
         * @private
         * @shared
         * @method urlFormat
         */
        urlFormat: function() {
            return this.yql.url + '?' + $.param(this.yql.query);
        },
        
        /**
         * Retrieve and format forecast
         *
         * @private
         * @shared
         * @method getForecast
         */
        getForecast: function getForecast(event) {
            var self = this,
            html,
            zipCode,
            weather,
            weatherConditionIcon;
            
            if (this.widget.source.getCurrentElement() !== null) {
                // Get the zipCode
                zipCode = this.widget.sourceAtt.getValue();
            
                // Set the query
                this.yql.query.q = this.yql.sql + zipCode + ' and u="' + this.widget.settings.units.temperature + '"';
                
                // Initiate the HTTP GET request
                $.getJSON(this.urlFormat(), function(data) {
                    html = '';
                    
                    try {
                        // Get results
                        weather = data.query.results.channel;
                        
                        // Point to the condition icon
                        weatherConditionIcon = 'http://l.yimg.com/a/i/us/nws/weather/gr/' + weather.item.condition.code + 'd.png';
                        
                        // Html injection
                        html += '<div class="condition icon" style="background-image: url(' + weatherConditionIcon + ')"></div>';
                        html += '<h2>' + weather.item.condition.temp + '&deg;<span>' + weather.units.temperature + '</span></h2>';
                        html += '<h4>' + weather.location.city + ', ' + weather.location.region + '</h4>';
                        html += '<table>';
                        html +=     '<col width="25%" />';
                        html +=     '<col width="25%" />';
                        html +=     '<col width="25%" />';
                        html +=     '<col width="25%" />';
                        html +=     '<tr>';
                        html +=         '<th colspan="2">' + weather.item.forecast[0].day + '</th>';
                        html +=         '<th colspan="2">' + weather.item.forecast[1].day + '</th>';
                        html +=     '</tr>';
                        html +=     '<tr>';
                        html +=         '<td colspan="2" align="center">' + weather.item.forecast[0].text + '</td>';
                        html +=         '<td colspan="2" align="center">' + weather.item.forecast[1].text + '</td>';
                        html +=     '</tr>';
                        html +=     '<tr>';
                        html +=         '<td rowspan="2"><div class="icon" style="background-position: -' + (61 * weather.item.forecast[0].code) + 'px 0;"></div></td>';
                        html +=         '<td>High:&nbsp;<span class="high">' + weather.item.forecast[0].high + '&deg;</span></td>';
                        html +=         '<td rowspan="2"><div class="icon" style="background-position: -' + (61 * weather.item.forecast[1].code) + 'px 0;"></div></td>';
                        html +=         '<td>High:&nbsp;<span class="high">' + weather.item.forecast[1].high + '&deg;</span></td>';
                        html +=     '</tr>';
                        html +=     '<tr>';
                        html +=         '<td>Low:&nbsp;<span class="low">' + weather.item.forecast[0].low + '&deg;</span></td>';
                        html +=         '<td>Low:&nbsp;<span class="low">' + weather.item.forecast[1].low + '&deg;</span></td>';
                        html +=     '</tr>';
                        html += '</table>';
                        html += '<a href="' + weather.item.link + '" target="_blank" class="full">Full Forecast at Yahoo! Weather</a>';
                        html += '<a href="javascript:void(0);" class="settings">Settings</a>';
                        
                        self.widget.front.html(html);
                    } catch(E) {
                        // Something wrong occured
                        self.widget.front.html('<h4>Sorry ! An error occured</h4>');
                    }
                });
                
            }
        },
		
        yahooWeatherEventHandler: function(event) {
            var shared = event.data.shared;
            $(shared.widget.containerNode).removeClass('flip');
            shared.getForecast();
        }
    },
    
    
    /**
     * @constructor
     * @param {Object} inConfig configuration of the widget
     */

    /**
     * The constructor of the widget
     *
     * @shared
     * @property constructor
     * @type Function
     * @default WAF.widget.YahooWeather
     **/
    function (config, data, shared) {
        var 
        /**
             * 
             * @private
             * @property widget
             * @type WAF.widget.YahooWeather
             **/
        widget = this,
            
        /**
             * 
             * @private
             * @property html
             * @type String
             **/
        html = '';
        
        shared.widget = this;
        
        // Html injection
        html += '<div class="front"></div>';
        html += '<div class="back">';
        html +=     '<h4>Settings</h4>';
        html +=     '<form>';
        html +=     '<fieldset>';
        html +=         '<legend>Units</legend>';
        html +=         'Temperature: <select name="units[temperature]"><option value="f" selected>Fahrenheit</option><option value="c">Celsius</option></select>';
        html +=     '</fieldset>';
        html +=     '</form>';
        html +=     '<a href="javascript:void(0);" class="settings">Settings</a>';
        html += '</div>';
        
        $(this.containerNode).html(html);
        
        // Public instance properties
        this.settings = {
            units: {
                temperature: 'f'
            }
        }
        
        this.front = $(this.containerNode).children('.front');
        this.back = $(this.containerNode).children('.back');
        
        this.back.children('form').change(function(event) {
            widget.settings.units.temperature = $(this).find('select[name="units[temperature]"] option:selected').val();
            shared.getForecast(widget);
        });
        
        // Events
        // Click on settings
        $(this.containerNode).delegate('.settings', 'click', function(){
            $(widget.containerNode).toggleClass('flip');
        });
        
        // Source attribute change
        if (typeof this.source !== 'undefined') {
            //this.source.addListener("attributeChange", shared.yahooWeatherEventHandler, {attributeName: this.att.name}, {widget:this, shared: shared, getForecast:shared.getForecast});
            this.source.addListener("attributeChange", shared.yahooWeatherEventHandler, {
                attributeName: this.att.name
                }, {
                shared: shared
            });
        }
    },
    
    
    
    
    
    {
    // [Prototype]
    // The public shared properties and methods inherited by all the instances
    // NOTE: "this" is available in this context
    // These methods and properties are available from the constructor through "this"
    }

    );