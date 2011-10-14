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
    type        : 'radioGroup',
    lib         : 'WAF',
    description : 'Radio Button Group',
    category    : 'Controls',
    img         : '/walib/WAF/widget/radiogroup/icons/widget-radiogroup.png',
    tag         : 'ul',
    attributes  : [
    {
        name       : 'class',
        description: 'Css class'
    },
    {
        name       : 'data-binding',
        description: 'Source In'
    },
    {
        name       : 'data-binding-out',
        description: 'Source Out',
        typeValue  : 'datasource'
    },
    {
        name        : 'data-display',
        description : 'Display',
        type        : 'dropdown',
        options     : ['Vertical', 'Horizontal'],
        defaultValue: 'vertical'
    },
    {
        name       : 'data-binding-options',
        visibility : 'hidden'
    },
    {
        name        : 'data-binding-key',
        description : 'Key',
        type        : 'dropdown',
        options     : ['']
    },
    {
        name       : 'data-format',
        description: 'Format'
    },
    {
        name        : 'data-label',
        description : 'Label',
        defaultValue: 'label'
    },
    {
        name        : 'data-label-position',
        description : 'Label position',
        defaultValue: 'left'
    },
    {
        name        : 'data-autoDispatch',
        description : 'Auto Dispatch',
        type        : 'checkbox',
        defaultValue: 'true'
    },
    {
        name       : 'tabindex',
        description: 'Tabindex',
        typeValue   : 'integer'
    },
    {
        name        : 'data-icon-default',
        description : 'Source',
        tab         : 'style',
        tabCategory : 'Icon',
        type        : 'file'
    },
    {
        name        : 'data-icon-hover',
        description : 'Source',
        tab         : 'style',
        tabCategory : 'Icon',
        type        : 'file'
    },
    {
        name        : 'data-icon-active',
        description : 'Source',
        tab         : 'style',
        tabCategory : 'Icon',
        type        : 'file'
    },
    {
        name        : 'data-icon-selected',
        description : 'Source',
        tab         : 'style',
        tabCategory : 'Icon',
        type        : 'file'
    }],
    events: [
    {
        name       : 'blur',
        description: 'On Blur',
        category   : 'Focus Events'
    },
    {
        name       : 'change',
        description: 'On Change',
        category   : 'Focus Events'
    },
    {
        name       : 'click',
        description: 'On Click',
        category   : 'Mouse Events'
    },
    {
        name       : 'focus',
        description: 'On Focus',
        category   : 'Focus Events'
    },
    {
        name       : 'mousedown',
        description: 'On Mouse Down',
        category   : 'Mouse Events'
    },
    {
        name       : 'mousemove',
        description: 'On Mouse Move',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseout',
        description: 'On Mouse Out',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseover',
        description: 'On Mouse Over',
        category   : 'Mouse Events'
    },
    {
        name       : 'onmouseup',
        description: 'On Mouse Up',
        category   : 'Mouse Events'
    }],
    style: [
    {
        name        : 'width',
        defaultValue: '100px'
    },
    {
        name        : 'height',
        defaultValue: '25px'
    }],
    properties: {
        style: {
            theme       : true,
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            textShadow  : true,
            dropShadow  : true,
            innerShadow : true,
            label       : true
        }
    },
    structure: [{
        description : 'box',
        selector    : '.waf-radio-box',
        style: {
            background  : true,
            gradient    : true,
            border      : true
        },
        state : [{
                label   : 'hover',
                cssClass: 'waf-state-hover',
                find    : '.waf-radio'
        },{
                label   : 'active',
                cssClass: 'waf-state-active',
                find    : '.waf-radio'
        },{
                label   : 'selected',
                cssClass: 'waf-state-selected',
                find    : '.waf-radio'
        }]
    }/*,{
        description : 'icon',
        selector    : '.waf-radio-icon',
        style: {
            background  : true,
            shadow      : true
        },
        state : [{
                label   : 'hover',
                cssClass: 'waf-state-hover',
                find    : '.waf-radio'
        },{
                label   : 'active',
                cssClass: 'waf-state-active',
                find    : '.waf-radio'
        },{
                label   : 'selected',
                cssClass: 'waf-state-selected',
                find    : '.waf-radio'
        }]
    }*/],
    onInit: function (config) {
        return new WAF.widget.RadioGroup(config);
    },
    onDesign : function (config, designer, tag, catalog, isResize) {
        var
        htmlObject,
        icon,
        theme,
        currentState,
        states,
        radios,
        options;
        
        options     = tag.getOptions();
        htmlObject  = tag.getHtmlObject();
        theme       = $.trim(tag.getTheme().replace('inherited', ''));
        
        htmlObject.children().remove();     
        
        /*
         * Add display class
         */
        htmlObject.removeClass('horizontal vertical');
        htmlObject.addClass(tag.getAttribute("data-display").getValue());
        
        /*
         * Create a radio input
         * @method createRadio
         */
        tag.createRadio = function(option) {
            var 
            radioLi,
            radioInput,
            radioLabel,
            radioDiv,
            attr,
            path,
            url,
            imgHtml,
            icons,
            cssClass;
            
            option = option || {};
            
            attr = {
                type    : 'radio',
                name    : tag.getId(),
                value   : option.value
            }
            
            radioLi = $('<li>');
            
            radioDiv = $('<div class="waf-widget waf-radio ' + tag.getTheme()+ '">');
            
            $('<div class="waf-radio-box">').appendTo(radioDiv);

            /*
             * Svg icon
             */        
            
            icons = [];
            
            if (config['data-icon-default'])    icons.push({cssClass : 'waf-radio-icon-default',  value : config['data-icon-default']});
            if (config['data-icon-hover'])      icons.push({cssClass : 'waf-radio-icon-hover',    value : config['data-icon-hover']});
            if (config['data-icon-active'])     icons.push({cssClass : 'waf-radio-icon-active',   value : config['data-icon-active']});
            if (config['data-icon-selected'])   icons.push({cssClass : 'waf-radio-icon-selected', value : config['data-icon-selected']});
            
            cssClass    = 'waf-icon waf-radio-icon';
            if (icons.length == 0) {
                cssClass += ' waf-icon-svg';
            } else {
                cssClass += ' waf-icon-image';
            }
            
            icon = $('<div class="' + cssClass + '">');
            
            if (icons.length > 0) {
                for (i = 0; i < icons.length; i += 1) {
                    path = Designer.util.cleanPath(icons[i].value.replace('/', ''));
                    url = path.fullPath;                    
                    
                    imgHtml = $('<img>');
                    
                    imgHtml.addClass(icons[i].cssClass);
                    
                    imgHtml.attr({
                        src : url
                    });
                    
                    imgHtml.appendTo(icon);        
                }
            } else {
                icon.svg({
                    loadURL: '/walib/WAF/widget/radiogroup/skin/' + theme + '/svg/widget-radiogroup-skin-' + theme + '.svg',
                    onLoad: function(svg) {
                            svg.configure({
                                    width: '100%',
                                    height: '100%',
                                    preserveAspectRatio: 'none'
                            });
                    }
                }); 
            }
            
            icon.appendTo(radioDiv);

            if (option.selected) {
                attr.checked = 'checked';
                radioDiv.addClass('waf-state-selected')
            }
                
            radioInput = $('<input>').attr(attr);
            radioInput.appendTo(radioDiv);
            
            radioDiv.appendTo(radioLi);
            
            if (option.label) {
                radioLabel = $('<label>').attr('for', attr.name).addClass(tag.getTheme()).html(option.label);
                radioLabel.appendTo(radioLi);
            }
            
            return radioLi;
        }
        
            
        
        /*
         * If only one radio
         */
        if (!options || (options&& options.length === 0)) {
            tag.createRadio().appendTo(htmlObject);
        } else {           
            
            for (var i in options) {                
                tag.createRadio(options[i]).appendTo(htmlObject);
            }
        }
        
        currentState = tag.getCurrentState();
        states       = tag.getStates();
        radios       = tag.getHtmlObject().find('.waf-radio');
        
        for (i = 0; i < states.length; i += 1) {
            radios.removeClass(states[i].cssClass);
        }
        
        if (currentState) {
            radios.addClass(currentState.cssClass);
        }
    }
});
