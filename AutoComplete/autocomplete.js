(function($) {
    $.createAutocompleter = function(fieldSelector, suggestionProvider) {
        var suggestTimeout = null,
            suggestingCanceled = false,
            mouseEventsEnabled = true,
            $searchInput = $(fieldSelector);

        function setSuggestionText(suggestionText) {
            $searchInput.val(suggestionText).focus();
            $searchInput.change(/*This notifies Knockout to update its view model as well*/);
        }

        function scrollToSuggestion($suggestion) {
            var $suggestionBox = $('.suggestion-box'),
                curScrollTop = $suggestionBox.scrollTop(),
                newScrollTop = $suggestion.position().top + curScrollTop;

            if (newScrollTop < curScrollTop)
                $suggestionBox.scrollTop(newScrollTop - 3);
            else if (newScrollTop - $suggestionBox.height() + $suggestion.outerHeight() >= curScrollTop)
                $suggestionBox.scrollTop(newScrollTop - $suggestionBox.height() + $suggestion.outerHeight() - 3);
        }

        $(document)
            .on('click', '.suggestion', function() {
                setSuggestionText($(this).text());
                $('.suggestion-box').remove();
            })
            .on('click', function(e) {
                if ($searchInput[0] !== e.target)
                    $('.suggestion-box').remove();
            })
            .on('mouseout', '.suggestion-box', function () {
                if (mouseEventsEnabled)
                    $('.suggestion').removeClass('selected by-arrows');
            })
            .on('mousemove', '.suggestion', function () {
                if (mouseEventsEnabled) {
                    $('.suggestion').removeClass('selected by-arrows');
                    $(this).addClass('selected');
                }
            })
            .on('mousewheel DOMMouseScroll', '.suggestion-box', function (e) {
                //Manual scrolling to prevent the page to scroll when at end of suggestion list
                var wheelDelta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail, 10);
                var delta = 40 * (wheelDelta < 0 ? 1 : -1);
                $('.suggestion-box').scrollTop($('.suggestion-box').scrollTop() + delta);

                e.stopPropagation();
                e.preventDefault();
                return false;
            });

        $searchInput.keyup(function(e) {
            if (e.keyCode === $.ui.keyCode.UP || e.keyCode === $.ui.keyCode.DOWN) {
                setTimeout(function() {
                    mouseEventsEnabled = true;
                }, 150); 
            }
        });

        $searchInput.keydown(function (e) {
            var key = e.keyCode,
                keys = $.ui.keyCode;

            if (key === keys.ENTER) {
                var $oldSuggestion = $('.suggestion.selected.by-arrows:visible');

                if ($oldSuggestion.length) {
                    setSuggestionText($oldSuggestion.text());
                    $('.suggestion-box').remove();
                    e.stopImmediatePropagation();
                    return false;
                }

                return true;
            }
            else if (key === keys.UP || key === keys.DOWN) {
                if (!$('.suggestion:visible').length) //Don't interfere when no suggestions visible
                    return true;
                
                var $oldSuggestion = $('.suggestion.selected').removeClass('selected by-arrows'),
                    $newSuggestion = null;

                if ($oldSuggestion.length) {
                    if (key === keys.DOWN) {
                        $newSuggestion = $oldSuggestion.next();
                        if (!$newSuggestion.length) $newSuggestion = $oldSuggestion;
                    }
                    else if (key === keys.UP) {
                        $newSuggestion = $oldSuggestion.prev();
                    }
                }
                else if (key === keys.DOWN) {
                    $newSuggestion = $('.suggestion').first();
                }

                if ($newSuggestion && $newSuggestion.length) {
                    mouseEventsEnabled = false;
                    $newSuggestion.addClass('selected by-arrows');
                    scrollToSuggestion($newSuggestion);
                }

                return false;
            }
            else if (key === keys.LEFT || key === keys.RIGHT) {
                return true;
            }
            else if (key === keys.TAB) {
                if ($('.suggestion:visible').length) {
                    setSuggestionText($('.suggestion.selected').text() || $('.suggestion').first().text());
                    $('.suggestion-box').remove();
                    return false;
                } else {
                    $('.suggestion-box').remove();
                    return true;
                }
            }
            else if (key === keys.ESCAPE) {
                $('.suggestion-box').remove();
                suggestingCanceled = true;
                return true;
            }
            else if (key === keys.SPACE && e.ctrlKey) {
                suggestingCanceled = false;
            }

            if (suggestTimeout) clearTimeout(suggestTimeout);
			$('.suggestion-box').remove();

            suggestTimeout = setTimeout(function () {
                //Get and trim the value
                var val = $searchInput.val();
                if (val.length <= 1) suggestingCanceled = false;
                val = String.trim(val.replace(/"/g, '')); //Remove dubble quotes

                if (val.length > 1 && !suggestingCanceled) {
                    //Get and render suggestions
                    $.when(suggestionProvider.get(val))
                        .then(function(suggestions) {
                            if (suggestions.any()) {
                                var renderedSuggestions = suggestions.select(function(s) {
                                    return '<div class="unselectable suggestion">' + s + '</div>';
                                });

                                var $suggestionBox = $('<div class="suggestion-box"/>').html(renderedSuggestions.join(''));
                                $searchInput.parent().css('position', 'relative');
                                $searchInput.after($suggestionBox);
                            }
                        });
                }
            }, 100);

            return true;
        });
    }
})(window.jQuery);