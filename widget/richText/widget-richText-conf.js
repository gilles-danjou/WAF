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
    type        : 'richText',
    lib         : 'WAF',
    description : 'Text',
    category    : 'Controls',
    img         : '/walib/WAF/widget/richText/icons/widget-richText.png',
    include     : [],
    tag         : 'div',
    attributes  : [
    {
        name       : 'data-binding',
        description: 'Source'
    },
    {
        name       : 'class',
        description: 'Css class'
    },
    {
        name       : 'data-format',
        description: 'Format'
    },
    {
        name        : 'data-autoWidth',
        description : 'Auto Resize',
        type        : 'checkbox',
        defaultValue: 'true'
    },
    {
        name        : 'data-label',
        description : 'Label'
    },
    {
        name        : 'data-text',
        description : 'Text',
        type        : 'textarea'
    },
    {
        name        : 'data-label-position',
        description : 'Label position',
        defaultValue: 'left'
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
        name        : 'data-overflow',
        description : 'Overflow',
        type        : 'dropdown',
        options     : ['Hidden', 'Horizontal', 'Vertical', 'Both'],
        defaultValue: '_blank'
    }],
    style: [
    {
        name        : 'width',
        defaultValue: '50px'
    },
    {
        name        : 'height',
        defaultValue: '16px'
    }],
    events: [
    {
        name       : 'click',
        description: 'On Click',
        category   : 'Mouse Events'
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
            dropShadow  : true,
            innerShadow : true,
            disabled    : ['border-radius']
        }
    },
    onInit: function (config) {
        return new WAF.widget.RichText(config);        
    },
    onDesign: function (config, designer, tag, catalog, isResize) {
        var
        text,
        htmlObject,
        tmpWidth,
        tmpHeight,
        tagWidth,
        tagHeight,
        split,
        tmpHtmlObject;
        
        htmlObject      = tag.getHtmlObject();
        
        tagWidth        = tag.getWidth();
        tagHeight       = tag.getHeight();         
        
        /*
         * Get the source as text value
         */
        if (tag.getSource()) {
            text    = '[' + tag.getSource() + ']';                  
            
            /*
             * if a text exist set the old text as the label
             */
            if (tag._oldTextValue) {     
                tag.getAttribute('data-label').setValue(tag._oldTextValue);
            }
            

            if (!tag.getAttribute('data-label').getValue() && tag.getLabel() && tag.getLabel().getAttribute('data-text').getValue()) {  
                split = tag.getSource().split('.');
                tag.getAttribute('data-label').setValue(split[split.length-1]);
            }
            
            tag._oldTextValue = null;
            
            tag._oldLabelValue = tag.getAttribute('data-label').getValue();
            
            tag._oldSource = tag.getSource();          
        } else {          
            
            /*
             * if a label exist set the old label as the text then remove label
             */
            if (tag._oldLabelValue) {
                tag.getAttribute('data-text').setValue(tag._oldLabelValue);
                tag.getAttribute('data-label').setValue('');
            }
            
            if (tag.getLabel()) {
                D.tag.deleteWidgets(tag.getLabel());
                tag._linkedTag = null;
            }
            
            text    = tag.getAttribute('data-text').getValue();  
            
            tag._oldLabelValue = null;
                
            tag._oldTextValue = text;
        }
        
        tag.getAttribute('data-text').setValue(text);
        
        if (tag.getAttribute('data-link').getValue()) {
            htmlObject.addClass('link');
        }
        
        text = text.replace(/\n/g, '<br />');
        
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
                'position'          : 'absolute',

                'z-index'           : '10000',
                'left'              : '-1000px',
                'top'               : '-1000px',
                'background'        : '#FFCC66'
            });
            
            return tmpHtmlObject;
        }
        
        tmpHtmlObject   = tag._getTmpHtmlObject(text);
        
        tmpWidth        = tmpHtmlObject.width();
        tmpHeight       = tmpHtmlObject.height();        
        
        /*
         * Add text to html object
         */        
        htmlObject.html(text);
        
        /*
         * If autocomplete, resize the htmlobject depending on temporary html object
         */
        if (tag.getAttribute('data-autoWidth').getValue() === 'true') {
            if (tmpWidth > 0 && tmpWidth != tagWidth) {
                tag.setWidth(tmpWidth);
            } 
            
            if (tmpHeight > 0 && tmpHeight != tagHeight) {
                tag.setHeight(tmpHeight);
            }             
        }
        
        /*
         * DblClick event
         */
        tag.dblClickFn = function tag_dblClickFn(e){
            var
            text,
            editBox,
            tmpHtmlObject,
            tmpWidth,
            tmpHeight,
            htmlObject,
            tag;
            
            tag             = e.data && e.data.tag ? e.data.tag : D.getCurrent();   
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
            
            if (!e.data) {
                D.tag.refreshPanels();
            }
            
            htmlObject  = tag.getHtmlObject();            
            text        = tag.getAttribute("data-text").getValue();
            
               
            tmpHtmlObject   = tag._getTmpHtmlObject(text);  
            
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
                'resize'            : 'none'
            });
            
            editBox.html(text);
            
            htmlObject.html(editBox);
            
            
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
                    tmpHtmlObject.html(value.replace(/\n/g, '<br />') + '-');
                    
                    /*
                     * Change widget size only if auto width
                     */     
                    if (tag.getAttribute('data-autoWidth').getValue() === 'true') {
                        tmpWidth    = tmpHtmlObject.width();
                        tmpHeight   = tmpHtmlObject.height();

                        if (tmpWidth > 0) {
                            tag.setWidth(tmpWidth, false);
                        }

                        if (tmpHeight > 0) {
                            tag.setHeight(tmpHeight, false);
                        }
                    }

                }
                
                switch(e.keyCode) {                    
                    /*
                     * Save on enter key down (except holding shift)
                     */  
                    case 13:
                        if (!e.shiftKey) {
                            this.blur();
                        } else {
                            this.refresh();
                        }
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
            editBox.bind('blur', {tag : tag}, function(e){
                var 
                tag,
                newValue;

                tag         = e.data.tag;
                newValue    = $(this).val();
                
                tag.getAttribute('data-text').setValue(newValue);
                
                tag.update();
                tag.domUpdate();
                
                D.tag.refreshPanels();
                
                tag.getHtmlObject().html(newValue.replace(/\n/g, '<br />'))
                
                /*
                 * unlock d&d
                 */  
                tag.unlock();
                Designer.ui.core.enableKeyEvent();
                Designer.api.setListenerMode(true);
                tag.resize.unlock(true);      
                
            })
        }
        
        htmlObject.bind('dblclick', { tag : tag }, tag.dblClickFn);    
        
        /*
         * Remove temporary objects
         */
        tmpHtmlObject.remove();        
    }
});
