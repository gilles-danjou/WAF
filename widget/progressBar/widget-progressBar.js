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
    'ProgressBar',   
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
        htmlObject,
        widget,
        dontdisplayempty,
        ss,
        clone,
        cloneMsg;

        that        = this;
        htmlObject  = $(this.containerNode); 
        
        widget                  = {};
        dontdisplayempty        = false;
        ss                      = data['no-empty-display'];
        
        widget                  = {};
        widget.kind             = 'progressBar';
        widget.id               = config.id;
        widget.divID            = config.id;
        widget.renderId         = config.id;
        widget.progressInfo     = data['progressinfo'];
        widget.toph             = 25;
        widget.barh             = 20;
        widget.spaceh           = 5;
        widget.nblevel          = 0;
        widget.stillWaiting     = false;
        widget.updateWithInfo   = that.updateWithInfo;
        widget.startListening	= that.startListening;
        widget.stopListening	= that.stopListening;
        widget.setProgressInfo  = that.setProgressInfo;
        widget.userBreak        = that.userBreak;
        widget.parent           = htmlObject.parent();
        widget.top              = htmlObject.css('top');

        clone                   = htmlObject.clone();
        cloneMsg                = $('[data-linked=' + widget.id + ']').clone();

        /*
         * Remove original progressBar
         */
        htmlObject.hide();
        $('[for=' + widget.id + ']').hide();

        widget.clone = {
            progress : clone,
            msg : cloneMsg
        }

        if (ss != null) {
            if (typeof(ss) == 'string') {
                dontdisplayempty = ss.toLowerCase == 'true';
            } else {
                dontdisplayempty = ss;
            }
        }

        widget.atLeastOne = !dontdisplayempty;

        widget.timerStarted = false;

        WAF.widgets[config['id']] = widget;

        if (widget.atLeastOne) {
            widget.updateWithInfo({
                SessionInfo: [{
                    fMessage    : "",
                    fValue      : 0,
                    fMax        : 100
                }]
            })
        }

    },{
        updateWithInfo  : function (config) {
            var
            i,
            widget,
            range,
            sessions,
            nblevel,
            top,
            newProgress,
            newMsg,
            session,
            message,
            reg,
            percent;
            
            config          = config || {};
            widget          = this;
            range           = {};
            sessions        = config.SessionInfo;
            nblevel         = sessions == null ? 0 : sessions.length;
            top             = 0;
            newProgress     = {};
            newMsg          = {};

            widget.nbsessions   = 0;
            widget.nbsessions   = nblevel;   

            for (i = 0; i < nblevel; i++) {
                session = sessions[i];
                message = session.fMessage;
                reg     = new RegExp("({curValue})", "g");

                percent	= Math.round((session.fValue/session.fMax)*100) + '%';

                if ($('.' + widget.id + '-progress-' + i).length === 0) {
                    newProgress = widget.clone.progress.clone();
                    newMsg = widget.clone.msg.clone();

                    newProgress.addClass(widget.id + '-progress-' + i);
                    newMsg.addClass(widget.id + '-msg-' + i);

                    widget.parent.append(newProgress);
                    widget.parent.append(newMsg);
                } else {
                    newProgress = $('.' + widget.id + '-progress-' + i);
                    newMsg = $('.' + widget.id + '-msg-' + i);

                    if (session.stop) {
                        newProgress.remove();
                        newMsg.remove();
                        return false;
                    }
                }
        
                newProgress.css('top', widget.top + 'px');

                if (newMsg.offset()) {
                    newMsg.css('top', widget.top + top + 'px');
                }

                range = newProgress.children('.waf-progressBar-range');

                widget.stillWaiting = false;

                message = message.replace(reg, '<b>'+WAF.utils.formatNumber(session.fValue, {
                    format:"###,###,###,###,###"
                })+'</b>');

                reg = new RegExp("({maxValue})", "g");
                message = message.replace(reg, WAF.utils.formatNumber(session.fMax, {
                    format:"###,###,###,###,###"
                }));

                // get linked label and change the description
                newMsg.html(message);

                if (range.length === 0) {
                    // add range div
                    var height	= newProgress.height();
                    range = $('<div class="waf-progressBar-range" style="line-height: ' + height + 'px;-webkit-background-size: ' + height + 'px ' + height + 'px;-moz-background-size: ' + height + 'px ' + height + 'px; -webkit-animation: waf-progressBar-animation 10s linear infinite;"><span>' + percent + '</span></div>')
                    .appendTo(newProgress);
                }


                range.css({
                    'width' : percent
                })
                .children('span').html(percent);


                top += widget.toph;
                top += widget.barh+widget.spaceh;
            }
        },
        startListening  : function (interval) {
            var 
            widget;
            
            widget = this;
            
            if (interval == null) {
                interval = 1000;
            }
            if (!widget.timerStarted) {
                widget.stillWaiting = true;
            }
            widget.timeOutId = setInterval(function() {
                var
                xhr;
                
                if (!widget.requestStarted) {
                    xhr = new XMLHttpRequest();

                    xhr.onreadystatechange = function() {
                        var
                        rep,
                        pinfo;
                        
                        if (xhr.readyState  == 4) {
                            widget.nbsessions = 0;
                            rep = xhr.responseText;

                            if (rep != null) {
                                pinfo = JSON.parse(rep);
                                
                                if (pinfo.ProgressInfo != null) {
                                    widget.updateWithInfo(pinfo.ProgressInfo[0]);
                                }
                                
                                widget.requestStarted = false;
                            }
                        }
                    };

                    widget.requestStarted = true;
                    xhr.open("GET", "rest/$info/progressinfo/" + widget.progressInfo, true);
                    xhr.send();
                }

            }, 1000);

            widget.timerStarted = true;
            
        },
        stopListening  : function () {
            var 
            widget;
            
            widget = this;

            if (widget.timerStarted && widget.timeOutId != null) {
                clearInterval(widget.timeOutId);
                widget.timeOutId    = null;
                widget.timerStarted = false;
                widget.stillWaiting = false;

                if (widget.atLeastOne) {
                    widget.updateWithInfo({
                        SessionInfo: [{
                            fMessage: "",
                            fValue: 0,
                            fMax: 100,
                            stop: true
                        }]
                    });
                } else {
                    widget.updateWithInfo({});
                }
            }
            
        },
        setProgressInfo  : function (config) {
            var 
            widget;
            
            widget = this;
            widget.stopListening();
            widget.progressInfo = config;            
        },
        userBreak  : function () {
            var 
            widget,
            xhr;
            
            widget  = this;
            xhr     = new XMLHttpRequest();
            xhr.open("GET", "rest/$info/progressinfo/"+widget.progressInfo+'?$stop="true"', true);
            xhr.send();
        }
    }
);