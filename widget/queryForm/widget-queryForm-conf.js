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
    type       : 'queryForm',
    lib        : 'WAF',
    description: 'Query Form',
    category   : 'Controls',
    img        : '/walib/WAF/widget/queryForm/icons/widget-queryForm.png',
    tag        : 'div',
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
        name	    : 'data-withoper',
        description : 'Show Operators',
        type        : 'checkbox'
    },
    {
        name       : 'class',
        description: 'Css class'
    },{
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
        name        : 'data-column-attribute',
        description : 'Column attribute'
    },
    {
        name        : 'data-column-name',
        description : 'Column name'
    }],
    style      : [
    {
        name        : 'width',
        defaultValue: '250px'
    },
    {
        name        : 'height',
        defaultValue: '150px'
    }],
    events: [
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
        
    }
    ],
    properties: {
        style: {
            theme       : true,
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            shadow      : true,
            label       : false,
            disabled    : ['border-radius']
        }
    },
    onInit: function (config) {
        new WAF.widget.QueryForm(config);
    },
    onDesign: function (config, designer, tag, catalog, isResize) {
        var attrList = [],
        nameList = [],
        elt = document.getElementById(tag.getAttribute('id').getValue());

        // elt.setAttribute('class', '');
        elt.setAttribute('class', 'waf-widget waf-autoForm ');

        // Setting the theme
        if (tag.getTheme()) {
            $('#' + tag.getAttribute('id').getValue()).addClass(tag.getTheme());
        }

        if (tag.getAttribute('class')) {
            $('#' + tag.getAttribute('id').getValue()).addClass(tag.getAttribute('class').getValue().replace(',', ' '));
        }

        if(!isResize){
            // Refresh the datasource grid
            //Designer.ui.gridDatasource.initRows()

            // Getting the names list
            if(tag.getAttribute('data-column-name') && tag.getAttribute('data-column-name').getValue() != '') {
                nameList = tag.getAttribute('data-column-name').getValue().split(',');
            }

            // Getting the attributes list
            if(tag.getAttribute('data-column-attribute') && tag.getAttribute('data-column-attribute').getValue() != '') {
                attrList = tag.getAttribute('data-column-attribute').getValue().split(',');
            }
            if (tag.getAttribute('data-columns') && tag.getAttribute('data-columns').getValue() != '' && !tag.getAttribute('data-column-name')) {
                attrList = tag.getAttribute('data-columns').getValue().split(',');
                nameList = tag.getAttribute('data-columns').getValue().split(',');
            }

            // Adding data-type to overlay
            //document.getElementById(tag.overlay.id).setAttribute('data-type', tag.attributes['data-type']);

            tag.resize.on('endResize', function(evt) {
                setTimeout('Designer.env.tag.current.onDesign(true)', 100);
            });

            WAF.AF.buildQueryForm(tag.getAttribute('id').getValue(), null, attrList, nameList, null, catalog, tag);
            
            // message if not binding
            if (nameList.length === 0) {
                if ($('#' + tag.overlay.id + ' .message-binding-queryform').length == 0) {
                    $('<div class="message-binding-queryform">Drop a datasource<br> here</div>').appendTo($('#' + tag.overlay.id));
                }
            } else {
                $(tag.overlay.element).find('.message-binding-queryform').each(function(i) {
                    $(this).remove();
                });
            }
        } else {
            $(elt).find('tbody').css({
                width: $(elt).width() + 'px',
                height: $(elt).height() - $(elt).find('thead').height() - $(elt).find('tfoot').height() + 'px'
            });
        }
    }
});
