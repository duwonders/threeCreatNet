$(document).ready(() => {
    function GetQueryString(name){
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  decodeURI(r[2]); return null;
    }

    function pagersSet () {
        let totalPage = $("#total-page").text(),
            currentPage = $("#current-page").text();
        let $pagers = $('.pager');
        if (totalPage < 5) {
            for (let i = 0; i < 5; i++) {
                if (totalPage < i+1) {
                    $($pagers[i]).css('display', 'none');
                }
            }
        } else if (totalPage > 5) {
            if (totalPage > 6 && currentPage > 3 && currentPage < totalPage - 2) {
                $($pagers[1]).text(`...`);
                $($pagers[2]).text(currentPage);
                $($pagers[3]).text(`...`);
            }
            if (currentPage <= 3) {
                $($pagers[3]).text(`...`);
            } else if (totalPage - currentPage <= 2) {
                $($pagers[1]).text(`...`);
                $($pagers[2]).text(totalPage - 2);
                $($pagers[3]).text(totalPage - 1);
            }
            $($pagers[4]).text(totalPage);
        }
        $pagers.map((index, item) => {
            let i = $(item);
            if (~~i.text() == ~~currentPage) {
                i.addClass('current');
            }
        });
    }
    //  设置分页器的样式啥的
    pagersSet();
});
