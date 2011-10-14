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
    type       : 'dataGrid',
    lib        : 'WAF',
    category   : 'Datagrid',
    description: 'Grid',
    img        : '/walib/WAF/widget/dataGrid/icons/widget-dataGrid.png',
    attributes : [
    {
        name       : 'data-binding',
        description: 'Source'
    },
    {
        name       : 'data-columns',
        description: 'Columns',
        type       : 'textarea'
    },
    {
        name       : 'class',
        description: 'Css class'
    },
    {
        name        : 'data-label',
        description : 'Label',
        defaultValue: ''
    },
    {
        name        : 'data-label-position',
        description : 'Label position',
        defaultValue: 'top'
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
        name        : 'data-readOnly',
        description : 'Read only',
        type        : 'checkbox'
    },
    {
    	name		: 'data-selection-mode',
    	description	: 'Selection mode',
    	defaultValue: 'single',
    	type		: 'dropdown',
    	options		: [{
    			key		: 'single',
    			value	: 'Single'
    	}, {
    			key		: 'multiple',
    			value	: 'Multiple'
    	}]
    },
	{
        name        : 'data-display-error',
        description : 'Display error',
        type        : 'checkbox',
		category    : 'Error Handling',
		defaultValue:'true'
    },
	{
        name        : 'data-error-div',
        description : "Place holder for the error's description",
 		category   : 'Error Handling'
    },
    {
        name        : 'data-column-attribute',
        description : 'Column attribute'
    },
    {
        name        : 'data-column-name',
        description : 'Column name'
    },
    {
        name        : 'data-column-width',
        description : 'Column width'
    },
    {
        name        : 'data-column',
        visibility  : 'hidden',
        defaultValue: '[]'
    }],
    events: [
    {
        name       : 'onRowClick',
        description: 'On Row Click',
        category   : 'Grid Events'

    },
	{
        name       : 'onRowDraw',
        description: 'On Row Draw',
        category   : 'Grid Events'

    },
	{
        name       : 'onError',
        description: 'On Error Handler',
        category   : 'Grid Events'

    },
    {
        name       : 'onHeaderClick',
        description: 'On Header Click',
        category   : 'Grid Events'
    }],
    columns: {
        attributes : [    
        {
            name       : 'sourceAttID'        
        },
        {
            name       : 'colID'        
        },
        {
            name       : 'format'        
        },
        {
            name       : 'width'        
        },
        {
            name       : 'title'
        }
        ],
        events: []
    },
    properties: {
        style: {
            theme       : {
                'roundy'    : false
            },
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
        description : 'cells',
        selector    : '.waf-dataGrid-cell',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'header / cells',
        selector    : '.waf-dataGrid-header .waf-dataGrid-cell',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'header',
        selector    : '.waf-dataGrid-header',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'rows / even',
        selector    : '.waf-dataGrid-row.waf-widget-even',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'rows / odd',
        selector    : '.waf-dataGrid-row.waf-widget-odd',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'rows',
        selector    : '.waf-dataGrid-row',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        },
        state : [{
                label   : 'hover',
                cssClass: 'waf-state-hover',
                find    : '.waf-dataGrid-row'
        },{
                label   : 'active',
                cssClass: 'waf-state-active',
                find    : '.waf-dataGrid-row'
        }]
    },{
        description : 'body',
        selector    : '.waf-dataGrid-body',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'footer',
        selector    : '.waf-dataGrid-footer',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    }],
    onInit: function (config) {
        var 
        colWidth = config['data-column-width'] ? config['data-column-width'].split(',') : [],
        colNames = config['data-column-name'] ? config['data-column-name'].split(',') : [],
        tagClass = config['class'],
        theme = this.attributes[2].options,
        sum = 0,
        themeName = '', 
        colName = '', 
        tagWidth = 0, 
        diffWidth = 0, 
        displayScroll = true,
        grid = null,
        configColumn = {},
        configColumnUnescape = {},
        length = 0,
        i = 0,
        attributeName = '',
        column = [],
        selectionMode = config['data-selection-mode'] ? config['data-selection-mode'] : 'single',
		errorDiv = config['data-error-div'],
		mustDisplayError = config['data-display-error'],
        theID = config['id'];
        
		if (mustDisplayError == null)
			mustDisplayError = true;
		else
			mustDisplayError = (mustDisplayError == '1' || mustDisplayError == 'true');
        tagWidth = parseInt(document.getElementById(theID).style.width) - 1;       
        
        // check for retro compatibility
        if (config['data-column'] && config['data-column'] != '[]') {        
                        
            configColumn = JSON.parse(config['data-column'].replace(/'/g,"\""));
            
            // unescape value
            length = configColumn.length;
            for (i = 0; i < length; i++) {
                column = configColumn[i];
                for (attributeName in column) {
                    column[attributeName] = unescape(column[attributeName]);
                }
            }                        
                                    
            grid = new WAF.widget.Grid({
                inDesign        : false,
                id              : theID,
                render          : theID,
                dataSource      : config['data-binding'],
                binding         : config['data-binding'],
                columns         : configColumn,
                colWidth        : colWidth,
                cls             : tagClass,
                selMode			: selectionMode,
				mustDisplayError: mustDisplayError,
				errorDiv		: errorDiv
            });
        } else {
            // old code for compatibility with very early versions
            // if only one column the width is the same that the widget width
            if (colNames.length === 1) {
                colWidth = [tagWidth];
                displayScroll = false;
            // else auto resize the lastest column
            } else {
                sum = 0
                for (colName in colNames) {
                    sum += parseInt(colWidth[colName]);
                }
                if (sum < tagWidth) {
                    diffWidth = tagWidth-sum;
                    colWidth[colNames.length -1 ] = String((parseInt(colWidth[colNames.length - 1]) + diffWidth));
                    displayScroll = false;
                }
            }
            
            // reformat config
            var tabName = [];
            var tabAttribute = [];
            var tabWidth = [];
            
            if (config['data-column-name']) {
                tabName =  config['data-column-name'].split(',');
            }
            if (config['data-column-attribute']) {
                tabAttribute = config['data-column-attribute'].split(',');
            }
            if (config['data-column-width']) {
                tabWidth = config['data-column-width'].split(',');
            }
            
            var length = tabAttribute.length;
            var column = null;
            
            var att = '';
            var label = '';
            var width = '';            
            
            configColumn = [];
            for (i = 0; i < length; i++) {                                                
                column = {};
                
                att = tabAttribute[i];
                
                try {
                    label = tabName[i];
                } catch (e) {
                    label = att;
                }

                try {
                    width = tabWidth[i];
                } catch (e) {
                    width = '150';
                }
                
                column['sourceAttID'] = att;
                column['title'] = label;
                column['width'] = width;

                configColumn.push(column);
            }
                                    
            grid = new WAF.widget.Grid({
                inDesign        : false,
                id              : theID,
                render          : theID,
                dataSource      : config['data-binding'],
                binding         : config['data-binding'],
                columns         : configColumn,
                colWidth        : colWidth,
                cls             : tagClass,
                selMode			: selectionMode,
				mustDisplayError: mustDisplayError,
				errorDiv		: errorDiv
            });
            
        }

        // Hide vertical scrollbar if necessary
        if(!displayScroll){
            $('#' + theID + ' .waf-dataGrid-body').css('overflow-x', 'hidden');
        }   

        // Drag
        $.ui['draggable'].prototype.plugins.start[4][1] = function(event, ui) {
            var ind = $(this).data("draggable");
            if (ind.scrollParent && ind.scrollParent[0] != document && ind.scrollParent[0].tagName != 'HTML') {  
                ind.overflowOffset = ind.scrollParent.offset(); 
            }
        }
        
        
        if (config['data-draggable'] === "true") {
            $('#' + theID).draggable({
                cancel: '.waf-widget-body',
                stack : '.waf-widget'
            })
            .bind('mousedown', function(event) {
                $(this).data('draggable')._trigger('start', event);
            });
            
            $('#' + theID + ' .waf-widget-header').css('cursor', 'pointer');
            $('#' + theID + ' .waf-widget-footer').css('cursor', 'pointer');
        }

        // Resize
        if (config['data-resizable'] === "true") {
            $('#' + theID).resizable({
                //minHeight: parseInt($('#' + theID).css('height')),
                //minWidth: parseInt($('#' + theID).css('width')),
                
                resize: function(event, ui) {
                    $('#' + theID + ' .waf-widget-body').css('width', parseInt($('#' + theID).css('width')));

                    var newHeight = parseInt($('#' + theID).css('height')) - parseInt($('#' + theID + ' .waf-widget-footer').css('height'));
                    newHeight -= parseInt($('#' + theID + ' .waf-widget-header').css('height'));
                    $('#' + theID + ' .waf-widget-body').css('height', newHeight + 'px');      
                },
                
                stop: function(event, ui) {
                    $$(theID).gridController.gridView.refresh();
                }
            });
        }
        
        // readOnly
        if(config['data-readOnly'] === "true") {
        	// Hide toolbar
			$("#" + theID + " .waf-dataGrid-footer .waf-toolbar").hide();
			
			// Lock columns
			grid.columns().forEach( function(theCol, idx, arr) {
				theCol.readOnly = true;
			});
        }
        
        return grid;
    }
    ,
    onDesign: function (config, designer, tag, catalog, isResize) {
       function _getAttrValue(inName, inDefault) {
			inDefault = inDefault;
			attr = tag.getAttribute(inName);
			return attr ? attr.getValue() : inDefault;
		}
		
        var		i,
				colWidth		= tag.getAttribute('data-column-width') ? tag.getAttribute('data-column-width').getValue().split(',') : []
				colName			= _getAttrValue('data-column-name', ''),
				colAttribute	= _getAttrValue('data-column-attribute', ''),
				colBinding		= _getAttrValue('data-column-binding', ''),
				colColumn		= _getAttrValue('data-column', ''),
				tagClass		= tag.getAttribute('class').getValue(),
				grid			= {},
				isReadOnly		= _getAttrValue('data-readOnly', 'false') === 'true',
				configColumn	= null,
				tagID			= tag.getAttribute('id').getValue();
		
		

        if(!isResize){
            // Refresh the datasource grid
            //Designer.ui.gridDatasource.initRows()
            
            // check for retro compatibility
            if (tag.getColumns().count() > 0) {  
         
                grid = new WAF.widget.Grid({
                    inDesign        : true,
                    id              : tagID,
                    render          : tagID,
                    dataSource      : colBinding,
                    binding         : colBinding,
                    columns         : tag.getColumns().toArray(),
                    colWidth        : colWidth,
                    cls             : tagClass
                });       
            
            } else {
                grid = new WAF.widget.Grid({
                    inDesign        : true,
                    id              : tagID,
                    render          : tagID,
                    dataSource      : colBinding,
                    binding         : colBinding,
                    columns         : colColumn,
                    colNames        : colName,
                    colAttributes   : colAttribute,
                    colWidth        : colWidth,
                    cls             : tagClass
                });
            }
        
            grid.tag = tag;
            
            tag.grid = grid;

            // message if not binding
            if (tag.getColumns().count() === 0) {
                if ($('#' + tag.overlay.id + ' .message-binding-grid ').length == 0) {
                    $('<div class="message-binding-grid ">Drop a datasource<br> here</div>').appendTo($('#' + tag.overlay.id));
                }
            } else {
                $(tag.overlay.element).find('.message-binding-grid ').each(function(i) {
                    $(this).remove();
                });
            }
            
            // Adding row even/odd classNames
            // Could be tag.grid.gridController.gridView.refresh();
            // if row.rowNumber was really updated on widget-grid-view.js L949
            // (use of rowCount works)
            $(tag.overlay.element).find('.waf-dataGrid-row').each(function(i) {
                $(this).addClass(i%2 ? 'waf-widget-odd' : 'waf-widget-even');
            });
            
			// readOnly: Show/hide buttons		
			if(isReadOnly) {
				$("#" + tagID + " .waf-dataGrid-footer .waf-toolbar").hide();
			} else {
				$("#" + tagID + " .waf-dataGrid-footer .waf-toolbar").show();
			}
		}
    }    
});
