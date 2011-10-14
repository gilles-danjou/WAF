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
function optimize( request, response)
{
	var url = request.url;
	var queryValues = getURLQuery(url);
	var fileNames = queryValues.files;
	var output = "";
	var contentType = null;
	
	//console.log(JSON.stringify(queryValues));
	var referer = queryValues.referer; //request.headers.REFERER;
	referer = referer.split('\\').join('/');
	//console.log("referer: "+referer)
	var mustskipfirst = false;
	if (referer.toLowerCase().indexOf("http://") == 0)
	{
		mustskipfirst = true;
		referer = referer.slice(7);
	}
	var path = getURLPath(referer);
	if (mustskipfirst)
		path = path.slice(1);
	var pattern = application.pattern;
	if (path.length > 0 && pattern != null)
	{
		if (path[0].toLowerCase() == pattern.toLowerCase())
			path = path.slice(1);
	}
	path.pop(); // removes the page.html in folder1/folder2/page.html
	
	//trace("pattern :"+pattern+"\n")
	
	
	/*
	var reqH = request.headers;
	var resH = {a:1, b:2};
	
	for (var e in reqH)
	{
		resH[e] = reqH[e];
	}
	*/
	
	/*
	var resH = { referer : referer, url:url, pattern:pattern}
	var sReq = JSON.stringify(resH);
	saveText(sReq,"f:/req.json");
	*/
	
	
	var wafPath = getWalibFolder().path+"WAF";
	var serverPath = getWalibFolder().parent.path;
	var webFolderPath = webAppService.getDocumentRootFolder().path;
	var refererPath = webFolderPath;
	if (path.length > 0)
	{
		refererPath += path.join("/")+"/";
	}
	
	/*
	console.log("referer : "+refererPath)
	saveText("referer : "+refererPath,"f:/req.txt");
	*/
	
	var maxModifDate = new Date(1990, 1 ,1);
	
	if (fileNames != null)
	{
		fileNames = fileNames.split(",");
		var nbFiles = fileNames.length;
		for (var i = 0; i < nbFiles; i++ )
		{
			var fileName = fileNames[i];
			var fullFileName;
			if (fileName[0]== '+')
				fullFileName = wafPath+fileName.slice(1);
			else if (/^\/walib/i.test(fileName))
			{
				if (serverPath[serverPath.length-1] == '/' && fileName[0]== '/') {
                                    fullFileName = serverPath+fileName.slice(1);
                                } else {
                                    fullFileName = serverPath+fileName;
                                }
			}
			else if (fileName[0]== '/')
			{
				fullFileName = webFolderPath+fileName.slice(1);
			}
			else
			{
				fullFileName = refererPath+fileName;
			}
			//console.log(fullFileName)
			//trace(fullFileName+"\n")
			var text = "";
			try
			{
				text = loadText(fullFileName);
			}
			catch (err)
			{
				text = loadText(fullFileName, 1018);
			}
			if (text != null)
			{
				var file = File(fullFileName);
				var fileDate = file.modificationDate;
				if (fileDate > maxModifDate)
					maxModifDate = fileDate;
				if (contentType == null)
				{
					var ext = file.extension.toUpperCase();
					if (ext == 'CSS')
						contentType = 'text/css; charset=UTF-8';
					if (ext == 'JS')
					{
						contentType = 'application/javascript';
					}
				}
				output += "/*"+fullFileName+'*/'+"\n\n"+text + "\n";
				//console.log("OK   "+fullFileName);
			}
			else
			{
				//console.log("BAD BAD   "+fullFileName);
				//trace("BAD BAD   "+fullFileName+"\n");
			}
		}
	}
	
	var needSend = true;
	var modifSince = request.headers["If-Modified-Since"];
	if (modifSince != null && modifSince != "")
	{
		var modifSinceDate = new Date(modifSince);
		if (maxModifDate < modifSinceDate)
		{
			needSend = false;
		}
		else
		{
			if (!(maxModifDate > modifSinceDate)) // en javascript on ne peut pas avoir l'egalite des dates directement 
			{
				needSend = false;
			}
		}
		var sReq = "maxModifDate : "+maxModifDate.toUTCString()+"  ,  modifSinceDate : "+modifSinceDate.toUTCString()+"  ,  needSend : "+needSend;
		//trace(contentType + " --> "+sReq+"\n")
		//saveText(sReq,"f:/req.text");

	}
	
	if (needSend)
	{
                if (queryValues.componentid) {
                    response.body = output.replace(/{id}/g, queryValues.componentid);
                } else {
                    response.body = output;
                }            		
		if (contentType != null)
		{
			response.headers["Content-Type"] = contentType;
		}
		response.headers["Last-Modified"] = maxModifDate.toUTCString();
		var expireDate = new Date();
		expireDate.setFullYear(expireDate.getFullYear()+1);
		response.headers["Expires"] = expireDate.toUTCString();
		response.headers["Pragma"] = "";
		response.allowCompression(1024, 50000000); // 50 mega max for compression
		response.statusCode = 200;
	}
	else
	{
		if (contentType != null)
		{
			response.headers["Content-Type"] = contentType;
		}
		response.statusCode = 304;
		response.body = "";
		response.headers["Pragma"] = "";
		var expireDate = new Date();
		expireDate.setFullYear(expireDate.getFullYear()+1);
		response.headers["Expires"] = ""; //expireDate.toUTCString();
	}
}
