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
/*
if (typeof (WAF) === "undefined")
{
    WAF = { 'autoForms': true };
}
else
*/
    WAF.autoForms = true;
   // WAF.autoFormList = {};

if (typeof(WAF.AF == "undefined"))
{
    WAF.AF =
    {
        'VERSION': "0.0.1",
        'BUILD': "0001",
        genID: 0
    };
}

function idName(text)
{
	return text.split(".").join("_");
}


WAF.AF.generateID = function()
{
	this.genID++;
	return 'auto_form_' + this.genID;
}


WAF.AF.queryData = 
{
	wildchar : '@',
	
	stringOpers :
	[
		"begins with",
		"=",
		"!=",
		">",
		">=",
		"<",
		"<=",
		"contains", // 7
		"contains keyword" // 8
	],
	
	stringOper_begin_with : 0,
	stringOper_contains : 7,
	stringOper_contains_keyword : 8,
	
	numberOpers :
	[
		"=",
		"!=",
		">",
		">=",
		"<",
		"<=",
		"between" // 6
	],
	
	numberOper_between : 6,
	
	dateOpers :
	[
		"=",
		"!=",
		">",
		">=",
		"<",
		"<=",
		"between"	// 6	
	],
	
	dateOper_between : 6,
	
	appropriateOper : function(type)
	{
		var result = {};
		switch(type) 
		{
			case "number":
			case "long":
			case "byte":
			case "word":
			case "long64":
				result.operList = this.numberOpers;
				result.defaultOper = 0;
				break;
				
			case "date":
				result.operList = this.dateOpers;
				result.defaultOper = 0;
				break;
			
			default:
				result.operList = this.stringOpers;
				result.defaultOper = 0;
				break;
		}
		return result;
	},
	
	buildQueryNode : function (attName, attType, oper, value)
	{
		var result = "";
		switch(attType) 
		{
			case "number":
			case "long":
			case "byte":
			case "word":
			case "long64":
				if (oper == this.numberOper_between)
				{
					var a = value.split(',');
					if (a.length > 1)
					{
						result += '( '+attName + ' >= '+a[0]+' and '+attName + ' <= '+a[1]+' )';
					}
					else
					{
						result += attName + ' '+this.numberOpers[oper]+' '+value;
					}
				}
				else
				{
					result += attName + ' '+this.numberOpers[oper]+' '+value;
				}
				break;
				
			case "date":
				if (oper == this.dateOper_between)
				{
					var a = value.split(',');
					if (a.length > 1)
					{
						result += '( '+attName + ' >= "'+a[0]+'" and '+attName + ' <= "'+a[1]+'" )';
					}
					else
					{
						result += attName + ' '+this.dateOpers[oper]+' '+'"'+value+'"';
					}

				}
				else
				{
					result += attName + ' ' + this.dateOpers[oper] + ' ' + '"' + value+'"';
				}
				break;

				
			default:
				var opertext = this.stringOpers[oper];
				switch(oper) {
					case this.stringOper_begin_with:
						opertext = '=';
						value = '"' + value + this.wildchar + '"';
						break;
					case this.stringOper_contains:
						opertext = '=';
						value = '"' + this.wildchar + value + this.wildchar + '"';
						break;
					case this.stringOper_contains_keyword:
						opertext = '%';
						break;
					default:
						value = '"' + value + '"';
						break;
				}
				result += attName + ' ' + opertext + ' ' + value;
				break;
		}
		
		return result;
	}
	
};

WAF.AF.purgeErrorMessagesOnFormElement = function(divID, attName)
{
	var messDivName = divID + "_" + attName + "__mess";
	$('#' + divID + "_" + attName).parent().removeClass('AF_ValueWrong');
	$('#' + divID + "_" + attName).parent().addClass('AF_ValueOK');
	$('#' + messDivName).parent().removeClass('AF_messWrong');
	$('#' + messDivName).removeClass('AF_markedWrong');
	$('#' + messDivName).html("");
}


WAF.AF.purgeErrorMessagesOnForm = function()
{
	var form = this;
	var divID = form.divID;
	var attList = form.attList;
	for (var i = 0; i < attList.length; i++)
	{
		var att = form.atts[i];
		var sourceAtt = form.sourceAtts[i];
		var objDiv = document.getElementById(divID + "_" + idName(attList[i]));
		if (objDiv != null)
		{
			if (sourceAtt.readOnly || att.readOnly || (form.checkIdentifying && !att.identifying) || form.allReadOnly)
				objDiv.disabled = true;
			else
				objDiv.disabled = false;
		}

		if (att.kind == "storage" || att.kind == "calculated" || att.kind == "alias")
			WAF.AF.purgeErrorMessagesOnFormElement(divID, idName(sourceAtt.name));
	}
}

WAF.AF.clearForm = function()
{
	var form = this;
	form.purgeErrorMessagesOnForm();
    var divID = form.divID;
    var attList = form.attList;
    for (var i = 0; i < attList.length; i++)
    {
    	var att = form.atts[i];
    	if (att.kind == "storage" || att.kind == "calculated" || att.kind == "alias")
    		document.getElementById(divID + "_" + idName(attList[i])).value = "";
    }
	if (form.withToolBar) 
	{
		var xlength = form.source.length;
		if (form.isQueryForm)
		{
			$('#' + divID + ' .waf-status-right').html(xlength);
		}
		else
		{
			var pos = 0;
			if (form.source.getCurrentElement() != null)
				pos = (form.source.getPosition() + 1);
			$('#' + divID + ' .waf-status-right').html(pos + " / " + xlength);
		}
	}
}


WAF.AF.drawFormStatus = function()
{
	var form = this;
	var divID = form.divID;
	if (form.withToolBar) 
	{
		var xlength = form.source.length;
		if (form.isQueryForm)
		{
			$('#' + divID + ' .waf-status-right').html(xlength);
		}
		else
		{
			var pos = 0;
			if (form.source.getCurrentElement() != null)
				pos = (form.source.getPosition() + 1);
			$('#' + divID + ' .waf-status-right').html(pos + " / " + xlength);
		}
	}
}


WAF.AF.fillForm = function(){
	var form = this;
	form.purgeErrorMessagesOnForm();
	var divID = form.divID;
	var attList = form.attList;
	if (form.isQueryForm) 
	{
		if (form.withToolBar) 
		{
			var eset = form.source.getEntityCollection();
			var xlength = (eset != null) ? eset.length : 0;
			$('#' + divID + ' .waf-status-right').html(xlength);
		}
	}
	else 
	{
		for (var i = 0; i < attList.length; i++) 
		{
			var att = form.atts[i];
			//var sourceAtt = form.source.getAttribute(att.name);
			var sourceAtt = form.sourceAtts[i];
			if (sourceAtt != null) 
			{
				if (sourceAtt.simple) 
				{
					var htmlobj = document.getElementById(divID + "_" + idName(attList[i]));
					if (htmlobj.isInFocus) 
					{
						htmlobj.value = sourceAtt.getValue(); //form.source[att.name];
					}
					else 
					{
						htmlobj.value = htmlobj.getFormattedValue();
					}
				}
			}
		}
		if (form.withToolBar) 
		{
			var xlength = form.source.length;
			$('#' + divID + ' .waf-status-right').html((form.source.getPosition() + 1) + " / " + xlength);
		}
	}
}




WAF.AF.fillEntity = function()
{
	var form = this;
	var divID = form.divID;
	var attList = form.attList;
	if (!form.isQueryForm)
	{
		for (var i = 0; i < attList.length; i++)
		{
			var att = form.atts[i];
			//var sourceAtt = form.getAttribute(att.name);
			var sourceAtt = form.sourceAtts[i];
			if (sourceAtt != null)
			{
				if (sourceAtt.simple)
				{
					sourceAtt.setValue(document.getElementById(divID + "_" + idName(attList[i])).value, {stopDispatch:true});
				}
			}
		}
	}
}


WAF.AF.buildQueryForm = function(divID, dataSource, attrList, nameList, options, catalog, tag) 
{
	if (options == null)
		options = {};
	options.isQueryForm = true;
	return WAF.AF.buildForm(divID, dataSource, attrList, nameList, options, catalog, tag);
}


