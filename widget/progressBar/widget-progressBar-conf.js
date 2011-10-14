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
WAF.addWidget({
    type       : 'progressBar',
    lib        : 'WAF',
    description: 'Progress Bar',
    category   : 'Controls',
    img        : '/walib/WAF/widget/progressBar/icons/widget-progressBar.png',
    tag        : 'div',
    attributes : [
    {
        name       : 'data-progressinfo',
        description: 'Progress Reference'
    },
    {
        name       : 'class',
        description: 'css class'
    },
    {
        name        : 'data-showstop',
        description : 'Show Stop Button',
        type        : 'checkbox',
        defaultValue: 'false'
    },
    {
        name	    : 'data-no-empty-display',
        description : "Hide if Inactive",
        type	    : 'checkbox',
        defaultValue: 'false'
    },
    {
        name        : 'data-label',
        description : 'label',
        defaultValue: 'Progress Bar on []',
        visibility  : 'hidden'
    },
    {
        name        : 'data-label-position',
        description : 'label position',
        defaultValue: 'top'
    }
    ],
    style: [
    {
        name        : 'width',
        defaultValue: '300px'
    },
    {
        name        : 'height',
        defaultValue: '15px'
    }],
    properties: {
        style: {
            theme        : true,
            fClass       : true,
            text         : false,
            background   : true,
            border       : true,
            sizePosition : true,
            shadow       : true,
            disabled     : ['border-radius']
        }
    },
    structure: [{
        description : 'range',
        selector    : '.waf-progressBar-range',
        style: {
            background  : true,
            text        : true
        }
    }],
    onInit: function (config) {
        var progress = new WAF.widget.ProgressBar(config);
        return progress;
    },
    onDesign: function (config, designer, tag, catalog, isResize) {    
        var
        height;
        
        height      = tag.getHeight();     

        tag.getLabel().getAttribute('data-text').setValue('Progress Bar on [' + tag.getAttribute('data-progressinfo').getValue() + ']');
        tag.getLabel().onDesign();
        
        if (!isResize){
            /*
             * add range div
             */ 
            $('<div class="waf-progressBar-range"><span>30%</span></div>')
            .css({
                width                       : '30%',
                lineHeight                  : height + 'px',
                '-webkit-background-size'   : height + 'px ' + height + 'px',
                '-moz-background-size'      : height + 'px ' + height + 'px',
                backgroundSize              : height + 'px ' + height + 'px'
            }).appendTo('#' + tag.getId());
        } else {
            $('#' + tag.getId()).children('.waf-progressBar-range')
            .css({
                lineHeight                  : height + 'px',
                '-webkit-background-size'   : height + 'px ' + height + 'px',
                '-moz-background-size'      : height + 'px ' + height + 'px',
                backgroundSize              : height + 'px ' + height + 'px'
            })
        }
    }
});
