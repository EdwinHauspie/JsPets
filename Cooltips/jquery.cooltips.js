(function ($) {
    $(function() {
        var s = document.body.style,
            showPin = 'msTransform' in s || 'WebkitTransform' in s || 'MozTransform' in s || 'OTransform' in s || 'transform' in s;

        function newCooltip(isSticky) {
            var $new = $('<div class="cooltip"><div class="cooltip-body"/></div>');
            if (showPin) $new.append('<div class="cooltip-pin" />');
            if (isSticky) $new.attr('id', 'cooltipId' + Date.now()).append('<div class="cooltip-close"/>');
            return $new;
        }

        function showCooltip($tip, sender) {
            var content = $(sender).data('cooltip') || $(sender).data('sticky-cooltip');
            if ((function() { try { eval('var tmp = ' + content); return typeof tmp; } catch(e) {} })() === 'function')
                content = eval('(' + content + ')()');
            else if ((function() { try { return $(content).length; } catch(e) { return 0; } })() > 0 && $.contains(document, $(content)[0]))
                content = $(content).html();
            
            $tip.find('.cooltip-body').html(content);
            $tip.show().position({
                my: 'center bottom-10', at: 'center top', of: sender,
                within: window, collision: 'flipfit flipfit', using: function(position, info) {
                    $(this).css(position).find('.cooltip-pin').toggle(info.horizontal == 'center' && info.vertical == 'bottom');
                }
            });
        }

        var lastTarget, cooltipTimeout;
        var $cooltip = newCooltip().appendTo('body');

        $(document).on('mouseenter focus mouseleave blur', '[data-cooltip]', function(e) {
            clearTimeout(cooltipTimeout);

            if (e.type === 'mouseenter' || e.type === 'focusin') {
                if (lastTarget === this && $cooltip.is(':visible')) return;
                lastTarget = this;
                $cooltip.hide();

                cooltipTimeout = setTimeout(function () {
                    showCooltip($cooltip, lastTarget);
                }, 300);
            }
            else cooltipTimeout = setTimeout(function () { $cooltip.hide(); }, 200);
        });

        $(document).on('mouseenter mouseleave', '.cooltip', function(e) {
            clearTimeout(cooltipTimeout);

            if (e.type === 'mouseleave') cooltipTimeout = setTimeout(function () {
                $cooltip.hide();
            }, 200);
        });

        $(document).on('click', '[data-sticky-cooltip]', function(e) {
            if (!$(e.target).data('cooltip-id')) {
                var $sticky = newCooltip(sticky = true).appendTo('body');
                $(e.target).data('cooltip-id', $sticky[0].id);
                showCooltip($sticky, e.target);
            }
            else {
                var id = $(e.target).data('cooltip-id');
                var $sticky = $('#' + id);
                if ($sticky.is(':visible')) $sticky.hide();
                else showCooltip($sticky, e.target);
            }
        });

        $(document).on('click', '.cooltip-close', function() {
            $(this).closest('.cooltip').hide();
        });
    });
})(window.jQuery);