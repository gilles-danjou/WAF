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
WAF.ErrorManager = {
	
	defaultErrorDiv: null,
	dialogAlreadyOpened: false
		
};


WAF.ErrorManager.displayError = function(event, div)
{
	function handleOneError(err)
	{
		if (err.message != null)
		{
			html += '<tr class="waf-error-div-table-row">';
			
			html += '<td class="waf-error-div-table-message">';
			html += err.message;
			html += '</td>';
			
			html += '<td class="waf-error-div-table-errnum">';
			if (err.errCode != null)
				html += err.errCode;
			html += '</td>';
			
			html += '<td class="waf-error-div-table-component">';
			if (err.componentSignature != null)
				html += err.componentSignature;
			html += '</td>';
			
			html += '</tr>';
		}
	}
	
	var isInDialog = false;
	var html = "";
	if (div == null)
	{
		div = this.getDefaultErrorDiv();
		isInDialog = true;
	}
	
	var error = event.error;
	if (error == null)
	{
		div.html("");
		if (isInDialog)
		{
			div.dialog("close");
		}
	}
	else
	{
		div.addClass("waf-error-div");
		div.addClass("waf-widget");
		html += '<div class="waf-error-div-body waf-widget-body">';
		
		if (event.message != null)
		{
			html += '<div class="waf-error-div-message-outside">';
			html += '<div class="waf-error-div-message-inside">';
			html += event.message;
			html += '</div>';
			html += '</div>';
		}
		
		html += '<table class="waf-error-div-table">';
		html += '<tbody class="waf-error-div-table-body">';
		if (error.length == null)
			error = [error];
		error.forEach(handleOneError);
		html += '</tbody>';
		html += '</table>';
		
		html += '</div>';
		div.html(html);
		if (isInDialog)
		{
			if (!this.dialogAlreadyOpened)
			{
				this.dialogAlreadyOpened = true;
				div.dialog();
				var dataTheme = $("body").attr("data-theme");
				if (dataTheme != null)
				{
					div.dialog("widget").addClass(dataTheme);
					div.addClass(dataTheme);
				}
			}
			else
				div.dialog("open");
		}
	}
}


WAF.ErrorManager.getDefaultErrorDiv = function()
{
	if (this.defaultErrorDiv == null)
	{
		this.defaultErrorDiv = $('<div class="waf-error-div waf-widget"></div>').appendTo($('body'));
		//this.defaultErrorDiv.dialog("option", "autoOpen", false);
	}
	return this.defaultErrorDiv;
}
