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
    type       : 'checkbox',
    lib        : 'WAF',
    description: 'Checkbox',
    category   : 'Controls',
    img        : '/walib/WAF/widget/checkbox/icons/widget-checkbox.png',
    tag        : 'div',
    attributes : [
    {
        name        : 'type',
        defaultValue: 'checkbox'
    },
    {
        name       : 'data-binding',
        description: 'Source'
    },
    {
        name       : 'class',
        description: 'Css class'
    },
    {
        name       : 'data-errorDiv',
        description: 'Display Error'
    },
    {
        name        : 'data-checked',
        description : 'Checked',
        type        : 'checkbox'
    },
    {
        name        : 'data-label',
        description : 'Label',
        defaultValue: 'label'
    },
    {
        name        : 'data-label-position',
        description : 'Label position',
        defaultValue: 'right'
    },
    {
        name        : 'tabindex',
        description : 'Tabindex',
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
    style: [
    {
        name        : 'width',
        defaultValue: '16px'
    },
    {
        name        : 'height',
        defaultValue: '16px'
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
        name       : 'mouseup',
        description: 'On Mouse Up',
        category   : 'Mouse Events'
    }],
    properties: {
        style: {
            theme       : true,
            fClass      : true,
            text        : false,
            background  : true,
            border      : false,
            sizePosition: true,
            label       : true,
            disabled    : ['border-radius']
        }
    },
    structure: [{
        description : 'box',
        selector    : '.waf-checkbox-box',
        style: {
            background  : true,
            gradient    : true,
            border      : true
        },
        state : [{
                label   : 'hover',
                cssClass: 'waf-state-hover'
        },{
                label   : 'active',
                cssClass: 'waf-state-active'
        },{
                label   : 'selected',
                cssClass: 'waf-state-selected'
        }]
    }/*,{
        description : 'icon',
        selector    : '.waf-checkbox-icon',
        style: {
            background  : true,
            shadow      : true
        },
        state : [{
                label   : 'hover',
                cssClass: 'waf-state-hover'
        },{
                label   : 'active',
                cssClass: 'waf-state-active'
        },{
                label   : 'selected',
                cssClass: 'waf-state-selected'
        }]
    }*/],
    onInit: function (config) {
        return new WAF.widget.Checkbox(config);
    },
    onDesign: function (config, designer, tag, catalog, isResize) {
        var
        i,
        htmlObject,
        icon,
        icons,
        url,
        path,
        imgHtml,
        cssClass,
        theme;
        
        htmlObject  = $('#' + tag.getId());
        theme       = $.trim(tag.getTheme().replace('inherited', ''));
        
        if (!isResize) {    
            $('<div class="waf-checkbox-box">').appendTo(htmlObject);
            
            icons = [];
            
            if (config['data-icon-default'])    icons.push({cssClass : 'waf-checkbox-icon-default',  value : config['data-icon-default']});
            if (config['data-icon-hover'])      icons.push({cssClass : 'waf-checkbox-icon-hover',    value : config['data-icon-hover']});
            if (config['data-icon-active'])     icons.push({cssClass : 'waf-checkbox-icon-active',   value : config['data-icon-active']});
            if (config['data-icon-selected'])   icons.push({cssClass : 'waf-checkbox-icon-selected', value : config['data-icon-selected']});
            
            cssClass    = 'waf-icon waf-checkbox-icon';
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
                    //url = 'http://kpitalrisk.free.fr/images/stars/17000/s_toto1.jpg'
                    
                    imgHtml = $('<img>');
                    
                    imgHtml.addClass(icons[i].cssClass);
                    
                    imgHtml.attr({
                        src : url
                    });
                    
                    imgHtml.appendTo(icon);        
                }
            } else {
                icon.svg({
                    loadURL: '/walib/WAF/widget/checkbox/skin/' + theme + '/svg/widget-checkbox-skin-' + theme + '.svg',
                    onLoad: function(svg) {
                            svg.configure({
                                    width: '100%',
                                    height: '100%',
                                    preserveAspectRatio: 'none'
                            });
                    }
                });
            }
            
            icon.appendTo(htmlObject);
        }
    }    
});
