!function(){

	$('.search-btn').on('click', () => {

		let partern = $('.search-wrapper')
						.children('input')
						.val()

		window.location.href = `/home/activity/search?partern=${partern}`
	})
}()