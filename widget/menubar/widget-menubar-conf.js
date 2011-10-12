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
    type        : 'menuBar',
    lib         : 'WAF',
    description : 'Menu Bar',
    category    : 'Controls',
    img         : '/walib/WAF/widget/menuBar/icons/widget-menuBar.png',
    tag         : 'ul',
    attributes  : [
    {
        name       : 'class',
        description: 'Css class'
    },
    {
        name        : 'data-display',
        description : 'Display',
        type        : 'dropdown',
        options     : [{
                key     : 'vertical',
                value   : 'Vertical'
        },{
                key     : 'horizontal',
                value   : 'Horizontal'
        }],
        defaultValue: 'horizontal'
    },
    {
        name        : 'data-subMenuShow',
        description : 'Show Submenus',
        type        : 'dropdown',
        options     : [{
            key     : 'hover', 
            value   : 'On Mouse Over'
        },{
            key     : 'click',
            value   :'On Mouse Click'
        }],
        defaultValue: 'hover'
    }],
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
    style: [
    {
        name        : 'width',
        defaultValue: '300px'
    },
    {
        name        : 'height',
        defaultValue: '26px'
    }],
    properties: {
        style: {
            theme       : true,
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            label       : true,
            shadow      : true,
            disabled    : ['border-radius']
        }
    },
    structure: [{
        description : 'menuItem',
        selector    : '.waf-menuItem'
    }],
    onInit: function (config) {
        var widget  = new WAF.widget.MenuBar(config);
        return widget;
    },
    onDesign : function (config, designer, tag, catalog, isResize) {
        var 
        htmlObject,
        menuItems,
        menuItemsLength,
        tagWidth,
        tagHeight,
        i,
        diff,
        children,
        totalWidth,
        totalHeight,
        menuItemTag,
        parent,
        menuItem,
        t;
            
        htmlObject      = $('#' + tag.getId());
        menuItems       = tag.getMenuItems();
        menuItemsLength = menuItems.count();
        tagWidth        = $('#' + tag.getId()).width();
        tagHeight       = $('#' + tag.getId()).height();
        i               = 0;        
        diff            = 0;
        totalWidth      = 0;
        totalHeight     = 0;
        menuItemTag     = {};
        parent          = tag.getParent();
        
        htmlObject.removeClass('waf-menuBar-vertical waf-menuBar-horizontal')
        htmlObject.addClass('waf-menuBar-' + tag.getAttribute('data-display').getValue());        
        
        for (t in WAF.widget.themes) {
                $('#' + tag.getId()).removeClass(t)
        }

        $('#' + tag.getId()).addClass(tag.getTheme());
        
        if (isResize) {   
            children    = htmlObject.children();
            for (i = 0; i < menuItemsLength; i += 1) {
                menuItem = menuItems.get(i);
                menuItemTag = menuItem.getTag();
                $(children[i]).append($('#' + menuItemTag.getOverlayId()));

                totalWidth += menuItemTag.getWidth();
                totalHeight += menuItemTag.getHeight();

                if (isResize.redrawItems != false) {   
                    menuItem.redraw(false, true);
                }
            }   
                        
            if (menuItemsLength > 0) {
                // Resize menu bar
                switch (tag.getAttribute('data-display').getValue()) {
                    case 'horizontal':
                        if (totalWidth >= tagWidth) {
                            diff = totalWidth - tagWidth;
                            tag.setWidth( $('#' + tag.getOverlayId()).width() + diff, false);
                        }
                        break;

                    case 'vertical':
                        if (totalHeight >= tagHeight) {
                            diff = totalHeight - tagHeight;
                            if (tag.getParent().isMenuItem()) {
                                diff += 1;
                            }

                            tag.setHeight( $('#' + tag.getOverlayId()).height() + diff, false);
                        }
                        break;
                }
            }
        }
        
        if (parent && parent.isMenuItem()) {
            $('#' + tag.getOverlayId()).css('position', 'absolute !important');
        }
    }
});
