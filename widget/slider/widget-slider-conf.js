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
    type       : 'slider',
    lib        : 'WAF',
    description: 'Slider',
    category   : 'Controls',
    img        : '/walib/WAF/widget/slider/icons/widget-slider.png',
    tag        : 'div',
    attributes : [
    {
        name        : 'data-binding',
        description : 'Source'
    },
    {
        name        : 'class',
        description : 'Css class'
    },
    {
        name        : 'data-errorDiv',
        description : 'Display Error'
    },
    {
        name        : 'data-minValue',
        description : 'Minimum Value',
        defaultValue: '0',
        typeValue   : 'integer'
    },
    {
        name        : 'data-maxValue',
        description : 'Maximum Value',
        defaultValue: '100',
        typeValue   : 'integer'
    },
    {
        name        : 'data-step',
        description : 'Step',
        defaultValue: '1',
        typeValue   : 'integer'
    },
    {
        name        : 'data-orientation',
        description : 'Orientation',
        type        : 'dropdown',
        options     : [{
                key     : 'vertical',
                value   : 'Vertical'
        },{
                key     : 'horizontal',
                value   : 'Horizontal'
        }],
        defaultValue: 'horizontal'
    }
    ,
    {
        name        : 'data-range',
        description : 'Range',
        type        : 'dropdown',
        options     : [{
                key     : '',
                value   : ''
        },{
                key     : 'min',
                value   : 'Min'
        },{
                key     : 'max',
                value   : 'Max'
        }],
        defaultValue: 'min'
    },
    {
        name        : 'data-label',
        description : 'Label',
        defaultValue: ''
    },
    {
        name        : 'data-label-position',
        description : 'Label position',
        defaultValue: 'left'
    }],
    events: [
    {
        name       : 'slidecreate',
        description: 'On Create',
        category   : 'Slider Events'
    },
    {
        name       : 'slidestart',
        description: 'On Start',
        category   : 'Slider Events'
    },
    {
        name       : 'slide',
        description: 'On Slide',
        category   : 'Slider Events'
    },
    {
        name       : 'slidechange',
        description: 'On Change',
        category   : 'Slider Events'
    },
    {
        name       : 'slidestop',
        description: 'On Stop',
        category   : 'Slider Events'
    }
    ],
    style: [
    {
        name        : 'width',
        defaultValue: '200px'
    },
    {
        name        : 'height',
        defaultValue: '15px'
    }],
    properties: {
        style: {
            theme        : {
                roundy  : false
            },
            fClass       : true,
            text         : false,
            background   : true,
            border       : true,
            sizePosition : true,
            label        : true,
            shadow       : false,
            disabled     : ['border-radius']
        }
    },
    structure: [{
        description : 'range',
        selector    : '.ui-slider-range',
        style: {
            background  : true
        }
    },{
        description : 'handle',
        selector    : '.ui-slider-handle',
        style: {
            background  : true
        },
        state : [{
                label   : 'hover',
                cssClass: 'ui-state-hover',
                find    : '.ui-slider-handle'
        },{
                label   : 'active',
                cssClass: 'ui-state-active',
                find    : '.ui-slider-handle'
        }]
    }],
    onInit: function (config) {
        var slider = new WAF.widget.Slider(config);
        return slider;
    },
    onDesign: function (config, designer, tag, catalog, isResize) {  
        var slider,
        tmpValue = '';

        slider = document.getElementById(tag.getAttribute('id').getValue());
        
        if (!isResize) {
            // change style size if orientation has changed
            if ( tag.tmpOrientation && tag.tmpOrientation != tag.getAttribute('data-orientation').getValue() ){
                tmpValue = tag.style.width;
                tag.style.width = tag.style.height;
                tag.style.height = tmpValue;


                tag.tmpOrientation = tag.getAttribute('data-orientation').getValue();

                $("#" + tag.overlay.id).css({
                    width: tag.style.width,
                    height: tag.style.height
                });

                tag.update();
            }

            $(slider)
            .slider({
                disabled: true,
                range: tag.getAttribute('data-range').getValue(),
                //step: 5,
                orientation: tag.getAttribute('data-orientation').getValue(),
                value: 30
            })
            .addClass('waf-widget waf-slider ' + tag.getTheme());

            tag.tmpOrientation = tag.getAttribute('data-orientation').getValue();
        }
    }
});
