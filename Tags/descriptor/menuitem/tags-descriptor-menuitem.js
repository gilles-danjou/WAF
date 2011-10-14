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
WAF.tags.descriptor.menuItem = {}
    
/**
 * MenuItem of Tag Descriptor
 * @namespace WAF.tags.descriptor
 * @class MenuItem
 * @params {Object} config parameters
 */
WAF.tags.descriptor.MenuItem = function(config) {
    config              = config            || {};
    
    config.text         = config.text       || null;
    config.icon         = config.icon       || null;
    config.margin       = config.margin     || 10;
    config.tag          = config.tag        || null;
    config.iconPos      = config.iconPos    || 'top';
    config.padding      = config.padding    || 0;
    
    this._text          = config.text;
    this._icon          = config.icon;
    this._iconPosition  = config.iconPos;
    this._padding       = config.padding;
    this._parent        = config.parent;
    this._tag           = config.tag;
    
    this._value         = '';    
    this._name          = null;
};


/**
 * 
 */
WAF.tags.descriptor.MenuItem.prototype.init = function ( init ) {
    var 
    menuItemLi,
    parentHTML,
    tagDefinition,
    menuItem,
    borderLeft,
    borderTop;
    
    menuItemLi      = $('<li>');
    parentHTML      = $('#' + this._parent.getId());
    tagDefinition   = Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('menuItem'));
    
    if (this._tag) {
        menuItem    = this._tag;
    } else {
        menuItem    = new Designer.tag.Tag(tagDefinition);
        borderLeft  = parseInt(this._parent.getComputedStyle('border-width')) * 2;
        borderTop   = borderLeft;  
        // create the tag
        menuItem.create({
            parent : this._parent
        });
        
        menuItem.setCss('text-align', 'center');
        
        switch(this._parent.getAttribute('data-display').getValue() ) {
            case 'horizontal' :       
                menuItem.setHeight(this._parent.getHeight() - borderTop, false)
                break;
                
            case 'vertical' :       
                menuItem.setWidth(this._parent.getWidth() - borderLeft, false)
                break;
        }               

        menuItem.save(false, false, false);           
    }

    menuItem.setParent(this._parent);    
    
    // Disable d&d
    menuItem.ddElt.lock();

    menuItemLi.append($('#' + menuItem.getOverlayId()));
    
    parentHTML.append(menuItemLi);   

    menuItem._menuItem = this;    

    this.setDescriptor(menuItem);    
    
    this.refreshContaint(init);
    
    this._id = menuItem.getId();  
    
    this._name = menuItem.getId();     
}

/**
 * Set the descriptor to link to the menu item
 * @namespace WAF.tags.descriptor.MenuItem
 * @method setDescriptor
 * @param {WAF.tags.Descriptor} descriptor descriptor to link
 */
WAF.tags.descriptor.MenuItem.prototype.setDescriptor = function (descriptor) {
    this._descriptor = descriptor;
};

/**
 * Set the text value of the menu item
 * @namespace WAF.tags.descriptor.MenuItem
 * @method setText
 * @param {String} value
 */
WAF.tags.descriptor.MenuItem.prototype.setText = function (value) {
    this._text = value;
    this.refreshContaint();
    this.getTag().domUpdate();
};

/**
 * Set the icon value of the menu item
 * @namespace WAF.tags.descriptor.MenuItem
 * @method setIcon
 * @param {String} value
 */
WAF.tags.descriptor.MenuItem.prototype.setIcon = function (value) {
    this._icon = value;
    this.refreshContaint();
    this.getTag().domUpdate();
};

/**
 * Set the icon value of the menu item
 * @namespace WAF.tags.descriptor.MenuItem
 * @method setIcon
 * @param {String} value
 */
WAF.tags.descriptor.MenuItem.prototype.setIconPosition = function (value) {
    this._iconPosition = value;
    this.refreshContaint();
    this.getTag().domUpdate();
};

/**
 * Set the associated tag
 * @namespace WAF.tags.descriptor.MenuItem
 * @method getTag
 */
WAF.tags.descriptor.MenuItem.prototype.getTag = function () {
    return this._descriptor;
};


/**
 * Get the text value
 * @namespace WAF.tags.descriptor.MenuItem
 * @method getText
 */
WAF.tags.descriptor.MenuItem.prototype.getText = function () {
    return this._text;
};


/**
 * Get the text value
 * @namespace WAF.tags.descriptor.MenuItem
 * @method getText
 */
