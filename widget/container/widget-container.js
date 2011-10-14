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
WAF.Widget.provide(


    /**
     * TODO: Write a description of this WAF widget
     *
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    'Container',    
    {
    },
    
    /**
     * @constructor
     * @param {Object} inConfig configuration of the widget
     */

    /**
     * The constructor of the widget
     *
     * @shared
     * @property constructor
     * @type Function
     * @default TODO: set to the name to this class (ex: WAF.widget.DataGrid)
     **/
    function WAFWidget(config, data, shared) {
        var
        widget,
        htmlObject,
        splitted,
        splitter,
        container,
        splitType,
        splittedLength,
        splitterTop,
        splitterLeft,
        splitterHeight,
        splitterWidth,
        splitterConfig,
        tagWidth,
        tagHeight,
        splitterCss,
        parent,
        dragMethod;
        
        widget          = this;
        htmlObject      = $(this.containerNode);
        
        splitted        = htmlObject.children('.waf-split-container');
        splittedLength  = splitted.length;
        splitterConfig  = {};
        splitterCss     = {};
        tagWidth        = this.containerNode.offsetWidth;
        tagHeight       = this.containerNode.offsetHeight;        
        parent          = htmlObject.parent();
        
        htmlObject.children('.waf-splitter').remove();
                 
        /*
         * Check if the container get splitted containers
         */
        if (splittedLength > 0) {           
            splitType = this._getSplitType();
            
            switch(splitType) {
                case 'horizontally':   
                    splitterLeft    = 0;
                    splitterHeight  = widget._splitterHeight;
                    splitterWidth   = htmlObject.width(); 
                    splitterTop     = parseInt($(splitted[0]).css('height')) - (splitterHeight/2);
                    
                    splitterCss['border-top'] = splitterCss['border-bottom'] = '1px solid #AEAEAE';
                    
                    splitterConfig  = {                        
                        axis    : 'y'
                    }
                    
                    dragMethod = function(e, ui) {
                        var
                        splitted,
                        htmlObject;
                        
                        splitted    = e.data.splitted;
                        htmlObject  = e.data.htmlObject;
                        
                        $.each(splitted, function() {
                            var
                            container,
                            tagHeight;

                            tagHeight = htmlObject.height();
                            container = $(this);                                

                            if (container.is(":first-child")) {
                                container.css('height', (ui.position.top + (splitterHeight/2)) + 'px');
                            } else {
                                container.css('top', ui.position.top + (splitterHeight/2) + 'px');
                                container.css('height', ((tagHeight - ui.position.top) - (splitterHeight/2)) + 'px');
                            }   

                            if ($$(container.attr('id'))) {
                                $$(container.attr('id'))._resizeSplitters();
                            }
                        });
                        }
                    
                    break;

                case 'vertically': 
                    splitterTop     = 0;
                    splitterWidth   = widget._splitterWidth;
                    splitterHeight  = htmlObject.height();  
                    splitterLeft    = parseInt($(splitted[0]).css('width')) - (splitterWidth/2);
                    
                    splitterCss['border-left'] = splitterCss['border-right'] = '1px solid #AEAEAE';
                    
                    splitterConfig  = {                        
                        axis    : 'x'
                    }                    
                    
                    dragMethod = function(e, ui) {
                        var
                        splitted,
                        htmlObject;
                        
                        splitted    = e.data.splitted;
                        htmlObject  = e.data.htmlObject;
                        
                        widget._saveSplitPosition(ui.position.left);
                        
                        $.each(splitted, function() {
                            var
                            container,
                            tagWidth;

                            tagWidth    = htmlObject.width();
                            container = $(this);       

                            if (container.is(":first-child")) {
                                container.css('width', (ui.position.left + (splitterWidth/2)) + 'px');
                            } else {
                                container.css('left', ui.position.left + (splitterWidth/2) + 'px');
                                container.css('width', ((tagWidth - ui.position.left) - (splitterWidth/2)) + 'px');
                            }   

                            if ($$(container.attr('id'))) {
                                $$(container.attr('id'))._resizeSplitters();
                            }
                        });
                        }
                    
                    break;
            }
            
            splitterConfig.containment = 'parent';
            
            $.extend(splitterCss, {
                'width'         : splitterWidth + 'px',
                'height'        : splitterHeight + 'px',
                'left'          : splitterLeft + 'px',
                'top'           : splitterTop + 'px',
                'cursor'        : splitType == 'horizontally' ? 'row-resize' : 'col-resize',
                'z-index'       : htmlObject.css('z-index')
            });
            
            if ((!data.hideSplitter || data.hideSplitter !== 'true') && htmlObject.parents('[data-hideSplitter="true"]').length == 0) {
                splitter    = $('<div>');

                splitter
                    .attr('id', 'waf-splitter-' + htmlObject.attr('id'))
                    .addClass('waf-splitter')
                    .css(splitterCss)
                    .draggable(splitterConfig)
                    .appendTo(htmlObject); 
            
                splitter.bind( "drag", {
                    splitted    : splitted,
                    htmlObject  : htmlObject
                    
                }, dragMethod);
            }
        }   
    },{           
        /*
         * Resize method called during resize
         * @method onResize
         */
        onResize : function container_resize() {   
            this._resizeSplitters('on');
        },    
        
        /*
         * Resize method called on stop resize
         * @method onResize
         */
        stopResize : function container_stop_resize() {   
            this._resizeSplitters('stop');
        },    
        
        /*
         * Resize method called on start resize
         * @method onResize
         */
        startResize : function container_start_resize() {   
            this._resizeSplitters('start');
        },       
        
        /*
         * Get the position of the splitter
         * @method getSplitPosition
         * @param {number} value position to define
         */
        getSplitPosition   : function container_get_split_size() {
            var
            splitter,
            splitType,
            htmlObject,
            position;
            
            splitType = this._getSplitType();   
            htmlObject      = $(this.containerNode);
            
            
            splitter        = htmlObject.children('.waf-splitter');  
            
            if (splitType === 'horizontally') {
                position = parseInt(splitter.css('top'));
            } else {
                position = parseInt(splitter.css('left'));
            }
            
            return position;
        },
        
        /*
         * Set the position of the splitter
         * @method setSplitPosition
         * @param {number} value position to define
         */
        setSplitPosition   : function container_set_split_size(value) {
            var
            widget,
            htmlObject,
            splitter,
            splitted,
            splitterSize,
            splitType,
            tagSize;
            
            widget          = this;
            htmlObject      = $(this.containerNode);
            splitted        = htmlObject.children('.waf-split-container');
            splitter        = htmlObject.children('.waf-splitter');     
                       
            splitType = this._getSplitType();            
            
            switch(splitType) {
                case 'horizontally': 
                    splitterSize    = widget._splitterHeight;
                    tagSize         = htmlObject.height();
                    
                    if (value > tagSize) {
                        value = tagSize - splitterSize;
                    }
                    
                    splitter.css('top', value + 'px');
                    
                    $.each(splitted, function() {
                        var
                        container;
                        
                        container = $(this);       

                        if (container.is(":first-child")) {
                            container.css('height', (value + (splitterSize/2)) + 'px');
                        } else {
                            container.css('top', value + (splitterSize/2));
                            container.css('height', ((tagSize - value) - (splitterSize/2)) + 'px');
                        }   

                        $$(container.attr('id'))._resizeSplitters();
                    });
                    break;
                    
                case 'vertically': 
                    splitterSize    = widget._splitterWidth;                     
                    tagSize         = htmlObject.width();                      
                    
                    if (value > tagSize) {
                        value = tagSize - splitterSize;
                    }
                    
                    splitter.css('left', value + 'px');
                    
                    $.each(splitted, function() {
                        var
                        container;

                        container = $(this);       

                        if (container.is(":first-child")) {
                            container.css('width', (value + (splitterSize/2)) + 'px');
                        } else {
                            container.css('left', value + (splitterSize/2));
                            container.css('width', ((tagSize - value) - (splitterSize/2)) + 'px');
                        }   

                        $$(container.attr('id'))._resizeSplitters();
                    });
                    break;
            }
            
            
        },
        
        /*
         * Splitter default width
         */
        _splitterWidth : 5,
        
        /*
         * Splitter default height
         */
        _splitterHeight : 5,
        
        /*
         * Get the type of the split (horizontal/vertical)
         * @method _getSplitType
         * @return {string}
         */
        _getSplitType : function container_get_split_type() {
            var
            children,
            splitType;
            
            children = $(this.containerNode).children();
            
            /*
             * Get splitter type
             */
            if (children.length > 1) {
                if ($(children[0]).css('left') == '0px' && $(children[1]).css('left') == '0px') {
                    splitType   = 'horizontally';
                } else {
                    splitType   = 'vertically';
                }
            } else {
                splitType = '';
            }
            
            return splitType;            
        },
        
        /*
         * Resize splitter containers inside this container
         * @method _resizeSplitters
         */
        _resizeSplitters : function container_resize_splitter(type) {
            var
            that,
            child,
            children,
            thatHeight,
            thatWidth,
            splitType,
            splitter;
            
            that        = $(this.containerNode);
            children    = that.children();
            
            type        = type || 'on';
            
            if (children.length > 0) {
                /*
                 * Hide overflow if container as splitted containers
                 */
                that.css('overflow', 'hidden');
            }            
                
            thatHeight  = parseInt(that.css('height'));
            thatWidth   = parseInt(that.css('width'));            

            splitter    = that.children('.waf-splitter');

            /*
             * Get splitter type
             */
            splitType = this._getSplitType();
                
            $.each(children, function(e){
                var
                containerX,
                containerY,
                childWidget,
                checkResize;
                
                child       = $(this);
                childWidget = $$(child.attr('id'));
                containerX  = parseInt(child.css('left'));
                containerY  = parseInt(child.css('top'));
                
                child.resizeChildren = that.resizeChildren;
            
                
                //if (checkResize.x && checkResize.y) {
                if (child.is('.waf-split-container')) {
                    switch(splitType) {
                        case 'horizontally':

                            if (containerY != 0) {
                                child.css('height', (thatHeight - containerY) + 'px');
                            }

                            child.css('width', thatWidth + 'px');

                            splitter.css('width', thatWidth + 'px');
                            break;

                        case 'vertically':
                            if (containerX != 0) {
                                child.css('width', (thatWidth - containerX) + 'px');
                            }
                            child.css('height', thatHeight + 'px');

                            splitter.css('height', thatHeight + 'px');
                            break;
                    } 
                    
                    if (childWidget) {
                        childWidget._resizeSplitters(type);
                    }
                }

                if (childWidget && childWidget.checkResize) {
                    checkResize = childWidget.checkResize();                    
                
                    if (checkResize.x || checkResize.y) {
                        childWidget.resize(type);
                        
                    }
                    
                }
                
            });
        },
        
        _saveSplitPosition: function(position) {    
            var
            dsPos,
            dsParent,
            htmlObject;
            
            htmlObject = $('#' + this.id);
            if (htmlObject.attr('data-dsPos')) {
                dsPos = htmlObject.attr('id') + '-' + htmlObject.attr('data-dsPos');
            } else {
                dsParent = htmlObject.parents('[data-dsPos]');
                
                if (dsParent.length > 0) {
                    dsPos = htmlObject.attr('id') + '-' + dsParent.attr('data-dsPos');
                }
            }
            
            if (!WAF._tmpSplitPosition) {
                WAF._tmpSplitPosition = {};
            }
            
            if (dsPos) {
                WAF._tmpSplitPosition[this.id] = position;
            } 
        }
    }
);