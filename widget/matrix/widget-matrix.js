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
        /*
         * Resize method called on stop resize
         * @method onResize
         */
        onResize : function matrix_on_resize() { 
            if (this.eventData) {
                this.display(this.eventData)
            }
        },
        
        getPosByRow : function matrix_get_pos_by_row (row) {
            var 
            that,
            result;

            that    = this;
            result  = (row * (that.elt[that.typeSize] + that.margin[that.typePos])) + that.margin[that.typePos];

            return result;
        },

        getRowByPos : function matrix_get_row_by_pos (pos) {
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

        getDisplayedRow : function matrix_get_displayed_row () {
            var 
            that,
            result,
            scrollPosition;

            that            = this;
            scrollPosition  = that.scrolling === 'vertical' ? $('#' + that.config.id).scrollTop() : $('#' + that.config.id).scrollLeft();
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
        create  : function matrix_create() {             
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
            child,
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
        
            that.tmpSubID   = 0;
        
            if (WAF.events[config.id] && WAF.events[config.id][0] && WAF.events[config.id][0].fn) {
                that.ChildrenEvent = WAF.events[config.id][0].fn;
            } else {
                that.ChildrenEvent = function() {}
            }

            // Get the matrix children to find a datasource
            matrixChildren.each(function(e) {
                var
                subChild;
                
                child = $(this);
                
                if (child.attr('data-type') === 'container') {
                    elt = {
                        id      : child.attr('id'),
                        widget  : WAF.widgets[child.attr('id')],
                        width   : parseInt(child.css('width')),
                        height  : parseInt(child.css('height')),
                        left    : parseInt(child.css('left')),
                        top     : parseInt(child.css('top')),
                        htmlObj : $('#' + child.attr('id')),
                        children: []
                    }
                    //children = $('#' + child.attr('id') + ' [data-binding]');
                    children = $('#' + child.attr('id') + ' .waf-widget');
                    
                    // Get the container children
                    children.each(function(e) {
                        subChild = $(this);
                        
                        /*
                         * Remove draggable and resizable to prevent function duplication
                         */
                        subChild.resizable('destroy');
                        subChild.draggable('destroy');
                        
                        widget = WAF.widgets[subChild.attr('id')];
                        if (subChild.attr('data-binding') && widget.source) {
                            // Get the source of widget
                            thisSource.push(widget.source);
                        }
                        
                        elt.children.push(widget)
                    });
                    
                } else {
                    if (child.attr('data-binding')) {
                        containerConfig = {
                            id: 'waf-tmp-container',
                            'data-type' : 'container',
                            'data-lib'  : 'WAF'

                        };
                        thisId          = child.attr('id');
                        widgetContainer = new WAF.widget['Container'](containerConfig);
                        width           = child[0].offsetWidth;
                        height          = child[0].offsetHeight;
                        label           = $("[for='" + thisId+ "']");
                        margin          = params['data-margin'] ? parseInt(params['data-margin']) : 10;
                        
                        $('<div />').attr({
                            'id'        : 'waf-tmp-container',
                            'data-type' : 'container'
                        }).css('position', 'absolute').appendTo('#' + config.id).append(child);

                        widgetContainer.config = containerConfig;

                        // Get the source of widget
                        widget = WAF.widgets[child.attr('id')];
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

                            switch (child.attr('data-label-position')) {
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
                            subChild = $(this);
                            subChild.css('left', parseInt(subChild.css('left')) - margin + 'px');
                            subChild.css('top', parseInt(subChild.css('top')) - margin + 'px');
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
                                if ($('#' + e.dispatcherID).attr('data-type') != 'slider' && e.data.that.clickOnElement) {
                                    e.dataSource.save({
                                        subID : subIDValue
                                    });
                                }
                            
                                e.data.that.clickOnElement = false;
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
                                
                                e.changeDs = true;
                                
                                e.data.that.display(e);
                                
                                // force select on the first element
                                e.dataSource.select(firstPos, {
                                    dispatcherID : config.id
                                });  
                                
                                /*
                                 * ADD SCROLL EVENTS
                                 */
                                htmlObject.bind('scroll', function matrix_scroll(e){
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
                                    subIDValue,
                                    limit2,
                                    typePos,
                                    sourceRef;

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
                                    totalRows           = (that.limit1 + that.moreToShow);
                                    totalRealRow        = Math.ceil(that.sourceRef.length/that.limit2);
                                    eltPos              = 0;
                                    sourceRef           = that.sourceRef;
                                    limit2              = that.limit2;
                                    typePos             = that.typePos;

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

                                    if (displayedRow !== that.tmp) {

                                        that.nbTmp += 1;

                                        if (that.nbTmp === 1){
                                            that.nbTmp = 0;

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
                                                        
                                                        var 
                                                        widget;
                                                        
                                                        widget = WAF.widgets[currentContainer.attr('id')];
                                                        if (widget.setSplitPosition) {
                                                            widget.setSplitPosition(WAF.widgets[currentContainer.attr('data-ref')].getSplitPosition());
                                                        }
                                                        
                                                        $.each(currentContainer.children(), function() {
                                                            var
                                                            thatHtml,
                                                            refHtml,
                                                            currentWidget;

                                                            currentWidget   = WAF.widgets[this.id];
                                                            thatHtml        = $(this);
                                                            refHtml         = $('#' + thatHtml.attr('data-ref'));
                                                            
                                                            if (currentWidget && currentWidget.kind != 'container') {
                                                                currentWidget.clear();
                                                            }
                                                            
                                                            if (currentWidget && currentWidget.setSplitPosition) {
                                                                currentWidget.setSplitPosition(WAF.widgets[thatHtml.attr('data-ref')].getSplitPosition());
                                                            }
                                                        
                                                            if (thatHtml.attr('data-resizable') && thatHtml.attr('data-resizable') == 'true') {
                                                                thatHtml.width(refHtml.width());
                                                                thatHtml.height(refHtml.height());
                                                            }
                                                                    
                                                            if (thatHtml.attr('data-draggable') && thatHtml.attr('data-draggable') == 'true') {
                                                                thatHtml.css('top', refHtml.css('top'));
                                                                thatHtml.css('left', refHtml.css('left'));
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

                                                                var 
                                                                widget;

                                                                widget = WAF.widgets[currentContainer.attr('id')];
                                                                if (widget.setSplitPosition) {
                                                                    widget.setSplitPosition(WAF.widgets[currentContainer.attr('data-ref')].getSplitPosition());
                                                                }
                                                        
                                                                $.each(currentContainer.children(), function() {
                                                                    var
                                                                    thatHtml,
                                                                    refHtml,
                                                                    currentWidget;

                                                                    currentWidget   = WAF.widgets[this.id];
                                                                    thatHtml        = $(this);
                                                                    refHtml         = $('#' + thatHtml.attr('data-ref'));
                                                                    
                                                                    if (currentWidget && currentWidget.kind != 'container') {
                                                                        currentWidget.clear();
                                                                    }
                                                                    
                                                                    if (currentWidget && currentWidget.setSplitPosition) {
                                                                        currentWidget.setSplitPosition(WAF.widgets[thatHtml.attr('data-ref')].getSplitPosition());
                                                                    }
                                                                    
                                                                    if (thatHtml.attr('data-resizable') && thatHtml.attr('data-resizable') == 'true') {
                                                                        thatHtml.width(refHtml.width());
                                                                        thatHtml.height(refHtml.height());
                                                                    }
                                                                    
                                                                    if (thatHtml.attr('data-draggable') && thatHtml.attr('data-draggable') == 'true') {
                                                                        thatHtml.css('top', refHtml.css('top'));
                                                                        thatHtml.css('left', refHtml.css('left'));
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

                                            /*sourceRef.select(that.selectedDS, {
                                                dispatcherID : config.id
                                            });*/

                                        }
                                        
                                        that.tmp = displayedRow;
                                    }            
                                });

                                /*
                                 * Scrollstop event
                                 */
                                htmlObject.bind('scrollstop', function matrix_scroll_stop(e){
                                    var
                                    sourceRef;

                                    sourceRef = that.sourceRef;

                                    $.each($(this).find('.waf-matrix-element'), function(i){
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
                                    
                                    //console.log("======>", that.getDisplayedRow())
                                });
                                
                                break;
                        }
                    }
            
                    that.eventData = e;

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
        goTo : function matrix_goto(pos) {
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
        },

        /**
         * Go to first position
         * @namespace WAF.widget.Matrix
         * @method goToFirst
         */
        goToFirst : function matrix_goto_first() {
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
        goToLast : function matrix_goto_last() {
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
        goToNext : function matrix_goto_next() {
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
        },

        /**
         * Go to previous
         * @namespace WAF.widget.Matrix
         * @method goPrevious
         */
        goToPrevious : function matrix_goto_previous() {
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
        },

        /**
         * Get the total number of pages
         * @namespace WAF.widget.Matrix
         * @method getTotalPages
         */
        getTotalPages : function matrix_get_total_pages() {
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
        getCurrentPage : function matrix_get_current_page() {
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
        cloneEvents : function matrix_clone_events(id, element) {  
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
        display : function matrix_display(e) {
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
            config,
            idList,
            totalRow,
            currentRow,
            childrenLength,
            eltChildrenLength;
        
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
            
            /*
             * Set variables as attribute of the matrix widget
             */
            that.elt            = elt;
            that.typePos        = typePos;
            that.typePos2       = typePos2;
            that.typeSize       = typeSize;
            that.typeSize2      = typeSize2;
            that.margin         = margin;
            that.scrolling      = scrolling;
            that.limit2         = limit2;
            that.limit1         = limit1;
            that.moreToShow     = moreToShow;
            that.sourceRef      = sourceRef;  
                         
            /*
             * FOR MATRIX RESIZE
             */
            if (that.tmpColumns != columns || that.tmpRows != rows) {
                // DO NOTHING
                if (typeof(that.tmpColumns) != 'undefined') { 
                    currentRow  = that.getDisplayedRow();
                    totalRow    = Math.ceil(that.sourceRef.length/that.limit2);
                    
                    /*
                     * To prevent resize bug when on last row
                     */
                    if (currentRow > totalRow) {
                        currentRow = totalRow
                    }                        
                
                    dsPos   = currentRow * that.limit2;                    
                    pos2    = that.getPosByRow(currentRow);   
                    
                    if (dsPos >= sourceRef.length) {
                        dsPos = (sourceRef.length-1) - (that.limit2*(that.limit1 + moreToShow));
                    }
                    
                    sourceRef.setDisplayLimits(that.divID, currentRow*that.limit2, (currentRow*that.limit2 + (currentRow*that.limit2)) );                    
                }
                
                /*
                 * Remove existing listeners
                 */
                idList = []
                $.each(htmlObject.find('.waf-widget'), function() {
                    idList.push($(this).attr('id'))
                })

                $.each(sourceRef._private.listeners, function() {
                    if (this.id && new RegExp(this.id).test(idList.join(','))) {
                        sourceRef.removeListener(this)
                    }
                });
            } else if (!e.changeDs){
                eltHtml.hide();
            
                return;
            }
            
            that.tmpRows = rows;
            that.tmpColumns = columns;              
            
            htmlObject.children('.waf-widget, .matrix-container, .waf-splitter').remove();     

            // Container is used to define the scroll size
            container = $('<div/>').addClass('matrix-container').appendTo(htmlObject);
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
                        if (dsPos < sourceRef.length) {
                            /// Clone html element
                            eltHtml.clone(true, true).attr('id', cloneConfig.id).appendTo(container);
                            
                            containerClone = $('#' + cloneConfig.id);
                            containerClone.children('.waf-splitter').remove();
                        
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
                                'data-dspos': dsPos,
                                'data-ref'  : thisConfig.id
                            })
                            // Add class
                            .addClass('waf-matrix-element waf-matrix-clone waf-clone-' + elt.id);
                            
                            
                            // Clone widget
                            new WAF.widget[that.ucfirst(elt.widget.kind)](cloneConfig);

                            children = $('#' +  cloneConfig.id + ' [id]');
                            
                            childrenLength = children.length;
                            
                            for (c = 0; c < childrenLength; c += 1) {
                                childrenHtml = $(children[c]);
                            
                                oldID = childrenHtml.attr('id');
                                oldChild = $('#' + oldID);
                                
                                var width = oldChild[0].offsetWidth + 'px';
                                var height = oldChild[0].offsetHeight + 'px';
                                
                                if (oldChild.attr('data-constraint-right') == 'true' && oldChild.attr('data-constraint-left') == 'true') {
                                    width = 'auto';
                                }

                                if (oldChild.attr('data-constraint-top') == 'true' && oldChild.attr('data-constraint-bottom') == 'true') {
                                    height = 'auto';
                                }           

                                // fix clones position
                                childrenHtml.css({
                                    'top'       : oldChild.css('top'),
                                    'left'      : oldChild.css('left'),
                                    'right'     : oldChild.css('right'),
                                    'bottom'    : oldChild.css('bottom'),
                                    'position'  : oldChild.css('position'),
                                    'width'     : width,
                                    'height'    : height
                                });
                                
                                // add class
                                childrenHtml.addClass('waf-clone-' + oldID);

                                // change id
                                childrenHtml.attr({
                                    'id'        : 'clone-' + oldID + '-' + i + '-' + j,
                                    'data-ref'  : oldID
                                });
                                childrenHtml.addClass('waf-matrix-clone');

                                // Add events
                                that.cloneEvents(oldID, childrenHtml);
                            }
                            
                            eltChildrenLength = elt.children.length;
                        
                            for (c = 0; c < eltChildrenLength; c += 1) {
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
                                
                                if (childrenConfig.config['data-type'] == 'container') {
                                    childConfig.id = 'clone-' + childrenConfig.config.id + '-' + i + '-' + j;
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


                            inputElements.bind('focusin', {
                                source  : sourceRef,
                                element : containerClone
                            }, function(e) {
                                this.textInputChanged = WAF.widgets[this.id].change;
                            
                                $(this).bind('change', {}, function() {
                                    this.textInputChanged();
                                });
                                
                                
                                    focusOnElement(e);
                                
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
                                
                                that.clickOnElement = true;
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

            // Reset tmp variables
            that.tmp     = 0;
            that.nbTmp   = 0;
            
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