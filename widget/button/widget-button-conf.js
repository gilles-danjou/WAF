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
    type       : 'button',
    lib        : 'WAF',
    description: 'Button',
    category   : 'Controls',
    img        : '/walib/WAF/widget/button/icons/widget-button.png',
    tag        : 'button',
    attributes : [
    {
        name       : 'data-binding',
        description: 'Source'
    },
    {
        name       : 'class',
        description: 'Css class'
    },
    {
        name       : 'data-text',
        description: 'Text'
    },
    {
        name       : 'data-state-1',
        visibility : 'hidden'
    },
    {
        name       : 'data-state-2',
        visibility : 'hidden'
    },
    {
        name       : 'data-state-3',
        visibility : 'hidden'
    },
    {
        name       : 'data-state-4',
        visibility : 'hidden'
    },
    {
        name        : 'data-action',
        description : 'Action',
        defaultValue: 'simple',
        type        : 'dropdown',
        options     : [{
            key     : 'create',
            value   : 'Create'
        },{
            key     : 'simple',
            value   : 'Simple'
        },{
            key     : 'save',
            value   : 'Save'
        },{
            key     : 'next',
            value   : 'Next'
        },{
            key     : 'previous',
            value   : 'Previous'
        },{
            key     : 'last',
            value   : 'Last'
        },{
            key     : 'first',
            value   : 'First'
        }]
    },
    {
        name        : 'data-link',
        description : 'Link'
    },
    {
        name        : 'data-target',
        description : 'Target',
        type        : 'dropdown',
        options     : ['_blank', '_self'],
        defaultValue: '_blank'
    },
    {
        name        : 'tabindex',
        description : 'Tabindex',
        typeValue   : 'integer'
    }],
    events: [
    {
        name       : 'click',
        description: 'On Click',
        category   : 'Mouse Events'
    },
    {
        name       : 'dblclick',
        description: 'On Double Click',
        category   : 'Mouse Events'
    },
    {
        name       : 'mousedown',
        description: 'On Mouse Down',
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
    style: [,
    {
        name        : 'width',
        defaultValue: '82px'
    },
    {
        name        : 'height',
        defaultValue: '28px'
    }],
    properties: {
        style: {
            theme       : {
                'roundy'    : false
            },
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            shadow      : true,
            textShadow  : true,
            innerShadow : true,
            label       : false
        },
        state : [{
                label   : 'hover',
                cssClass: 'waf-state-hover',
                find    : ''
        },{
                label   : 'active',
                cssClass: 'waf-state-active',
                find    : ''
        },{
                label   : 'focus',
                cssClass: 'waf-state-focus',
                find    : ''
        }]
    },
    onInit: function (config) {
        var button = new WAF.widget.Button(config);
        return button;
    },
    onDesign: function (config, designer, tag, catalog, isResize) {
        var
        tagId,
        nb,
        thisI,
        toinnerHTML,
        textSize,
        url,
        path,
        htmlObject,
        dbClickFn,
        htmlObjectInput,
        imgHTML;

        tagId       = tag.getId();
        htmlObject  = $('#' + tagId);
        nb          = 0;
        thisI       = 0;
        textSize    = 0;
        toinnerHTML = '';
        url         = '';
        path        = '';
        imgHTML     = '';
        
        if (!isResize) {
            var text = tag.getAttribute('data-text').getValue();

            if (text.length == 0 && tag.getAttribute('data-action').getValue() == "simple") {
                text = '[' + tagId + ']';
            } else if (text.length == 0 && tag.getAttribute('data-action').getValue() != "simple") {
                text = tag.getAttribute('data-action').getValue();
            }

            if (tag.getAttribute('data-state-1').getValue() && !tag.getAttribute('data-text').getValue() ) {
                text = '';
            }
            toinnerHTML = '<span class="text"></span>';

            if (tag.getAttribute('data-src')) {
                path = Designer.util.formatPath(tag.getAttribute('data-state-' + thisI).getValue());
                url = path.fullPath;
            }

            // Append 4 states
            if (nb === 1) {
                url = Designer.util.formatPath(tag.getAttribute('data-state-' + thisI).getValue()).fullPath;
                imgHTML += '<img src="' + url  + '" class="data-state-1 data-state-2 data-state-3 data-state-4" />';
            } else {
                for (var i = 1; i <= 4; i +=1) {
                    if (tag.getAttribute('data-state-' + i) && tag.getAttribute('data-state-' + i).getValue()) {
                        url = Designer.util.formatPath(tag.getAttribute('data-state-' + i).getValue()).fullPath;
                        imgHTML += '<img src="' + url  + '" class="data-state-' + i + '" />';
                        nb += 1;
                        thisI = i;
                    }
                }
            }

            htmlObject.html(toinnerHTML + imgHTML);
            
            // escape text
            $('#' + tagId + ' span').text(text);                   

            if (tag.style['font-size']) {
                textSize = tag.style['font-size'];
            } else {
                textSize = $('#' + tagId + ' span.text').css('font-size');
            }

            $('#' +tagId + ' .text').css('margin-top', '-' + parseInt(textSize)/2 + 'px');

            // Dblclick event
            htmlObject.bind('dblclick', {}, dbClickFn = function dbClickFn (e) {                   
                var 
                text;
                
                Designer.env.editMode = tag;
                
                tag.setFocus(true);
                    
                /* No text for image or none button theme */
                if ((tag.getTheme() === 'image' || tag.getTheme() === 'none') && !tag.getAttribute('data-text').getValue() ) {
                    return;
                }

                text = tag.getAttribute('data-text').getValue();

                if (text.length == 0 && tag.getAttribute('data-action').getValue() == "simple") {
                    text = '[' + tagId + ']';
                } else if (text.length == 0 && tag.getAttribute('data-action').getValue() != "simple") {
                    text = tag.getAttribute('data-action').getValue();
                }
                
                
                // Disable the events key
                Designer.ui.core.disableKeyEvent();
                Designer.api.setListenerMode(false);
                tag.resize.lock(true);
                YAHOO.util.Event.stopEvent(e);
                $(this).attr('disabled', 'disabled'); 
                // lock d&d
                tag.lock();
                
                htmlObject.html('<input />' + imgHTML);            
            
                htmlObjectInput = htmlObject.children('input');
                htmlObjectInput.focus();
                htmlObjectInput.val(text);
                
                // Append inherit css
                htmlObjectInput.css({
                    'width'             : tag.getWidth() + 'px',
                    'height'            : tag.getHeight() + 'px',
                    'resize'            : 'none',
                    'overflow'          : 'hidden',
                    'background'        : 'none',
                    'border'            : 'none',
                    'font-size'         : 'inherit',
                    'font-style'         : 'inherit',
                    'font-family'       : 'inherit',
                    'font-weight'       : 'inherit',
                    'text-decoration'   : 'inherit',
                    'text-align'        : 'inherit',
                    'letter-spacing'    : 'inherit',
                    'color'             : tag.getComputedStyle('color'),
                    'margin-top'        : '-1px',
                    'margin-left'       : '-1px'
                });
                 
                htmlObjectInput.select();

                htmlObjectInput.bind('keydown', {}, function (e) {
                    if (e.keyCode === 13) {
                        $(this).blur();
                    }
                })

                htmlObjectInput.bind('blur', {}, function(e){
                    var 
                    newValue;
                    
                    newValue = $(this).val();
                    
                    if (D.getCurrent() && D.getCurrent() === tag) {
                        tag.setResizable(true);
                    }

                    htmlObject.bind('dblclick', {}, dbClickFn);

                    // unlock d&d
                    tag.unlock();


                    tag.getAttribute('data-text').setValue(newValue);
                    tag.update();
                    tag.domUpdate();

                    tag.editBox = null;

                    Designer.ui.core.enableKeyEvent();
                    
                    Designer.api.setListenerMode(true);
                    tag.resize.unlock(true);                    
                    

                    htmlObject.html('<span class="text"></span>' + imgHTML);
                    
                    // escape text
                    $('#' + tagId + ' span').text(newValue);  

                    htmlObject.removeAttr('disabled');
                    
                    D.tag.refreshPanels();
                    
                    Designer.env.editMode = false;
                });

            });
        }
    }    
});