WAF.AF.buildForm = function(divID, dataSource, attrList, nameList, options, catalog, tag) {
    var lib = '';

	var formdiv = $('#' + divID),
        isQueryForm = false,
        autonomous = true,
		withoutTable = false,
		allowResizeInput = false,
		subWidgets = [],
		mustDisplayError = options.mustDisplayError,
		errorDiv = options.errorDiv,
		inDesign = false;
        //dataTheme = $('#' + divID).attr('data-theme');
	
	var dataTheme = "";
	var existingClasses = $('#' + divID).attr('class').split(" ");
	existingClasses.forEach(function(className) {
		if (className != "inherit" && className.substr(0,4) != "waf-")
		{
			dataTheme += className+" ";
		}
	});
	if (options != null && options.isQueryForm)
		isQueryForm = true;
		
	if (options != null && options.included)
		autonomous = false;
		
	if (options != null && options.withoutTable)
		withoutTable = true;
		
	if (options != null && options.allowResizeInput)
		allowResizeInput = true;
	
	var mustResizeInputs = formdiv.hasClass("roundy");
	
	/*
    if(!options || (options && options.level == 1)){
        WAF.autoFormList[divID] = {
            attrList : attrList,
            nameList : nameList,
            dataSource : dataSource
        }
    }
    */

	var dataClass = null;

	if (dataSource == null) // si nous sommes dans le GUI designer
	{
		inDesign = true;
		if (tag && tag.getAttribute('data-binding')) 
		{
			dataClass = catalog.getByName(tag.getAttribute('data-binding').getValue());
		}
		else 
		{
			dataClass = {};
			dataClass.getAttributes = function(){
				return []
			};
			dataClass.getAttributeByName = function(){
				return []
			};
		}
	}
	else 
	{
		dataClass = dataSource.getDataClass(); // n'a de sens qu'avec les sources sur les datastore classes
											 // cette var ne sera utilisee que dans ce cas.
	}

	
    var formTitle = '';
	if (dataSource == null) {
            if (tag && tag.getAttribute('data-binding')) {
                formTitle = tag.getAttribute('data-binding').getValue();
            } else {
                formTitle = '';
            }
        } else {
            formTitle = dataSource.getClassTitle();
        }

	if (options == null)
		options = {};

	if (options.formTitle != null)
		formTitle = options.formTitle;
		
	if (isQueryForm)
	{
		formTitle = "Query on "+formTitle;
		otherAttInfo = [];
	}

	var checkIdentifying = false;
	if (options.checkIdentifying)
		checkIdentifying = true;

	var level = 1;
	if (options.level)
		level = options.level;

	var toolBarForRelatedEntity = false;
	if (options.toolBarForRelatedEntity)
		toolBarForRelatedEntity = options.toolBarForRelatedEntity;

	var allReadOnly = false;
	if (options.allReadOnly)
		allReadOnly = options.allReadOnly;

	if (attrList == null || attrList.length == 0)
	{
		if (dataSource == null && dataClass)
		{
			var attlist = dataClass.getAttributes();
			attrList = [];
			for (var i = 0, nb = attlist.length; i < nb; i++)
			{
				attrList.push(attlist[i].name);
			}
		}
		else if (dataSource)
			attrList = dataSource.getAttributeNames();
	}

	var atts = [];
	var newlist = [];
	var sourceAtts = [];

	for (var i = 0, nb = attrList.length; i < nb; i++)
	{
		var attname = attrList[i];
		var att;
		if (dataSource == null)
		{
			if (dataClass) 
			{
				att = dataClass.getAttributeByName(attname);
			}
		}
		else
		{
			att = dataSource.getClassAttributeByName(attname);
			var sourceAtt = dataSource.getAttribute(attname);
			sourceAtts.push(sourceAtt);
		}
		if (att != null)
		{
			if (isQueryForm)
			{
				var isRel;
				if (att.kind == "storage" || att.kind == "calculated" || att.kind == "alias") {
					isRel = false;
					if (att.type == 'image') {
						isRel = true;
					}
				} else {
					isRel = true;
				}
				if (!isRel)
				{
					atts.push(att);
					newlist.push(attname);
				}
			}
			else
			{
				atts.push(att);
				newlist.push(attname);
			}
		}
	}
	attrList = newlist;

	var withTitle = !options.noTitle;
	
	var html = '';
	
	var headerDom = null;
	var bodyDom = null;
	var footerDom = null;

	
	if (withoutTable)
	{
		if (withTitle) // l'entete du formulaire
		{
			html += '<div class="waf-form-header waf-widget-header waf-autoForm-header">';
			html += 	'<div class="waf-form-header-left">';
			html += 		'<div class="waf-form-header-left-inside">';
			html +=			'</div>';
			html +=		'</div>';
			html += 	'<div class="waf-form-header-text autoForm-title-col">';
			html += 	formTitle;
			html +=		'</div>';
			html += 	'<div class="waf-form-header-right">';
			html +=		'</div>';
			html +=	'</div>';
		}
		
		var moreclass = "";
		if (autonomous)
			moreclass += ' autonomous';
		else
			moreclass += ' included';
		html += '<div class="waf-user-select-none waf-widget-body waf-form-body waf-autoForm-body'+moreclass+'" style="overflow:auto">';
		
		html += '<div class="waf-form-body-inside">';
		
		for (var i = 0, nb = attrList.length; i < nb; i++) 
		{
			var largeObject = false;
			var att = atts[i];
			var isRel;
			if (att.kind == "storage" || att.kind == "calculated" || att.kind == "alias") 
			{
				if (att.type == 'string' && att.multiLine)
					largeObject = true;
				isRel = false;
				if (att.type == 'image') 
				{
					isRel = true;
				}
			}
			else 
			{
				isRel = true;
			}
			
			if (isRel)
				largeObject = true;
			
			var classMore = "";
			if (largeObject)
				classMore = " waf-form-large-object"
			
			var htmlIDName = idName(attrList[i]);
			lib = (nameList && nameList[i]) ? nameList[i] : attrList[i];
			
			html += '<div class="waf-form-row" id="'+divID+'_att_'+i+'">';
			
			html += 	'<div class="waf-form-att-label'+classMore+'">';
			html +=			'<div class="waf-form-att-label-text attribute-col">';
			html +=			lib;
			html += 		'</div>';
			if (isRel)
			{
				html += 	'<div class="waf-form-att-label-rel waf-expandable waf-collapsed" data-form-id="'+divID+'" data-att-id="'+i+'">';
				html +=		'</div>';
			}
			html += 	'</div>'; // fin d'un form-att-label
			
			if (dataSource == null)
				var binding = '';
			else
				var binding = dataSource.getID()+'.'+attrList[i];
					
			html += 	'<div class="waf-form-att-value'+classMore+'">';
			if (!isRel) 
			{
				var maxinputsize = 0;
				switch(att.type) {
					case "bool":
					case "byte":
						maxinputsize = 3;
						break;
					case "word":
						maxinputsize = 4;
						break;
					case "long":
						maxinputsize = 7;
						break;
					case "long64":
					case "number":
						maxinputsize = 14;
						break;
					case "date":
					case "duration":
						maxinputsize = 12;
						break;
					case "string":
						maxinputsize = 30;
						break;
					
				};
				
				
				if (att.type != "bool")
				{
					var multiline = false;
					if (att.multiLine)
						multiline = true;
					var resizeClass;
					if (multiline)
					{
						resizeClass = "waf-form-resize-multiline";
						html += '<textarea data-multiline="true" ';
					}
					else
					{
						resizeClass = "waf-form-resize";
						html += '<input type="text" ';
					}
					
					html += 'class="'+dataTheme+resizeClass+' waf-form-att-value-input waf-widget waf-textField" id="' + divID + "_" + htmlIDName + '" ';
					if (maxinputsize != 0)
					{
						html += ' style="width:'+maxinputsize+'em;';
						if (multiline)
							html += 'height:40px;';
						html+='"';
					}
					html += ' data-binding="'+binding+'" data-type="textField">';
					html += '</textarea>';
				}
				else
				{
					html += '<input type="checkbox" class="'+dataTheme+'waf-form-att-value-checkbox waf-widget waf-checkbox" datatype="checkbox" ';
					html += 'data-binding="'+binding+'" id="' + divID + "_" + htmlIDName + '"/>';
				}
				
				/*	
				html += 	'<input class="waf-form-att-value-input" id="' + divID + "_" + htmlIDName + '" type="text" value=""';
				if (!isQueryForm)
					html += ' onchange="WAF.AF.changeEntityAtt(' + "'" + divID + "','" + htmlIDName + "'" + ",'" + i + "'" + ')"';
				if (true || mustResizeInputs)
				{

					if (maxinputsize != 0)
					{
						html += ' style="width:'+maxinputsize+'em;"';
					}
				}
				html += '/>';
				*/
				
				html += '<div class="errormess-div" id="' + divID + '_' + htmlIDName + '__mess"></div>';
	
			} 
			else 
			{
				if (att.type == 'image')
				{
					
					html += '<div class="'+dataTheme+'waf-form-resize-pict waf-form-att-value-pict waf-widget waf-image" data-type="image" data-fit="4" '
					html += 'style="height:80px;width:200px;" '
					html += 'data-binding="'+binding+'" id="' + divID + "_" + htmlIDName + '"/>';
					
				}
				else
				{
					html += '<div class="waf-form-att-value-rel" id="' + divID + "_" + htmlIDName + '" >';
					html += '</div>';
				}
	
			}
			html += 	'</div>'; // fin d'un form-att-value
			
			html += '</div>'; // fin d'un form row
			
		}
		
		html += '</div>'; // fin du form body inside
		
		html += '</div>'; // fin du form body

		var withToolBar,
	        toolbarConfig,
	        toolbar;
	    
		withToolBar = !options.noToolBar;
		
		if(withToolBar) {
			
			
			html += '<div class="waf-widget-footer waf-autoForm-footer">';
			html += 	'<div class="waf-status">';
			html += 		'<div class="waf-status-element waf-status-left"></div>';
			html += 		'<div class="waf-status-element waf-status-center"></div>';
			html += 		'<div class="waf-status-element waf-status-right"></div>';
			html += 	'</div>';
			html += '</div>';
		}

		formdiv.attr({
	        'data-type': isQueryForm ? 'queryForm' : 'autoForm',
	        'data-level': level
	    })
	    .addClass('waf-widget')//.addClass('waf-form')
	    .html(html);
		
		var tabDom = $('[data-type]', formdiv);

 		for (var i = 0, nbComponent = tabDom.length; i < nbComponent; i++) 
		{
			var domobj = tabDom[i];
			subWidgets[i] = WAF.tags.createComponent(domobj, false);
		}
		
		/* 
		if (allowResizeInput && !inDesign)
		{
			$(".waf-form-resize-multiline", formdiv).resizable();
			$(".waf-form-resize", formdiv).resizable({handles:"e"});
			
			$(".waf-form-resize-pict", formdiv).resizable({
				resize: function(event, ui)
				{
					//if ($(this).hasClass('waf-form-att-value-pict'))
					if (true)
					{
						var img = $('img', $(this));
						img.css("max-width", ""+$(this).width()+"px");
						img.css("max-height", ""+$(this).height()+"px");
					}
				}
			});
			
			
			
			$(".waf-form-resize", formdiv).parent().css("padding", "0px");
			$(".waf-form-resize-multiline", formdiv).parent().css("padding", "0px");
			$(".waf-form-resize,.waf-form-resize-pict,.waf-form-resize-multiline", formdiv).each(function(index)
			{
				var parent = $(this).parent();
				$(this).height(parent.height());
				$(this).width(parent.width());
				//$('.ui-resizable-se', parent).css("z-index", "100000");
			});
		}
		*/
		
		var maxwidth = 10;
		$(".waf-form-att-label", formdiv).each(function(index)
		{
			var w = $(this).outerWidth();
			if (maxwidth < w)
				maxwidth = w;
		});
		
		$(".waf-form-att-label", formdiv).width(maxwidth);
	
		var toolBarForRelatedEntity = false;
		if (options.toolBarForRelatedEntity)
			toolBarForRelatedEntity = options.toolBarForRelatedEntity;
	
		if(withToolBar) {
	        
			if (isQueryForm)
			{
					toolbarConfig = [
	                    {icon: {size: 16, type: 'radioactive'}, title: 'Clear', click: function() {WAF.AF.clearEntity(divID);}},
	                    {icon: {size: 16, type: 'magnifyingGlass'}, title: 'Find', click: function() {WAF.AF.findEntity(divID);}}
	                ];
			}
			else
			{
				if (toolBarForRelatedEntity)
				{
					toolbarConfig = [
	                    {icon: {size: 16, type: 'radioactive'}, title: 'Clear', click: function() {WAF.AF.clearRel(divID);}},
	                    {icon: {size: 16, type: 'magnifyingGlass'}, title: 'Find', click: function() {WAF.AF.findRel(divID);}}
	                   // {icon: {size: 16}, title: 'Assign', click: function() {WAF.AF.assignRel(divID);}}
	                ];
	            }
				else
				{
					toolbarConfig = [
	                    {icon: {size: 16, type: 'arrowFullLeft'}, title: 'Previous', click: function() {WAF.AF.prevEntity(divID);}},
	                    {icon: {size: 16, type: 'arrowFullRight'}, title: 'Next', click: function() {WAF.AF.nextEntity(divID);}},
	                    /*{icon: {size: 16, type: 'radioactive'}, title: 'Clear', click: function() {WAF.AF.clearEntity(divID);}},*/
						{icon: {size: 16, type: 'plus'}, text: '', title: 'Add', click: function() {WAF.AF.addEntity(divID);}},
	                    {icon: {size: 16, type: 'magnifyingGlass'}, title: 'Find', click: function() {WAF.AF.findEntity(divID);}},
	                    {icon: {size: 16, type: 'floppyDisk'}, title: 'Save', click: function() {WAF.AF.saveEntity(divID);}},
	                    {icon: {size: 16, type: 'trash'}, title: 'Delete', click: function() {WAF.AF.dropEntity(divID);}}
	                ];
				}
			}
	        
	        toolbar = new WAF.widget.Toolbar(toolbarConfig);
			
			formdiv.find('.waf-autoForm-footer .waf-status-left').append(toolbar);
		}

		/*
		var formHeight = formdiv.height();
		
		var headerDom = $('.waf-widget-header', formdiv);
		var bodyDom = $('.waf-form-body', formdiv);
		
		var headerHeight = headerDom.outerHeight();
		
		var footerHeight = 0;
		if (withToolBar)
		{
			var footerDom = $('.waf-widget-footer', formdiv);
			footerHeight = footerDom.outerHeight();
		}
		
		bodyDom.height(formHeight-footerHeight-headerHeight);
		*/
		headerDom = $('.waf-widget-header', formdiv);
		bodyDom = $('.waf-form-body', formdiv);
		if (withToolBar)
			footerDom = $('.waf-widget-footer', formdiv);
		WAF.AF.afterResize(formdiv, withToolBar);
		
	}
	else
	{
		html += '<table border="0" cellpadding="0" cellspacing="0" class="autoForm-data';
		if (isQueryForm)
			html += ' query-form';
		if (autonomous)
			html += ' autonomous';
		else
			html += ' included';
		html += '">';
	    /* It seems the following make the tbody have a wrong width
	       Width is now fixed on cells. */
		/* if (!isQueryForm)
			html += '<col /><col width="100%" />'; */
	
		var xcol = 2;
		if (isQueryForm)
			xcol = 3;
			
		if (withTitle) // l'entete du formulaire
		{
			html += '<thead class="waf-widget-header waf-autoForm-header">';
			html += '   <tr class="autoForm-title-row">';
			html += '       <th class="autoForm-title-col" colspan="' + xcol + '"><div class="autoForm-title">' + formTitle + '</div></th>';
			html += '   </tr>';
			html += '</thead>';	
		}
	
		
		html += '<tbody class="waf-widget-body waf-autoForm-body">';		
	
		for(var i = 0, nb = attrList.length; i < nb; i++) {
			var att = atts[i];
			var isRel;
			if (att.kind == "storage" || att.kind == "calculated" || att.kind == "alias") 
			{
				isRel = false;
				if (att.type == 'image') 
				{
					isRel = true;
				}
			}
			else 
			{
				isRel = true;
			}
	
			html += '<tr class="waf-autoForm-row ';
			if(i == 0) html += 'first-child ';
			if(i == nb - 1) html += 'last-child ';
			html += (i%2) ? 'waf-widget-even' : 'waf-widget-odd';
			html += '">';
			
	        lib = (nameList && nameList[i]) ? nameList[i] : attrList[i];
	
			html += '<td '
			if (isRel)
				html += 'id="'+divID+'_rel'+i+'" '
			html += 'class="attribute-col'+ (isRel ? ' related' : '')+'"><div class="attribute-div">' + lib;
			if (isRel)
			{
				html += '<span class="attribute-rel waf-state" data-att-id="'+i+'"></span>';
			}
			html += '</div></td>';
			
			if (isQueryForm)
			{
				html += '<td class="oper-col"><div class="oper-div">';
				//html += '<span class="oper-text">';
				if (!isRel)
				{
					var operinfo = WAF.AF.queryData.appropriateOper(att.type);
					html += '<select id="'+ divID+ '_oper'+ i+ '" data-row-ref="' + i + '" class="oper-select" tabindex="'+ (operinfo.defaultOper+1) + '">';
					for (var j = 0, nbx = operinfo.operList.length; j < nbx; j++)
					{
						var opertext = operinfo.operList[j];
						html += '<option value="' + (j+1) + '"';
						if (j == operinfo.defaultOper)
							html += ' selected="selected"';
						html+= '>';
						html += htmlEncode(opertext, false, 4);
						html += '</option>';
					}
					html += '</select>';
					otherAttInfo[i] = {curOper : operinfo.defaultOper};
				}
				//html += '</span>';
				html += '</div></td>';
			}
	
			var htmlIDName = idName(attrList[i]);
			if (!isRel) {
	
				html += '<td width="100%" class="value-col"><div class="value-div">';
				html += 	'<input class="waf-inputdiv" id="' + divID + "_" + htmlIDName + '" type="text" value=""';
				if (!isQueryForm)
					html += ' onchange="WAF.AF.changeEntityAtt(' + "'" + divID + "','" + htmlIDName + "'" + ",'" + i + "'" + ')"';
				if (mustResizeInputs)
				{
					var maxinputsize = 0;
					switch(att.type) {
						case "bool":
						case "byte":
							maxinputsize = 3;
							break;
						case "word":
							maxinputsize = 4;
							break;
						case "long":
							maxinputsize = 7;
							break;
						case "long64":
						case "number":
							maxinputsize = 14;
							break;
						case "date":
						case "duration":
							maxinputsize = 12;
							break;
						case "string":
							maxinputsize = 30;
							break;
						
					}
					if (maxinputsize != 0)
					{
						html += ' style="width:'+maxinputsize+'em;"';
					}
				}
				html += '/>';
				html += 	'<div class="errormess-div" id="' + divID + '_' + htmlIDName + '__mess"></div>';
				html += '</div></td>';
	
			} else {
	
				html += '<td width="100%" class="value-col value-rel">';
				html += 	'<div class="value-rel-div" id="' + divID + "_" + htmlIDName + '" ></div>';
				html += '</td>';
	
			}
	
			html += '</tr>';
		}
		
		// petite ligne cachee pour aggrandir la table si necessaire
		html += '<tr class="autoForm-filler" style="height:0px;">';
		html += '<td class="attribute-col" style="height:0px;"><div class="attribute-div">';
		html += '</div></td>';
		
		if (isQueryForm)
		{
			html += '<td class="oper-col" style="height:0px;"><div class="oper-div">';
			html += '</div></td>';
		}
	
		html += '<td class="value-col" style="height:0px;"><div class="value-div">';
		html += '</div></td>';
		html += '</tr>';
		// fin de la petite ligne cachee
		
	
		var withToolBar,
	        toolbarConfig,
	        toolbar;
	    
		withToolBar = !options.noToolBar;
	
		var toolBarForRelatedEntity = false;
		if (options.toolBarForRelatedEntity)
			toolBarForRelatedEntity = options.toolBarForRelatedEntity;
	
		if(withToolBar) {
			html += '<tfoot class="waf-widget-footer waf-autoForm-footer">';
			html += 	'<tr>';
			html += 		'<td colspan="'+xcol+'">';
			html += 		    '<div class="waf-status">';
			html += 		        '<div class="waf-status-element waf-status-left"></div>';
			html += 		        '<div class="waf-status-element waf-status-center"></div>';
			html += 		        '<div class="waf-status-element waf-status-right"></div>';
			html += 		    '</div>';
			html += 		'</td>';
			html += 	'</tr>';
			html += '</tfoot>';
	        
			if (isQueryForm)
			{
					toolbarConfig = [
	                    {icon: {size: 16, type: 'radioactive'}, title: 'Clear', click: function() {WAF.AF.clearEntity(divID);}},
	                    {icon: {size: 16, type: 'magnifyingGlass'}, title: 'Find', click: function() {WAF.AF.findEntity(divID);}}
	                ];
			}
			else
			{
				if (toolBarForRelatedEntity)
				{
					toolbarConfig = [
	                    {icon: {size: 16, type: 'radioactive'}, title: 'Clear', click: function() {WAF.AF.clearRel(divID);}},
	                    {icon: {size: 16, type: 'magnifyingGlass'}, title: 'Find', click: function() {WAF.AF.findRel(divID);}}
	                   // {icon: {size: 16}, title: 'Assign', click: function() {WAF.AF.assignRel(divID);}}
	                ];
	            }
				else
				{
					toolbarConfig = [
	                    {icon: {size: 16, type: 'arrowFullLeft'}, title: 'Previous', click: function() {WAF.AF.prevEntity(divID);}},
	                    {icon: {size: 16, type: 'arrowFullRight'}, title: 'Next', click: function() {WAF.AF.nextEntity(divID);}},
	                    /*{icon: {size: 16, type: 'radioactive'}, title: 'Clear', click: function() {WAF.AF.clearEntity(divID);}},*/
						{icon: {size: 16, type: 'plus'}, text: '', title: 'Add', click: function() {WAF.AF.addEntity(divID);}},
	                    {icon: {size: 16, type: 'magnifyingGlass'}, title: 'Find', click: function() {WAF.AF.findEntity(divID);}},
	                    {icon: {size: 16, type: 'floppyDisk'}, title: 'Save', click: function() {WAF.AF.saveEntity(divID);}},
	                    {icon: {size: 16, type: 'trash'}, title: 'Delete', click: function() {WAF.AF.dropEntity(divID);}}
	                ];
				}
			}
	        
	        toolbar = new WAF.widget.Toolbar(toolbarConfig);
		}
	
		html += '</table>';
	    
		formdiv.attr({
	        'data-type': isQueryForm ? 'queryForm' : 'autoForm',
	        'data-level': level
	    })
	    .addClass('waf-widget waf-autoForm')
	    .html(html);
		
		/*
		if (allowResizeInput)
		{
			$(".waf-inputdiv", formdiv).resizable();
			$(".waf-inputdiv", formdiv).parent().css("padding", "0px");
		}
	    */
		
	    var attibuteRelatedIcon = new WAF.widget.Icon(
	        {
	            size: 16,
	            type: 'arrowSansRight',
	            state: {
	                active: {
	                    fill: '#5e5e5e',
	                    rotation: 90
	                }
	            }
	        }
	    );
	    
	    formdiv.find('.attribute-rel').append(attibuteRelatedIcon.containerNode);
	    
	    if (options.included !== false) {
	        formdiv.find('tbody').css({
	            display: 'block',
	            'overflow-x': 'hidden',
	            'overflow-y': (dataSource == null) ? 'hidden' : 'auto',
	            width: formdiv.width() + 'px',
	            height: formdiv.height() - formdiv.find('thead').height() - formdiv.find('tfoot').height() + 'px'
	        });
	    }
	    
	    if(withToolBar) {
	        formdiv.find('.waf-autoForm-footer .waf-status-left').append(toolbar);
	    }
	
	
		if (isQueryForm)
		{
			/* for (i = 0; i < attrList.length; i++)
			{
				$('#' + divID + '_oper'+ i).csb({
						style: ''+divID + '_oper'+ i,
						mode: 'select',
						data: { divID: divID, rowID: i },
						callback: function(selectedID, data)
						{
							var id = data.divID;
							var form = WAF.forms[id];
							// Does it have a dataSource ?
							if(!(form && form.source)) return false;
							var rownum = data.rowID;
							form.otherAttInfo[rownum].curOper = selectedID - 1;
						}
					});
			} */
			
		}
		else
		{
			$('#' + divID + ' .attribute-rel').bind('click', {id:divID}, function(event)
			{
				var id = event.data.id;
				// Does it have a dataSource ?
				if(!(WAF.forms[id] && WAF.forms[id].source)) return false;
				// Yes, we can expand / collapse
				$(this).toggleClass('expanded waf-state-active');
				var attNum = parseInt($(this).attr("data-att-id"));
				WAF.AF.expandCollapseRelated(id, attNum, event.shiftKey);
				
			});
		}

	}
	
	for (var i = 0, nbatt = attrList.length; i < nbatt; i++) {
		var att = atts[i];
		var sourceAtt = sourceAtts[i];
		if((att.kind == "storage" || att.kind == "calculated" || att.kind == "alias") && att.type != 'image') {
			var objID = '';
                        var htmlobj = null;
                        if (typeof sourceAtt !== 'undefined') {
                            objID = divID + "_" + idName(sourceAtt.name);
                            htmlobj = $('#' + objID)[0];
                        }			
            if (htmlobj) 
            {
				htmlobj.isInFocus = false;
				htmlobj.att = att;
				htmlobj.format = att.defaultFormat;
				htmlobj.source = dataSource;
				htmlobj.getFormattedValue = WAF.AF.getFormattedValue;
				htmlobj.sourceAtt = sourceAtts[i];
				htmlobj.isTextInput = true;

				if (!isQueryForm)
				{
					$(htmlobj).focus(function(event)
					{
						this.isInFocus = true;
						if (this.format != null && this.format.format != null)
						{
							//this.value = this.source.getAttribute(this.att.name).getValue();
							this.value = this.sourceAtt.getValue();
						}
					});

					$(htmlobj).blur(function(event)
					{
						this.isInFocus = false;
						if (this.format != null && this.format.format != null)
						{
							this.value = this.getFormattedValue();
						}
					});
				}

				var enumValueList = [];
				var items = null;
				if (att.enumeration != null && !att.readOnly && !sourceAtt.readOnly)
				{
					items = att.enumeration.item;
					for (var j = 0, nb = items.length; j < nb; j++)
					{
						enumValueList.push(items[j].name);
					}
				}
				if (enumValueList.length > 0)
				{                    
                    $(htmlobj)
                    .data('enumValueList', enumValueList)
                    .autocomplete({
                        source: function(request, response) {
                            response($.grep($(this.element.context).data('enumValueList'), function(item, index) {
                                return item.toLowerCase().indexOf(request.term.toLowerCase()) === 0;
                            }));
                        }
                    })
                    .autocomplete('widget')
                    .addClass(dataTheme);
                    
					if (!isQueryForm)
					{
						$(htmlobj).blur(function(event)
						{
							//var sourceAtt = this.source.getAttribute(this.att.name);
							var sourceAtt = this.sourceAtt;
							if (this.value !== sourceAtt.getValue())
							{
								sourceAtt.setValue(this.value, {dispatcherID:divID});
							}
						});
					}
				}
				else if (att.autoComplete)/*(att.type == 'string' && att.indexed)*/
				{                    
                    $(htmlobj)
                    .autocomplete({
                        source: function(request, response) {
                            $.ajax({
                                url: 'rest/' + dataClass.getName() + '/' + this.element.context.att.name + '?$distinct=true&$top=20',
                                data: {
                                    '$filter': '"' + this.element.context.att.name + '=\'' + request.term + '@\'"'
                                },
                                success: function(data) {
                                    response($.map(data, function(item) {
                                        return {
                                            value: item
                                        }
                                    }));
                                }
                            });
                        }
                    })
                    .autocomplete('widget')
                    .addClass(dataTheme);

					if (!isQueryForm)
					{
						$(htmlobj).focus(function(event)
						{
						/*
							if (this.value == "")
							{
								var ac = this.inputAC;
								setTimeout(function()
								{ // For IE
									ac.sendQuery("");
								}, 0);
							}
							*/
						});

						$(htmlobj).blur(function(event)
						{
							var sourceAtt = this.sourceAtt;
							if (this.value !== sourceAtt.getValue())
							{
								sourceAtt.setValue(this.value, {dispatcherID:divID});
							}
						});
					}
				}
				else
				{
					if (att.type == 'date')
					{
						$(htmlobj)
                        .datepicker()
                        .datepicker('widget')
                        .addClass(dataTheme);
					}

				}
            }
		}
	}

	if (typeof (otherAttInfo) === "undefined")
		otherAttInfo = null;
		
	var result = {
		dataClass: dataClass,
		source: dataSource,
		divID: divID,
		kind: 'autoForm',
		attList: attrList,
		atts: atts,
		sourceAtts: sourceAtts,
		relForms: {},
		relGrids: {},
		relSources: {},
		imgAreas: {},
		subWidgets: subWidgets,
		withTitle: withTitle,
		withToolBar: withToolBar,
		withoutTable: withoutTable,
		headerDom: headerDom,
		bodyDom: bodyDom,
		footerDom: footerDom,
		allowResizeInput: allowResizeInput,
		toolBarForRelatedEntity: toolBarForRelatedEntity,
		allReadOnly: allReadOnly,
		level: level,
		checkIdentifying : checkIdentifying,
		fillForm: WAF.AF.fillForm,
		fillEntity: WAF.AF.fillEntity,
		clearForm: WAF.AF.clearForm,
		drawStatus: WAF.AF.drawFormStatus,
		purgeErrorMessagesOnForm: WAF.AF.purgeErrorMessagesOnForm,
		gotEntityCollection: WAF.AF.gotEntityCollection,
		parent: options.parent,
		isQueryForm: isQueryForm,
		otherAttInfo: otherAttInfo,
		dataTheme: dataTheme,
		mustDisplayError: mustDisplayError,
		errorDiv: null,
		onError: null,
		kill: function()
		{
			WAF.AF.killForm(this);
		},
		openAsPanel: function()
		{
			WAF.AF.openFormInAPanel(this.divID);
		},
		closeAsPanel: function()
		{
			WAF.AF.closeAsPanel(this.divID);
		},
		expandCollapseAtt: WAF.AF.expandCollapseAtt,
		onResize: WAF.AF.afterResize,
		installResizeOnSubWidgets: WAF.AF.installResizeOnSubWidgets,
		errorHandler: WAF.AF.errorHandler,
		getErrorDiv: WAF.AF.getErrorDiv,
		setErrorDiv: WAF.AF.setErrorDiv
		
		//gotEntity: WAF.AF.gotEntity
	};
   
   	result.setErrorDiv(errorDiv);
	if (dataSource != null) 
	{
		if (isQueryForm)
			dataSource.addListener("onCollectionChange", WAF.AF.queryformEventListener, {listenerID: divID, listenerType:'form'}, {form:result});
		else
			dataSource.addListener("all", WAF.AF.formEventListener, {listenerID: divID, listenerType:'form'}, {form:result});
	}

	WAF.forms[divID] = result;
	WAF.widgets[divID] = result;
	
   if (!isQueryForm && dataSource) {
            dataSource.dispatch('onCurrentElementChange');
        }

	return result;
}


