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
    'Image',   
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
        xsrc,
        txtHtml,
        txtHmlImg,
        htmlImg,
        htmlObject,
        sourceAtt;

        that        = this;
        htmlObject  = $(this.containerNode);        
        xsrc        = data.src;
        sourceAtt   = this.sourceAtt;
        
        if (xsrc == null || xsrc == "") {
            xsrc = "waLib/WAF/widget/css/images/emptyImage.png";
        }
        
        txtHmlImg = '<img src="' + xsrc + '" />';
        
        /*
         * IMAGE NAVIGATION
         */
        if (data.link) {
            txtHtml = '<a href="' + data.link + '" target="' + data.target + '">' + txtHmlImg + '</a>';
            htmlObject.removeAttr('data-link');
        } else {
            txtHtml = txtHmlImg;
        }
        
        htmlObject.html(txtHtml);
        
        htmlImg = htmlObject.find('img');
        
        /*
         * For binded image
         */
        if (sourceAtt) {
            sourceAtt.addListener(function(e) { 
                var
                url;
                
                url = e.data.widget.getFormattedValue();
                
                if (url == null || url == "") {
                    url = "waLib/WAF/widget/css/images/emptyImage.png";
                }
                
                htmlImg.attr('src', url);
            },{
                listenerID      : config.id,
                listenerType    : 'image',
                subID           : config.subID ? config.subID : null
            }, {
                widget:this
            });
            
            /*
             * Useful when matrix is resized
             */
            if (this.source.getPosition() != -1) {
                this.source.getElement(this.source.getPosition(), {
                    onSuccess:function(e) {
                        //console.log(e.element[sourceAtt])
                         htmlImg.attr('src', sourceAtt.getValue().__deferred.uri)
                    }
                })
            }
        }
                
        that.refresh();
    },{
        refresh : function image_refresh () {
            var
            imgWidth,
            imgHeight,
            padding,
            alignType,
            thisHeight,
            thisWidth,
            htmlImg,
            htmlObject;
            
            htmlObject  = $(this.containerNode);
            htmlImg     = htmlObject.find('img');
            
            /*
             * Resize image
             */
            switch (this.config['data-fit']) {
                case '0':
                    htmlImg.width('100%').height('100%');
                    break;

                case '1':
                    htmlImg.width('100%');
                    break;

                case '2':
                    htmlImg.height('100%');
                    break;

                case '4':
                    thisHeight  = parseInt(htmlObject.css('height'));
                    thisWidth   = parseInt(htmlObject.css('width'));

                    htmlImg.css({
                        'max-width'     : thisWidth + 'px',
                        'max-height'    : thisHeight + 'px'
                    });
                    
                    htmlObject.attr('align', 'center');
                    
                    htmlObject.css({
                        'line-height' : htmlObject.css('height')
                    });
                    
                    htmlImg.css({
                        'vertical-align'    : 'middle',
                        'display'           : 'inline-block'
                    });       

                    break;

                case '3':
                default :
                    htmlImg.load(function() {
                        var
                        htmlImg;
                        
                        htmlImg = $(this);
                        
                        htmlObject.css({
                            width   : htmlImg.width() + 'px',
                            height  : htmlImg.height() + 'px'
                        });
                    });
                    break;
            }  
        }
    }
);