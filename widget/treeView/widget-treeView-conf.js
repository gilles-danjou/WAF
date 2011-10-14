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

	/**
	 * Widget Descriptor
	 * 
	 */

	/* PROPERTIES */

	// {String} internal name of the widget
	type : 'treeView',

	// {String} library used ('waf', 'jquery', 'extjs', 'yui') (optional)
	lib : 'WAF',

	// {String} display name of the widget in the GUI Designer
	description : 'treeView',

	// {String} category in which the widget is displayed in the GUI Designer
	category : 'Experimental',

	// {String} image of the tag to display in the GUI Designer (optional)
	img : '/walib/WAF/widget/treeView/icons/widget-treeView.png',

	// {Array} css file needed by widget (optional)
	css : [],

	// {Array} script files needed by widget (optional)
	include : [],

	// {String} type of the html tag ('div' by default)
	tag : 'div',

	// {Array} attributes of the widget. By default, we have 3 attributes:
	// 'data-type', 'data-lib', and 'id', so it is unnecessary to add them
	// 
	// @property {String} name, name of the attribute (mandatory)
	// @property {String} description, description of the attribute (optional)
	// @property {String} defaultValue, default value of the attribute
	// (optional)
	// @property {'string'|'radio'|'checkbox'|'textarea'|'dropdown'|'integer'}
	// type, type of the field to show in the GUI Designer (optional)
	// @property {Array} options, list of values to choose for the field shown
	// in the GUI Designer (optional)
	attributes : [ {
		name : 'data-label',
		description : 'Label',
        defaultValue: ''
	},
    {
        name        : 'data-label-position',
        description : 'Label position',
        defaultValue: 'top'
    }, 
    {
		name : 'data-binding',
		description : 'Source',
		type : 'string'
	}, 
    {
		name : 'data-node',
		description : 'Attribut',
		autocomplete : true,
        defaultValue: ''
	},
	 {
		name : 'data-parent',
		description : 'Parent',
		autocomplete : true,
        defaultValue: ''
	}, 
	{
		name : 'data-width',
		description : 'Width',
        defaultValue: ''
	},
	{
		name : 'data-limit',
		description : 'Limit',
        defaultValue: ''
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
    }
    
    ],

	// {Array} default height and width of the container for the widget in the
	// GUI Designer
	// 
	// @property {String} name, name of the attribute
	// @property {String} defaultValue, default value of the attribute
	style : [ {
		name : 'width',
		defaultValue : '200px'
	}, {
		name : 'height',
		defaultValue : '200px'
	} ],

	// {Array} events ot the widget
	// 
	// @property {String} name, internal name of the event (mandatory)
	// @property {String} description, display name of the event in the GUI
	// Designer
	// @property {String} category, category in which the event is displayed in
	// the GUI Designer (optional)
	events : [ {
		name : 'click',
		description : 'On Click',
		category : 'Mouse Events'
	}],

	// {JSON} panel properties widget
	//
	// @property {Object} enable style settings in the Styles panel in the
	// Properties area in the GUI Designer
	properties : {
		style : {
			theme : {
				'roundy' : false
			},
			fClass : true,
			text : true,
			background : true,
			border : true,
			sizePosition : true,
			label : true,
			shadow : true,
			innerShadow : true,
			disabled : []
		// list of styles settings to disable for this widget
		}
	},
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
	// (optional area)
	// 
	// {Array} list of sub elements for the widget
	// 
	// @property {String} label of the sub element
	// @property {String} css selector of the sub element
	structure : [ {
		description : 'Description',
		selector : '.subElement',
		style : {
			background : true, // define which elements in the Styles tab you
			// want to display
			gradient : true,
			border : true
		}
	} ],

	/* METHODS */

	/*
	 * function to call when the widget is loaded by WAF during runtime
	 * 
	 * @param {Object} config contains all the attributes of the widget @result
	 * {WAF.widget.Template} the widget
	 */
	onInit : function(config) {
		var widget = new WAF.widget.TreeView(config);
		return widget;
	},

	recursiveLoad : function(attributtes) {

	},

	/**
	 * function to call when the widget is displayed in the GUI Designer
	 * 
	 * @param {Object}
	 *            config contains all the attributes for the widget
	 * @param {Designer.api}
	 *            set of functions used to be managed by the GUI Designer
	 * @param {Designer.tag.Tag}
	 *            container of the widget in the GUI Designer
	 * @param {Object}
	 *            catalog of dataClasses defined for the widget
	 * @param {Boolean}
	 *            isResize is a resize call for the widget (not currently
	 *            available for custom widgets)
	 */
	onDesign : function(config, designer, tag, catalog, isResize) {
		var columnsArray = tag.getColumns().toArray(), columns = [], data = [], totalWdth = 120;
		this.oldWidth, unitWidth = ($("#" + tag.getId()).width())/(columnsArray.length);
		
		
				if (config['data-node'] != "" && config['data-node'] != null) {
					columns.push({height:20, width: unitWidth, header: config['data-node'],title:"_DATA_"});
					for ( var item in columnsArray) {
						var obj = columnsArray[item];
						if (obj["colID"] == config['data-node'])  continue;
						columns.push({
							cellClass : "col" + item,
							value : obj["colID"],
							height : 20,
							width : unitWidth,
							header : obj["title"],
							title : obj["colID"]
						});
						totalWdth += obj["width"];
					}
				} 
		
		if (tag.getSource() == "") {
			$('#' + tag.getId()).addClass('message-binding-grid');
			$('#' + tag.getId()).html('Bind a <br> datasource');
			return;
		}

		var source = Designer.env.ds.catalog.getByName(tag.getSource());
		var attributes = source.getAttributes();
		data = loadData(attributes);
       // call `.jstree` with the options object
		$("#" + tag.getId()).jstree({
			"json_data" : {
				"data" : data
			},
			"themes" : {
				"theme" : "classic"
			},
//			"grid": {
//				"columns":columns
//			},
//			"plugins" : [ "themes", "json_data"/*, "grid"*/ ]
			"plugins" : [ "themes", "json_data" ]
		});
	}
		

});

function loadData(attributes) {
	var data = [];
	for ( var item in attributes) {
		var attr = attributes[item];
		if (attr.name !== "ID" && attr.kind !== "relatedEntities") {
			if (attr.kind === "relatedEntity"
					) {
				data.push({
					"data" : attr.name,
					"state" : "closed"
				});
			}

			else {
				data.push({
					data : attr.name
				});
			}
		}
	}
	return data;
}