WAF.AF.getErrorDiv = function()
{
	return this.errorDiv;
}

WAF.AF.setErrorDiv = function(div)
{
	if (typeof div === 'string')
	{
		if (div == "")
			div = null;
		else
			div = $("#"+div);
	}
	this.errorDiv = div;
}


WAF.AF.errorHandler = function(event)
{
	var form = event.userData.autoForm;
	var handler = form.onError;
	var cont = true;
	if (handler != null)
	{
		var b = handler(event);
		if (b != null && b === false)
			cont = false;
	}
	if (cont)
	{
		var errordiv = form.getErrorDiv();
		event.message = event.userData.errorMessage || null;
		WAF.ErrorManager.displayError(event, errordiv);
	}
}


WAF.AF.installResizeOnSubWidgets = function()
{
	function ResizeHandler(event, ui)
	{
		ui.originalElement.height(ui.size.height);
		ui.originalElement.width(ui.size.width);
	}
	
	var formdiv = $("#"+this.divID);
	if (this.allowResizeInput)
	{
		$(".waf-form-resize-multiline", formdiv).resizable({resize: ResizeHandler});
		$(".waf-form-resize", formdiv).resizable({handles:"e", resize: ResizeHandler});
		
		$(".waf-form-resize-pict", formdiv).resizable({
			resize: function(event, ui)
			{
				ui.originalElement.height(ui.size.height);
				ui.originalElement.width(ui.size.width);
				//if ($(this).hasClass('waf-form-att-value-pict'))
				if (true)
				{
					var img = $('img', $(this));
					//img.css("max-width", ""+$(this).width()+"px");
					//img.css("max-height", ""+$(this).height()+"px");
				}
			}
		});
		
		
		
		$(".waf-form-resize", formdiv).parent().css("padding", "0px");
		$(".waf-form-resize-multiline", formdiv).parent().css("padding", "0px");
		$(".waf-form-resize,.waf-form-resize-pict,.waf-form-resize-multiline", formdiv).each(function(index)
		{
			var parent = $(this).parent();
			$(this).height(parent.height());
			$(this).width(parent.width());
			//$('.ui-resizable-se', parent).css("z-index", "100000");
		});
	}
}

