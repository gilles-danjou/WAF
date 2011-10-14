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
        options     : ['create', 'simple', 'save', 'next', 'previous', 'last', 'first']
    },
    {
        name        : 'data-link',
        description : 'Link'
    },
    {
        name        : 'tabindex',
        description : 'Tabindex',
        typeValue   : 'integer'
    }],
    events: [
    {
        name       : 'touchstart',
        description: 'On Touch Start',
        category   : 'Touch Events'
    },
    {
        name       : 'touchend',
        description: 'On Touch End',
        category   : 'Touch Events'
    },
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
            label       : false
        }
    },
    onInit: function (config) {
        var button = new WAF.widget.Button(config);
        return button;
    },
    onDesign: function (config, designer, tag, catalog, isResize) {

        var theme       = tag.config.attributes[4].options;
        var t           = 0;
        var val         = '';
        var editBox     = {};
        var style       = [];
        var nb          = 0;
        var thisI       = 0;
        var toinnerHTML = '';
        var textSize    = 0;
        var url         = '';
        var bt          = {};
        var path        = '';
        
        if (!isResize) {
            var text = tag.getAttribute('data-text').getValue();

            if (text.length == 0 && tag.getAttribute('data-action').getValue() == "simple") {
                text = '[' + tag.getAttribute('id').getValue() + ']';
            } else if (text.length == 0 && tag.getAttribute('data-action').getValue() != "simple") {
                text = tag.getAttribute('data-action').getValue();
            }
            
            bt = document.getElementById(tag.getAttribute('id').getValue());

            if (tag.getAttribute('data-state-1').getValue() && !tag.getAttribute('data-text').getValue() ) {
                text = '';
            }

            var cntText = document.createElement('span');
            cntText.setAttribute('class', 'text');
            cntText.innerHTML = text + ' ';
            bt.appendChild(cntText);

            if (tag.getAttribute('data-src')) {
                path = Designer.util.formatPath(tag.getAttribute('data-state-' + thisI).getValue());
                url = path.fullPath;
            }

            // Append 4 states
            for (var i = 1; i <= 4; i +=1) {
                if (tag.getAttribute('data-state-' + i) && tag.getAttribute('data-state-' + i).getValue()) {
                    url = Designer.util.formatPath(tag.getAttribute('data-state-' + i).getValue()).fullPath;
                    toinnerHTML += '<img src="' + url  + '" class="data-state-' + i + '" />';
                    nb += 1;
                    thisI = i;
                }
            }

            if (nb === 1) {
                url = Designer.util.formatPath(tag.getAttribute('data-state-' + thisI).getValue()).fullPath;
                toinnerHTML += '<img src="' + url  + '" class="data-state-1 data-state-2 data-state-3 data-state-4" />';
            }

            bt.innerHTML += toinnerHTML;

            if (tag.style['font-size']) {
                textSize = tag.style['font-size'];
            } else {
                textSize = $('#' + bt.id + ' span.text').css('font-size');
            }

            $('#' + bt.id + ' .text').css('margin-top', '-' + parseInt(textSize)/2 + 'px');

            var dbClickFn = function(){};

            // Dblclick event
            $('#' + bt.id).dblclick( dbClickFn = function (e) {
                // Force focus on widget
                tag.setFocus(true);

                // lock d&d
                tag.lock();

                $(this).unbind('dblclick');

                /* No text for image or none button theme */
                if (tag.getTheme() === 'image' || tag.getTheme() === 'none') return;

                $('#' + tag.getAttribute('id').getValue() + ' span').hide();

                editBox = document.createElement('input'),
                editBox.setAttribute('id', 'waf_button_editBox_' + tag.getAttribute('id').getValue());
                editBox.setAttribute('type', 'text');
                editBox.setAttribute('data-type', 'button');
                style = [];

                for (t in tag.style) {
                    val = tag.style[t];
                    if(t === 'top' || t === 'left') {
                        val = '0';
                    }
                    style.push(t + ':' + val)
                }

                if ( !tag.style['text-align'] ) {
                    style.push('text-align:center');
                }

                style.push('background:none');
                style.push('border:none');

                editBox.setAttribute('style', style.join(';'));
                editBox.setAttribute('value', text);

                document.getElementById(tag.getAttribute('id').getValue()).appendChild(editBox);

                editBox.focus();


                tag.editBox = editBox.id;
                editBox.style.cursor = 'text';
                
                // Disable the events key
                Designer.ui.core.disableKeyEvent();

                Designer.api.setListenerMode(false);
                tag.resize.lock(true);
                YAHOO.util.Event.stopEvent(e);

                editBox.focus();


                editBox.onkeydown = function (e) {
                    if (e.keyCode === 13 && (!e.shiftKey || tag.getAttribute('data-multiline').getValue() === 'false')) {
                        editBox.blur();
                    }
                }

                $('#' + editBox.id).bind('blur', {}, function(e){
                    if (D.getCurrent() && D.getCurrent() === tag) {
                        tag.setResizable(true);
                    }

                    $('#' + bt.id).bind('dblclick', {}, dbClickFn);

                    // unlock d&d
                    tag.unlock();

                    text = editBox.value;

                    tag.getAttribute('data-text').setValue(text);
                    tag.update();
                    tag.domUpdate();

                    tag.editBox = null;

                    Designer.ui.core.enableKeyEvent();
                    
                    Designer.api.setListenerMode(true);
                    tag.resize.unlock(true);


                    $('#' + tag.getAttribute('id').getValue() + ' span').html(editBox.value);
                    $('#' + tag.getAttribute('id').getValue() + ' span').show();
                    $('#' + tag.getAttribute('id').getValue() + ' #waf_button_editBox_' + tag.getAttribute('id').getValue()).remove();

                });

            });
        }
    }    
});
