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
WAF.addWidget({    
    type        : 'combobox',
    lib         : 'WAF',
    description : 'Combo Box',
    category    : 'Controls',
    img         : '/walib/WAF/widget/combobox/icons/widget-combobox.png',
    tag         : 'div',
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
        name       : 'data-binding-options',
        visibility : 'hidden'
    },
    {
        name       : 'data-binding-key',
        description: 'Key',
        type       : 'dropdown',
        options    : ['']
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
        name        : 'tabindex',
        description : 'Tabindex',
        typeValue   : 'integer'
    },
    {
        name        : 'data-editable',
        description : 'Autocomplete',
        type        : 'checkbox',
        defaultValue: 'true'
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
        defaultValue: '153px'
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
            gradient    : true,
            border      : true,
            sizePosition: true,
            shadow      : true,
            disabled    : []
        },
        state : [{
                label   : 'hover',
                cssClass: 'waf-state-hover'
        },{
                label   : 'active',
                cssClass: 'waf-state-active'
        }]
    },
    structure: [{
        description : 'input',
        selector    : 'input',
        style: {
            text        : true,
            background  : true,
            gradient    : true,
            textShadow  : true,
            innerShadow : true,
            border      : true
        },
        state : [{
                label   : 'hover',
                cssClass: 'waf-state-hover'
        },{
                label   : 'active',
                cssClass: 'waf-state-active'
        }]
    },{
        description : 'button',
        selector    : 'button',
        style       : {
            background  : true,
            gradient    : true,
            border      : true
        },
        state : [{
                label   : 'hover',
                cssClass: 'ui-state-hover',
                find    : '.ui-button'
        },{
                label   : 'active',
                cssClass: 'ui-state-active',
                find    : '.ui-button'
        }]
    },{
        description : 'list',
        selector    : '.waf-combobox-list',
        style: {
            text        : true,
            background  : true,
            gradient    : true,
            textShadow  : true,
            innerShadow : true,
            border      : true
        }
    }],
    onInit: function (config) {
        var widget = new WAF.widget.Combobox(config);

        // add in WAF.widgets
        widget.kind     = config['data-type']; // kind of widget
        widget.id       = config['id']; // id of the widget
        widget.renderId = config['id']; // id of the tag used to render the widget
        widget.ref      = document.getElementById(config['id']); // reference of the DOM instance of the widget
        WAF.widgets[config['id']] = widget;        
        return widget;
    },
    onDesign : function (config, designer, tag, catalog, isResize) {
        var 
        htmlObject,
        htmlSelect,
        htmlInput,
        htmlButton,
        borderSize,
        buttonSize,
        tagWidth,
        tagHeight,
        options;
        
        tagWidth    = tag.getWidth();
        tagHeight    = tag.getHeight();
        htmlObject  = $('#' + tag.getId());
        buttonSize  = 25;        
        borderSize  = parseInt(tag.getComputedStyle('border-width')) * 2;
        
        //if (isResize) {   
        
            htmlObject.children().remove();

            htmlSelect  = $('<select>').appendTo(htmlObject);        
            options     = tag.getOptions();        

            for (var i in options) {
                var attr = {
                    value: options[i].value
                }

                if (options[i].selected) {
                    attr.selected = 'selected';
                }

                htmlSelect.append( $('<option/>').attr(attr).html(options[i].label) );
            }

            htmlSelect.combobox();  
            
            htmlInput   = htmlObject.children('input');
            htmlButton  = htmlObject.children('button');            

            htmlObject.parent().css({
                'overflow'    : 'hidden'
            });
            
            
            htmlInput.css({
                'width'     : (tagWidth - buttonSize - borderSize) + 'px',
                'height'    : (tagHeight - borderSize) + 'px',
                'cursor'    : 'move'
            });

            htmlButton.css({
                'width'     : buttonSize + 'px',
                'height'    : (tagHeight - borderSize) + 'px',
                'cursor'    : 'move'
            });
            
            htmlButton.bind('click', {}, function(e) { 
                htmlInput.autocomplete('close')
            })
            
                        
            htmlInput.autocomplete( "widget" ).remove();
            
            if (tag.currentSelector && tag.currentSelector != -1) {
                D.tag.showComboboxAutocomplete(/waf-combobox-list/.test(tag.currentSelector) ? true : false)
            }
        //}
        
    }    
});