WAF.AF.afterResize = function(formdiv, withToolBar)
{
	var headerDom, bodyDom, footerDom;
	
	if (formdiv == null)
	{
		if (this.withoutTable)
		{
			formdiv = $("#"+this.divID);
			withToolBar = this.withToolBar;
			headerDom = this.headerDom;
			bodyDom = this.bodyDom;
			footerDom = this.footerDom;
		}
	}
	else
	{
		headerDom = $('.waf-widget-header', formdiv);
		bodyDom = $('.waf-form-body', formdiv);
		footerDom = $('.waf-widget-footer', formdiv);
	}
	
	
	if (formdiv != null)
	{
		var formHeight = formdiv.height();				
		var headerHeight = headerDom.outerHeight();
		var footerHeight = 0;
		if (withToolBar)
		{
			footerHeight = footerDom.outerHeight();
		}
		
		bodyDom.height(formHeight-footerHeight-headerHeight);
	}
}


WAF.AF.formEventListener = function(event)
{
	var form = event.data.form;
	if (event.eventKind == 'onCurrentElementChange' || event.eventKind == 'onCollectionChange') 
	{
		if (form.source.getCurrentElement() == null) 
			form.clearForm();
		else 
			form.fillForm();
	}
	else 
		if (event.eventKind == "attributeChange") 
		{
			var domobj = document.getElementById(form.divID + "_" + idName(event.attributeName));
			if (domobj != null) 
			{
				var sourceAtt = event.attribute;
				if (sourceAtt.simple) 
				{
					if (domobj.isInFocus) 
						domobj.value = sourceAtt.getValue(); //form.source[notifyEvent.attName];

					else 
						domobj.value = domobj.getFormattedValue();
				}
				else 
				{
				}
			}
		}
}


