$(document).ready(() => {
    let topBtn = $("#back-top");
    let setLeft = $("#header-row").offset().left + 1050;

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
});