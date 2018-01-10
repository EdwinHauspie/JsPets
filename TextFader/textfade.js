(function($) {
    $.fn.applyTextFade = function(height) {
        for (var i = 0; i < this.length; i++) {
            var $element = $(this[i]);
            
            $element.data({ fadeHeight: height });
            
            if ($element.find('.text-fade-overlay')[0]) {
                if ($element.hasClass('text-fade-closed'))
                    $element.css({ height: height + 'px' });
                continue;
            }
            
            $element
                .data({ origHeight: $element.height() })
                .css({ height: height + 'px', overflow: 'hidden', position: 'relative' })
                .addClass('text-fade-closed')
                .append($('<div class="text-fade-overlay">&nbsp;</div>'))
                .after($('<div class="text-fade-toggle"><span>&#10093;</span><span style="display: none;">&#10092;</span></div>'));
        }
        
        return $(this);
    };

    $.fn.removeTextFade = function() {
        $.each($(this), function(i, element) {
            var $element = $(element);
            $element = $($element);
            $element.data().origHeight = null;
            $element.data().fadeHeight = null;
            $element.find('.text-fade-overlay').remove();
            $element.css({ height: 'auto', overflow: 'auto' });
            $element.next('.text-fade-toggle').remove();
            $element.removeClass('text-fade text-fade-open text-fade-closed');
        });
        
        return $(this);
    };

    $(function() {
        $('body').on('click', '.text-fade-toggle', function() {
            $(this).find('span').toggle();
            var $txt = $(this).prev();
            
            var wantedHeight = $txt.find('.text-fade-overlay').is(':visible')
                ? $txt.data().origHeight
                : $txt.data().fadeHeight;
                
            $txt.css({ height: wantedHeight + 'px' })
                .toggleClass('text-fade-open')
                .toggleClass('text-fade-closed')
                .find('.text-fade-overlay')
                .toggle();
        });
    });
})(window.jQuery);