WAF.AF.queryformEventListener = function(event)
{
	var form = event.data.form;
	form.drawStatus();
	
}


WAF.AF.killForm = function(form)
{
	for (fname in form.relForms)
	{
		form.relForms[fname].kill();
	}
	for (fname in form.relGrids)
	{
		form.relGrids[fname].grid.kill();
	}
	/*
	for (fname in form.relSources)
	{
		form.relSources[fname].kill();
	}
	*/
	$('#' + form.divID).html("");
}


WAF.AF.expandCollapseRelated = function(divID, attID, inAPanel) {
	var form = WAF.forms[divID],
        attrList = [],
        nameList = [],
        rootId, tmpForm,
        dataTheme = form.dataTheme;

	if (inAPanel == null)
		inAPanel = false;
		
	if(form == null) return;

	var attribute = form.atts[attID];
	
	$('#'+divID+'_rel'+attID).toggleClass("expanded");	

	if(attribute.kind == 'relatedEntity') {
		var subform = form.relForms[attribute.name];

		if(subform) {
			$('#' + subform.divID)[(subform.visible = !subform.visible) ? 'show' : 'hide']();
		} else {
			var subID = WAF.AF.generateID();

                        //if(WAF.AF.attrList)
			var sourceID = subID + "_source";
			var subsource = WAF.dataSource.create({id: sourceID, binding: form.source.getID() + "." + attribute.name});

                        // Get the id of the first form
                        if(!form.parent){
                            rootId = form.divID;
                        } else {
                            tmpForm = form;
                            while(tmpForm.parent)
                            {
                                tmpForm = tmpForm.parent.form;
                            }

                            rootId = tmpForm.divID;
                        }

                        if((WAF.widgets[rootId] && WAF.widgets[rootId].dataClass.getName() == subsource.getDataClass().getName())){
                            attrList = WAF.widgets[rootId].attrList;
                            nameList = WAF.widgets[rootId].nameList;
                        }

			var parentDivID = divID + '_' + attribute.name;
            
            /* subForm should inherit parent theme */
			//$('#' + parentDivID).html('<div id="' + subID + '" class="autoForm"></div>');
            $('<div />')
            .attr({
                id: subID,
                'class': dataTheme+" waf-autoForm",
                'data-theme': dataTheme
            })
            .css({
                'background-color': $('#' + divID).css('background-color'),
                'border': $('#' + divID).css('border')
            })
            .appendTo('#' + parentDivID);
            
			subform = WAF.AF.buildForm(subID, subsource, attrList, nameList,{toolBarForRelatedEntity: form.level == 1,
																noToolBar: form.level > 1,
																formTitle: attribute.name,
																checkIdentifying: form.level == 1,
																level: form.level+1,
																allReadOnly: form.level > 1,
																parent: {form: form, att: attribute, sourceAtt: form.sourceAtts[attID]},
																included: !inAPanel,
																inAPanel: inAPanel,
																withoutTable: form.withoutTable,
																allowResizeInput: form.allowResizeInput});

                        subform.parentID = parentDivID;
			subform.visible = true;
			form.relForms[attribute.name] = subform;
			form.relSources[sourceID] = subsource;
			if (inAPanel)
				WAF.AF.openFormInAPanel(subID);
			subsource.resolveSource();
		}
	} else if(attribute.kind == 'relatedEntities') {
		var subgrid = form.relGrids[attribute.name];

		if(subgrid) {
			$('#' + subgrid.gridID)[(subgrid.visible = !subgrid.visible) ? 'show' : 'hide']();
		} else {
			var subID = WAF.AF.generateID();
			var sourceID = subID + "_source";
			var subsource = WAF.dataSource.create({id: sourceID, binding: form.source.getID() + "." + attribute.name});
			var parentDivID = divID + '_' + attribute.name;
            
            /* subgrid should inherit parent theme */
			// $('#' + parentDivID).html('<div id="' + subID + '" data-type="dataGrid" class="AF_autoGridGen"></div>');
            $('<div />')
            .attr({
                id: subID,
                'data-type': 'dataGrid',
                'class': 'waf-widget waf-dataGrid AF_autoGridGen ' + dataTheme,
                'data-theme': dataTheme
            })
            .css({
                'background-color': $('#' + divID).css('background-color'),
                'border': $('#' + divID).css('border')
            })
            .appendTo('#' + parentDivID);

			var subattlist = subsource._private.dataClass.getAttributes();
			var subcolumns = [];
			for (var i = 0, nb = subattlist.length; i < nb; i++) {
				var att = subattlist[i];
				if (att.kind == "storage" || att.kind == "calculated" || att.kind == "alias") {
					if (att.kind == "storage" || att.kind == "calculated" || att.kind == "alias") {
						if (att.type != "image")
						{
							var w = 150;
							switch (att.type)
							{
								case 'number':
									w = 90;
									break;
								
								case 'long':
									w = 70;
									break;
									
								case 'byte':
								case 'word':
									w = 50;
									break;
									
								case 'date':
								case 'duration':
									w = 100;
									break;
									
								default:
									w = 150;
									break;
							}
							subcolumns.push({colID: att.name, sourceAttID: att.name, title:att.name, width: w});
						}
					}
				}
			}


			var subgrid = new WAF.widget.Grid({
				render: subID,
				id: subID,
				dataSource: sourceID,
				binding: sourceID,
				columns: subcolumns,
				cls: subID,
				included:true
			});

			if (inAPanel)
				$("#"+subID).dialog();

			form.relSources[sourceID] = subsource;
			form.relGrids[attribute.name] = {gridID: subID, visible: true, grid: subgrid};
			subsource.resolveSource();
		}
	} else if (attribute.type == 'image') {
		var imgArea = form.imgAreas[attribute.name];

		if(imgArea) {
			$('#' + imgArea.divID)[(imgArea.visible = !imgArea.visible) ? 'show' : 'hide']();
		} else {
			var subID = WAF.AF.generateID();
			subID = 'AF_image_'+subID;

			var parentDivID = divID + '_' + attribute.name;
			var parentwidth = $('#' + parentDivID).width();
			if (parentwidth < 300)
				parentwidth = 300;
			$('#' + parentDivID).html('<div id="' + subID + '" data-type="image" class="AF_autoImage" style="max-width:' + parentwidth + 'px;max-height:' + parentwidth + 'px;"></div>');

			var imgArea=WAF.AF.createImage(subID,form.source.getID()+'.' + attribute.name,{
				render: subID,
				id: subID,
				lib: 'waf',
				type: 'image',
				//dataSource: sourceID,
				binding: form.source.getID()+'.' + attribute.name,
				maxWidth: parentwidth,
				maxHeight: parentwidth
			});

			imgArea.visible = true;
			form.imgAreas[attribute.name] = imgArea;
			//var sourceAtt = form.source.getAttribute(attribute.name);
			var sourceAtt = form.sourceAtts[attID];
			if (sourceAtt != null)
				sourceAtt.dispatch();
			//form.source.changedCurrentEntityAttribute(attribute.name, '');
		}
	}
}



