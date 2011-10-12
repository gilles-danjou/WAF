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
    type        : 'matrix',
    lib         : 'WAF',
    description : 'Matrix',
    category    : 'Layout',
    img         : '/walib/WAF/widget/matrix/icons/widget-matrix.png',
    tag         : 'div',
    attributes  : [
    {
        name        : 'class',
        description : 'Css class'
    },
    {
        name        : 'data-margin',
        description : 'Margin',
        defaultValue: 10,
        typeValue   : 'integer',
        slider      : {
            min : 0,
            max : 50
        }
    },
    {
        name        : 'data-fit',
        description : 'Auto Fit',
        type        : 'checkbox',
        defaultValue: 'false'
    },
    {
        name        : 'data-scrolling',
        description : 'Scrolling',
        type        : 'dropdown',
        options     : [{
                key     : 'vertical',
                value   : 'Vertical'
        },{
                key     : 'horizontal',
                value   : 'Horizontal'
        }],
        defaultValue: 'vertical'
    },
    {
        name        : 'data-scrollbar',
        description : 'Scrollbar',
        type        : 'checkbox',
        defaultValue: 'true'
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
    }],
    style: [
    {
        name        : 'width',
        defaultValue: '500px'
    },
    {
        name        : 'height',
        defaultValue: '500px'
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
        name       : 'onChildrenDraw',
        description: 'On Draw',
        category   : 'Matrix Children Events'
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
            theme       : false,
            fClass      : true,
            text        : false,
            background  : true,
            border      : true,
            sizePosition: true,
            label       : false,
            dropShadow  : true,
            innerShadow : true,
            disabled    : []
        }
    },
    onInit: function (config) {
        return new WAF.widget.Matrix(config);  
    },
    
    onDesign: function (config, designer, tag, catalog, isResize) {
        tag.clean = function () {
            var
            child,
            except;
            
            child   = tag._childTag;
            
            if (child) {
                except  = '[id!="' + child.getOverlayId() + '"]';

                if (child.getLinkedTag()) {
                    except += '[id!="' + child.getLinkedTag().getOverlayId() + '"]';
                }
                
                $('#' + tag.getId()).children( except ).remove();

                if(tag._childTag) {
                    tag._childTag._matrix = null;
                    tag._childTag = null;
                }
            }
        }
        
        tag.rebuild = function() {
            if (tag._childTag && !tag._childTag.isLabel()) {
                var
                child,
                except,
                margin,
                initMarginLeft,
                initMarginTop,
                marginLeft,
                marginTop,
                width,
                height,
                left,
                top,
                matrixHeight,
                matrixWidth,
                rows,
                columns,
                initHeight,
                initWidth,
                i,
                j,
                cloneId,
                topLabel,
                leftLabel,
                initTopLabel,
                initLeftLabel,
                matrixId,
                idToClone,
                resizeWidth,
                resizeHeight,
                label;                
                
                tag.isRebuild = true;
                
                child   = tag._childTag;
                except  = '[id!="' + child.getOverlayId() + '"]';
                if (child.getLinkedTag()) {
                    except += '[id!="' + child.getLinkedTag().getOverlayId() + '"]';
                }

                // clean the matrix
                $('#' + tag.getId()).children( except ).remove();

                // set the element position
                margin          = tag.getAttribute('data-margin') ? parseInt(tag.getAttribute('data-margin').getValue()) : 0;
                initMarginLeft  = margin;
                initMarginTop   = margin;
                marginLeft      = 0;
                marginTop       = 0;
                width           = child.getWidth();
                height          = child.getHeight();
                left            = 0;
                top             = 0;
                matrixHeight    = tag.getHeight();
                matrixWidth     = tag.getWidth();
                rows            = 0;
                columns         = 0;
                initHeight      = 0;
                initWidth       = 0;
                cloneId         = '';
                topLabel        = 0;
                leftLabel       = 0;
                initTopLabel    = 0;
                initLeftLabel   = 0;
                matrixId        = tag.getId();
                idToClone       = child.getOverlayId();
                resizeWidth     = 0;
                resizeHeight    = 0;
                marginLeft      = initMarginLeft;
                marginTop       = initMarginTop;
                label           = child.getLabel();
                

                // Link the tag to the current matrix
                child._matrix = tag;

                if (label) {
                    label._matrix = tag;

                    switch (child.getAttribute('data-label-position').getValue()) {
                        case 'top':
                            marginTop   += label.getHeight();
                            height      += label.getHeight();

                            break;

                        case 'right':
                            width       += label.getWidth();
                            break;

                        case 'bottom':
                            height      += label.getHeight();
                            break;
                            
                        case 'left':
                            marginLeft  += label.getWidth();
                            width       += label.getWidth();

                            break;
                    }
                }

                child.setXY(marginLeft, marginTop, true);
                
                initHeight  = (parseInt(initMarginTop) + height);
                initWidth   = (parseInt(initMarginLeft) + width);

                /*
                 * Calcul number of elements for the height
                 */ 
                rows        = Math.ceil(matrixHeight / initHeight) - 1;
                
                /*
                 * Calcul number of elements for the width
                 */ 
                columns = Math.ceil(matrixWidth / initWidth) - 1;
                
                /*
                 * Resize the matrix to appropriate size
                 */ 
                if (tag.getAttribute('data-fit').getValue() === true || tag.getAttribute('data-fit').getValue() === 'true') {
                    if (columns === 0) {
                        columns = 1;
                    }
                    if (rows === 0) {
                        rows = 1;
                    }
                    
                    resizeWidth     = (initWidth*columns) + parseInt(initMarginLeft);
                    resizeHeight    = (initHeight*rows) + parseInt(initMarginTop);

                    if (tag.getAttribute('data-scrollbar').getValue() !== 'false') {
                        if (tag.getAttribute('data-scrolling').getValue() === 'vertical') {
                            resizeWidth += 15;
                        } else {
                            resizeHeight += 15;
                        }
                    }
                    
                    resizeWidth     += 'px';
                    resizeHeight    += 'px';

                    $('#' + tag.overlay.id).css('width', resizeWidth);
                    $('#' + tag.overlay.id).css('height', resizeHeight);

                    tag.setStyle('width', resizeWidth);
                    tag.setStyle('height', resizeHeight);

                    tag.domUpdate();
                }

                // Add clone class for WYSIWYG
                $('#' + idToClone + ' .waf-widget').each(function(e) {
                    $(this).addClass('waf-clone-' + $(this).attr('id'));
                });

                var createClone = function( matrixId, idToClone, cloneId, newTop, newLeft ) {
                    var
                    elt,
                    clone;
                    
                    elt     = $('#' + idToClone);
                    elt.clone(false, true).attr('id', cloneId).appendTo('#' + matrixId);
                    clone   = $('#' + cloneId);
                    
                    clone.unbind('click');
                    clone.unbind('dblclick');
                    clone.unbind('mousedown');
                    clone.unbind('mouseup');
                    
                    clone.ready(function() {           
                        var
                        $that,
                        ctx,
                        canvas,
                        width,
                        height,
                        $all;
                        
                        $that   = clone;
                        $all    = $('#' + cloneId + ' *');
                        
                        // remove useless elements
                        $that.find('.yui-resize-handle').remove();
                        $that.removeClass('waf-focus');
                        
                        $all.addClass('waf-matrix-clone');
                        $all.removeAttr('id');                        
                        
                        $that.css({
                            'top'       : newTop + 'px',
                            'left'      : newLeft + 'px',
                            'opacity'   : '0.5',
                            'outline'   : 'none'
                        });                        

                        canvas = clone.find('canvas');

                        if (canvas.length > 0) {
                            width   = canvas.width();
                            height  = canvas.height();
                            canvas  = canvas[0];
                            ctx     = canvas.getContext("2d");
                            ctx.fillStyle = "rgb(200,0,0)";
                            ctx.fillRect(0, 0, width/2, height / 2);
                            ctx.fillStyle = "rgba(0, 50, 200, 0.5)";
                            ctx.fillRect(width / 2 - width / 6, height / 2 - height / 6, width / 2 + width / 6, height / 2 + height / 6);
                        }
                    });
                }                

                if (child.getLabel()) {
                    initTopLabel    = child.getLabel().getY();
                    initLeftLabel   = child.getLabel().getX();
                }
                
                for (i = 0; i < rows; i += 1) {
                    cloneId     = 'waf_ghost_' + child.getOverlayId() + '_' + i,
                    newTop      = (initHeight * i) + marginTop,
                    newLeft     = parseInt(left) + marginLeft;

                    topLabel    = initTopLabel + (initHeight * i);

                    if ( i != 0) {
                        createClone( matrixId, idToClone, cloneId, newTop, newLeft );

                        if (child.getLabel()) {
                            createClone( matrixId, child.getLabel().getOverlayId(), cloneId + '_' + child.getLabel().getId(), topLabel, initLeftLabel );
                        }
                    }

                    for (j = 1; j < columns; j += 1) {
                        cloneId = 'waf_ghost_' + child.getOverlayId() + '_' + i + '_' + j,
                        newLeft = (initWidth * j) + marginLeft;

                        createClone( matrixId, idToClone, cloneId, newTop, newLeft );

                        if (child.getLabel()) {
                            leftLabel = initLeftLabel + (initWidth * j);
                            createClone( matrixId, child.getLabel().getOverlayId(), cloneId + '_' + child.getLabel().getId(), topLabel, leftLabel );
                        }
                    }
                }

                tag.isRebuild =  false;
            }
        }

        if (isResize) {
            tag.rebuild();
        }

    }
});
