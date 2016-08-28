$(document).ready(() => {
    function GetQueryString(name){
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  decodeURI(r[2]); return null;
    }
    //  通过 url 获取

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
        $('.page-outer-container').css('display', 'block');
    }
    //  设置分页器的样式
    pagersSet();

    let gotoPage = (() => {
        let cache = {};
        return function (page, type = GetQueryString('type')) {
            cache.type = type || '最近';
            cache.page = page || 1;
            window.location.href = `/speak?type=${type}&page=${page}`;
        }
    })();
    //  跳转链接 通过 url 请求页面

    $('.top-page').bind('click', (e) => {
        e = e || window.event;
        if (e.target.nodeName.toLowerCase() == 'a') {
            e.preventDefault();
            let type = $(e.target).text().trim().slice(0, 2);
            gotoPage(1, type);
        }
    });
    //  点击分类按钮

    $('.page-outer-container').bind('click', (e) => {
        e = e || window.event;
        if (e.target.className == 'pager') {
            let t = e.target;
            let page = ~~$(e.target).text();
            if (page > 0) {
                gotoPage(page);
            }
        }
    });
    //  点击分页按钮

    $('#prev').bind('click', () => {
        let page = ~~GetQueryString('page');
        let toPage = page - 1;

        page == 1 ? alert(`已经是第一页`) : gotoPage(toPage);
    });
    //  点击上一页按钮

    $('#next').bind('click', () => {
        let page = ~~GetQueryString('page');
        let totalPage = ~~$("#total-page").text();
        let toPage = page + 1;

        page == totalPage ? alert(`已经是最后一页`) : gotoPage(toPage);
    });
    //  点击下一页按钮

    $("#page-go").bind('click', () => {
        let totalPage = ~~$("#total-page").text();
        let toPage = ~~$("#page-input").val();

        toPage >= 1 && toPage <= totalPage ? gotoPage(toPage) : alert(`无效的页数`);
    });
    //  点击 input 的 value 地址跳转到相应页面

    $(".main-con-item").bind('click', function () {
        let $cover = $("#cover");
        $cover.addClass('cover-show');

        $("#article-title").text($(this.querySelector(".title")).text());
        $("#article-author").text($(this.querySelector(".item-author")).text());
        $("#article-date").text($(this.querySelector(".item-time")).text());
        $("#article-like").text($(this.querySelector(".item-like")).text());
        $("#article-view").text($(this.querySelector(".item-like")).text());
        document.querySelector("#article-content").innerHTML = $(this.querySelector(".content")).text();
        //  加上 XSS 过滤
    });
    //  点击展示文章

    $("#cover-close").bind('click', () => {
        let $cover = $("#cover");
        $cover.removeClass('cover-show');
    });
    //  点击关闭文章
});