WAF.AF.expandCollapseAtt = function(divID, attID) {
	var form = WAF.forms[divID],
        attrList = [],
        nameList = [],
        rootId, tmpForm,
        dataTheme = form.dataTheme;

	var inAPanel = false;
		
	if (form == null) 
		return null;

	var attribute = form.atts[attID];
	
	var formDiv = $("#"+divID);
	var rowDiv = $("#"+divID+"_att_"+attID);
	
	if(attribute.kind == 'relatedEntity') 
	{
		var subform = form.relForms[attribute.name];

		if(subform) {
			$('#' + subform.divID)[(subform.visible = !subform.visible) ? 'show' : 'hide']();
		} else {
			var subID = WAF.AF.generateID();

                        //if(WAF.AF.attrList)
			var sourceID = subID + "_source";
			var subsource = WAF.dataSource.create({id: sourceID, binding: form.source.getID() + "." + attribute.name});

                        // Get the id of the first form
                        if(!form.parent){
                            rootId = form.divID;
                        } else {
                            tmpForm = form;
                            while(tmpForm.parent)
                            {
                                tmpForm = tmpForm.parent.form;
                            }

                            rootId = tmpForm.divID;
                        }

                        if((WAF.widgets[rootId] && WAF.widgets[rootId].source.getDataClass().getName() == subsource.getDataClass().getName())){
                            attrList = WAF.widgets[rootId].attrList;
                            nameList = WAF.widgets[rootId].nameList;
                        }

			var parentDivID = divID + '_' + attribute.name;
            
            /* subForm should inherit parent theme */
			//$('#' + parentDivID).html('<div id="' + subID + '" class="autoForm"></div>');
            var objdiv = $('<div />');
            objdiv.attr({
                id: subID,
                'class': dataTheme+" waf-autoForm",
                'data-theme': dataTheme
            })
            .css({
                'background-color': $('#' + divID).css('background-color'),
                'border': $('#' + divID).css('border')
            });
            objdiv.appendTo('#' + parentDivID);
            
			subform = WAF.AF.buildForm(subID, subsource, attrList, nameList,{toolBarForRelatedEntity: form.level == 1,
																noToolBar: form.level > 1,
																formTitle: attribute.name,
																checkIdentifying: form.level == 1,
																level: form.level+1,
																allReadOnly: form.level > 1,
																parent: {form: form, att: attribute, sourceAtt: form.sourceAtts[attID]},
																included: !inAPanel,
																inAPanel: inAPanel,
																withoutTable:form.withoutTable,
																allowResizeInput: form.allowResizeInput});

            subform.parentID = parentDivID;
			subform.visible = true;
			form.relForms[attribute.name] = subform;
			form.relSources[sourceID] = subsource;
			if (inAPanel)
				WAF.AF.openFormInAPanel(subID);
			else
			{
				if (subform.withoutTable)
				{
					var needrecalc = false;
					var h = objdiv.outerHeight();
					if (h > 400)
					{
						objdiv.height(400);
						needrecalc = true;		
					}
					var w = objdiv.outerWidth()+30;
					var maxw = form.bodyDom.innerWidth() - objdiv.position().left - 30;
					if (maxw > 150 && maxw < w)
						objdiv.width(maxw);
					else
						objdiv.width(w);
						
					objdiv.resizable({
		                //minHeight: parseInt($('#' + config.id).css('height')),
		                //minWidth: parseInt($('#' + config.id).css('width')),
		                resize: function(event, ui) {
		                    $('.waf-widget-body:first', objdiv).css('width', parseInt(objdiv.css('width')));
		                    $('.waf-widget-body:not(:first)', objdiv).css('width', '100%');
		
		                    var newHeight = parseInt(objdiv.css('height')) - parseInt($('.waf-widget-footer', objdiv).css('height'));
		                    newHeight -= parseInt($('.waf-widget-header:first', objdiv).css('height'));
		                    $('.waf-widget-body:first', objdiv).css('height',  newHeight+ 'px');
							subform.onResize();
		                }
		            });
			
					if (subform.installResizeOnSubWidgets != null)
						subform.installResizeOnSubWidgets();
					if (needrecalc)
						subform.onResize();
				}
			}
			subsource.resolveSource();
		}
	} 
	else if (attribute.kind == 'relatedEntities') 
	{
		var subgrid = form.relGrids[attribute.name];

		if(subgrid) {
			$('#' + subgrid.gridID)[(subgrid.visible = !subgrid.visible) ? 'show' : 'hide']();
		} else {
			var subID = WAF.AF.generateID();
			var sourceID = subID + "_source";
			var subsource = WAF.dataSource.create({id: sourceID, binding: form.source.getID() + "." + attribute.name});
			var parentDivID = divID + '_' + attribute.name;
            
            /* subgrid should inherit parent theme */
			// $('#' + parentDivID).html('<div id="' + subID + '" data-type="dataGrid" class="AF_autoGridGen"></div>');
			
			var objdiv = $('<div />');
            objdiv.attr({
                id: subID,
                'data-type': 'dataGrid',
                'class': 'waf-widget waf-dataGrid AF_autoGridGen ' + dataTheme,
                'data-theme': dataTheme
            })
            .css({
                'background-color': $('#' + divID).css('background-color'),
                'border': $('#' + divID).css('border')
            })
            .appendTo('#' + parentDivID);

			if (form.withoutTable)
			{
				var needrecalc = false;
				var h = objdiv.outerHeight();
				if (h > 400)
				{
					objdiv.height(400);
					needrecalc = true;		
				}
				var w = objdiv.outerWidth()+30;
				var maxw = form.bodyDom.innerWidth() - objdiv.position().left - 30;
				if (maxw > 200)
					objdiv.width(maxw);
				else
					objdiv.width(200);
					
			}

			var subattlist = subsource._private.dataClass.getAttributes();
			var subcolumns = [];
			for (var i = 0, nb = subattlist.length; i < nb; i++) {
				var att = subattlist[i];
				if (att.kind == "storage" || att.kind == "calculated" || att.kind == "alias") {
					if (att.type != "image")
					{
						var w = 150;
						switch (att.type)
						{
							case 'number':
								w = 90;
								break;
							
							case 'long':
								w = 70;
								break;
								
							case 'byte':
							case 'word':
								w = 50;
								break;
								
							case 'date':
							case 'duration':
								w = 100;
								break;
								
							default:
								w = 150;
								break;
						}
						subcolumns.push({colID: att.name, sourceAttID: att.name, title:att.name, width: w});
					}
				}
			}


			var subgrid = new WAF.widget.Grid({
				render: subID,
				id: subID,
				dataSource: sourceID,
				binding: sourceID,
				columns: subcolumns,
				cls: subID
			});

			if (inAPanel)
				$("#"+subID).dialog();
			else
			{
				objdiv.resizable({
	               
				   	resize: function(event, ui) {
	                    $('.waf-widget-body', objdiv).css('width', parseInt(objdiv.css('width')));
	
	                    var newHeight = parseInt(objdiv.css('height')) - parseInt($('.waf-widget-footer', objdiv).css('height'));
	                    newHeight -= parseInt($('.waf-widget-header', objdiv).css('height'));
	                    $('.waf-widget-body', objdiv).css('height', newHeight + 'px');      
	                },
	                
	                stop: function(event, ui) {
	                    subgrid.gridController.gridView.refresh();
	                }
				   
		            });
			}

			form.relSources[sourceID] = subsource;
			form.relGrids[attribute.name] = {gridID: subID, visible: true, grid: subgrid};
			subsource.resolveSource();
		}
	} 
	else if (attribute.type == 'image') 
	{
		var expandDiv = $('.waf-expandable', rowDiv);
		var imgArea = form.subWidgets[attID];
		if (imgArea != null) 
		{
			var imgDiv = $('#' + imgArea.divID);
			if (imgArea.visible)
			{
				imgDiv.hide();
				expandDiv.removeClass('waf-expanded');
				expandDiv.addClass('waf-collapsed');
				imgArea.visible = false;
			}
			else
			{
				imgDiv.show();
				expandDiv.removeClass('waf-collapsed');
				expandDiv.addClass('waf-expanded');
				imgArea.visible = true;
			}
		} 
		else 
		{
			expandDiv.removeClass('waf-collapsed');
			expandDiv.addClass('waf-expanded');
			var attValueDiv = $('.waf-form-att-value', rowDiv);
			
			var htmlIDName = idName(form.attList[attID]);
			var binding = form.source.getID()+'.'+form.attList[attID];
			
			var html = "";
			html += '<div class="waf-form-resize-pict waf-form-att-value-pict waf-widget waf-image" data-type="image" data-fit="0" '
			html += 'style="height:80px;width:200px;" '
			html += 'data-binding="'+binding+'" id="' + divID + "_" + htmlIDName + '"/>';
			
			attValueDiv.html(html);
			var objDiv = $("#"+divID + "_" + htmlIDName);
			form.subWidgets[attID] = WAF.tags.createComponent(objDiv[0], false);
			form.subWidgets[attID].visible = true;
			
			var subID = WAF.AF.generateID();
			subID = 'AF_image_'+subID;

			if (form.allowResizeInput)
			{
				objDiv.resizable({
					resize: function(event, ui)
					{
						var img = $('img', $(this));
						img.css("max-width", ""+$(this).width()+"px");
						img.css("max-height", ""+$(this).height()+"px");
					}
				});
				
				var parent = objDiv.parent();
				parent.css("padding", "0px");
				objDiv.height(parent.height());
				objDiv.width(parent.width());
				//$('.ui-resizable-se', parent).css("z-index", "100000");
			}
			
			var sourceAtt = form.sourceAtts[attID];
			if (sourceAtt != null)
				sourceAtt.dispatch();
		}
	}
}


WAF.AF.gotEntityCollection = function(event)
{
	var sel = event.entityCollection;
	var form = WAF.forms[event.userData.idval];
	if (form != null)
	{
		form.source.setEntityCollection(sel);
	}
}


WAF.AF.findForm = function(domElement)
{
    var objid = domElement.id;
    var p = objid.indexOf("_", 1);
    var divID = objid.substring(0, p);
    var form = WAF.forms[divID];
}


WAF.AF.clearEntity = function(divID)
{
	var form = WAF.forms[divID];
	if (form != null)
	{
		if (form.isQueryForm)
		{
			form.clearForm();
		}
		else if (form.source)
		{
			//form.source.newEntity();
			
			//form.source.addNewElement();
			form.clearForm();
			//form.source.serverRefresh();
		}
	}
}


WAF.AF.dropEntity = function(divID)
{
	var form = WAF.forms[divID];
	if ((form != null))
	{
		var source = form.source;
        if (source) 
        {
            if (source.getCurrentElement() != null)
            {
				source.removeCurrent();
				/*
				var curpos = source.getPosition();
				source.removeCurrent({onSuccess: function(event)
				{
					//WAF.AF.nextEntity(divID);	
					source.select(curpos+1);			
				}});
				*/
			}
			else
			{
				WAF.AF.clearEntity(divID);
			}
		}
	}
}


