$(document).ready(() => {

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