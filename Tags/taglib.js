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
/**
 * Core Element of WAF Framework
 *
 * @author			erwan carriou
 * @date			march 2010
 * @version			0.9
 *
 * @note 
 */


// DATASOURCE
WAF.addWidget({
    type       : 'dataSource',
    lib        : 'WAF',
    description: 'Source',
    category   : 'Data Source',
    img        : '../icons/dataSource.png',
    tag        : 'meta',
    attributes : [
    {
        name       : 'data-source',
        description: 'Source',
        category   : 'General'
    },
    {
        name        : 'data-source-type',
        description : 'Kind of source',
        tooltip     : 'array, object, scalar, dataClass',
        defaultValue: 'dataClass',
        visibility  : 'hidden',
        type        : 'dropdown',
        options     : ['array', 'object', 'scalar', 'dataClass'],
        category    : 'General'
    },
    {
        name	    : 'data-dataType',
        description : 'Variable Type',
        defaultValue: 'string',
        type        : 'dropdown',
        options     : ['string', 'number', 'boolean','object'],
        tooltip     : 'if source kind is scalar, then is used :  number, string, date, ...',
        category   : 'General'
    },
    {
        name	   : 'data-attributes',
        description: 'Attributes',
        visibility : 'hidden',
        tooltip    : 'property1:type1, property2:type2, ....  par ex  name:string,salary:number',
        category   : 'General'
    },
    {
        name        : 'data-autoLoad',
        defaultValue: 'true',
        type        : 'checkbox',
        description : 'Initial Query'
    },
    {
        name        : 'data-initialQueryString',
        defaultValue: '',
        description : 'Initial Query String'
    },
    {
        name        : 'data-initialOrderBy',
        defaultValue: '',
        description : 'Initial Order By'
    },
    {
        name        : 'name',
        defaultValue: 'WAF.config.datasources',
        visibility  : 'hidden'
    },
    {
        name        : 'content',
        defaultValue: '',
        visibility  : 'hidden'
    }
    ],
    events: [
    {
        name       : 'attributeChange',
        description: 'On Change',
        category   : 'Datasource Events'
    },
    {
        name       : 'onBeforeCurrentElementChange',
        description: 'On Before Current Element Change',
        category   : 'Datasource Events'
    },
    {
        name       : 'onCurrentElementChange',
        description: 'On Current Element Change',
        category   : 'Datasource Events'
    },
    {
        name       : 'onElementSaved',
        description: 'On Element Saved',
        category   : 'Datasource Events'
    },
    {
        name       : 'onCollectionChange',
        description: 'On Collection Change',
        category   : 'Datasource Events'
    }
    ],
    onInit   : function (config) {                        
        config['binding'] = config['data-source'];
        if (config['data-autoLoad'] === null) {
            config['data-autoLoad'] = 'true';
        }
        return WAF.dataSource.create(config);
    },
    onDesign : function (config, designer, tag, catalog, isResize) {}
});


// DOCUMENT
WAF.addWidget({
    type        : 'document',
    lib         : 'WAF',
    description : 'Document',
    category    : 'Hidden',
    img         : '../icons/document.png',
    tag         : 'div',
    attributes  : [
    {
        name       : 'id',
        visibility : 'hidden'
    },
    {
        name       : 'data-title',
        description: 'Title'
    },
    {
        name        : 'data-platform',
        description : 'Target',
        category    : 'Platform',
        type        : 'dropdown',
        options     : [
        {
            key: 'desktop', 
            value: 'Desktop'
        },
        {
            key: 'auto', 
            value: 'Auto'
        },
        {
            key: 'smartphone', 
            value: 'Smartphone'
        },
        {
            key: 'tablet', 
            value: 'Tablet'
        }
        ],
        defaultValue: 'desktop'
    },
    {
        name        : 'data-rpc-activate',
        defaultValue: 'false',
        type        : 'checkbox',
        visibility  : 'hidden',
        description : 'Activate'
    },
    {
        name        : 'data-rpc-namespace',
        defaultValue: 'rpc',
        visibility  : 'hidden',
        description : 'Namespace'
    },
    {
        name        : 'data-rpc-validation',
        defaultValue: 'false',
        type        : 'checkbox',
        visibility  : 'hidden',
        description : 'Validation'
    },
    {
        name       : 'class',
        description: 'Css class'
    }
    ],
    events      : [
    {
        name       : 'onLoad',
        description: 'On Load',
        category   : 'UI Events'
    }],
    style       : [
    {
        name        : 'z-index',
        defaultValue: '0'
    },
    {
        name        : 'width',
        defaultValue: '0px'
    },
    {
        name        : 'height',
        defaultValue: '0px'
    }],
    properties: {
        style: {
            theme       : {
                'orange'    : false,
                'blue'      : false,
                'inherited' : false,
                'roundy'    : false
            },
            fClass      : true,
            text        : false,
            background  : true,
            border      : false,
            sizePosition: false,
            label       : false
        }
    },
    onInit   : function (config) {
        var
        i;
        
        // Hide displayed submenus
        $(document).bind('click', function(){
            $('.waf-menuItem .waf-menuBar').fadeOut(200); 
            $('.waf-menuItem').removeClass('waf-state-active');
        });
        
        for (i in WAF.widget.themes) {
            $('body').removeClass(WAF.widget.themes[i].key);
        }    
        
    },
    onDesign : function (config, designer, tag, catalog, isResize) {}
});
    
    
// HTML TAG        
WAF.addWidget({
    type        : 'htmlTag',
    lib         : 'html',
    description : 'tag html',
    category    : 'Hidden',
    img         : '../icons/htmlTag.png',
    tag         : '',
    attributes  : [],
    events      : [],
    style       : [
    {
        name        : 'z-index',
        defaultValue: '0'
    },
    {
        name        : 'background-color',
        defaultValue: '#FFFFFF'
    },
    {
        name        : 'width',
        defaultValue: '0px'
    },
    {
        name        : 'height',
        defaultValue: '0px'
    }],
    properties: {
        style: {
            theme       : false,
            fClass      : false,
            text        : false,
            background  : false,
            border      : false,
            sizePosition: false,
            label       : false
        }
    },
    onInit   : function (config) {},
    onDesign : function (config, designer, tag, catalog, isResize) {}
});