WAF.AF.saveEntity = function(divID)
{
	var form = WAF.forms[divID];
	if (form != null)
	{
		var source = form.source;
        if (source) {
            if (source.getCurrentElement() != null)
            {
                var wasnew = source.isNewElement();
                source.save({
					onSuccess: function(event)
					{
		                if (wasnew)
						{
							source.addNewElement();
							//source.serverRefresh();
						}
					},
					onError: form.errorHandler 
				},
				{ // user Data
					autoForm: form,
					errorMessage: "The form could not save the entity"
				}
				);
            }
            else
            {
				/*
                source.newEntity("--"); // do not dispatch
                form.fillEntity();
                source.save();
                */
                source.addNewElement();
				//source.serverRefresh();
            }
        }
	}
}


WAF.AF.changeEntityAtt = function(divID, attName, i)
{
	var form = WAF.forms[divID];
	if (form != null)
	{
		var value = document.getElementById(divID + "_" + attName).value;
		//var sourceAtt = form.source.getAttribute(attName);
		var sourceAtt = form.sourceAtts[i];
		value = sourceAtt.normalize(value);
		var validation = sourceAtt.validate(value);
		var messDivName = divID + "_" + attName + "__mess";
		var messDiv = document.getElementById(messDivName);
		if (messDiv == null)
		{
			$("#" + divID + "_" + attName).after('<span id="' + messDivName + '" class="AF_mess"></span>');
			messDiv = document.getElementById(messDivName);
		}
		if (validation.valid)
		{
			$('#' + divID + "_" + attName).parent().removeClass('AF_ValueWrong');
			$('#' + divID + "_" + attName).parent().addClass('AF_ValueOK');
			$('#' + messDivName).parent().removeClass('AF_messWrong');
			$('#' + messDivName).removeClass('AF_markedWrong');
			sourceAtt.setValue(value, {dispatcherID:divID});
			if (messDiv != null)
				messDiv.innerHTML = "";
		}
		else
		{
			$('#' + divID + "_" + attName).parent().addClass('AF_ValueWrong');
			$('#' + divID + "_" + attName).parent().removeClass('AF_ValueOK');
			$('#' + messDivName).parent().addClass('AF_messWrong');
			$('#' + messDivName).addClass('AF_markedWrong');
			sourceAtt.setValue(value, {dispatcherID:divID});
			if (messDiv == null)
				alert(validation.messages.join(" , "));
			else
				messDiv.innerHTML = validation.messages.join(" , ");
		}

	}
}

WAF.AF.nextEntity = function(divID)
{
	var form = WAF.forms[divID];
	if ((form != null) && form.source)
	{
		form.source.selectNext();
	}
}

WAF.AF.prevEntity = function(divID)
{
    var form = WAF.forms[divID];
    if ((form != null) && form.source)
    {
    	form.source.selectPrevious();
    }
}

WAF.AF.addEntity = function(divID)
{
	var form = WAF.forms[divID];
    if ((form != null) && form.source)
    {
		form.source.addNewElement();
	}
}


WAF.AF.clearRel = function(divID)
{
	WAF.AF.clearEntity(divID);
}


WAF.AF.findRel = function(divID)
{
	var form = WAF.forms[divID];
    if (form != null)
    {
        var queryString = "";
        var attList = form.attList;
        for (var i = 0; i < attList.length; i++)
        {
			var attName = attList[i];
            var val = document.getElementById(divID + "_" + idName(attName)).value;
            //var att = form.dataClass.getAttributeByName(attName);
			var att = form.atts[i];

            if (att.identifying && val != null && val != "")
            {
                if (queryString != "")
                    queryString += " and ";
                queryString += attName + ' = ' + '"' + val + '"';
            }
        }

        form.dataClass.query(queryString,
            {
                onSuccess: function(event)
                {
					var entityCollection = event.entityCollection;
					if (entityCollection != null && entityCollection.length != 0)
					{
						entityCollection.getEntity(0, {onSuccess:function(event)
						{
							var entity = event.entity;
							form.source.setCurrentEntity(entity);
							if (form.parent != null)
							{
								form.parent.form.source[form.parent.att.name].set(form.source);
							}
						}});
					}
					else
					{
						form.source.setCurrentEntity(null);
						if (form.parent != null)
						{
							form.parent.form.source[form.parent.att.name].set(null);
						}
					}
                }
             },
			 {
             	idval: divID
             }
 
		);
    }

}


WAF.AF.findEntity = function(divID)
{
    var form = WAF.forms[divID];
    if (form != null && form.source)
    {
		if (form.isQueryForm)
		{
			var queryString = "";
			var attList = form.attList;
			for (var i = 0; i < attList.length; i++)
			{
				var val = document.getElementById(divID + "_" + idName(attList[i])).value;
				if (val != null && val != "")
				{
					if (queryString != "")
						queryString += " and ";
					var oper = 0;
					var objoper = document.getElementById(divID + "_oper" + i);
					if (objoper != null)
						oper = parseInt(objoper.value) - 1;
					form.otherAttInfo[i].curOper = oper;
					queryString += WAF.AF.queryData.buildQueryNode(form.atts[i].name, form.atts[i].type, oper, val);
				}
			}
			form.source.query(queryString);
		}
		else
		{
			var queryString = "";
			var attList = form.attList;
			for (var i = 0; i < attList.length; i++)
			{
				var val = document.getElementById(divID + "_" + idName(attList[i])).value;
				if (val != null && val != "")
				{
					if (queryString != "")
						queryString += " and ";
					queryString += attList[i] + ' = ' + '"' + val + '"';
				}
			}

			form.dataClass.query(queryString,
				{
					onSuccess: form.gotEntityCollection
				},
				{
					idval: divID
				}
			);
		}
    }

}

WAF.AF.clearErrorMessage = function()
{
	var htmlobj = document.getElementById(this.divID);
	var errorobj = this.errorDiv !== '' ? document.getElementById(this.errorDiv) : null; // To prevent warning
	$(htmlobj).removeClass("AF_InputError");
	$(htmlobj).addClass("AF_InputOK");
	if (errorobj != null)
	{
		$(errorobj).removeClass("AF_ErrorMessageWrong");
		$(errorobj).addClass("AF_ErrorMessage");
		$(errorobj).html("");
	}
}


WAF.AF.setErrorMessage = function(message)
{
	var htmlobj = document.getElementById(this.divID);
	var errorobj = document.getElementById(this.errorDiv);
	$(htmlobj).addClass("AF_InputError");
	$(htmlobj).removeClass("AF_InputOK");
	if (errorobj != null)
	{
		$(errorobj).addClass("AF_ErrorMessageWrong");
		$(errorobj).removeClass("AF_ErrorMessage");
		$(errorobj).html(message);
	}
	else
		alert(message);
}

WAF.AF.textInputChanged = function()
{
	var widget = WAF.widgets[this.id];
	if (widget != null)
	{
		if (widget.doNotUpdate)
			widget.doNotUpdate = false;
		else
		{
			var value = this.value;
			//var sourceAtt = widget.source.getAttribute(widget.att.name);
			var sourceAtt = widget.sourceAtt;
			value = sourceAtt.normalize(value);
			var validation = sourceAtt.validate(value);

			if (validation.valid)
			{
				sourceAtt.setValue(value, {dispatcherID:widget.divID});
				widget.clearErrorMessage();
			}
			else
			{
				sourceAtt.setValue(value, {dispatcherID:widget.divID});
				widget.setErrorMessage(validation.messages.join(" , "));
			}
		}
	}
}


WAF.AF.checkBoxClicked = function()
{
	var widget = WAF.widgets[this.id];
	if (widget != null)
	{
		var value = this.checked;
		//var sourceAtt = widget.source.getAttribute(widget.att.name);
		var sourceAtt = widget.sourceAtt;
		value = sourceAtt.normalize(value);
		var validation = sourceAtt.validate(value);

		if (validation.valid)
		{
			sourceAtt.setValue(value, {dispatcherID:widget.divID});
			widget.clearErrorMessage();
		}
		else
		{
			sourceAtt.setValue(value, {dispatcherID:widget.divID});
			widget.setErrorMessage(validation.messages.join(" , "));
		}

	}
}


WAF.AF.getValueForInput = function()
{
	var value;
	if (this.sourceAtt == null)
		value = this.source.getAttribute(this.att.name).getValueForInput();
	else
		value = this.sourceAtt.getValueForInput();
	return value;
}


WAF.AF.getFormattedValue = function(value)
{
	if (value === undefined)
	{
		if (this.sourceAtt == null)
			value = this.source.getAttribute(this.att.name).getValue();
		else
			value = this.sourceAtt.getValue();
	}
	if (typeof (value) == "number")
	{
		return WAF.utils.formatNumber(value, this.format);
	}
	else if (this.att.type == "date")
	{
		return WAF.utils.formatDate(value,this.format);
	}
	else if (this.att.type == "image")
	{
        if (value) {
			if (value.__deferred) {
				value = value.__deferred.uri;
			} else {
				value = value[0].__deferred[0].uri;   // patch� par Gilles car provoque une erreur sur le save d'une Entit�e (voir avec L.R.)
			}				
        } else {
            value = '';
        }
        return value;
	}
	else if (typeof (value) == "string")
	{
		if (this.kind === 'textField') {
                    return value;
                } else{
                    return htmlEncode(value, true, 4)
                }
	}
	else
	{
		if (value == null)
			return "";
		else
			return String(value);
	}
}

WAF.AF.createWidget = function(divID, binding, params)
{
	var result = null;
	var bindingInfo = WAF.dataSource.solveBinding(binding);
	
	var dataSource = bindingInfo.dataSource;
	var sourceAtt = bindingInfo.sourceAtt;
	if (dataSource != null && sourceAtt != null)
	{
		var dataClassAtt = bindingInfo.dataClassAtt;
		result = {
			source: dataSource,
			divID: divID,
			att: dataClassAtt,
			sourceAtt: sourceAtt,
			errorDiv: params['data-errorDiv'],
			format: dataClassAtt.defaultFormat,
			isInFocus: false,
			clearErrorMessage: WAF.AF.clearErrorMessage,
			setErrorMessage: WAF.AF.setErrorMessage,
			getFormattedValue: WAF.AF.getFormattedValue,
			getValueForInput: WAF.AF.getValueForInput
		};
		if (params['data-format'] != null) {
                    result.format        = {};
                    result.format.format = params['data-format'];
                }
			
		WAF.widgets[divID] = result;
		WAF.widgets[divID] = result;
	}


        // Automatically add theme if it is defined in the config
        if (params['data-theme']) {
           $('#' + divID).addClass(params['data-theme']);
        }


	return result;
}

