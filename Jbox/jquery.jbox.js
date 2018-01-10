(function ($) {
    var s = $('<div/>')[0].style,
        canTransform = 'transform' in s || 'msTransform' in s,
        canBorderRadius = 'borderRadius' in s;
    
    $.fn.extend({
        jBox: function () {
            $.each($(this), function (i, orig) {
                var old = orig,
                    $old = $(orig);

                if (!canTransform || !canBorderRadius || old.tagName !== 'INPUT' || old.type !== 'checkbox' && old.type !== 'radio' || old.jBox)
                    return;

                var jBox = $('<div class="jBox" tabindex="0"><span/><span/></div>')
                    .addClass(old.type)
                    .insertAfter(old)
                    .keydown(function (e) {
                        if ((e.keyCode || e.which) === 32) {
                            if (old.disabled || old.type === 'radio' && old.checked)
                                return false;
                            $old.prop('checked', !$old.prop('checked')).change();
                        }
                    });
                
                $old.css({ 'position': 'fixed', 'margin-left': -999 })
                    .attr('tabindex', -1)
                    .change(function () {
                        jBox.focus()
                            .toggleClass('checked', old.checked)
                            .toggleClass('disabled', old.disabled)
                            .attr('tabindex', old.disabled ? -1 : 0)
                            .closest('label')
                                .toggleClass('jBoxEnabled', !old.disabled);

                        if (old.type === 'radio' && old.checked && old.name)
                            $('[name=' + old.name + ']').not(old).change();
                    })
                    .change();

                old.jBox = jBox;
            });

            return $(this);
        }
    });
})(window.jQuery);