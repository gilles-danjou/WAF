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
     *      
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    'Matrix',   
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
     **/
    function WAFWidget(config, data, shared) {   
        var
        that,
        htmlObject,
        scrollSpeed,
        matrix,
        tmpBinding,
        split;

        that                = this;
        htmlObject          = $(this.containerNode);   
        matrix              = {};
    
        that.subIDPrefix    = config.id + '-clone-';
        
        that.containerId    = config.id + '-container';
        
        that.scrollSpeed    = 500;

        /*
         * {Object} this.params parameters of the matrix
         */
        that.params         = {};

        /*
         * {Array} this.clones array of cloned elements of the matrix
         */
        that.clones         = [];

        /*
         * {String} this.scrolling scroll direction
         */
        that.scrolling      = data.scrolling || '';

        if (that.scrolling === 'vertical') {
            htmlObject.css({
                'overflow-y' : 'auto',
                'overflow-x' : 'hidden'
            });
        } else {
            htmlObject.css({
                'overflow-y' : 'hidden',
                'overflow-x' : 'auto'
            });
        }
    
        if (data.scrollbar === 'false') {
            htmlObject.css({
                'overflow-y' : 'hidden',
                'overflow-x' : 'hidden'
            });
        }

        /*
         * Add the in_array function for arrays
         * @method in_array
         * @param {string} val value to find
         */
        Array.prototype.in_array = function(val) {
            var 
            i,
            l;
        
            for( i = 0, l = this.length; i < l; i++) {
                if(this[i] == val) {
                    return true;
                }
            }
            return false;
        }

        /*
         * Get at least one source of the matrix children to create matrix after all datasources has been loaded
         */
        tmpBinding = $($('#' + config.id + ' [data-binding]')[0]).attr('data-binding');
        if (tmpBinding && tmpBinding.length > 0) {
            split = tmpBinding.split('.');

            if (split.length > 1) {
                tmpBinding = split[0];
            }
            
            sources[tmpBinding].addListener("onCollectionChange", function(e) {
                that.create();
            });
        }
    
        that.tmpElt = 0;
        that.tmp = 0;
        that.scrollDirection = null;
    },{
        
        getPosByRow : function getPosByRow (row) {
            var 
            that,
            result;

            that    = this;
            result  = (row * (that.elt[that.typeSize] + that.margin[that.typePos])) + that.margin[that.typePos];

            return result;
        },

        getRowByPos : function getRowByPos (pos) {
            var 
            that,
            result,
            totalRow;

            that         = this;
            totalRow    = Math.ceil(that.sourceRef.length/that.limit2);
            result      = Math.floor((totalRow/that.sourceRef.length) * pos);

            if (result < 0 ) {
                result = 0;
            }

            return result;
        },

        getDisplayedRow : function getDisplayedRow () {
            var 
            that,
            result,
            scrollPosition;

            that            = this;
            //scrollPosition  = that.scrolling === 'vertical' ? $('#' + that.config.id).scrollTop() : $('#' + that.config.id).scrollLeft();
            scrollPosition  = that.scrolling === 'vertical' ? -($("#mainContainer-"+that.config.id).position().top) : -($("#mainContainer-"+that.config.id).position().left); //for mobile cannot use scrollTop
            // determine what is the row displayed depending on the scroll bar
            result = Math.floor(scrollPosition / (that.elt[that.typeSize] + (that.margin[that.typePos])));

            return result;
        },

        ucfirst : function ucfirst (str) {
            var
            f;

            f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        },
        
        /*
         * Create the matrix
         * @namespace WAF.widget.Matrix
         * @method create
         */
        create  : function () {             
            var
            htmlObject,
            currentSource,
            nbSources,
            widget,
            thisSource,
            aSource,
            otherSources,
            result,
            elt,
            i,
            that,
            config,
            params,
            matrixChildren,
            children,
            thisId,
            widgetContainer,
            widgetLabel,
            width,
            height,
            label,
            margin,
            otherSourcesLength,
            containerConfig;        
        
            widget          = {};
            thisSource      = [];
            aSource         = [];
            otherSources    = [];
            result          = {};
            elt             = {};
            i               = 0;
            that            = this;
            
            config          = this.config;
            params          = config;
            htmlObject      = $(this.containerNode); 
            matrixChildren  = htmlObject.children();        
        
            that.tmpSubID = 0;
        
            if (WAF.events[config.id] && WAF.events[config.id][0] && WAF.events[config.id][0].fn) {
                that.ChildrenEvent = WAF.events[config.id][0].fn;
            } else {
                that.ChildrenEvent = function() {}
            }

            // Get the matrix children to find a datasource
            matrixChildren.each(function(e) {
                if ($(this).attr('data-type') === 'container') {
                    elt = {
                        id      : $(this).attr('id'),
                        widget  : WAF.widgets[$(this).attr('id')],
                        width   : parseInt($(this).css('width')),
                        height  : parseInt($(this).css('height')),
                        left    : parseInt($(this).css('left')),
                        top     : parseInt($(this).css('top')),
                        htmlObj : $('#' + $(this).attr('id')),
                        children: []
                    }
                    children = $('#' + $(this).attr('id') + ' [data-binding]');

                    // Get the container children
                    children.each(function(e) {
                        widget = WAF.widgets[$(this).attr('id')];
                        if ($(this).attr('data-binding') && widget.source) {
                            // Get the source of widget
                            thisSource.push(widget.source);
                        }
                        elt.children.push(widget)
                    });
                } else {
                    if ($(this).attr('data-binding')) {
                        containerConfig = {
                            id: 'waf-tmp-container',
                            'data-type' : 'container',
                            'data-lib'  : 'WAF'

                        };
                        thisId          = $(this).attr('id');
                        widgetContainer = new WAF.widget['Container'](containerConfig);
                        width           = parseInt($(this).width());
                        height          = parseInt($(this).height());
                        label           = $("[data-linked='" + thisId+ "']");
                        margin          = params['data-margin'] ? parseInt(params['data-margin']) : 10;

                        $('<div />').attr({
                            'id'        : 'waf-tmp-container',
                            'data-type' : 'container'
                        }).css('position', 'absolute').appendTo('#' + config.id).append($(this));

                        widgetContainer.config = containerConfig;

                        // Get the source of widget
                        widget = WAF.widgets[$(this).attr('id')];
                        thisSource.push(widget.source);

                        elt = {
                            id      : containerConfig.id,
                            widget  : widgetContainer,
                            left    : margin,
                            top     : margin,
                            htmlObj : $('#' + containerConfig.id),
                            children: []
                        }

                        elt.children.push(widget)

                        if (label.length > 0) {
                            $('#waf-tmp-container').append(label);
                            widgetLabel = WAF.widgets[label.attr('id')];
                            elt.children.push(widgetLabel)

                            switch ($(this).attr('data-label-position')) {
                                case 'top':
                                case 'bottom':
                                    height += parseInt(document.getElementById(label.attr('id')).offsetHeight);
                                    break;

                                case 'left':
                                case 'right':
                                    width += parseInt(document.getElementById(label.attr('id')).offsetWidth);
                                    break;
                            }
                        }

                        $('#waf-tmp-container').children().each(function(e) {
                            $(this).css('left', parseInt($(this).css('left')) - margin + 'px');
                            $(this).css('top', parseInt($(this).css('top')) - margin + 'px');
                        })

                        $('#waf-tmp-container').addClass('waf-widget');

                        elt.width = width;
                        elt.height = height;
                    }
                }
            });

            nbSources = thisSource.length;

            // Get the data source name
            if (nbSources > 0) {
                aSource = thisSource[0];
                if (nbSources > 1) {
                    for (i = 0; i < nbSources; i += 1) {
                        currentSource = thisSource[i];
                        if (currentSource && currentSource._private.sourceType == 'dataClass' && currentSource._private.sourceType == 'relatedEntity') {
                            aSource = currentSource;
                        }
                    
                        if (currentSource._private.sourceType === "scalar") {
                            otherSources.push(currentSource)
                        }
                    }
                }
            
                params.elt = elt;
            
                otherSourcesLength = otherSources.length;
                for (i = 0; i < otherSourcesLength; i += 1){
                    otherSources[i].addListener("onCurrentElementChange", function(e) {
                        e.dataSource.dispatch('onCurrentElementChange', {
                            subID : that.tmpSubID, 
                            attributeName : e.attributeName
                            }, {});
                    });
                }

                aSource.addListener("all", function(e) {
                
                    if (!e.dispatcherID) { // e.dispatcherID !== config.id && 
                        if ($('#' + config.id))
                            var 
                            pos,
                            element,
                            displayedRow,
                            calcul,
                            row,
                            firstPos,
                            subIDValue,
                            userData;                    
                    
                        pos             = e.dataSource.getPosition();
                        element         = $('#' + config.id + ' [data-dspos="' + pos + '"]');

                        subIDValue      = that.subIDPrefix + $('#' + element.attr('id')).attr('data-area');

                        switch (e.eventKind) {
                            case 'onBeforeCurrentElementChange' :
                                // Do not automatically save if it's a slider
                                if ($('#' + e.dispatcherID).attr('data-type') != 'slider') {
                                    e.dataSource.save({
                                        subID : subIDValue
                                    });
                                }
                            
                                break;

                            case 'attributeChange' :
                                userData = e.userData || null;
                                e.dataSource.dispatch('attributeChange', {
                                    subID : subIDValue, 
                                    attributeName : e.attributeName
                                    }, userData);
                                break;  

                            case 'onCurrentElementChange' :
                                if (!e.data.that.elt) {
                                } else {
                                    displayedRow    = e.data.that.getDisplayedRow();
                                    calcul          = (displayedRow + e.data.that.limit1) - 1;
                                    row             = e.data.that.getRowByPos(pos);
                                    e.data.that.selectedDS     = pos;

                                    e.data.that.currentPos     = pos;

                                    // add selected class
                                    element.addClass('waf-matrix-element waf-state-selected');
                                    $('#' + config.id + ' .waf-container[data-dspos!="' + pos + '"]').removeClass('waf-state-selected');

                                    // Scroll ony if the element is not already displayed
                                    if ( element.length > 0 && row >= displayedRow && row <= calcul) {
                                    // DO NOTHING
                                    } else {
                                        e.data.that.goTo(pos);
                                    }
                                }
                            
                                break;

                            case 'onCollectionChange' :
                                firstPos = e.dataSource.getPosition();
                                e.data.that.selectedDS = firstPos;
                                e.data.that.display(e);

                                // force select on the first element
                                e.dataSource.select(firstPos, {
                                    dispatcherID : config.id
                                    });
                                break;
                        }
                    }

                }, {
                }, {
                    widget  : result,
                    params  : params,
                    source  : aSource,
                    that    : that
                })
            }  
        },
                
        /**
         * Go to indicated position
         * @namespace WAF.widget.Matrix
         * @method goTo
         */
        goTo : function (pos) {
             
            var 
            that,
            htmlObject,
            row,
            scrollPosition,
            scrollConfig;
            
            that            = this;
            htmlObject      = $(this.containerNode);
            row             = that.getRowByPos(pos);
            scrollPosition  = that.getPosByRow(row) - that.margin[that.typePos2];
            scrollConfig    = {};

            scrollConfig    = that.scrolling === 'vertical' ? {scrollTop : scrollPosition} : {scrollLeft : scrollPosition};

            htmlObject.animate(scrollConfig, that.scrollSpeed);    
            
            //trigger touch end because no native scoll event is fired    
            $('#' + that.config.id).trigger('touchend'); 
        },

        /**
         * Go to first position
         * @namespace WAF.widget.Matrix
         * @method goToFirst
         */
        goToFirst : function () {
            var 
            that;

            that = this;
            that.goTo(0);  
        },

        /**
         * Go to last position
         * @namespace WAF.widget.Matrix
         * @method goToLast
         */
        goToLast : function () {
            var 
            that;

            that = this;
            that.goTo(that.sourceRef.length);  
        },     

        /**
         * Go to next
         * @namespace WAF.widget.Matrix
         * @method goNext
         */
        goToNext : function () {
            var 
            that,
            htmlObject,
            currentRow,
            currentPos,
            scrollConfig,
            scrollPosition;

            that            = this;
            htmlObject      = $(this.containerNode);
            currentRow      = that.getDisplayedRow();
            currentPos      = that.getPosByRow(currentRow + (that.limit1));
            scrollConfig    = {};
            scrollPosition  = currentPos - 10;

            scrollConfig    = that.scrolling === 'vertical' ? {scrollTop : scrollPosition} : {scrollLeft : scrollPosition};

            htmlObject.animate(scrollConfig, that.scrollSpeed); 
            
            //trigger touch end because no native scoll event is fired    
            $('#' + that.config.id).trigger('touchend');
        },

        /**
         * Go to previous
         * @namespace WAF.widget.Matrix
         * @method goPrevious
         */
        goToPrevious : function () {
            var 
            that,
            htmlObject,
            currentRow,
            currentPos,
            scrollConfig,
            scrollPosition;

            that            = this;
            htmlObject      = $(this.containerNode);
            currentRow      = that.getDisplayedRow();
            currentPos      = that.getPosByRow(currentRow - that.limit1);
            scrollConfig    = {};
            scrollPosition  = currentPos - 10;

            scrollConfig    = that.scrolling === 'vertical' ? {scrollTop : scrollPosition} : {scrollLeft : scrollPosition};

            htmlObject.animate(scrollConfig, that.scrollSpeed); 
            
            //trigger touch end because no native scoll event is fired    
            $('#' + that.config.id).trigger('touchend');
        },

        /**
         * Get the total number of pages
         * @namespace WAF.widget.Matrix
         * @method getTotalPages
         */
        getTotalPages : function () {
            var 
            that,
            totalRows,
            result;

            that        = this;
            totalRows   = Math.ceil(that.sourceRef.length/that.limit2);
            result      = Math.ceil(totalRows/that.limit1);

            return result;
        },

        /**
         * Get the current page
         * @namespace WAF.widget.Matrix
         * @method getCurrentPage
         */
        getCurrentPage : function () {
            var 
            that,
            totalRows,
            totalPages,
            currentRow,
            result;

            that        = this;
            totalRows   = Math.ceil(that.sourceRef.length/that.limit2);
            totalPages  = that.getTotalPages();
            currentRow  = that.getDisplayedRow();
            result      = (currentRow*totalPages)/totalRows;       

            return result;
        },
        
        /**
         * Clone widgets events
         * @namespace WAF.widget.Matrix
         * @method cloneEvents
         */
        cloneEvents : function(id, element) {  
            var 
            k,
            events;
        
            events  = WAF.events[id];

            if (events) {
                for (k = 0; k < events.length; k += 1) {
                    element.bind(events[k].name, {}, events[k].fn);
                }
            }
        },
        
        
        /**
         * Display the  matrix
         * @namespace WAF.widget.Matrix
         * @method display
         */
        display : function(e) {
            var 
            thisConfig,
            cloneConfig,
            childConfig,
            children,
            container,
            childrenHtml,
            dsPos,
            limit1,
            limit2,
            pos1,
            pos2,
            columns,
            rows,
            i,
            j,
            c,
            n,
            tmp,
            nbTmp,
            moreToShow,
            params,
            scrolling,
            sourceRef,
            typePos,
            typePos2,
            typeSize,
            typeSize2,
            elt,
            eltHtml,
            containerClone,
            margin,
            matrix,
            oldID,
            childrenConfig,
            allChildren,
            focusOnElement,
            subIDValue,
            oldChild,
            inputElements,
            that,
            htmlObject,
            config;
        
            that            = this;
            htmlObject      = $(this.containerNode);
            config          = this.config;
            thisConfig      = {};
            cloneConfig     = {};
            childConfig     = {};
            children        = {};
            container       = {};
            childrenHtml    = {};
            dsPos           = 0;
            limit1          = 0;
            limit2          = 0;
            pos1            = 0;
            pos2            = 0;
            columns         = 0;
            rows            = 0;
            moreToShow      = 2;
            params          = e.data.params;
            scrolling       = params['data-scrolling'];
            sourceRef       = e.data.source;
            typePos         = scrolling === 'vertical' ? 'top' : 'left';
            typePos2        = scrolling === 'vertical' ? 'left' : 'top';
            typeSize        = scrolling === 'vertical' ? 'height' : 'width';
            typeSize2       = scrolling === 'vertical' ? 'width' : 'height';
            elt             = params.elt;
            eltHtml         = elt.htmlObj;
            containerClone  = null;
            margin          = {
                left : params['data-margin'] ? parseInt(params['data-margin']) : 10,
                top : params['data-margin'] ? parseInt(params['data-margin']) : 10
            }
            matrix          = {
                id      : params.id,
                margin  : margin,
                width   : parseInt($('#' + params.id).css('width')),
                height  : parseInt($('#' + params.id).css('height'))
            };
        
            // Calcul how many widgets can be had,
            columns = Math.floor(matrix.width / (elt.width + margin.left));
            rows    = Math.floor(matrix.height / (elt.height + margin.top));

            thisConfig = params.elt.widget.config;

            // Get the widget config
            for (n in thisConfig) {
                cloneConfig[n] = thisConfig[n];
            }
            
            
            pos2 = margin.top;
            pos1 = margin.left;

            // First : remove all created clones
            $('#' + thisConfig.id).show();

            that.original = $('#' + matrix.id + " #" + thisConfig.id);

            $('#' + matrix.id + " #" + thisConfig.id).appendTo('body');

            if (scrolling === 'vertical') {
                limit1 = rows;
                limit2 = columns;
            } else {
                limit1 = columns;
                limit2 = rows;
            }   

            // Set variables as attribute of the matrix widget
            that.elt            = elt;
            that.typePos        = typePos;
            that.typePos2       = typePos2;
            that.typeSize       = typeSize;
            that.typeSize2      = typeSize2;
            that.margin         = margin;
            that.scrolling      = scrolling;
            that.limit2         = limit2;
            that.limit1         = limit1;
            that.sourceRef      = sourceRef;        
            
            htmlObject.children().remove();

            // Container is used to define the scroll size
            container = $('<div/>').addClass('matrix-container').appendTo(htmlObject);
            container.get()[0].id = "mainContainer-"+matrix.id;            
            setTimeout(function () {
                scrollObj = new iScroll(matrix.id);
            }, 100);
            
            that.totalSize = ((elt[typeSize] + margin[typePos]) * Math.ceil(sourceRef.length/limit2));
        
            container.css(typeSize, that.totalSize + margin[typePos2] + 'px');
            container.css(typeSize2, matrix[typeSize2] - 30 + 'px');
            
            for (i = 0; i < limit1 + moreToShow; i += 1) {
                pos1 = margin[typePos2];

                for (j = 0; j < limit2; j += 1) {
                    cloneConfig.id = 'clone-' + thisConfig.id + '-' + i + '-' + j;
                
                    subIDValue = that.subIDPrefix + i + '-' + j;

                    // if container, also clone children
                    if (elt.widget.kind === 'container' && elt.children && elt.children.length > 0 ) {
                        if (dsPos <  sourceRef.length) {
                            /// Clone html element
                            eltHtml.clone(true, true).attr('id', cloneConfig.id).appendTo(container);

                            containerClone = $('#' + cloneConfig.id);
                        
                            // Add on draw function on the matrix
                            containerClone.onDraw = that.ChildrenEvent;

                            containerClone.css(typePos, pos2 + 'px');
                            containerClone.css(typePos2, pos1 + 'px');

                            // Add events
                            that.cloneEvents(thisConfig.id, containerClone);

                            containerClone.css({
                                'width'     : elt.width + 'px',
                                'height'    : elt.height + 'px',
                                'position'  : 'absolute'
                            })
                            // Set cloneConfig row/column position
                            .attr({
                                'data-area' : i + '-' + j,
                                'data-pos'  : i,
                                'data-dspos': dsPos
                            })
                            // Add class
                            .addClass('waf-matrix-element waf-clone-' + elt.id);

                            // Clone widget
                            new WAF.widget[that.ucfirst(elt.widget.kind)](cloneConfig);

                            children = $('#' +  cloneConfig.id + ' [id]');
                            for (c = 0; c < children.length; c += 1) {
                                childrenHtml = $(children[c]);
                            
                                oldID = childrenHtml.attr('id');
                                oldChild = $('#' + oldID);

                                // fix clones position
                                childrenHtml.css({
                                    'top'       : oldChild.css('top'),
                                    'left'      : oldChild.css('left'),
                                    'position'  : oldChild.css('position'),
                                    'width'     : oldChild[0].offsetWidth + 'px',
                                    'height'    : oldChild[0].offsetHeight + 'px'
                                });
                                
                                // add class
                                childrenHtml.addClass('waf-clone-' + oldID);

                                // change id
                                childrenHtml.attr('id', 'clone-' + oldID + '-' + i + '-' + j);

                                // Add events
                                that.cloneEvents(oldID, childrenHtml);
                            }
                        
                            for (c = 0; c < elt.children.length; c += 1) {
                                // Get the widget config
                                childConfig = {};
                                childrenConfig = elt.children[c];                            

                                for (n in elt.children[c].config) {
                                    childConfig[n] = childrenConfig.config[n];
                                }

                                if (childrenConfig.config && childrenConfig.source && (dsPos <  childrenConfig.source.length)) {
                                    // Clone children element only if there is a DS
                                    childConfig.id = 'clone-' + childrenConfig.config.id + '-' + i + '-' + j;

                                    childConfig.subID = subIDValue;

                                    new WAF.widget[that.ucfirst(childrenConfig.kind)](childConfig);
                                }
                            
                                // CASE OF SOURCE IS RELATED
                                if (childrenConfig.source && childrenConfig.source._private.sourceType != 'dataClass' && childrenConfig.source._private.sourceType != 'relatedEntity') {

                                    // Clone children element only if there is a DS
                                    childConfig.id = 'clone-' + childrenConfig.config.id + '-' + i + '-' + j;

                                    childConfig.subID = subIDValue;

                                    new WAF.widget[that.ucfirst(childrenConfig.kind)](childConfig);
                                }
                            }           

                            // dispatch value to widgets
                            if (sourceRef) {   
                                that.sourceSelect(sourceRef, dsPos, subIDValue, containerClone);
                            }
   
                        
                            //return;
                            inputElements = $('#' + containerClone.attr('id') + ' input[data-binding],textarea[data-binding]');
                            inputElements.unbind('blur');
                            inputElements.bind('blur', {}, function(e) {
                                that.focused = null;
                            });

                            inputElements.bind('focus', {}, function(e) {
                                this.textInputChanged = WAF.widgets[this.id].change;
                            
                                $(this).bind('change', {}, function() {
                                    this.textInputChanged();
                                });

                                that.focused = this;
                            });

                            focusOnElement = function focusOnElement (e) {
                                var 
                                thatElt,
                                source;
                            
                                if (that.focused && $(that.focused).parent().attr('data-dsPos') != $(this).attr('data-dsPos') && that.focused != this ) {
                                    // remove change event for text input
                                    $(that.focused).unbind('change');
                                    that.focused.textInputChanged = WAF.widgets[that.focused.id].change;
                                    that.focused.textInputChanged();
                                    that.focused = null;                                
                                }

                                thatElt    = e.data.element;
                                source     = e.data.source;

                                source.select(parseInt(thatElt.attr('data-dsPos')));
                            }

                            // Add click event on container
                            containerClone.bind('mousedown', {
                                source  : sourceRef,
                                element : containerClone
                            }, focusOnElement);

                            allChildren = $('#' + containerClone.attr('id') + ' *');

                            // Add click event on all children
                            allChildren.bind('mousedown', {
                                source  : sourceRef,
                                element : containerClone
                            }, focusOnElement);
                        
                        }
                    }
                    // Increment position
                    pos1 += (elt[typeSize2] + margin[typePos2]);

                    // Increment position of element in the DS
                    dsPos += 1;

                    if (containerClone) {
                        containerClone.addClass("waf-clone-" + elt.id);
                    }
                }

                // Increment position
                pos2 += (elt[typeSize] + margin[typePos]);
            }

            eltHtml.hide();

            // Do not display the originale element
            $('#' + thisConfig.id).hide();

            // Scroll into the matrix
            tmp     = 0;
            nbTmp   = 0;
            
            htmlObject.bind('scrollstop', function(e){
                $.each($(this).find('.waf-matrix-element'), function(e, ui){
                    var 
                    currentContainer,
                    pos,
                    subIDValue;
                    
                    currentContainer = $(this);
                    
                    subIDValue = that.subIDPrefix + currentContainer.attr("data-area");
                    
                    pos = currentContainer.attr('data-dspos');
                    
                    currentContainer.onDraw = that.ChildrenEvent;
                            
                    that.sourceSelect(sourceRef, pos, subIDValue, currentContainer);
                });
            });
            
            htmlObject.bind('touchmove',function(e) {
                
                that.timeoutID = window.setTimeout(function(){
                    that.scrollManager( limit1 , limit2, moreToShow, tmp, nbTmp, sourceRef, config, typePos, that );
                }, 500);
               
            });
            htmlObject.bind('touchstart',function(e) {

     
            });
            htmlObject.bind('touchend',function(e) {
                
                window.clearTimeout(that.timeoutID);
                
                var cont        = $("#mainContainer-"+matrix.id),
                    topStart    = cont.position().top,
                    topVal,
                    count = true;

                var timer = setInterval( function() { //add interval in order to handle inertie srolling

                    topVal = cont.position().top;

                    if( topVal != topStart || count ) {

                        if( !count ) { 
                            that.scrollManager( limit1 , limit2, moreToShow, tmp, nbTmp, sourceRef, config, typePos, that );
                        }

                        count = false;

                        topStart = topVal;
                    } else {
                        clearInterval(timer);
                    }

                }, 200);
     
            });

            that.matrix = matrix;
            that.matrix.limit1 = limit1;
            that.matrix.limit2 = limit2;
            that.matrix.elt = elt;
        },        
                
        /**
         * select and display
         * @namespace WAF.widget.Matrix
         * @method sourceSelect
         */
        sourceSelect : function matrix_source_select(source, pos, subId, container){
            var
            that;
            
            that = this;
            pos = parseInt(pos);
			
            source.select(pos, {
                subID: subId, 
                stop: true,
                onSuccess   : function(e) {  
                    that.tmpSubID = e.data.subID; 
                    e.data.htmlObject.onDraw();
                },
                delay   : 10,
                delayID : that.divID
            },{
                htmlObject : container,
                subID      : subId
            });
        },
        /**
         * manage the scroll position
         * @namespace WAF.widget.Matrix
         * @method scrollManager
         */
        scrollManager : function matrix_scroll_manager( limit1 , limit2, moreToShow, tmp, nbTmp, sourceRef, config, typePos, elem  ) {
           
            that = elem;
           
            var 
            displayedRow,
            i,
            j,
            orderLength,
            num,
            pos,
            thisRowLength,
            firstEltPos,
            firstEltIndex,
            currentRow,
            currentContainer,
            thisRow,
            order,
            firstEltDisplayed,
            totalRows,
            totalRealRow,
            eltPos,
            subIDValue;

            displayedRow        = 0;
            i                   = 0;
            j                   = 0;
            orderLength         = 0;
            num                 = 0;
            pos                 = 0;
            thisRowLength       = 0;
            firstEltPos         = 0;
            firstEltIndex       = 0;
            currentRow          = {};
            currentContainer    = {};
            thisRow             = {};
            order               = [];
            firstEltDisplayed   = null;
            totalRows           = (limit1 + moreToShow);
            totalRealRow        = Math.ceil(that.sourceRef.length/that.limit2);
            eltPos              = 0;

            /*
             * Do not move containers if they are all displayed
             */
            if (totalRealRow <= totalRows) {
                return false;
            }     
                    
            /*
             * determine what is the row displayed depending on the scroll bar
             */
            displayedRow = that.getDisplayedRow();

            if (displayedRow !== tmp) {


                nbTmp += 1;

                if (nbTmp === 1){
                    nbTmp = 0;

                    firstEltPos = that.getPosByRow(displayedRow); 
            
                    /*
                     * To improve live scrolling
                     */
                    sourceRef.setDisplayLimits(that.divID, displayedRow*limit2, (displayedRow*limit2 + (totalRows*limit2)) );                   

                    /*
                     * Get the first element that must be displayed depending on the scroll
                     */ 
                    for (i = 0; i < totalRows; i += 1,firstEltIndex +=1) {
                        currentRow = $('#' + config.id + " [data-pos=" + i + "][data-type!=label]");

                        if ( parseInt(currentRow.css(typePos)) === firstEltPos) {
                            firstEltDisplayed = currentRow;
                            break;
                        }
                    }
                    if (firstEltDisplayed === null) {
                        firstEltIndex = -1;
                    }
        
                    order = [];
                    /* 
                     * Get next element to order them
                     */
                    for (i = firstEltIndex + 1; i < totalRows; i += 1) {
                        num += 1;
                        order.push($('#' + config.id + " [data-pos=" + i + "][data-type!=label]"));
                    }

                    /* 
                     * Get previous element to order them
                     */
                    for (i = 0; i < firstEltIndex; i += 1) {
                        order.push($('#' + config.id + " [data-pos=" + i + "][data-type!=label]"));
                    }

                    num = 0;

                    orderLength = order.length;

                    /*
                     * change first element position attribute
                     */
                    if (firstEltDisplayed && !firstEltDisplayed.is(':hidden')) {
                        firstEltDisplayed.attr('data-pos', num);
                    } else {

                        orderLength -= 1;
                        order[orderLength].show();
            
                        order[orderLength].css(typePos, firstEltPos + 'px');
                        order[orderLength].attr('data-pos', num);
                        order[orderLength].attr("data-dspos", displayedRow);

                        thisRowLength = order[orderLength].length;

                        for (j = 0; j <= thisRowLength; j += 1){
                            currentContainer = $(order[orderLength][j]);
                            if (currentContainer.attr('data-type') === 'container') {

                                pos = ((displayedRow*limit2) + j);

                                currentContainer.show();
                    
                                currentContainer.attr("data-dspos", pos);
                    
                                currentContainer.onDraw = that.ChildrenEvent;
                                subIDValue = that.subIDPrefix + currentContainer.attr("data-area");
                                 $.each(currentContainer.children(), function() {
                                        var
                                        currentWidget;
                                        
                                        currentWidget = WAF.widgets[this.id];
                                        
                                        if (currentWidget) {
                                            currentWidget.clear();
                                        }
                                    });
                                if (sourceRef.getPosition() == pos &&  that.currentPos == pos) {
                                    sourceRef.dispatch('onCurrentElementChange', {
                                        subID : subIDValue
                                    });
                                }                                
                        
                                that.sourceSelect(sourceRef, pos, subIDValue, currentContainer);
                            }
                        }

                    }

                    /*
                     * Order elements
                     */
                    for (i = 0; i < orderLength; i += 1) {
                        num += 1;

                        order[i].attr('data-pos', num );

                        thisRow = (displayedRow+num);

                        thisRowLength = order[i].length;

                        eltPos  = that.getPosByRow(thisRow);

                        /*
                         * Move only those wrongly positioned
                         */
                        if (parseInt(order[i].css(typePos)) != eltPos){

                            for (j = 0; j <= thisRowLength; j += 1){
                                currentContainer = $(order[i][j]);

                                if (currentContainer.attr('data-type') === 'container') {

                                    pos = ((thisRow*limit2) + j);

                                    if (pos >= sourceRef.length) {
                                        currentContainer.hide();
                                    } else {
                                        currentContainer.show();
                                    }
                        
                                    if (currentContainer.attr("data-dspos") != pos) {
                                        currentContainer.attr("data-dspos", pos);
                            
                                        currentContainer.onDraw = that.ChildrenEvent;
                                        subIDValue = that.subIDPrefix +  currentContainer.attr("data-area");
                                         $.each(currentContainer.children(), function() {
                                                var
                                                currentWidget;
                                                
                                                currentWidget = WAF.widgets[this.id];
                                                
                                                if (currentWidget) {
                                                    currentWidget.clear();
                                                }
                                            });

                                        if (sourceRef.getPosition() == pos &&  that.currentPos == pos) {
                                            sourceRef.dispatch('onCurrentElementChange', {
                                                subID : subIDValue
                                            });
                                        } else {          
                                           that.sourceSelect(sourceRef, pos, subIDValue, currentContainer);
                                        }
                                
                                    }
                                }

                            }

                            /*
                             * Margin for the first element of the matrix
                             */
                            if (thisRow >= sourceRef.length || (thisRow*limit2) >= sourceRef.length) {
                            // DO NOTHING
                            } else {
                                order[i].css(typePos, eltPos + 'px' );
                                order[i].children().blur();
                            }
                        }
                    }
        
            
                    $('#' + that.matrix.id + ' [data-dspos="' + that.selectedDS + '"][data-type!="checkbox"]').addClass('waf-matrix-element waf-state-selected');
                    $('#' + that.matrix.id + ' [data-dspos!="' + that.selectedDS + '"][data-type!="checkbox"]').removeClass('waf-state-selected');

                    sourceRef.select(that.selectedDS, {
                        dispatcherID : config.id
                    });

                }
                tmp = displayedRow;
            }
        }
    }
);
       
