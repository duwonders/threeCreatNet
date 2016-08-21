$(document).ready(()=>{

    let topBtn = $("#back-top");
    let setLeft = $("#banner").offset().left + 1050;

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
    //  固定 top 按钮位置

    let mySwiper = new Swiper('.swiper-container', {
        autoplay: 2000,
        speed: 500,
        pagination : '.swiper-pagination',
        paginationClickable :true
    });
    /*
    *  最新动态 Swiper 轮播
    * */
});