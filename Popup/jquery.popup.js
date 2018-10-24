(function ($) {
    (function(undefined) {
        function mustKeepFocus($popup) {
            return $popup.is(':visible') && ($popup.hasClass('fullscreen') || $popup.prev('.popup-overlay').length) && !$popup.nextAll('.popup').length; //Only when modal or fullscreen
        }
    
        $.fn.extend({
            popup: function (command, options) {
                var me = this[0]; //Only do first item in the jQuery collection
                if (typeof me == undefined) return this;
                
                var $me = $(me),
                    $tip = $me.find('.popup-tip'),
                    $body = $('body'),
                    cmd = command.toLowerCase();

                if (cmd === 'init') {
                    if (me.popupInfo) {
                        me.popupInfo = $.extend(me.popupInfo, options);
                    }
                    else {
                        me.popupInfo = $.extend({ title: null, submit: 'OK', cancel: null, submitOnEnter: false, hideOnSubmit: true, hideOnCancel: true, cancelOnEscape: false, draggable: !!$.fn.draggable }, options);
                        me.popupInfo.draggable = me.popupInfo.draggable && !!$.fn.draggable;
                        me.popupCallbacks = {};

                        $me .wrapInner('<div class="popup-body"/>')
                            .prepend('<div class="popup-header"/>')
                            .prepend('<span class="popup-close" data-command="cancel"></span>')
                            .append('<div class="popup-footer"><button class="popup-submit" data-command="submit"></button> <a href="javascript:void(0);" class="popup-cancel" data-command="cancel"></a></div>')
                            .append('<div class="popup-tip"></div>')
                            .attr('tabIndex', '-1') //Make focusable so pressing escape will be able to hide
                            .on('keydown', function(e) {
                                if (e.keyCode && !e.isDefaultPrevented()) { 
                                    if (e.keyCode === $.ui.keyCode.ESCAPE && me.popupInfo.cancelOnEscape) {
                                        e.preventDefault();
                                        $me.popup('cancel');
                                    }
                                    else if (e.keyCode === $.ui.keyCode.ENTER && me.popupInfo.submitOnEnter && e.target !== $me.find('[data-command="submit"]')[0] && e.target !== $me.find('[data-command="cancel"]')[0]) {
                                        e.preventDefault();
                                        $me.popup('submit');
                                    }
                                    else if (e.keyCode === $.ui.keyCode.TAB && mustKeepFocus($me)) { //Tab trap
                                        var $first = $me.find(':tabbable').first(),
                                            $last = $me.find(':tabbable').last();

                                        if (e.target === $last[0] && !e.shiftKey) {
                                            $first.focus();
                                            e.preventDefault();
                                        }
                                        else if (e.target === $first[0] && e.shiftKey) {
                                            $last.focus();
                                            e.preventDefault();
                                        }
                                    }
                                }
                            });
                        
                        $body.on('focusin', function(e) { //Prevent focus steal
                            if ($me[0] === e.target || $.contains($me[0], e.target))
                                me.popupInfo.lastestFocus = e.target;
                            else if (mustKeepFocus($me))
                                $(me.popupInfo.lastestFocus).focus();
                        });
                        
                        if ($.fn.draggable && me.popupInfo.draggable) {
                            $me.draggable({
                                containment: 'window', handle: '.popup-header',
                                start: function() { $me.find('.popup-tip').hide(); }
                            });
                        }

                        $me.on('click', '[data-command]', function(e) {
                            e.preventDefault();
                            $me.popup($(this).attr('data-command'));
                        });
                    }

                    $me.find('.popup-header').toggle(!!me.popupInfo.title).html(me.popupInfo.title);
                    $me.find('.popup-footer').toggle(!!me.popupInfo.submit || !!me.popupInfo.cancel);
                    $me.find('.popup-submit').toggle(!!me.popupInfo.submit).text(me.popupInfo.submit);
                    $me.find('.popup-cancel').toggle(!!me.popupInfo.cancel).text(me.popupInfo.cancel);
                }
                else if (me.popupInfo) {
                    if (cmd === 'show') {
                        $me .show() //position() does not work on a hidden element -> show it first
                            .css({ opacity: 0 })
                            .position({ my: 'center center', at: 'center center-50', of: window, collision: 'fit fit' })
                            .animate({ opacity: 1 }, 300, 'easeOutSine');
                                
                        if (options == undefined || options === true) {
                            var $overlay = $('<div class="popup-overlay"/>')
                                .on('mousedown', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    $(me.popupInfo.lastestFocus).focus();
                                });
                            
                            $me.before($overlay);
                        }
                            
                        $tip.hide();
                        $(':focus').blur();
                        $me.focus();
                        if ($.fn.draggable && me.popupInfo.draggable) { $me.draggable('enable'); }
                        
                        me.popupInfo.lastestFocus = me;
                        if (me.popupCallbacks.onshow) { me.popupCallbacks.onshow(); }
                    }
                    else if (cmd === 'showfullscreen') {
                        $me.show().css({ opacity: 0 });
                        
                        $body
                            .data('origOverflow', $body.css('overflow'))
                            .css({ overflow: 'hidden' });

                        $me .addClass('fullscreen')
                            .css({ top: '', right: '', bottom: '', left: '', width: '', height: '', opacity: 1 });
                            
                        $tip.hide();
                        $(':focus').blur();
                        $me.focus();
                        if ($.fn.draggable && me.popupInfo.draggable) { $me.draggable('disable'); }
                        
                        me.popupInfo.lastestFocus = me;
                        if (me.popupCallbacks.onshow) { me.popupCallbacks.onshow(); }
                    }
                    else if (cmd === 'showballoon' && options.position) {
                        $me .show() //position() does not work on a hidden element -> show it first
                            .css({ opacity: 0 })
                            .position(options.position)
                            .animate({ opacity: 1 }, 300, 'easeOutSine');
                        
                        if ($.fn.draggable && me.popupInfo.draggable) { $me.draggable('enable'); }

                        var bS = document.body.style;
                        if (options.tip && ('msTransform' in bS || 'WebkitTransform' in bS || 'MozTransform' in bS || 'OTransform' in bS || 'transform' in bS)) {
                            if (typeof options.tip === 'string' && options.tip.toLowerCase() in ({ top: 1, right: 1, bottom: 1, left: 1 })) {
                                $tip.show().addClass(options.tip.toLowerCase());
                            }
                            else {
                                $tip.show().css(options.tip);
                            }
                        }
                        
                        $(':focus').blur();
                        $me.focus();
                        me.popupInfo.lastestFocus = me;
                        if (me.popupCallbacks.onshow) { me.popupCallbacks.onshow(); }
                    }
                    else if (cmd === 'hide' && $me.is(':visible')) {
                        //Remove the overlay (modal popup only)
                        $me.prev('.popup-overlay').fadeOut(150, function () { $(this).remove(); });

                        //Restore body style (fullscreen popup only)
                        if ($me.hasClass('fullscreen')) {
                            $me.removeClass('fullscreen');
                            $body.css({ overflow: $body.data('origOverflow') }).removeData('origOverflow');
                        }
                        
                        $me.hide();
                        if (me.popupCallbacks.onhide) { me.popupCallbacks.onhide(); }
                    }
                    else if (cmd === 'submit') {
                        if (me.popupCallbacks.onsubmit) { me.popupCallbacks.onsubmit(); }
                        if (me.popupInfo.hideOnSubmit) { $me.popup('hide'); }
                    }
                    else if (cmd === 'cancel') {
                        if (me.popupCallbacks.oncancel) { me.popupCallbacks.oncancel(); }
                        if (me.popupInfo.hideOnCancel) { $me.popup('hide'); }
                    }
                    else if (cmd.slice(0, 2) == 'on') {
                        if (typeof options === 'function') { me.popupCallbacks[cmd] = options; }
                        else if (typeof options == undefined && me.popupCallbacks[cmd]) { me.popupCallbacks[cmd](); }
                        else if (options === null) { delete me.popupCallbacks[cmd]; }
                    }
                    else if (me.popupCallbacks['on' + cmd]) {
                        me.popupCallbacks['on' + cmd]();
                    }
                }

                return $(this[0]);
            }
        });
        
        $.say = function(title, body, submit, onSubmit) {
            $('body').append('<div id="sayPopup" class="popup">' + body + '</div>');
            var $sayPopup = $('#sayPopup').popup('init', { title: title, submit: submit || 'OK', cancelOnEscape: true });
            if (onSubmit) $sayPopup.popup('onSubmit', onSubmit);
            $sayPopup.popup('onHide', function() { $('#sayPopup').remove(); });
            $sayPopup.popup('show');
        };
        
        $.ask = function(title, body, submit, cancel, onSubmit, onCancel) {
            $('body').append('<div id="askPopup" class="popup">' + body + '</div>');
            var $askPopup = $('#askPopup').popup('init', { title: title, submit: submit || 'OK', cancel: cancel, cancelOnEscape: true, submitOnEnter: true });
            if (onSubmit) $askPopup.popup('onSubmit', onSubmit);
            if (onCancel) $askPopup.popup('onCancel', onCancel);
            $askPopup.popup('onHide', function() { $('#askPopup').remove(); });
            $askPopup.popup('show');
        };
    })();
})(window.jQuery);