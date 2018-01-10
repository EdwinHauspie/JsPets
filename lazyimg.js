$('body').append('<img class="lazy-img" src="" style="width: 200px; height: 150px;margin-top: 300px;" data-lazysrc="https://dl.dropboxusercontent.com/u/38282964/albums/img/Random/2.jpg">');
$('body').append('<br>');
$('body').append('<img class="lazy-img" src="" style="width: 200px; height: 150px;margin-top: 300px;" data-lazysrc="https://dl.dropboxusercontent.com/u/38282964/albums/img/Random/4.jpg">');

topIsInViewport = function (element, offset) {
    offset = offset || 0;
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(element).offset().top;

    return (elemTop + offset >= docViewTop) && (elemTop + offset <= docViewBottom);
};
    
$(window).scroll(function() {
    $('.lazy-img').each(function() {
        if($(this).attr('data-lazysrc') && topIsInViewport(this)) {
            $(this).attr('src', $(this).attr('data-lazysrc'));
            $(this).removeAttr('data-lazysrc');
        }
    });
});