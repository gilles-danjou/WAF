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
//"use strict";
/*global WAF,window*/

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
WAF.Widget.provide (

/**
 * TODO: Write a description of this WAF widget
 * 
 * @class TODO: give a name to this class (ex:
 *        WAF.widget.DataGrid)
 * @extends WAF.Widget
 */
'TreeView', // TODO: set the widget constructor name in
// CamelCase (ex:
// "DataGrid")

{
// Shared private properties and methods
// NOTE: "this" is NOT available in this context to access the
// current to widget
// instance
// These methods and properties are available from the
// constrctor through
// "shared"

// /**
// * A Private shared Method
// *
// * @/private
// * @/shared
// * @/method privateSharedMethod
// * @/param {String} inWidget
// **/
// privateSharedMethod: function privateSharedMethod(inWidget) {
// can work on the widget instance through inWidget
// }

},

/**
 * @constructor
 * @param {Object}
 *            inConfig configuration of the widget
 */

/**
 * The constructor of the widget
 * 
 * @shared
 * @property constructor
 * @type Function
 * @default TODO: set to the name to this class (ex:
 *          WAF.widget.DataGrid)
 */
function WAFWidget(config, inData, shared) {
	var source = this.source;
	var myWidget = this;
	var dataClass = this.source.getDataClass();
	var className = source.getClassTitle();
	var attributes = dataClass.getAttributes();
	var data = [];
	var nameKey = "";
	var object;
	var nameObject = "";
	var selectFromWidget = false;
	var i = 0;
	var columns = [];
	var columnsArray = JSON.parse(inData['column'].replace(/'/g,'"'));
	for ( var item in ds[className]) {
		if(i==1) {
			nameKey = item;
			break;
			};
		i++;
	}
	for ( item in source) {
		try {
				if( typeof(source[item]) == "object") {	
					nameObject = source[item].emAtt.name;
					break;
					} 
		     }catch (e) {}
	}
	
	source.addListener('all',function(e) {
			switch (e.eventKind) {
			case 'onElementSaved':
			case 'onCollectionChange' :
				columns = [];
				if(parseFloat(config['data-width']) == config['data-width']){
					columns.push({height:20, width: config['data-width'] , header: config['data-node'],title:"_DATA_"});
				}
				else {
					columns.push({height:20, width: 0 , header: config['data-node'],title:"_DATA_"});
				}
				for ( var item in columnsArray) {
					var objectColumn = columnsArray[item];
					if (objectColumn["colID"] == config['data-node'])  continue;
							columns.push({
								cellClass : "col" + item,
								value : objectColumn["colID"],
								height : 20,
								width : objectColumn["width"],
								header : objectColumn["title"],
								title : objectColumn["colID"]
							});
				};
				if(config['data-node'] != null){
							ds[className].query(config["data-parent"] + ' = null',{    
								"onSuccess" : function(e) { 
									e.result.toArray('',    
											{    
										"onSuccess" : function(event) {    
							data = [];
							data = myWidget.readAll(event.result, config['data-node'], config['data-limit'], columns, config['data-parent']);
							/**
							 * Building a Tree
							 */
							$("#"+ config.id).jstree(
					        				{
					        					"json_data" : {
					        						            "data" : data
					        								  },
					        					"grid" : {
					        						            "columns": columns
					        								},
					        					"themes" : {
					        									"theme" : "classic"
					        					},
					        				    "ui" : {
					        				    	 "select_limit" : 1
					        				  	},

					        					"plugins" : [ "themes", "dnd", "json_data", "ui", "grid", "crrm", "hotkeys" ]
					        				});
							
							 /**
							  * Listener move_node
							  * Todo Later
							  */
							 $("#"+ config.id).bind('move_node.jstree',function(e,data){
								var oldParentKey = $(data.args[0]["op"][0]).attr("id").replace("node_","");
								var newParentKey = $(data.args[0]["np"][0]).attr("id").replace("node_","");
								var key = $(data.args[0]["o"][0]).attr("id").replace("node_","");
							 });
							 
							 /**
							  * Listener select_node
							  */
							 $("#"+ config.id).bind('select_node.jstree', function (e,data){
								 var key = $(data.rslt.obj[0]).attr("id").replace("node_","");
								 
								  if (key != source[nameKey]) {
									  source.toArray('',{
										    "onSuccess" : function(e){
										    	// Position counter
										    	var i = 0;
										        for(var item in e.result){
										             if(e.result[item][nameKey] == key){
										            	 selectFromWidget = true;
										            	 source.select(i);
										            	  break;
										            }   
										                i++;
										        } 
										        
										    }    
										});
								}
							 });
							 
							 /**
							  * Listener rename_node
							  */
							 $("#"+ config.id).bind('rename_node.jstree', function(event,data) {
								source[config['data-node']] = data.args[1];
								source.save();
							});
							 
							 /**
							  * Listener delete_node
							  */
							 $("#"+ config.id).bind('delete_node.jstree', function(event,data) {
								 source.removeCurrent();
							});
							 
							 /**
							  * Listener open_node
							  */
					        $("#"+ config.id).bind('open_node.jstree', function (e,data){
					        	 var key = $(data.rslt.obj[0]).attr("id").replace("node_","");
					        	try {
					        	
					       for ( var attr in attributes) { 
					    	       
							 	      object = source[attributes[attr]["name"]];
							 	      try {  
							 	      	if (object.emAtt.type == className) { 
							 	      		ds[className].query(object.name + '.' + nameKey +'= '+ key,{    
							 	      			"onSuccess" : function(e) { 
							 	      				e.result.toArray('',    
							 	      				{    
							 	      				"onSuccess" : function(e) {    
							 	      					var result = e.result;
							 	      					for ( var item in result) {	
							 	      						if($("#node_" + result[item][nameKey] ).length != 0) continue;
							 	      						//Creating child if not exist
							 	      						var attrData = {};
							 	      						attrData["id"] = "node_" + result[item][nameKey];
							 	      						for ( var itemColumn in columns) {
							 	      							var headerColumn =  columns[itemColumn].value;
							 	      							attrData[headerColumn] =  result[item][headerColumn];
															}
							 	      						$("#"+ config.id).jstree("create","#"+$(data.args[0]).attr("id"),"last",{"data" :result[item][config['data-node']],    
				 	      							             "attr" : attrData,
				 	      							             "state" : "closed"},false,true);  
							 	      					  }
							 	      					}    
							 	      				});    
							 	      			}
							 	      		});    
//							 	      		break;    
							 	      	}
							 	      	
						                  
							 	      } catch (e) {}    
						        }
					        		
					        	} catch (e) {  }
					        });
										}    
											});    
								}
							});
					
					
				}else {
					$("#"+ config.id).addClass('message-binding-grid');
					$("#"+ config.id).html('<p>The attribute on which <br> to base the TreeView is <br> not specified</p>');
				}
				break;
			case 'onCurrentElementChange':
				var key = "node_" + source[nameKey];
				try {
				          $("#" + config.id).jstree(
				      		"deselect_all");
				      if (!selectFromWidget) {
				      	$("#" + config.id).jstree(
				      			"select_node",
				      			"#" + key);
				      } else {
				      	selectFromWidget = false;
				      }
				} catch (e) {}
				
				
				break;
			}
        });
},

{
    /**
     * Return all nodes have not ancestors
     * @param colllection
     * @param data_node
     * @returns {Array}
     */
	readAll : function (colllection, data_node, data_limit,columns,father) {
		var data = [];
		var key = "";
		var compteur = 0;
		var isLimited = (data_limit == parseInt(data_limit));
		for ( var element in colllection) {			   
				for(item in colllection[element]['__KEY']){
					key = "node_" + colllection[element]['__KEY'][item];
					break;
				}	
				var attrData = {};
					attrData["id"] = key;
					for ( var itemColumn in columns) {
						var headerColumn =  columns[itemColumn].value;
						attrData[headerColumn] =  colllection[element][headerColumn];
				}
				data.push(
					{
					"data" : colllection[element][data_node] , 
					"attr" : attrData,
					"state" : "closed" 
				   }
				);
				key = "";
				compteur++;
				if(isLimited && data_limit == compteur) { break; } 
				}
		return data;
 }
 }
);