WAF.AF.createImage = function(divID, binding, params)
{
	var result = WAF.AF.createWidget(divID, binding, params);
	if (result != null)
	{
	    result.kind = 'image';
		var htmlobj = $('#' + divID);
		var parentw = params.maxWidth;
		if (parentw == null || parentw <= 0)
			parentw = parseInt(htmlobj.css('width'));
		var parenth = params.maxHeight;
		if (parenth == null || parenth <= 0)
			parenth = parseInt(htmlobj.css('height'));
		var html = '';

		var html2 = '<div id="'+divID+'_uploadDiv"';
		//if (params.readOnly)  // pour l'instant on le cache tout le temps
			html2 += ' style="display:none;"'
		html2 += '>';

		html2 += '<form method="post" id="'+divID+'_upform" action="" enctype="multipart/form-data">';
	//	html += '<input id="'+divID+'_xinput" type="text" name="titi" value="tagada"/>';
		html2 += '<input id="'+divID+'_input" type="file" name="upload_file"/>';
		html2 += '<input id="'+divID+'_submit" type="submit" />';
		html2 += '</form>';
		html2 += '</div>';
		var uploadh = 0;
		/*
		if (!params.readOnly)
		{
			var subobj = $(html2);
			uploadh = subobj.height();
		}
		parenth = parenth - uploadh;
		*/

		html += '<img src="" id="'+divID+'_img" class="AF_Image" style="max-width:'+parentw+'px;max-height:'+parenth+'px;"/>';
		html += html2;
		htmlobj.html(html);
                
		htmlobj.addClass("AF_ImageDiv");

		//result.source.getAttribute(result.att.name).addListener(WAF.AF.imageEventHandler, {listenerID:divID, listenerType:'image'}, {widget:result});
		result.sourceAtt.addListener(WAF.AF.imageEventHandler, {listenerID:divID, listenerType:'image'}, {widget:result});

	}
	return result;
}


WAF.AF.imageEventHandler = function(event)
{
	var widget = event.data.widget;
	var imgobj = $('#' + widget.divID+'_img');
	var uri = widget.getFormattedValue();
	imgobj.attr('src', uri);
	var htmlform = $('#' + widget.divID+'_upform');
	htmlform.attr('action', uri);
}

 WAF.AF.openFormInAPanel = function(divID)
 {
	var formdiv = $('#'+divID);
	var already = formdiv.attr("data-inPanel");
	if (already == "1")
	{
		formdiv.dialog("open");
	}
	else
	{	
		formdiv.attr("data-inPanel", "1");
		var off = formdiv.offset();
		var h = formdiv.height();
		var w = formdiv.width();
		
		formdiv.css('position', 'relative');
		formdiv.css('top','0px');
		formdiv.css('left','0px');
		//$('#'+divID+" .autoForm-title-col").hide();
		var title = $('#'+divID+" .autoForm-title").html();
		formdiv.dialog({ 
			dialogClass: 'waf-widget-panel autoForm-panel '+formdiv.attr('class'),
			title: title,
			position: [off.left, off.top],
			width: w,
			resize: function(event, ui)	
			{
				var offsettop = $(this).position().top;
				var filler = $(this).find('.autoForm-filler').not('.included tr');
				filler.hide();
				var h = $(this).find('table').height() + offsettop;
				if (h < ui.size.height)
				{
					filler.height(ui.size.height - h);
					filler.show();
				}
			}
		});
		formdiv.css('width','auto');
		formdiv.css('height','auto');
	}
}


/* Managing events on autoForms
$('[data-type=autoForm]')
	.delegate('.waf-button', 'click', function(event) {
        // Get the AF id
		var id = $(this).closest('[data-type=autoForm]').attr('id');
		// Does it have a dataSource ?
		if(!(WAF.forms[id] && WAF.forms[id].source)) return false;
		// Yes, do the appropriate action
                if (WAF.AF[$(this).attr('data-action')]) {
                    WAF.AF[$(this).attr('data-action')](id);
                }
	});

$('[data-type=queryForm]')
	.delegate('.waf-button', 'click', function(event) {
		// Get the AF id
		var id = $(this).closest('[data-type=queryForm]').attr('id');
		// Does it have a dataSource ?
		if(!(WAF.forms[id] && WAF.forms[id].source)) return false;
		// Yes, do the appropriate action
		WAF.AF[$(this).attr('data-action')](id);
	});
*/


$('body').delegate('.waf-form-att-label-rel.waf-expandable', 'click', function(event)
{
	var attNo = $(this).attr('data-att-id');
	var formID = $(this).attr('data-form-id');
	if (attNo != null && formID != null)
	{
		attNo = parseInt(attNo);
	}
	
	var form = waf.forms[formID];
	if (form != null)
	{
		WAF.AF.expandCollapseAtt(formID, attNo);
	}
	
	
});

/**
 * WAF AutoForm widget (wrapper)
 *
 * @namespace WAF.widget
 * @class AutoForm
 * @param {object} config configuration of the widget
 */
/*WAF.widget.AutoForm = function (config, parent) {
    var result = null,
    source = WAF.source[config['data-binding']],
    nameList = [],
    attrList = [],
    tagClass = config['class'],
	errorDiv = config['data-error-div'],
	mustDisplayError = config['data-display-error'],
    theme = parent.attributes[2].options,
	divID = config['id'],
    t,
	options = {},
    elt = document.getElementById(divID);          

    for(t in theme) {
        $('#' + divID).removeClass(theme[t]);
    }

	if (mustDisplayError == null)
		mustDisplayError = true;
	else
		mustDisplayError = (mustDisplayError == '1' || mustDisplayError == 'true');
	
	options.mustDisplayError = mustDisplayError;
	options.errorDiv = errorDiv;
	
	if (config["data-withoutTable"] === "true")
       options.withoutTable = true;
	   
	if (config["data-resize-each-widget"] === "true")
       options.allowResizeInput = true;

    // Setting the theme
    if (config['data-theme']) {
        $('#' + divID).addClass(config['data-theme']);
    }

    if (source != null) {
        var attlist = [];

        // Getting the names list
        if(config['data-column-name']) {
            nameList = config['data-column-name'].split(',')
        }

        // Getting the attributes list
        if(config['data-column-attribute']) {
            attrList = config['data-column-attribute'].split(',')
        }

        if (config['data-columns'] != null && config['data-columns'] != '' && !config['data-column-name'] ) {
            attrList = config['data-columns'].split(',');
            nameList = config['data-columns'].split(',');
        }
        if (config.isQueryForm)
			result = WAF.AF.buildQueryForm(divID, source, attrList, nameList, options );
		else
			result = WAF.AF.buildForm(divID, source, attrList, nameList, options );
    }
	else
	{
		$('<div class="waf-autoForm-missingBinding">Datasource is either missing <br>or <br>invalid</div>').appendTo($('#' + divID));
	}
    return result;
}*/

/*
 * AUTOFORM USING WIDGET'S PROVIDE
 */
WAF.Widget.provide(
    'AutoForm',    
    {
    },
    function WAFWidget(config, data, shared) {
        var
        source,
        nameList,
        attrList,
        errorDiv,
        mustDisplayError,
        divID,
        options,
        htmlObject;
        
        htmlObject          = $(this.containerNode);
        source              = WAF.source[config['data-binding']];
        nameList            = [];
        attrList            = [];
        errorDiv            = config['data-error-div'];
        mustDisplayError    = config['data-display-error'];
        divID               = config['id'];
        options             = {};

        if (mustDisplayError == null) {
            mustDisplayError = true;
        } else {
            mustDisplayError = (mustDisplayError == '1' || mustDisplayError == 'true');
        }
        
        options.mustDisplayError = mustDisplayError;
        options.errorDiv = errorDiv;

        /*
         * Display autormform with widgets
         */ 
        if (data['withoutTable'] === "true"){
            options.withoutTable = true;
        }

        if (data['resize-each-widget'] === "true"){
            options.allowResizeInput = true;
        }

        if (source != null) {
            /*
             * Getting the names list
             */
            if(data['column-name']) {
                nameList = data['column-name'].split(',')
            }

            /*
             * Getting the attributes list
             */
            if(data['column-attribute']) {
                attrList = data['column-attribute'].split(',')
            }

            if (data['columns'] != null && data['columns'] != '' && !data['column-name'] ) {
                attrList = data['columns'].split(',');
                nameList = data['columns'].split(',');
            }            
            
            /*
             * Call autoform build method
             */
            this.oldAF = WAF.AF.buildForm(divID, source, attrList, nameList, options );
            
            this.oldAF.afterResize  = WAF.AF.afterResize;   
            
            /*
             * Allow to resize subelements
             */
            if (this.oldAF.installResizeOnSubWidgets != null) {
                this.oldAF.installResizeOnSubWidgets();
            }
            
            /*
             * DEPRECATED AFTER REFACTORING
             */
            WAF.widgets[this.id] = this;
        /*
         * Display a message to indicate that the widget is not binded
         */
        } else {
            $('<div class="waf-autoForm-missingBinding">Datasource is either missing <br>or <br>invalid</div>').appendTo(htmlObject);
        }
        
        if (data.draggable == 'true') {
            htmlObject.children('.waf-widget-header,.waf-widget-footer').css('cursor', 'pointer');
        }
    }, {       
        /*
         * Resize method called during resize
         * @method onResize
         */
        onResize : function autoform_resize() {  
            var
            width,
            height,
            newHeight,
            htmlObject;
            
            /*
             * Resize autoform body
             */
            htmlObject  = $(this.containerNode);
            width       = htmlObject.width();
            height      = htmlObject.height();
            newHeight   = height - parseInt(htmlObject.children('.waf-widget-footer').css('height'));
            newHeight  -= parseInt(htmlObject.children('.waf-widget-header:first').css('height'));
            
            htmlObject.children('.waf-widget-body:first').css('width', width);
            htmlObject.children('.waf-widget-body:not(:first)').css('width', '100%');
            
            htmlObject.children('.waf-widget-body:first').css('height',  newHeight + 'px');
                    
            
            this.oldAF.afterResize();
        },
        
        /*
         * Resize method called on stop resize
         * @method onResize
         */
        stopResize : function autoform_stop_resize() {   
        }   
        
    }
);