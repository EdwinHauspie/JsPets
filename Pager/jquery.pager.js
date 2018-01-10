$.createPager = function(config) {
    config = $.extend(true, { 
        pageSize: 10,
        rowCount: 100,
        pageIndex: 0,
        text: {
            first: 'First',
            last: 'Last',
            next: 'Next',
            previous: 'Previous',
            statusFormat: '{0} / {1}',
            pageSizeFormat: 'Page size {0}' }
        }, config);

    var L = config.text,
        pageSize = config.pageSize,
        numberOfPages = Math.ceil(config.rowCount / pageSize),
        currentPageIndex = config.pageIndex;
    
    //Create elements
    var $pager = $('<div class="pager"/>'),
        $first = $('<span class="rwd"/>').text(L.first),
        $prev = $('<span class="prv"/>').text(L.previous),
        $pages = $('<ul class="pages"/>'),
        $status = $('<span class="status"/>'),
        $next = $('<span class="nxt"/>').text(L.next),
        $last = $('<span class="ffd"/>').text(L.last);

    var $size = $('<select class="size"></select>');
    function addSize(s) { $size.append($('<option value="' + s + '"/>').html('&nbsp;&nbsp;' + L.pageSizeFormat.replace('{0}', s) + '&nbsp;&nbsp;')); }
    addSize(10); addSize(20); addSize(30); addSize(50);

    //Funcs
    function drawPager() {
        $pages.empty();
        
        var page = '<li class="page" data-pageindex="{0}">{1}</li>',
            ellipsis = '<li class="ellipsis">&hellip;</li>';

        if (numberOfPages <= 10) {
            for (var p = 0; p < numberOfPages; p++) $pages.append($(page.replace('{0}', p).replace('{1}', p + 1)));
        } else if (currentPageIndex <= 5) {
            for (var p = 0; p < 10; p++) $pages.append($(page.replace('{0}', p).replace('{1}', p + 1)));
            $pages.append($(ellipsis));
        } else if (currentPageIndex >= (numberOfPages - 1 - 5)) {
            for (var p = numberOfPages - 1; p >= numberOfPages - 10; p--) $pages.prepend($(page.replace('{0}', p).replace('{1}', p + 1)));
            $pages.prepend($(ellipsis));
        } else {
            $pages.append($(ellipsis));
            for (var p = currentPageIndex - 4; p < currentPageIndex + 5; p++) $pages.append($(page.replace('{0}', p).replace('{1}', p + 1)));
            $pages.append($(ellipsis));
        }

        $pages.find('.page').last().addClass('last');
        $pages.find('[data-pageindex=' + currentPageIndex + ']').addClass('active');
        
        //Update status
        $status.text(L.statusFormat.replace('{0}', currentPageIndex + 1).replace('{1}', numberOfPages));

        //Toggle navigation
        $first.add($prev).toggleClass('disabled', currentPageIndex === 0);
        $next.add($last).toggleClass('disabled', currentPageIndex === numberOfPages - 1);
    }
    
    //Events
    $pager.click(function (e) {
        var newPageIndex = -1,
            $target = $(e.target);
        
        if ($target.is('.rwd'))       newPageIndex = 0;
        else if ($target.is('.prv'))  newPageIndex = currentPageIndex - 1;
        else if ($target.is('.nxt'))  newPageIndex = currentPageIndex + 1;
        else if ($target.is('.ffd'))  newPageIndex = numberOfPages - 1;
        else if ($target.is('.page')) newPageIndex = $target.data('pageindex');
        
        if ($target.hasClass('disabled') || newPageIndex == currentPageIndex || newPageIndex < 0 || newPageIndex >= numberOfPages)
            return false;
        
        var onPageChangedEvent = $.Event('onPageChanged');
        $pager.trigger(onPageChangedEvent, [ newPageIndex, pageSize, numberOfPages ]);
            
        if (onPageChangedEvent.isDefaultPrevented()) return false;
            
        currentPageIndex = newPageIndex;
        drawPager();
        return true;
    });

    $size.change(function(e) {
        $size.blur();
        
        var newPageSize = $size.val();
        var newNumberOfPages = Math.ceil(config.rowCount / newPageSize);
        
        var onPageSizeChangedEvent = $.Event('onPageSizeChanged');       
        $pager.trigger(onPageSizeChangedEvent, [ currentPageIndex, newPageSize, newNumberOfPages ]);
        
        if (onPageSizeChangedEvent.isDefaultPrevented()) return false;
        
        if (currentPageIndex != 0) {
            currentPageIndex = 0;
        
            var onPageChangedEvent = $.Event('onPageChanged');
            $pager.trigger(onPageChangedEvent, [ currentPageIndex, newPageSize, newNumberOfPages ]);
            
            if (onPageChangedEvent.isDefaultPrevented()) return false;
        }
        
        pageSize = newPageSize;
        numberOfPages = newNumberOfPages;
        drawPager();
        return true;
    });

    drawPager();

    return $pager.append($first).append($prev).append($pages).append($status).append($next).append($last).append($size);
}