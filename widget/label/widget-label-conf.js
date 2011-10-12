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
    type        : 'label',
    lib         : 'WAF',
    description : 'Label',
    category    : 'Hidden',
    tag         : 'label',
    attributes  : [
    {
        name : 'data-text'
    },
    {
        name : 'data-linked' // DEPRECATED
    },
    {
        name : 'for'
    },
    {
        name: 'data-valign',
        defaultValue: 'middle'
    }],
    style       : [
    {
        name        : 'width',
        defaultValue: '75px'
    },
    {
        name        : 'height',
        defaultValue: '22px'
    }],
    onInit: function (config) {
        return new WAF.widget.Label(config);     
    },

    onDesign: function (config, designer, tag, catalog, isResize) {
        var
        htmlObject,
        tmpHtmlObject,
        tmpWidth,
        tmpHeight,
        width,
        height,
        minWidth,
        maxWidth,
        linked,
        labelTextAlign,
        text;
        
        htmlObject      = tag.getHtmlObject();
        width           = tag.getWidth();
        height          = tag.getHeight();
        minWidth        = parseInt(tag.getComputedStyle('min-width'));
        maxWidth        = parseInt(tag.getComputedStyle('max-width'));
        linked          = tag.getLinkedTag();
        text            = tag.getAttribute('data-text').getValue();       
            
        labelTextAlign  = tag.getComputedStyle('text-align'); 
              
        htmlObject.attr('for', tag.getAttribute('for').getValue())
              
        /*
         * get/create the temporary html object
         */ 
        tag._getTmpHtmlObject = function tag_createTmpHtmlObject(text) {
            var 
            tmpHtmlObject;

            if ($('#waf-tmp-div').length > 0) {
                tmpHtmlObject = $('#waf-tmp-div');
            } else {
                tmpHtmlObject   = $('<div id="waf-tmp-div">'); 
            }

            /*
             * Set the temporary html object
             */    
            tmpHtmlObject.appendTo('body'); 
            tmpHtmlObject.html(text);
            
            tmpHtmlObject.css({
                /*
                 * Keep the same css as the tag
                 */    
                'font-size'         : this.getComputedStyle('font-size'),
                'font-style'        : this.getComputedStyle('font-style'),
                'font-family'       : this.getComputedStyle('font-family'),
                'font-weight'       : this.getComputedStyle('font-weight'),
                'text-decoration'   : this.getComputedStyle('text-decoration'),
                'text-align'        : this.getComputedStyle('text-align'),
                'letter-spacing'    : this.getComputedStyle('letter-spacing'),
                'min-width'         : this.getComputedStyle('min-width'),
                'max-width'         : this.getComputedStyle('max-width'),
                'position'          : 'absolute',

                'z-index'           : '10000',
                'left'              : '-10000px',
                'top'               : '-10000px',
                'background'        : '#FFCC66'
            });

            return tmpHtmlObject;
        }

        /*
         * Refreh the label position depending on the linked widget position
         */
        tag._refreshPosition = function label_refreshPosition() {
            var
            left,
            top,
            linked,
            position,
            width, 
            height,
            padding;

            left    = 0;
            top     = 0;
            padding = 5;
            linked  = this.getLinkedTag();
            width   = this.getWidth();
            height  = this.getHeight();
            
            
            if (!isNaN(linked.getX()) && !isNaN(linked.getY())) {
                top     = linked.getY();
                left    = linked.getX();
            }

            position = linked.getAttribute('data-label-position').getValue();
            switch( position ){
                case 'left' :
                    left -= width + 5;
                    break;

                case 'top' :
                    top -= height + 5;
                    break;

                case 'right' :
                    left += linked.getWidth() + padding;
                    break;

                case 'bottom' :
                    top += linked.getHeight() + padding;
                    break;
            }

            if ((position === 'left' || position === 'right') && this.getAttribute('data-valign')) {
                switch( this.getAttribute('data-valign').getValue() ){
                    case 'top' :
                        top = linked.getY();
                        break;

                    case 'middle' :
                        top += (linked.getHeight()/2) - (height/2);
                        break;

                    case 'bottom' :
                        top = linked.getY() + linked.getHeight() - height;
                        break;
                }
            }

            if ((position === 'top' || position === 'bottom') && labelTextAlign) {

                switch( labelTextAlign ){
                    case 'center' :
                        left += (linked.getWidth()/2) - (width/2);
                        break;

                    case 'right' :
                        left = linked.getX() + linked.getWidth() - width;
                        break;
                }
            }


            if (this.isFitToBottom() || this.isFitToRight()) {
                this.refreshPositionWithConstraints();
            } else {
                this.setXY(left, top);
                this.setStyle('width', width + 'px');
                this.setStyle('height', height + 'px');
                this.setStyle('left', left + 'px');
                this.setStyle('top', top + 'px');
            }
            
            if (isResize) {
                this.domUpdate();
            }
        }

        if (linked) {
            /*
             * Add label text
             */
            //htmlObject.html(text);
            htmlObject.text(text);

            htmlObject.css('height', 'auto');

            if (isNaN(maxWidth)) {
                maxWidth = 0;
            }

            tmpHtmlObject   = tag._getTmpHtmlObject(text);

            tmpWidth        = tmpHtmlObject.width();
            tmpHeight       = tmpHtmlObject.height();
            
            if (tmpWidth < minWidth) {
                tmpWidth = minWidth;
            }
            
            if (tmpWidth > maxWidth && maxWidth > 0) {
                tmpWidth = maxWidth;
            }
            /*
             * Set the size
             */
            if (tmpWidth > 0 && (tmpWidth+2 != tag.getWidth())) {
                tag.setWidth(tmpWidth, false);
            } 

            if (tmpHeight > 0 && (tmpHeight != tag.getHeight())) {
                tag.setHeight(tmpHeight, false);
            }   

            /*
             * Set the correct position
             */
            tag._refreshPosition();
        }
        
        /**
         * Refresh position with contraints
         * @method refreshPositionWithConstraints
         */
        tag.refreshPositionWithConstraints = function refreshPositionWithConstraints () {
            var linked  = this.getLinkedTag(),
            parentElt = this.getParent(),
            left = '',
            top = ''; 
                        
            if (linked) {
                                
                if (!linked.isFitToRight() && !this.isFitToRight()) {                    
                    // no right constraint
                    
                    if (!parentElt.isDocument()) {
                        left = parentElt.getWidth() - (this.getStyle('right') + this.getWidth());
                    } else {
                        left = this.getStyle('left') + 'px';
                    }                                                                                                                                                
                    $('#' + this.getOverlayId()).css('left', left);
                    if (left.toString().indexOf('px') == -1) {
                        left = left+'px';
                    }
                    this.style['left'] = left;                                    
                    $('#' + this.getOverlayId()).css('right', '');
                    this.style['right'] = '';
                } else {                    
                    // right constraint
                                        
                    if (!linked.isFitToLeft() && !this.isFitToLeft()) {
                        // no left constraint
                        $('#' + this.getOverlayId()).css('right', this.getStyle('right') + 'px');                                       
                        this.style['right'] = this.getStyle('right') + 'px'; 
                        $('#' + this.getOverlayId()).css('left', '');
                        this.style['left'] = '';
                    } else {
                        // already a left constraint
                        // do nothing
                    }
                }
                
                if (!linked.isFitToBottom() && !this.isFitToBottom()) {                
                    // no bottom constraint
                    if (!parentElt.isDocument()) {
                        top = parentElt.getHeight() - (this.getStyle('bottom') + this.getHeight());
                    } else {
                        top = this.getStyle('top') + 'px';
                    }                                        
                    $('#' + this.getOverlayId()).css('top', top);
                    if (top.toString().indexOf('px') == -1) {
                        top = top+'px';
                    }
                    this.style['top'] = top;
                    $('#' + this.getOverlayId()).css('bottom', '');
                    this.style['bottom'] = '';                                    
                } else {
                    // bottom constraint
                    
                    if (!linked.isFitToTop() && !this.isFitToTop()) {
                        // no top contraint
                        $('#' + this.getOverlayId()).css('bottom', this.getStyle('bottom') + 'px');
                        this.style['bottom'] = this.getStyle('bottom')+ 'px'; 
                        $('#' + this.getOverlayId()).css('top', '');
                        this.style['top'] = '';                                                            
                    } else {
                        // already a top constraint
                        // do nothing
                    }
                }                
            }
            
        }
        
        /**
         * dblClickFn events
         * @method dblClickFn
         * @param {event} e
         */
        tag.dblClickFn = function tag_dblClickFn(e){
            var
            text,
            editBox,
            linked,
            tmpHtmlObject,
            parentHtmlObject,
            tmpWidth,
            tmpHeight,
            htmlObject,
            tag;
            
            tag             = e.data && e.data.tag ? e.data.tag : D.getCurrent();  
            linked          = tag.getLinkedTag();            
            
            /*
             * Disable key event
             */
            Designer.ui.core.disableKeyEvent();
            Designer.api.setListenerMode(false);
            tag.resize.lock(true);
            YAHOO.util.Event.stopEvent(e);
            $(this).attr('disabled', 'disabled');
            
            /*
             * Lock d&d
             */
            tag.lock();
            tag.setFocus(true, false);
            
            linked.setFocus(false, false);
            
            htmlObject          = tag.getHtmlObject();            
            text                = tag.getAttribute("data-text").getValue();            
               
            tmpHtmlObject       = tag._getTmpHtmlObject(text);  
            parentHtmlObject    = htmlObject.parent();
            
            parentHtmlObject.css('overflow', 'hidden');
            
            /*
             * Create edit box with the same css as the tag
             */
            editBox = $('<textarea>');
            editBox.css({
                /*
                 * Keep the same css as the tag
                 */    
                'font-size'         : tag.getComputedStyle('font-size'),
                'font-family'       : tag.getComputedStyle('font-family'),
                'font-style'        : tag.getComputedStyle('font-style'),
                'font-weight'       : tag.getComputedStyle('font-weight'),
                'text-decoration'   : tag.getComputedStyle('text-decoration'),
                'text-align'        : tag.getComputedStyle('text-align'),
                'background-color'  : tag.getComputedStyle('background-color'),
                'background-image'  : tag.getComputedStyle('background-image'),
                'text-shadow'       : tag.getComputedStyle('text-shadow'),
                'letter-spacing'    : tag.getComputedStyle('letter-spacing'),
                'border'            : 'none',
                'width'             : '100%',
                'height'            : '100%',
                'resize'            : 'none',
                'overflow'          : 'hidden'
            });
            
            //editBox.html(text);
            editBox.text(text);
            
            parentHtmlObject.html(editBox);
            
            /*
             * Select the all text on focus
             */
            editBox.select();
            
            /*
             * Add key events
             */     
            editBox.bind('keydown', {}, function(e) {
                var
                value;
                
                value = $(this).val();
                
                value += e.shiftKey && e.keyCode == 13 ? '<br />' : String.fromCharCode(e.keyCode);
                
                this.refresh = function () {
                    tmpHtmlObject.html(value.replace(/\n/g, '<br />') + '.');
                    
                    /*
                     * Change widget size only if auto width
                     */     
                    tmpWidth    = tmpHtmlObject.width();
                    tmpHeight   = tmpHtmlObject.height();

                    if (tmpWidth > 0) {
                        tag.setWidth(tmpWidth, false);
                    }

                    if (tmpHeight > 0) {
                        tag.setHeight(tmpHeight, false);
                    }
                    
                    /*
                     * Set the correct position
                     */
                    tag._refreshPosition();

                }
                
                switch(e.keyCode) {                    
                    /*
                     * Save on enter key down
                     */  
                    case 13:
                        this.blur();
                        
                        linked.setFocus(true, true);
                        linked.updateProperty();
                        break;
                        
                    /*
                     * Resize on key event
                     */  
                    default:
                        if (e.keyCode >= 37 && e.keyCode <= 40) {
                        // DO NOTHING FOR ARROW KEYS
                        } else {
                            this.refresh();
                        }
                        break;
                }
            });
            
            /*
             * Save on blur
             */  
            editBox.bind('blur', {
                tag : tag
            }, function(e){
                var 
                tag,
                linked,
                newValue;

                tag         = e.data.tag;
                newValue    = $(this).val();
                linked      = tag.getLinkedTag();
                                
                tag.getAttribute('data-text').setValue(newValue);
                linked.getAttribute('data-label').setValue(newValue);
                
                tag.update();
                tag.domUpdate();
                
                tag.getHtmlObject().html(newValue.replace(/\n/g, '<br />'))
                
                /*
                 * unlock d&d
                 */  
                tag.unlock();
                Designer.ui.core.enableKeyEvent();
                Designer.api.setListenerMode(true);
                tag.resize.unlock(true);      
                
                /*
                 * Remove focus
                 */
                tag.setFocus(false);
                
                /*
                 * Reload label
                 */
                
                if (newValue == '') {
                    Designer.tag.deleteWidgets(tag);
                } else {
                    tag.onDesign();
                }
                
            })
            
        }
        
        htmlObject.bind('dblclick', {
            tag : tag
        }, tag.dblClickFn); 
    }
});
