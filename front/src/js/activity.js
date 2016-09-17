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
        
        $('.page-redirect').on('click', (e) => {

            let type = GetQueryString('type') || '全部',
                state = GetQueryString('state') || '最近',
                page = e.target.innerHTML;
            window.location.href = `/home/activity?type=${type}&state=${state}&page=${page}`;

        })

        $('.prev').on('click', () => {
            let page = GetQueryString('page');

            if(page && page > 1){
                let type = GetQueryString('type') || '全部',
                    state = GetQueryString('state') || '最近';
                page--
                window.location.href = `/home/activity?type=${type}&state=${state}&page=${page}`;

            }else{
                alert('已经是第一页了哦')
            }

        })

        $('.next').on('click', () => {

            let page = GetQueryString('page') || 1;

            if(page < $('.page-redirect').length){

                let type = GetQueryString('type') || '全部',
                    state = GetQueryString('state') || '最近';
                page++;
                window.location.href = `/home/activity?type=${type}&state=${state}&page=${page}`;
            
            }else{

                alert('已经是最后了哦');

            }


        })

        $('.page-go').on('click', () => {

            let page = $('.page-input').val(),
                type = GetQueryString('type') || '全部',
                state = GetQueryString('state') || '最近';

            window.location.href = `/home/activity?type=${type}&state=${state}&page=${page}`;
        })

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

