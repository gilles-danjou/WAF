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
    type       : 'image',
    lib        : 'WAF',
    description: 'Image',
    category   : 'Image',
    img        : '/walib/WAF/widget/image/icons/widget-image.png',
    attributes : [
    {
        name       : 'data-binding',
        description: 'Source'
    },
    {
        name       : 'class',
        description: 'Css class'
    },
    {
        name       : 'data-src',
        description: 'Src',
        type       : 'file',
        accept     : 'image/*'
    },
    {
        name        : 'data-link',
        description : 'Link'
    },
    {
        name        : 'data-target',
        description : 'Target',
        type        : 'dropdown',
        options     : ['_blank', '_self'],
        defaultValue: '_blank'
    },
    {
        name       : 'data-label',
        description: 'Label',
        defaultValue: ''
    },
    {
        name        : 'data-label-position',
        description : 'Label position',
        defaultValue: 'left'
    },
    {
        name        : 'data-fit',
        description : 'Fit',
        type        : 'dropdown',
        options     : [{
            key : '0',
            value : 'to container'
        },{
            key : '4',
            value : 'to container (proportionately)'
        },{
            key : '1',
            value : 'to width'
        },{
            key : '2',
            value : 'to height'
        },{
            key : '3',
            value : 'container to image'
        }],
        defaultValue: '0'
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
        name       : 'mousemove',
        description: 'On Mouse Move',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseout',
        description: 'On Mouse Out',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseover',
        description: 'On Mouse Over',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseup',
        description: 'On Mouse Up',
        category   : 'Mouse Events'
    }],
    style: [
    {
        name        : 'width',
        defaultValue: '85px'
    },
    {
        name        : 'height',
        defaultValue: '80px'
    }],
    properties: {
        style: {
            theme       : false,
            fClass      : true,
            text        : false,
            background  : true,
            border      : true,
            sizePosition: true,
            label       : true,
            shadow      : true,
            disabled    : ['border-radius']
        }
    },
    onInit: function (config) {
        var image = new WAF.widget.Image(config);
        return image;
    },
    onDesign: function (config, designer, tag, catalog, isResize) {

        var 
        htmlObject,
        canvasId = "canvas" + tag.getId(),
        width = tag.getWidth(),
        height = tag.getHeight(),
        thisWidth = '',
        thisHeight = '',
        path = '',
        url = '',
        img = {},
        myFile = {},
        cnt = {},
        canBeDisplay = false;

        path = Designer.env.project.path;

        if (tag.getAttribute('data-src').getValue()) {
            path = Designer.util.cleanPath(tag.getAttribute('data-src').getValue().replace('/', ''));
            url = path.fullPath;
        }

        if (typeof(studio) != 'undefined' && url) {
            myFile = studio.File(url);
        }
        
        htmlObject = tag.getHtmlObject();

        //url = 'http://kpitalrisk.free.fr/images/stars/17000/s_toto1.jpg'
        //myFile.exists = true;
        
        // Display binding image
        if (!url || !myFile.exists) {
            $('#' + tag.getId()).html(' <canvas class="' + canvasId + '" width="' + width + 'px" height="' + height + 'px"></canvas>');
            var canvas = $('.' + canvasId)[0];

            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "rgb(200,0,0)";
            ctx.fillRect(0, 0, width / 2, height / 2);
            ctx.fillStyle = "rgba(0, 50, 200, 0.5)";
            ctx.fillRect(width / 2 - width / 6, height / 2 - height / 6, width / 2 + width / 6, height / 2 + height / 6);
        } else { // Display the real img if src is filling
            document.getElementById(tag.getAttribute('id').getValue()).innerHTML = '<img src="' + url + '" class="' + canvasId + '" />';

            img = $('.' + canvasId)[0];

            canBeDisplay = true;
        
            htmlObject.attr('align', 'left');
            htmlObject.css('padding-top', '0px');
            
            if (canBeDisplay) {
                // Dynamic resizing of the image and his overlay
                switch (tag.getAttribute('data-fit').getValue()) {
                    case '0':
                        thisWidth = tag.tmpWidth = tag.style.width;
                        thisHeight = tag.tmpHeight = tag.style.height;
                        
                        $(img).width('100%').height('100%');

                        tag.setWidth(thisWidth, false);
                        tag.setHeight(thisHeight, false);
                        break;

                    case '1':
                        thisWidth = tag.tmpWidth = tag.style.width;
                        $(img).width('100%');
                        tag.setWidth(thisWidth, false);
                        break;

                    case '2':
                        thisHeight = tag.tmpHeight = tag.style.height;
                        $(img).height('100%');
                        tag.setHeight(thisHeight, false);
                        break;

                    case '3':
                        thisHeight = parseInt(tag.style.height);
                        thisWidth = parseInt(tag.style.width);                    

                        tag._tagImg = img;
                        
                        img.onload = function() {
                            if (img.width !== 0) {
                                thisWidth = img.width;
                            }
                            if (img.height !== 0) {
                                thisHeight = img.height;
                            }
                            
                            thisWidth += parseInt(tag.getComputedStyle('borderLeftWidth')) + parseInt(tag.getComputedStyle('borderRightWidth'));
                            thisHeight += parseInt(tag.getComputedStyle('borderTopWidth')) +  parseInt(tag.getComputedStyle('borderBottomWidth'));
                                                     
                            $('#' + tag.getId()).parent().css('height', thisHeight + 'px');
                            
                            tag.setWidth(thisWidth, false);
                            tag.setHeight(thisHeight, false);                            
                        };
                        
                        break;

                    case '4':
                        /*
                         * Get the hightest size
                         */
                        thisHeight = parseInt(tag.style.height);
                        thisWidth = parseInt(tag.style.width);   
                        
                        img.onload = function() {                            
                            var 
                            imgWidth,
                            alignType,
                            padding,
                            imgHeight;
                            
                            if (img.width !== 0) {
                                imgWidth = img.width;
                            }
                            if (img.height !== 0) {
                                imgHeight = img.height;
                            }
                            
                            if (imgHeight < imgWidth) {
                                $(img).width('100%');
                                alignType = '1';
                                if (img.height > thisHeight) {
                                    alignType = '2';
                                    $(img).height('100%');
                                    $(img).width('auto');
                                }
                            } else {                 
                                $(img).height('100%');
                                alignType = '2';
                                if (img.width > thisWidth) {
                                    alignType = '1';
                                    $(img).width('100%');
                                    $(img).height('auto');
                                }
                            }
                            
                            imgWidth = img.width;
                            imgHeight = img.height;
                            
                            htmlObject.attr('align', 'center');
                            
                            padding = (alignType === '1') ? (thisHeight - imgHeight) / 2 : 0;
                            
                            htmlObject.css('padding-top', padding + 'px');
                        }
                        
                        break;
                }
                
                Designer.ui.form.Style.refreshPosition();

            }
        }
        tag.tmpSrc = tag.getAttribute('data-src').getValue();
    }
});