WAF.tags.descriptor.MenuItem.prototype.getValue = function () {
    return this._value;
};


/**
 * Get the icon value
 * @namespace WAF.tags.descriptor.MenuItem
 * @method getIcon
 */
WAF.tags.descriptor.MenuItem.prototype.getIcon = function () {
    return this._icon;
};


/**
 * Get the icon position
 * @namespace WAF.tags.descriptor.MenuItem
 * @method getIconPosition
 */
WAF.tags.descriptor.MenuItem.prototype.getIconPosition = function () {        
    return this._iconPosition;
};


/**
 * Get the value of the name of the attribute
 * @namespace WAF.tags.descriptor.Attribute
 * @method getName
 * @return {String} the value of the attribute
 */
WAF.tags.descriptor.MenuItem.prototype.getName = function () {
    return this._id;
};

/**
 * Refresh the menu item containt
 * @namespace WAF.tags.descriptor.MenuItem
 * @method refreshContaint
 * @param {Boolean} indicate if the widget has just been init
 */
WAF.tags.descriptor.MenuItem.prototype.refreshContaint = function ( init ) {
    var 
    aText,
    tag,
    htmlObject,
    paragraphe,
    tagHeight,
    tagWidth,
    text1,
    text2,
    iconClass,
    pHeight,
    pWidth,
    tagParent,
    valueToCheck,
    borderLeft,
    borderTop,
    computedPadding,
    path,
    url;
    
        
    aText           = '';
    text1           = '';
    text2           = '';
    tag             = this.getTag();
    tagHeight       = tag.getHeight();
    tagWidth        = tag.getWidth();
    tagParent       = tag.getParent();
    htmlObject      = $('#' + tag.getId());
    iconClass       = this._iconPosition ? 'waf-menuItem-icon-' + this._iconPosition : '';
    borderLeft      = parseInt(tagParent.getComputedStyle('border-width'));
    borderTop       = borderLeft;  
        
    computedPadding = tag.getComputedStyle('padding-left');
    this._padding   = computedPadding ? parseInt(computedPadding) : 0;   
    
    this._text      = this._text || '';
    this._icon      = this._icon || '';
    
    valueToCheck    = this._text + this._icon + this._iconPosition;
    
    if (valueToCheck != this._value) {
        htmlObject.children('p').remove();

        paragraphe = $('<p>').addClass(Designer.constants.menuItem.spanTextClass + ' ' + iconClass).appendTo(htmlObject);        

        if (this._icon) {            
            path    = Designer.util.cleanPath(this._icon.replace('/', ''));
            url     = path.fullPath;

            //text1 += '<img src="../walib/WAF/widget/image/icons/onebit_18.png" />';
            text1 = '<img src="' + url + '" />';
        }

        if (this._text) {
            text2 = '<span>' + this._text + '</span>';
        }

        if (this._iconPosition === 'bottom' || this._iconPosition === 'right') {
            aText = text2 + text1;
        } else {
            aText = text1 + text2;
        }
            
        this._value = this._text + this._icon + this._iconPosition;

        paragraphe.html(aText.replace(/\n/g, '<br />'));
    } else {
        paragraphe = htmlObject.children('p');
    }
    
    pHeight = paragraphe.height() + (this._padding * 2);
    pWidth  = paragraphe.width() + (this._padding * 2);    
    
    // Check paragraphe height & width to resize menu item then menu bar
    switch(tagParent.getAttribute('data-display').getValue() ) {
        case 'horizontal' :       
            if (tagHeight < pHeight && !init) {
                tagParent.setHeight(pHeight, true); // true to refresh widget      
                pHeight -= borderTop;
                pHeight -= (this._padding * 2);
            } else {
                pHeight = tagHeight - (this._padding * 2);
            }

            // Check paragraphe width to resize menu item then menu bar
            if (tagWidth < pWidth && !init) {
                tagWidth = pWidth;
                tag.setWidth(tagWidth);
                tagParent.onDesign(true);  
                pWidth -= borderLeft;
                pWidth -= (this._padding * 2);
            } else {
                pWidth = tagWidth - (this._padding * 2);
            }               
            break;
            
        default :            
            if (tagWidth < pWidth && !init) {
                tagParent.setWidth(pWidth, true); // true to refresh widget      
                pWidth -= borderLeft - (this._padding * 2);
            } else {
                pWidth = tagWidth - (this._padding * 2);
            } 

            // Check paragraphe width to resize menu item then menu bar
            if (tagHeight < pHeight && !init) {
                tagHeight = pHeight;
                tag.setHeight(tagHeight);
                tagParent.onDesign(true);    
                pHeight -= borderTop; 
                pHeight -= (this._padding * 2); 
            } else {
                pHeight = tagHeight - (this._padding * 2);
            }            
            break;
    }
    
    htmlObject.children('.' + Designer.constants.menuItem.spanTextClass).css('height', pHeight + 'px');
    htmlObject.children('.' + Designer.constants.menuItem.spanTextClass).css('width', pWidth + 'px');
}

