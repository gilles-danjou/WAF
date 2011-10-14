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
    type        : 'menuItem',
    lib         : 'WAF',
    description : 'Menu Item',
    category    : 'Hidden',
    img         : '/walib/WAF/widget/menuItem/icons/widget-menuItem.png',
    tag         : 'li'/*,
    attributes  : [{
        name       : 'class',
        description: 'Css class'
    }]*/,
    events: [{
        name       : 'click',
        description: 'On Click',
        category   : 'Mouse Events'
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
    style: [{
        name        : 'width',
        defaultValue: '100px'
    },
    {
        name        : 'height',
        defaultValue: '24px'
    }],
    properties: {
        style: {
            theme       : false,
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            label       : true,
            textShadow  : true,
            innerShadow : true,
            disabled    : ['left', 'top', 'z-index']
        },
        state : [{
                label   : 'hover',
                cssClass: 'waf-state-hover'
        },{
                label   : 'active',
                cssClass: 'waf-state-active'
        }]
    },
    structure: [],
    onInit: function (config) {
        var widget  = new WAF.widget.MenuItem(config);
        return widget;
    },
    onDesign : function (config, designer, tag, catalog, isResize) { 
        var
        htmlObject,
        fnDblclick,
        t;
        
        htmlObject = $('#' + tag.getId());     
        
		for (t in WAF.widget.themes) {
			$('#' + tag.getId()).removeClass(t)
		}
		
		$('#' + tag.getId()).addClass(tag.getTheme());
        
        // Edit menu item text on dblclick
        fnDblclick = function(e) {
            var
            htmlObject,
            htmlObjectP,
            htmlObjectPText,
            htmlObjectArea,
            textWidth,
            textHeight,
            menuItem,
            textValue,
            parent;
            
            Designer.env.editMode = tag;
            
            
            parent          = tag.getParent();
            menuItem        = parent.getMenuItems().getByName(tag.getId());
            htmlObject      = $(this);
            htmlObjectP     = htmlObject.children('p');
            htmlObjectPText = htmlObjectP.children('span');
            htmlObjectPText = htmlObjectP.children('span');
            
            // Remove outline on other items
            $('#' + parent.getId() + ' .waf-menuItem').parents('.yui-overlay').removeClass(Designer.constants.style.widgets.focused + ' ' + Designer.constants.style.widgets.outline);
            
            tag.setCurrent();
            tag.lock();
            tag.getParent().lock();
            D.tag.refreshPanels();            
            
            //htmlObject.unbind('dblclick');
            e.stopPropagation();
            
            textWidth       = htmlObjectPText.width();
            textHeight      = htmlObjectPText.height();

            textValue       = menuItem.getText();
            
            // Disable the events key
            Designer.ui.core.disableKeyEvent();
            
            htmlObjectPText.html('<textarea></textarea>');
            
            
            htmlObjectArea = htmlObjectPText.children('textarea');
            htmlObjectArea.focus();
            htmlObjectArea.val(textValue);
            
            // Auto select the textarea containt
            htmlObjectArea.select();
            
            // set the css the same as the parent
            htmlObjectArea.css({
                'width'             : textWidth + 'px',
                'height'            : textHeight + 'px',
                //'margin-top'        : '1px',
                'resize'            : 'none',
                'overflow'          : 'hidden',
                //'background'      : 'rgba(255,255,255,0.8)',
                'background'        : 'none',
                'border'            : 'none',
                'font-size'         : 'inherit',
                'font-family'       : 'inherit',
                'font-weight'       : 'inherit',
                'text-decoration'   : 'inherit',
                'text-align'        : 'inherit'
            });
            
            
            $.fn.extend({
                save : function () {
                    var
                    htmlObject,
                    menuItem,
                    oldValue,
                    newValue;

                    htmlObject  = $(this);

                    menuItem    = tag.getParent().getMenuItems().getByName(tag.getId());
                    oldValue    = menuItem.getText();
                    newValue    = htmlObject.val();
                    
                    if (oldValue != newValue) {
                        menuItem.setText(newValue);                    
                    } else {
                        htmlObject.parent().html(oldValue.replace(/\n/g, '<br />'));
                    }
                    
                    // Enable the events key
                    Designer.ui.core.enableKeyEvent();
                    
                    D.tag.refreshPanels();
                    
                    tag.unlock();
                    tag.getParent().unlock();
                    
                    $('#' + tag.getId()).bind('dblclick', fnDblclick);
                    
                    Designer.env.editMode = false;
                }
            });
            
            htmlObjectArea.bind('blur', $(this).save);
            
            htmlObjectArea.bind('keypress', function(e) {
                if (e.keyCode === 13 && !e.shiftKey) {
                    $(this).save();
                }
            });
            
            
        }
        htmlObject.bind('dblclick', fnDblclick);
        
        htmlObject.bind('dblclick', function(e) {e.stopPropagation();});
    }
});
