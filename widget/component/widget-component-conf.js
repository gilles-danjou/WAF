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
    type        : 'component',  
    lib         : 'WAF',
    description : 'Component',
    category    : 'Web Component',         
    tag         : 'div',                               

    attributes  : [
    {
        name        : 'class',
        description : 'Css class'
    },
    {
        name         : 'data-path',        
        description  : 'Path',
        autocomplete : 'components'
    },
    {
        name        : 'data-draggable',
        description : 'Draggable',
        type        : 'checkbox'
    },
    {
        name        : 'data-resizable',
        description : 'Resizable',
        type        : 'checkbox'
    }
    ],

    style: [                                                                     
    {
        name        : 'width',
        defaultValue: '200px'
    },
    {
        name        : 'height',
        defaultValue: '200px'
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
        name       : 'mouseout',
        description: 'On Mouse Out',
        category   : 'Mouse Events'
    },
    {
        name        : 'mouseover',
        description: 'On Mouse Over',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseup',
        description: 'On Mouse Up',
        category   : 'Mouse Events'
    }],

    properties: {
        style: {
            theme       : {
                'roundy'    : false
            },
            fClass      : true,
            text        : false,
            background  : true,
            border      : true,
            sizePosition: true,
            shadow      : true,
            label       : false,
            disabled    : []
        }
    },

    onInit: function (config) {       

        if (config['data-draggable'] === "true") {
            $('#' + config.id).draggable({});
            $('#' + config.id).css('cursor', 'pointer');
        }

        if (config['data-resizable'] === "true") {
            $('#' + config.id).resizable({
                minHeight: parseInt($('#' + config.id).css('height')),
                minWidth: parseInt($('#' + config.id).css('width'))
            });
        }
        
        $('#' + config.id)
        .attr({
            'data-type': 'container',
            'class': config['class']
        });

        // Setting the theme
        if (typeof config['theme'] == 'string' && config['theme'] !== '') {
            $('#' + config.id).addClass(config['theme']);
        }

        if (!config['data-path']) {
        //console.log('WAF ERROR: missing manifest file for the Web Component ' + config.id);
        } else {        
            WAF.loadComponent({
                id   : config.id,
                path : config['data-path'],
                data : config           
            });     
        }
               
    },

    onDesign: function (config, designer, tag, catalog, isResize) {
        var name = '',
        tabName = [],
        path = '',
        css = '',
        stream = null,
        dom = '',
        html = '';
                        
        if (config['data-path']) {
                        
            // name of the component
            name = config['data-path'];
            tabName = name.split('/');
            name = tabName[tabName.length - 1].replace('.waComponent', '');
        
            if (!tag.getComponentRessource(config['data-path'])) {
                
                // style
                if (!Designer.env.isMac) {
                    path = Designer.env.pathProject + '\\' + config['data-path'] + '\\' + name + '.css';
                    path = path.replace('/','');
                } else {
                    path = Designer.env.pathProject + '' + config['data-path'] + '/' + name + '.css';
                    path = path.replace('/','');
                    path = path.replace('\\','');
                }
                
                try {                
                    stream = studio.TextStream(path, 'read');                
                    css = stream.read();
                } catch (e) {
                    console.log(e);
                }
                
                
                css = css.replace(/{id}/g, config.id);
                css = '<style>'  + css + '</style>';
        
                // dom
                if (!Designer.env.isMac) {
                    path = Designer.env.pathProject + '\\' + config['data-path'] + '\\' + name + '.html';
                    path = path.replace('/','');
                } else {
                    path = Designer.env.pathProject + '' + config['data-path'] + '/' + name + '.html';
                    path = path.replace('/','');
                    path = path.replace('\\','');
                }
                
                try {  
                    stream = studio.TextStream(path, 'read');                
                    dom = stream.read();
                } catch (e) {
                    console.log(e);
                }
                
                dom = dom.replace(/{id}/g, config.id);
                dom = dom.replace('<!DOCTYPE html >', '');
                dom = dom.replace('<meta name="generator" content="Wakanda GUIDesigner"/>', '');
        
                // html
                html = css + dom;
        
                tag.setComponentRessource(config['data-path'], html);
        
            } else {
                html = tag.getComponentRessource(config['data-path']);
            }
                                
            document.getElementById(config.id).innerHTML = html;  
                
            // generate
            WAF.tags.generate(config.id); 
        }
    }                                                               
    
});                                                                                                                                  