/**
 * Redraw the menu item & resize his parent
 * @namespace WAF.tags.descriptor.MenuItem
 * @method redraw
 */
WAF.tags.descriptor.MenuItem.prototype.redraw = function (size, position) {
    var 
        tag,
        parent,
        borderLeft,
        borderTop;
    
    tag             = this._descriptor;
    parent          = this._parent;  
    borderLeft      = parseInt(parent.getComputedStyle('border-width'));
    borderTop       = borderLeft;  
            
    // Resize height
    if (parent.getAttribute('data-display').getValue() === 'horizontal') {
        tag.setHeight(parent.getHeight() - (borderTop*2), true);
    } else {
        tag.setWidth(parent.getWidth() - (borderLeft*2), true);
    }
    
    if (tag._menuBar) {   
        
        if (parent.getAttribute('data-display').getValue() === 'horizontal') {
            if (position) {
                tag._menuBar.setXY(0, tag.getHeight() + borderTop, true);
            }
            if (size) {
                tag._menuBar.setWidth(tag.getWidth());
            }
        } else {
            if (position) {
                tag._menuBar.setXY(tag.getWidth() + borderLeft, 0, true);
            }
            if (size) {
                tag._menuBar.setHeight(tag.getHeight());
            }
        }
    }
    
    $('#' + tag.getId()).children('.' + Designer.constants.menuItem.spanTextClass).css('height', tag.getHeight() - (this._padding * 2) + 'px');
    $('#' + tag.getId()).children('.' + Designer.constants.menuItem.spanTextClass).css('width', tag.getWidth() - (this._padding * 2)  + 'px');
}

/**
 * Remove the menu item
 * @namespace WAF.tags.descriptor.MenuItem
 * @method remove
 */
WAF.tags.descriptor.MenuItem.prototype.remove = function () {   
    var 
    i,
    position,
    length,
    menuItems,
    menuItem,
    tag,
    tagParent,
    tagSize,
    tagParentSize;

    i           = 0;
    position    = -1;
    length      = 0;
    menuItems   = this._parent.getMenuItems();
    menuItem    = {};

    length = menuItems.count();
    
    // Resize menubar
    for (i = 0; i < length; i++) {
        menuItem = menuItems.get(i);
        if (menuItem == this) {
            position        = i;
            menuItems._list = menuItems._list.slice(0, position).concat(menuItems._list.slice(position+1));
            tag             = menuItem.getTag();   
            tagParent       = tag.getParent();         
            tag._menuItem   = false;            
            
            // Resize menubar
            if (tagParent.getAttribute('data-display').getValue() === 'vertical') {
                tagSize       = tag.getHeight();
                tagParentSize = tagParent.getHeight();
                tagParent.setHeight(tagParentSize - tagSize);                
            } else {
                tagSize       = tag.getWidth();
                tagParentSize = tagParent.getWidth();
                tagParent.setWidth(tagParentSize - tagSize);     
            }
            
            D.tag.deleteWidgets(tag, false);
            
            $('#' + tag.getOverlayId()).css('display', 'none')
            
            if (menuItems.count() === 0) {
                //D.tag.deleteWidgets(this._parent, false);
            }
            break;
        }
    }       
    
}
    

// PUBLIC

/**
 * Add a menu item to the menu bar
 * @namespace WAF.tags.Descriptor 
 * @method addToMenuBar
 */
WAF.tags.Descriptor.prototype.addToMenuBar = function (config) {
    var menuItemList    = config.parent.getMenuItems();
    var menuItem        = new WAF.tags.descriptor.MenuItem({
        parent  : config.parent,
        tag     : this,
        text    : config.text       || null,
        icon    : config.icon       || null,
        iconPos : config.iconPos    || null
    });   
    
    menuItem.init(true);    
    
    menuItemList.add(menuItem);        
};

    