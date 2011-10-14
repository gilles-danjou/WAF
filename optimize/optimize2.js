

function optimize(request, response) {
	
    var 
        url,
        queryValues,
        fileNames,
        output,
        contentType,
        referer,
        mustskipfirst,
        path,
        pattern,
        wafPath,
        serverPath,
        webFolderPath,
        refererPath,
        maxModifDate,
        nbFiles,
        i,
        fileName,
        fullFilename;
        
    url = request.url;
	queryValues = getURLQuery(url);
	fileNames = queryValues.files;
	output = "";
	contentType = null;
    
	//console.log(JSON.stringify(queryValues));
    referer = queryValues.referer; //request.headers.REFERER;
	referer = referer.split('\\').join('/');
	//console.log("referer: "+referer)
	mustskipfirst = false;
	if (referer.toLowerCase().indexOf("http://") === 0) {
		mustskipfirst = true;
		referer = referer.slice(7);
	}
    path = getURLPath(referer);
	if (mustskipfirst) {
		path = path.slice(1);
    }
	pattern = application.pattern;
	if (path.length > 0 && pattern != null) {
		if (path[0].toLowerCase() === pattern.toLowerCase()) {
			path = path.slice(1);
        }
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
	
	
	wafPath = getWalibFolder().path + "WAF";
	serverPath = getWalibFolder().parent.path;
	webFolderPath = webAppService.getDocumentRootFolder().path;
    refererPath = webFolderPath;
	if (path.length > 0) {
		refererPath += path.join("/") + "/";
	}
	
	/*
	console.log("referer : "+refererPath)
	saveText("referer : "+refererPath,"f:/req.txt");
	*/
	
    maxModifDate = new Date(1990, 1 ,1);
	
	if (fileNames != null) {
		fileNames = fileNames.split(",");
        for (i = 0, nbFiles = fileNames.length; i < nbFiles; i++ ) {
            fileName = fileNames[i];
			fullFileName;
			if (fileName[0]== '+') {
				fullFileName = wafPath+fileName.slice(1);
            } else if (/^\/walib/i.test(fileName)) {
				fullFileName = serverPath+fileName;
			} else if (fileName[0]== '/') {
				fullFileName = webFolderPath+fileName.slice(1);
			} else {
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
		response.body = output;
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
