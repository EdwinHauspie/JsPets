let json = null,
    data = null;

let render = () => {
    let html = '';
    const sort = $('#sort').prop('checked'), depth = 99;
    const toggle = arr => arr.length ? '<i class="toggle">›</i>' : '';

    (function ___(o, name, curDepth) {
        if (curDepth >= depth) return;

        name = name === null ? '' : name;

        if (o === null) {
            html += `<li><b>${name}</b> <span>null</span></li>`;
        }
        else if (o instanceof Array) {
            html += `<li>${toggle(o)} <b>${name}</b> <span>array [${o.length}]</span>`;
            if (o.length) {
                html += '<ul>';
                for (var i = 0; i < o.length; i++) {
                    ___(o[i], i, curDepth + 1);
                }
                html += '</ul>';
            }
            html += '</li>';
        }
        else if (typeof o == 'object') {
            let props = Object.keys(o);
            if (sort) props = props.sort((a, b) => a.localeCompare(b));
            html += `<li>${toggle(props)} <b>${name}</b> <span>{ ${props.join(', ')} }</span>`;
            if (props.length) {
                html += '<ul>';
                for (var i = 0; i < props.length; i++) {
                    ___(o[props[i]], props[i], curDepth + 1);
                }
                html += '</ul>';
            }
            html += '</li>';
        }
        else {
            html += `<li><b>${name}</b> <span>` + (typeof o === 'string' ? `"${o.replace(/\</g, '&lt;')}"` : o) + '</span></li>';
        }
    })(data, null, 0);

    $('.tree').hide().html(`<ul>${html}</ul>`).fadeIn();
    $('.tree > ul > li').addClass('open');
}

$(() => {
    $('.tree').on('click', '.toggle', e => {
        e.stopPropagation();
        $(e.target).closest('li').toggleClass('open');
        return false;
    });

    /*$('.tree').on('dblclick', 'li', e => {
        e.stopPropagation();
        var $li = $(e.target).closest('li');
        if ($li.find('.toggle').length) $li.toggleClass('open');
        return false;
    });*/

    $('#expand').on('click', () => $('.tree').find('li').addClass('open'));
    $('#collapse').on('click', () => $('.tree').find('li').removeClass('open'));

    $('textarea').on('paste', () => {
        setTimeout(() => {
            try {
                data = JSON.parse($('textarea').val());
                $('textarea').val('').hide();
                render();
            }
            catch (e) {
                $('.tree').html('😵 Clipboard does not contain valid JSON.');
            }
        }, 50);
    });

    $('textarea').on('keydown', event => {
        if (event.keyCode === 27) $('textarea').val('').hide();
    })

    $('#clipboard').on('click', () => $('textarea').toggle().focus());
});