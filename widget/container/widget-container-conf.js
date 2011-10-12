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
    type        : 'container',
    lib         : 'WAF',
    description : 'Container',
    category    : 'Layout',
    img         : '/walib/WAF/widget/container/icons/widget-container.png',
    tag         : 'div',
    attributes  : [
    {
        name        : 'class',
        description : 'Css class'
    },
    {
        name        : 'data-draggable',
        description : 'Draggable',
        type        : 'checkbox'
    },
    {
        name        : 'data-resizable',
        description : 'Resizable',
        type        : 'checkbox'
    },
    {
        name        : 'data-hideSplitter',
        description : 'Hide Splitters',
        type        : 'checkbox'
    }],
    style: [
    {
        name        : 'width',
        defaultValue: '200px'
    },
    {
        name        : 'height',
        defaultValue: '200px'
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
        name        : 'mouseover',
        description: 'On Mouse Over',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseup',
        description: 'On Mouse Up',
        category   : 'Mouse Events'
    },
    {
        name        : 'startResize',
        description : 'On Start Resize',
        category    : 'Resize'
        
    },
    {
        name        : 'onResize',
        description : 'On Resize',
        category    : 'Resize'
        
    },
    {
        name        : 'stopResize',
        description : 'On Stop Resize',
        category    : 'Resize'
        
    }],
    properties: {
        style: {
            theme       : {
                'roundy'    : false
            },
            fClass      : true,
            text        : false,
            background  : true,
            border      : true,
            sizePosition: true,
            dropShadow  : true,
            innerShadow : true,
            label       : false,
            disabled    : []
        }
    },
    onInit: function (config) {
        return new WAF.widget.Container(config);
    },
    onDesign: function (config, designer, tag, catalog, isResize) {  
        var
        htmlObject,
        parent,
        containerSplitClass;
        
        containerSplitClass = 'waf-split-container';
        
        htmlObject = tag.getHtmlObject();
        
        /*
         * Get the first parent container of the splitted container
         */
        tag.getFirstParent = function () {
            var
            parent;
            
            parent = this.getParent();
            
            if (parent && parent.isContainer()) {
                if (parent._isSplit) {
                    parent = parent.getFirstParent();
                }
            } else {
                parent = this;
            }
            
            return parent;
        }
        
        /*
         * Split the container into many other containers
         */
        tag.split = function container_split(params) {            
            var 
            tagWidth,
            tagHeight,
            container,
            containers,
            nb,
            type,
            containerHtml,
            containerX,
            containerY,
            containersWidth,
            containersHeight,
            i,
            that,
            htmlObject,
            firstParent,
            children,
            childrenLength,
            existingClasses;                
            params              = params        || {};
            nb                  = params.nb     || 2;
            type                = params.type   || 'vertically';
            htmlObject          = this.getHtmlObject();
            that                = this;
            tagWidth            = parseInt(htmlObject.css('width'));//that.getWidth();
            tagHeight           = parseInt(htmlObject.css('height'));//that.getHeight();
            containers          = [];
            
            switch(type) {
                case 'horizontally':
                    containersWidth     = tagWidth;
                    containersHeight    = tagHeight/nb;
                    break;
                    
                case 'vertically':
                    containersWidth     = tagWidth/nb;
                    containersHeight    = tagHeight;
                    break;
            }
            
            containerX          = 0;
            containerY          = 0;
            
            children            = that.getChildren();
            childrenLength      = children.length;
            
            /*
             * Create many containers as indicated by nb
             */
            for (i = 0; i < nb; i += 1) {
            
                container = new Designer.tag.Tag(Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('container')));                
                container._isSplit = true;
                container.create();
                
                existingClasses = container.getAttribute('class').getValue();
                
                container.getAttribute('class').setValue($.trim(existingClasses) + containerSplitClass);
                

                container.setXY(containerX,containerY, true);
                
                container.setWidth(containersWidth);
                container.setHeight(containersHeight);

                
                container.setParent(that);
                
                containerHtml = container.getHtmlObject();
                
                containerHtml.addClass(containerSplitClass);
                
                switch(type) {
                    case 'horizontally':
                        containerY += containersHeight;
                        break;

                    case 'vertically':
                        containerX += containersWidth;
                        break;
                }
                
                containers.push(container);    
                
                /*
                 * Lock d&d on splitted containers
                 */
                containerHtml.bind('mousedown', {container : container}, function(e) {
                    e.data.container.ddElt.lock();
                });
                containerHtml.bind('mouseup', {container : container}, function(e) {
                    e.data.container.ddElt.unlock();
                });                      
                
                container.unlock();    
            }            
            
            firstParent = that.getFirstParent();
            
            that._containers = containers;
            
            that.addSplitter(type);
            
            
            /*
             * Append children into first splitted container
             */
            if (children && childrenLength > 0) {
                /*
                 * Constraint for right/bottom position
                 */  
                Designer.tag.createPositionConstraintList(children);
                Designer.tag.cleanPositionConstraints();  
                for (i = 0; i < childrenLength; i += 1) {
                    if (children[i].status != 'destroy') {
                        children[i].setParent(containers[0]);                        
                    }
                }
                /*
                 * restore constaints
                 */ 
                Designer.tag.restorePositionConstraints(); 
                    
            }
            
            firstParent.setCurrent();
            D.tag.refreshPanels();
        }
        
        tag.addSplitter = function container_add_splitter( type ) {    
            var 
            that,
            htmlObject,
            tagHtmlObject,
            splitterLeft,
            splitterHeight,
            splitterWidth,
            splitterTop,
            config,
            splitterCss,
            children,
            childrenLength,
            refreshFocus,
            matrix,
            matrixHtml,
            inMatrix;
            
            that            = this;
            tagHtmlObject   = that.getHtmlObject();
            children        = that._containers;
            htmlObject      = $("<div>");
            childrenLength  = children ? children.length : 0;
            config          = {
                containment : 'parent'
            };
            
            splitterCss     = {};            
                
            matrixHtml = tagHtmlObject.parents('.waf-matrix');
            inMatrix = false;
            /*
             * Check if the tag is in a matrix
             */
            if (matrixHtml.length > 0) {
                inMatrix = true;
                matrix = D.tag.getTagById(matrixHtml.attr('id'));
            }
            
            
            refreshFocus = function () {
                var
                j,
                currentTag,
                selection,
                selectionCount; 
                
                selection       = Designer.getSelection(); 
                selectionCount  = selection.count();
                currentTag      = D.getCurrent();
                
                if (selectionCount > 0) {                                      
                    for (j = 0; j < selection.count(); j += 1) {
                        currentTag = selection.get(j);
                        Designer.ui.focus.setPosition(currentTag);
                        Designer.ui.focus.setSize(currentTag);
                    }                    
                } else if (currentTag){
                    Designer.ui.focus.setPosition(currentTag);
                    Designer.ui.focus.setSize(currentTag);
                }
                    
            }
            
            
            switch(type) {
                case 'horizontally':                    
                    splitterLeft    = 0;
                    splitterHeight  = 5;
                    splitterWidth   = tagHtmlObject.width();
                    splitterTop     = children[0].getHeight() - (splitterHeight/2);//(containersHeight - (splitterHeight/2));
                    
                    $.extend(config, {                        
                        axis    : 'y',
                        /*
                         * Resize containers on dragging
                         */
                        drag    : function(e, ui) {
                            var
                            i,
                            child,
                            containersLength;

                            containersLength = childrenLength;

                            for (i = 0; i < containersLength; i += 1) {
                                child = children[i];

                                if (i === 0) {
                                    child.setHeight(ui.position.top + (splitterHeight/2));
                                } else {
                                    child.setY(ui.position.top + (splitterHeight/2), true);
                                    child.setHeight(((parseInt(that.getHtmlObject().css('height')) + 1) - ui.position.top) - (splitterHeight/2));
                                }
                                                                            
                                child.domUpdate();
                                
                                refreshFocus();
                            } 
                        }
                    });
                    
                    splitterCss['border-top'] = splitterCss['border-bottom'] = '1px solid #AEAEAE';
                    
                    break;

                case 'vertically':                    
                    splitterTop     = 0;
                    splitterWidth   = 5;
                    splitterHeight  = tagHtmlObject.height();  
                    splitterLeft    = children[0].getWidth() - (splitterWidth/2);//(containersWidth - (splitterWidth/2));
                    
                    $.extend(config, {                        
                        axis    : 'x',
                        stop   : function() {
                            D.env.resizeSplit = false;
                        },
                        /*
                         * Resize containers on dragging
                         */
                        drag    : function(e, ui) {
                            var
                            i,
                            child,
                            containersLength;

                            containersLength = childrenLength;

                            for (i = 0; i < containersLength; i += 1) {
                                child = children[i];
                                if (i === 0) {
                                    child.setWidth(ui.position.left + (splitterWidth/2));
                                } else {
                                    child.setX(ui.position.left + (splitterWidth/2), true);
                                    child.setWidth(((parseInt(that.getHtmlObject().css('width')) + 1 ) - ui.position.left) - (splitterWidth/2));
                                }      
                                                                            
                                child.domUpdate();
                                
                                refreshFocus();
                            } 
                        }
                    });
                    
                    splitterCss['border-left'] = splitterCss['border-right'] = '1px solid #AEAEAE';
                    
                    break;
            }
            
            
            config.stop = function (e, ui) {
                var
                i,
                containersLength;

                containersLength = childrenLength;

                for (i = 0; i < containersLength; i += 1) {
                    children[i].domUpdate();
                } 
                            
                if (inMatrix) {
                    matrix.rebuild();
                }
            }
            
            $.extend(splitterCss, {
                'width'         : splitterWidth + 'px',
                'height'        : splitterHeight + 'px',
                'left'          : splitterLeft + 'px',
                'top'           : splitterTop + 'px',
                'cursor'        : type == 'horizontally' ? 'row-resize' : 'col-resize',
                'z-index'       : 100
            });
            
            /*
             * Add splitter
             */
            htmlObject
                .addClass('waf-splitter')
                .bind('mousedown', {}, function(e) {           
                    
                    /*
                     * Lock tag when splitter is dragging
                     */
                    that.lock();
                })
                .bind('mouseup', {}, function(e) {
                    /*
                     * Unlock tag when splitter is dragging
                     */
                    that.unlock();
                })
                .css(splitterCss)
                .draggable(config)
                .appendTo(that.getHtmlObject());
                
            if (inMatrix) {                
                matrix.rebuild();
            }
            
            return tagHtmlObject;
        }
        
        tag.getSplitter = function container_get_splitter() {
            var
            that,
            htmlObject,
            splitter,
            result;
            
            that        = this;
            htmlObject  = that.getHtmlObject();
            splitter    = htmlObject.children('.waf-splitter');
            
            if (splitter.length === 0) {
                result  = null;
            } else {
                result  = splitter;
            }
            
            return result;
        }
        
        tag.getSplitOrientation = function container_get_split_orientation() {
            var
            i,
            that,
            containersLength,
            container,
            containers,
            splitType;
            
            that                = this;
            containers          = that._containers;            
            containersLength    = containers.length;  
            
            
            if (containers && containersLength > 0) {
                for (i = 0; i < containersLength; i += 1) {
                    container = containers[i];
                    if (container.getX() === 0) {
                        splitType = "horizontally";
                    } else {
                        splitType = "vertically";
                    }
                }
            }
            
            return splitType;
        }
        
        tag.resizeSplitted = function container_resize_splitted() {
            var
            i,
            that,
            htmlObject,
            thatWidth,
            thatHeight,
            containers,
            containersLength,
            container,
            containerX,
            containerY,
            splitType,
            splitter;
            
            that                = this;
            htmlObject          = that.getHtmlObject();
            thatWidth           = parseInt(htmlObject.css('width'));//that.getWidth();
            thatHeight          = parseInt(htmlObject.css('height'));//that.getHeight();
            containers          = that.getChildren();
            
            containersLength    = containers.length;
            
            splitType           = that.getSplitOrientation();
            splitter            = that.getSplitter();
            
            /*
             * Resize splitter
             */   
            switch(splitType) {
                case 'horizontally':
                    splitter.css('width', thatWidth + 'px');
                    break;

                case 'vertically':
                    splitter.css('height', thatHeight + 'px');
                    break;
            }  
            
            
            /*
             * Resize containers
             */
            if (containers && containersLength > 0) {
                for (i = 0; i < containersLength; i += 1) {
                    container       = containers[i];
                    containerX      = container.getX();
                    containerY      = container.getY();
                    
                    
                    switch(splitType) {
                        case 'horizontally':
                            if (containerY != 0) {
                                container.setHeight(thatHeight - containerY);
                            }
                            
                            container.setWidth(thatWidth);
                            
                            break;

                        case 'vertically':
                            if (containerX != 0) {
                                container.setWidth((thatWidth - containerX));
                            }
                            container.setHeight(thatHeight);
                            break;
                    }    
                }
            }
            
            that._containers    = containers;
        }
        
        /*
         * Also resize splitted containers
         */
        if (isResize && tag._containers) {
            tag.resizeSplitted();
        }
        
        if (isResize && tag.getChildren()) {   
            $.each(tag.getChildren(), function(){
                if (this.isMatrix() && ((this._isFitToRight && this._isFitToLeft) || (this._isFitToTop && this._isFitToBottom))) {
                    this.rebuild();                            
                }

                D.ui.focus.setPosition(this);
                D.ui.focus.setSize(this);
            });
        }
        
    },
    
    onCreate : function (tag) {
        var
        containerSplitClass,
        htmlObject,
        parent;
        
        containerSplitClass = 'waf-split-container';
        
        htmlObject = tag.getHtmlObject();        
        
        /*
         * if tag is a splitted container, append splitter to is parent
         */
        if (tag.getAttribute('class').getValue().match(containerSplitClass)) {
            htmlObject.addClass(containerSplitClass);
            
            parent          = tag.getParent();
            tag._isSplit    = true;            
            
            if (parent._containers) {
                parent._containers.push(tag);
            } else {
                parent._containers = [tag];
            }
            
            /*
             * Lock d&d on splitted containers
             */
            htmlObject.bind('mousedown', {container : tag}, function(e) {
                e.data.container.ddElt.lock();
            });
            htmlObject.bind('mouseup', {container : tag}, function(e) {
                e.data.container.ddElt.unlock();
            }); 
            
            if(!parent.getSplitter() && parent._elementNode.getChildNodes().length == parent._containers.length) {
                //console.log(parent.getSplitOrientation())
                parent.addSplitter(parent.getSplitOrientation());
            }
        }
    }
});