/*
 * ScrollStart & ScrollStop special events
 */
$.event.special.scrollstart = {
    setup: function() {
            
        var timer,
        handler =  function(evt) {
                    
            var _self = this,
            _args = arguments;
                    
            if (timer) {
                clearTimeout(timer);
            } else {
                evt.type = 'scrollstart';
                $.event.handle.apply(_self, _args);
            }
                    
            timer = setTimeout( function(){
                timer = null;
            }, $.event.special.scrollstop.latency);
                    
        };
            
        jQuery(this).bind('scroll', handler).data('D' + (+new Date()), handler);
            
    },
    teardown: function(){
        jQuery(this).unbind( 'scroll', jQuery(this).data('D' + (+new Date())) );
    }
};
    
$.event.special.scrollstop = {
    latency: 300,
    setup: function() {
            
        var timer,
        handler = function(evt) {
                    
            var _self = this,
            _args = arguments;
                    
            if (timer) {
                clearTimeout(timer);
            }
                    
            timer = setTimeout( function(){
                        
                timer = null;
                evt.type = 'scrollstop';
                $.event.handle.apply(_self, _args);
                        
            }, $.event.special.scrollstop.latency);
                    
        };
            
        jQuery(this).bind('scroll', handler).data('D' + (+new Date() + 1), handler);
            
    },
    teardown: function() {
        jQuery(this).unbind( 'scroll', jQuery(this).data('D' + (+new Date() + 1)) );
    }
};