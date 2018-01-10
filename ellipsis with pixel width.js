    function ellipsis(origStr, maxWidth) {
        var str = origStr,
            width = getTextWidth(str),
            remove = 4,
            len = origStr.length - 1;
        while (width > maxWidth && remove < len) {
            width = getTextWidth((str = (origStr.substr(0, len - remove).trim() + '…')));
            remove += 2/*Math.floor((maxWidth / width) * len)*/;
        }
        return str;
    }
    
    var widthTester = $('<span style="display:none;"></span>');
    $('body').append(widthTester);
    function getTextWidth(text) { return widthTester.text(text).width(); }