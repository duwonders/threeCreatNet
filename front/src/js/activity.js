$(document).ready(() => {

    let type = GetQueryString('type') || '全部',
        state = GetQueryString('state') || '最近';

        $('.left-bar').children().map( (i, item) => {
            if(item.innerHTML == type)
                $(item).addClass('current')
        } )

        $('.mid-bar').children().map( (i, item) => {
            if(item.innerHTML == state)
                $(item).addClass('current')
        } )

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
            return function (page, type = GetQueryString('type'), state = GetQueryString('state')) {
                cache.type = type || '全部';
                cache.page = page || 1;
                cache.state = state || '最近';
                window.location.href = `/home/activity?type=${cache.type}&state=${cache.state}&page=${cache.page}`;
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

    function GetQueryString(name){
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  decodeURI(r[2]); return null;
    }

    let topBtn = $("#back-top");
    let setLeft = $("#header-row").offset().left + 1050;
    let sideNav = $("#aside-nav");

    function showBackTop () {
        let scrollTop = document.body.scrollTop;

        if (scrollTop > 300) {
            topBtn.addClass('back-top-show');
        } else {
            topBtn.removeClass('back-top-show');
        }
        topBtn.css('left', setLeft + 'px');
    }
    $(window).on('scroll', () => {
        showBackTop();
    });
    topBtn.on('click', () => {
        $('html, body').animate({scrollTop: '0px'}, 600);
    });
    //  回到顶部

    topBtn.css('left', setLeft + 'px');
    sideNav.css('left', setLeft - 1150 + 'px');
    /*
    *   设置左右 fixed 定位元素位置
    * */


    let mySwiper = new Swiper('.swiper-container', {
        autoplay: 2000,
        speed: 500,
        pagination : '.swiper-pagination',
        paginationClickable :true
    });
    /*
     *  大图 Swiper 轮播
     * */
});

(function(){

    $('.left-bar').children().on('click', (tar) => {

        let type = tar.target.innerHTML;

        let state = '';

        $('.mid-bar').children().map((i, item) => {

            if($(item).hasClass('current')){

                state = item.innerHTML;

            }

        })

        window.location.href = `/home/activity?type=${type}&state=${state}`;

    })

    $('.mid-bar').children().on('click', (tar) => {

        let state = tar.target.innerHTML;

        let type = '';

        $('.left-bar').children().map((i, item) => {

            if($(item).hasClass('current')){

                type = item.innerHTML;

            }

        })

        window.location.href = `/home/activity?type=${type}&state=${state}`;

    })

})();
