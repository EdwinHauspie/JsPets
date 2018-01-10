(function ($) {
    $.fn.extend({
        jCombo: function () {
            $.each($(this), function () {
                var $old = $(this),
                    $new = $('<div class="jCombo"><div class="toggle"><span class="arrow">&#9660;</span><div class="text"/></div><div class="options"><ul/></div></div>');

                $new[0].jComboSearch = '';
                $new[0].jComboStamp = new Date().getTime();
                $new[0].enableMouseEnter = true;
                
                $new.insertAfter($old)
                    .keydown(function (e) {
                        var key = e.keyCode || e.which,
                            isOpen = $new.hasClass('open');
                            
                        if (key == 38 || key == 40) { //Up & down
                            if ($old[0].disabled) return;
                                
                            var getFunc = key == 38 ? getPrevLi : getNextLi,
                                selector = isOpen ? 'li.hover' : 'li.current',
                                setFunc = isOpen ? function(li) { setHover(li); scrollTo(li); } : setSelectedIndex;
                            
                            var $li = getFunc($new.find(selector));
                            if ($li.length) setFunc($li);
                            return false;
                        }
                        else if (key == 13) { //Enter
                            var $hoverLi = $new.find('li.hover');
                            if (isOpen && $hoverLi.length) setSelectedIndex($hoverLi);
                            toggleOptions(e);
                            return false;
                        }
                        else if (key == 27 && isOpen) { //Escape
                            closeOptions();
                            return false;
                        }
                        else if (key == 9 && isOpen) { //Tab
                            closeOptions();
                        }
                    })
                    .keypress(function (e) { //Searching entries by typing
                        var letter = String.fromCharCode(e.which);
                        
                        if (letter) {
                            if (new Date().getTime() - $new[0].jComboStamp > 900)
                                $new[0].jComboSearch = '';
                            
                            $new[0].jComboSearch += letter;
                            $new[0].jComboStamp = new Date().getTime();
                            
                            var $resultLi = $new
                                .find('li')
                                .filter(isValidLi)
                                .filter(function() { return ($(this).text().toLowerCase()).indexOf($new[0].jComboSearch.toLowerCase()) !== -1; })
                                .first();
                            
                            if ($resultLi.length) {
                                if ($new.hasClass('open')) {
                                    $new[0].enableMouseEnter = false;
                                    setHover($resultLi);
                                    scrollTo($resultLi);
                                }
                                else {
                                    setSelectedIndex($resultLi);
                                }
                            } else {
                                $new.find('.hover').removeClass('hover');
                            }
                        }
                    })
                    .on('mousedown', '.toggle', function(e) {
                        if (e.which != 3) toggleOptions(e);
                    })
                    .on('mouseup', 'li', function(e) {
                        if (e.which != 3 && isValidLi(null, e.target)) {
                            setSelectedIndex($(e.target));
                            closeOptions();
                        }
                    })
                    .on('mousemove', 'li', function(e) { if ($new[0].enableMouseEnter) setHover(e.target); else $new[0].enableMouseEnter = true; })
                    //.on('mouseleave', 'li', function(e) { $(e.target).removeClass('hover'); })
                    .on('blur', function() { closeOptions(); })
                    ;
                    
                //Hide options when clicking outside of it
                /*$(document).mouseup(function (e) {
                    //console.log(e.target);
                    if ($new.has(e.target).length === 0) closeOptions();
                });*/

                //Bind replicator
                $old.css({ 'position': 'fixed', 'left': '-999px' })
                    .attr('tabindex', '-1')
                    .change(replicate)
                    .change();

                //Funcs
                function isValidLi(_, li) { return $(li).css('display') != 'none' && !$(li).hasClass('disabled'); }
                function getPrevLi(li) { return $(li).prevAll().filter(isValidLi).first(); }
                function getNextLi(li) { return $(li).nextAll().filter(isValidLi).first(); }
                
                function setHover(li) {
                    if (!isValidLi(null, li)) return;
                    $(li).addClass('hover').siblings('li').removeClass('hover');
                }
                
                function scrollTo(li) {
                    if (!isValidLi(null, li)) return;
                    
                    var $options = $new.find('.options');
                    
                    var curScrollTop = $options.scrollTop();
                    var newScrollTop = $(li).position().top + $options.scrollTop();
                    
                    if (newScrollTop < $options.scrollTop())
                        $options.scrollTop(newScrollTop);
                    else if (newScrollTop - $options.height() + $(li).outerHeight() >= curScrollTop)
                        $options.scrollTop(newScrollTop - $options.height() + $(li).outerHeight());
                }
                
                function setSelectedIndex(li) {
                    if (!isValidLi(null, li)) return;
                    var newIndex = $(li).index() - $(li).prevAll().filter('.optgroup').length;
                    if ($old[0].selectedIndex == newIndex) return;
                    $old[0].selectedIndex = newIndex;
                    $old.change(); //Triggers a replication and any other libraries listening to this event
                }
                
                function closeOptions() { $new.removeClass('open'); }

                function toggleOptions(e) {
                    if ($old[0].disabled) return false;
                    $new.toggleClass('open');
                    var $current = $new.find('.current');
                    setHover($current);
                    scrollTo($current);
                }

                function replicate() {
                    //Set text
                    $new.find('.text')
                        .html($old.find('option:selected').text() || '');
                    
                    //Set disabled/enabled
                    if ($old[0].disabled && !$new.hasClass('disabled')) $new.removeAttr('tabindex').addClass('disabled').blur();
                    else if (!$old[0].disabled && !$new.attr('tabindex')) $new.attr('tabindex', '0').removeClass('disabled');
                    
                    //Set options
                    $new.find('ul').html('');
                    $old.find('option, optgroup').each(function() {
                        var $newLi = $('<li/>');
                        
                        if ($(this).is('optgroup')) {
                            $newLi.addClass('optgroup disabled').html($(this).attr('label') || '&nbsp;');
                        }
                        else {
                            if ($(this).css('display') == 'none') $newLi.addClass('hidden');
                            if ($(this)[0].disabled) $newLi.addClass('disabled');
                            $newLi.html($(this).html() || '&nbsp;');
                        }
                        
                        $new.find('ul').append($newLi);
                    });
                    
                    //Set current option
                    $new.find('li').not('.optgroup').eq($old[0].selectedIndex).addClass('current');
                }
            });

            return $(this);
        }
    });
})(window.jQuery);